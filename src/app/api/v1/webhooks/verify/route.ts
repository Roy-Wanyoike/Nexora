import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, parseBody, auditLog, methodNotAllowed } from "@/lib/api";
import { verifyWebhookSchema, formatZodError } from "@/lib/schemas";

/**
 * POST /api/v1/webhooks/verify
 *
 * Verifies a Stripe-style webhook signature header of the form:
 *   `t=<unix-seconds>,v1=<hex-sha256-hmac>`
 * against the request payload using HMAC-SHA256 with
 * `process.env.NEXORA_WEBHOOK_SECRET` (falls back to "dev-secret" in dev).
 *
 * Rejects if the timestamp is more than 300s off from the current time
 * (replay-window guard), or if the digests do not match (constant-time).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.NEXORA_WEBHOOK_SECRET;
  if (!secret) return errorResponse("Webhook secret not configured. Set NEXORA_WEBHOOK_SECRET env var.", 503, "not_configured");
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = verifyWebhookSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }
  const body = parsed.data;

  // Parse `t=<ts>,v1=<hex>` from the signature header.
  const sig = body.signature || "";
  const parts = new Map<string, string>();
  for (const token of sig.split(",")) {
    const idx = token.indexOf("=");
    if (idx === -1) continue;
    const k = token.slice(0, idx).trim();
    const v = token.slice(idx + 1).trim();
    if (k) parts.set(k, v);
  }

  const tStr = parts.get("t");
  const v1 = parts.get("v1");
  if (!tStr || !v1) {
    return okResponse({
      verified: false,
      reason: "malformed_signature",
      event_type: "unverified",
      timestamp: Math.floor(Date.now() / 1000),
    });
  }

  const t = Number(tStr);
  if (!Number.isFinite(t)) {
    return okResponse({
      verified: false,
      reason: "bad_timestamp",
      event_type: "unverified",
      timestamp: Math.floor(Date.now() / 1000),
    });
  }

  // Replay window: ±300s
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - t) > 300) {
    return okResponse({
      verified: false,
      reason: "timestamp_out_of_range",
      event_type: "unverified",
      timestamp: nowSec,
    });
  }

  // Compute HMAC-SHA256 over `${t}.${payload}` with the webhook secret.
  // `secret` was already validated at the top of the handler (line 19).
  const payload = String(body.payload);
  const expected = createHmac("sha256", secret)
    .update(`${t}.${payload}`)
    .digest("hex");

  let verified = false;
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(v1, "hex");
    // Only compare if lengths match (timingSafeEqual throws otherwise).
    if (a.length === b.length && a.length > 0) {
      verified = timingSafeEqual(a, b);
    }
  } catch {
    verified = false;
  }

  const event = await db.webhookEvent.create({
    data: {
      type: verified ? "payment.succeeded" : "unverified",
      payload: JSON.stringify({
        signature: body.signature,
        payloadSample: payload.slice(0, 500),
        t,
      }),
      delivered: verified,
    },
  });

  if (verified) {
    auditLog({
      actorUserId: key.userId,
      apiKeyId: key.id,
      action: "webhook.verify",
      resourceType: "webhook_event",
      resourceId: event.id,
      req,
      metadata: { verified: true, t },
    });
  }

  return okResponse({
    verified,
    event_type: verified ? "payment.succeeded" : "unverified",
    event_id: `evt_${event.id.slice(-10)}`,
    timestamp: nowSec,
  }, 201);
}

export async function GET(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
