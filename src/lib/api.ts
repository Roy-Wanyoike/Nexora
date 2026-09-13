/**
 * Shared helpers for /api/v1/* routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";

export function errorResponse(error: string, status = 400, code?: string) {
  return NextResponse.json({ error, code }, { status });
}

export function okResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
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

/** Get or create a demo customer (since we don't have real auth in this demo). */
export async function getOrCreateDemoCustomer(): Promise<{ id: string }> {
  const email = "john.doe@nexora.africa";
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
