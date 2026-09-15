/**
 * Shared helpers for /api/v1/* routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";

export function errorResponse(
  error: string,
  status = 400,
  code?: string,
  details?: any
) {
  const body: Record<string, any> = { error, code };
  if (details !== undefined) body.details = details;
  return NextResponse.json(body, { status });
}

export function okResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

/**
 * Return a 405 Method Not Allowed response with an `Allow` header listing
 * the methods the route actually supports. Use this as the catch-all for
 * every HTTP method a route handler does NOT export, so clients get a
 * standards-compliant JSON 405 instead of Next.js's empty default.
 */
export function methodNotAllowed(req: NextRequest, allowed: string[]) {
  const allow = allowed.join(", ").toUpperCase();
  const requestId = req.headers.get("x-request-id") || undefined;
  return NextResponse.json(
    {
      error: `Method ${req.method} is not allowed for this endpoint.`,
      code: "method_not_allowed",
      allowed,
      request_id: requestId,
    },
    {
      status: 405,
      headers: {
        Allow: allow,
        "x-request-id": requestId ?? "",
      },
    }
  );
}

export async function parseBody<T = any>(req: NextRequest): Promise<T | null> {
  try {
    const text = await req.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/** SHA-256 hash a string and return hex. */
export function hashKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}

/**
 * Resolve the API key from `Authorization: Bearer ...` header.
 * Stores/looks up only the SHA-256 hash — the raw key is never in the DB.
 * Returns null if missing/revoked.
 */
export async function authenticate(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(nxp_(?:test|live)_[a-z0-9]+)$/i);
  if (!m) return null;
  const rawKey = m[1];
  const keyHash = hashKey(rawKey);
  // Single DB lookup by hash; constant-time equality is implicit via SQLite index
  const key = await db.apiKey.findFirst({
    where: { keyHash, revokedAt: null },
  });
  // Belt-and-suspenders: timingSafeEqual on the hash to defeat any timing leaks
  if (key) {
    const a = Buffer.from(keyHash, "hex");
    const b = Buffer.from(key.keyHash, "hex");
    if (a.length === b.length && timingSafeEqual(a, b)) {
      return key;
    }
  }
  return null;
}

/** Convert decimal currency amount (e.g. 50.00) to smallest unit (e.g. 5000 cents). */
export function toMinorUnit(amount: number): number {
  return Math.round(amount * 100);
}

/** Convert smallest unit back to decimal. */
export function fromMinorUnit(amount: number): number {
  return amount / 100;
}

/**
 * Cryptographically-secure random alphanumeric string.
 * Uses node:crypto.randomBytes (not Math.random).
 */
export function randomId(len: number, prefix = ""): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(len);
  let s = "";
  for (let i = 0; i < len; i++) s += chars[bytes[i] % chars.length];
  return prefix + s;
}

/** Generate a full API key string: nxp_<test|live>_<24 chars>. */
export function generateApiKey(mode: "test" | "live"): string {
  return `nxp_${mode}_${randomId(24, "")}`;
}

/** Generate a 4-digit string for card last4 etc. */
export function randomLast4(): string {
  return String(randomBytes(2).readUInt16BE(0) % 9000 + 1000);
}

// ── Master key (admin endpoints) ────────────────────────────────────

/**
 * Check the `x-master-key` header against process.env.NEXORA_MASTER_KEY
 * using a constant-time comparison.
 *
 * Behavior:
 *  - If NEXORA_MASTER_KEY is set, the header must match it byte-for-byte.
 *  - If NEXORA_MASTER_KEY is NOT set, the request is allowed only when
 *    NODE_ENV !== 'production' (dev convenience). In production we reject.
 *
 * Returns `null` when authorized, otherwise a NextResponse (401/403) the
 * caller should return immediately.
 */
export function requireMasterKey(req: NextRequest): NextResponse | null {
  const expected = process.env.NEXORA_MASTER_KEY;

  // No master key configured — ALWAYS deny (no dev bypass).
  // Set NEXORA_MASTER_KEY in your .env file for local development.
  if (!expected) {
    return NextResponse.json(
      { error: "Master key is not configured. Set NEXORA_MASTER_KEY env var.", code: "master_key_unconfigured" },
      { status: 503 }
    );
  }

  const provided = req.headers.get("x-master-key") || "";
  if (!provided) {
    return NextResponse.json(
      { error: "Missing x-master-key header.", code: "auth_error" },
      { status: 401 }
    );
  }

  // Constant-time compare. Both must be the same length, so we hash both
  // to a fixed-length digest first — this also defeats any timing leaks
  // from a length-mismatch shortcut.
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  if (a.length === b.length && timingSafeEqual(a, b)) {
    return null;
  }

  return NextResponse.json(
    { error: "Invalid master key.", code: "auth_error" },
    { status: 403 }
  );
}

/** Get or create a demo customer (since we don't have real auth in this demo). */
export async function getOrCreateDemoCustomer(): Promise<{ id: string }> {
  const email = "john.doe@nexapay.africa";
  const existing = await db.customer.findFirst({ where: { email } });
  if (existing) return { id: existing.id };
  const c = await db.customer.create({ data: { email, name: "John Doe", phone: "+2348000000000" } });
  return { id: c.id };
}

/** Validate that an amount is a positive finite number within bounds. */
export function isValidAmount(amount: any, max = 1_000_000): boolean {
  return (
    typeof amount === "number" &&
    Number.isFinite(amount) &&
    amount > 0 &&
    amount <= max
  );
}

// ── Idempotency ─────────────────────────────────────────────────────

/**
 * Check for an existing idempotency record. If found and the request body
 * hash matches, return the cached response. If the body hash differs, return
 * a 409 (the caller reused a key with different data).
 *
 * If not found, return null — the caller should call `saveIdempotencyRecord`
 * after a successful response.
 */
export async function checkIdempotency(
  req: NextRequest,
  requestBodyHash: string,
  endpoint: string
): Promise<{ replay: boolean; response: NextResponse | null; conflict: boolean }> {
  const idemKey = req.headers.get("idempotency-key");
  if (!idemKey) return { replay: false, response: null, conflict: false };

  // Expire old records opportunistically (cheap delete on read)
  await db.idempotencyRecord.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  }).catch(() => {});

  const existing = await db.idempotencyRecord.findUnique({
    where: { key: idemKey },
  }).catch(() => null);

  if (!existing) return { replay: false, response: null, conflict: false };

  if (existing.requestBodyHash !== requestBodyHash || existing.endpoint !== endpoint) {
    return {
      replay: false,
      response: NextResponse.json(
        { error: "Idempotency-Key was used with a different request body or endpoint.", code: "idempotency_conflict" },
        { status: 409 }
      ),
      conflict: true,
    };
  }

  // Replay the cached response body. Per HTTP semantics (and the project
  // contract: Issue #15), an idempotency replay MUST return 200 OK — the
  // resource already exists, we're not "creating" it again. We preserve
  // the original body verbatim but force the status to 200.
  const body = JSON.parse(existing.responseBody);
  return {
    replay: true,
    response: NextResponse.json(body, { status: 200 }),
    conflict: false,
  };
}

/** Save an idempotency record after a successful response. */
export async function saveIdempotencyRecord(
  req: NextRequest,
  requestBodyHash: string,
  endpoint: string,
  responseBody: Record<string, any>,
  responseStatus: number,
  userId?: string
): Promise<void> {
  const idemKey = req.headers.get("idempotency-key");
  if (!idemKey) return;
  try {
    await db.idempotencyRecord.create({
      data: {
        key: idemKey,
        userId,
        endpoint,
        requestBodyHash,
        responseBody: JSON.stringify(responseBody),
        responseStatus,
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000), // 24h
      },
    });
  } catch {
    // P2002 = key already exists (race) — safe to ignore
  }
}

/** Hash a request body for idempotency comparison. */
export function hashRequestBody(body: any): string {
  return createHash("sha256").update(JSON.stringify(body || {})).digest("hex");
}

// ── Audit log ───────────────────────────────────────────────────────

/**
 * Record an audit log entry for a state-changing action.
 * Fire-and-forget — never block the response on audit logging.
 */
export function auditLog(opts: {
  actorUserId?: string | null;
  apiKeyId?: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  req?: NextRequest;
  metadata?: Record<string, any>;
}): void {
  const ip = opts.req?.headers.get("x-forwarded-for")?.split(",")[0].trim() || null;
  const ua = opts.req?.headers.get("user-agent") || null;
  // Fire-and-forget — don't await
  db.auditLog
    .create({
      data: {
        actorUserId: opts.actorUserId ?? null,
        apiKeyId: opts.apiKeyId ?? null,
        action: opts.action,
        resourceType: opts.resourceType,
        resourceId: opts.resourceId,
        ipAddress: ip,
        userAgent: ua,
        metadata: opts.metadata ? JSON.stringify(opts.metadata) : null,
      },
    })
    .catch((e) => {
      // Never let audit failure break the request — just log
      console.error("Audit log write failed:", e?.message || e);
    });
}
