/**
 * Outbound webhook dispatcher.
 *
 * Signs an event payload with HMAC-SHA256 (Stripe-style `t=,v1=` header) and
 * POSTs it to the registered endpoint with up to 5 retries on failure using
 * exponential backoff (1m, 5m, 30m, 2h, 6h).
 *
 * Records delivery state (delivered, attempts, lastAttemptAt, responseCode,
 * nextAttemptAt) on the WebhookEvent row.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";

// Backoff schedule (in seconds): 1m, 5m, 30m, 2h, 6h.
const BACKOFF_SECONDS = [60, 300, 1800, 7200, 21600];
const MAX_ATTEMPTS = 5;

const REQUEST_TIMEOUT_MS = 15_000;

export interface WebhookEndpoint {
  id: string;
  url: string;
  secret: string;
  enabled: boolean;
  eventTypes: string;
}

/** Build the Stripe-style signature header: `t=<unix>,v1=<hex>`. */
export function signPayload(secret: string, payload: string, ts: number): string {
  const mac = createHmac("sha256", secret).update(`${ts}.${payload}`).digest("hex");
  return `t=${ts},v1=${mac}`;
}

/** Verify a signature header — exported for test/demo use. */
export function verifySignature(secret: string, signature: string, payload: string): boolean {
  const parts = new Map<string, string>();
  for (const token of (signature || "").split(",")) {
    const idx = token.indexOf("=");
    if (idx === -1) continue;
    parts.set(token.slice(0, idx).trim(), token.slice(idx + 1).trim());
  }
  const tStr = parts.get("t");
  const v1 = parts.get("v1");
  if (!tStr || !v1) return false;
  const t = Number(tStr);
  if (!Number.isFinite(t)) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(v1, "hex");
    return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function shouldDeliver(endpoint: WebhookEndpoint, eventType: string): boolean {
  if (!endpoint.enabled) return false;
  const types = endpoint.eventTypes
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  // Empty list = subscribe to all events.
  if (types.length === 0) return true;
  return types.includes(eventType);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postOnce(
  url: string,
  signature: string,
  payload: string
): Promise<{ ok: boolean; status: number; delivered: boolean }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-nexapay-signature": signature,
        "user-agent": "NexaPay-Webhook/1.0",
      },
      body: payload,
      signal: controller.signal,
    });
    // 2xx = delivered; 3xx-4xx = permanent failure (don't retry meaningfully
    // but we still count attempts). 5xx/timeout/network = retry.
    return { ok: res.ok, status: res.status, delivered: res.ok };
  } catch {
    return { ok: false, status: 0, delivered: false };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Dispatch a webhook event to a single endpoint.
 *
 * Creates a WebhookEvent row, then attempts delivery with exponential backoff.
 * Records the final state on the row. Returns the event id.
 */
export async function dispatchWebhook(
  endpoint: WebhookEndpoint,
  eventType: string,
  payload: Record<string, any>
): Promise<string | null> {
  if (!shouldDeliver(endpoint, eventType)) {
    return null; // endpoint not subscribed
  }

  const payloadStr = JSON.stringify(payload);
  const event = await db.webhookEvent.create({
    data: {
      type: eventType,
      payload: payloadStr,
      delivered: false,
      attempts: 0,
    },
  });

  // Fire delivery in the background so we never block the calling request.
  // We do NOT await — the route handler returns the gateway response and the
  // dispatcher continues. In a serverless context this would be a queued job;
  // here we run it eagerly so the demo visibly delivers.
  deliverWithBackoff(endpoint, event.id, payloadStr).catch((e) => {
    console.error("[webhook] dispatcher failed:", (e as Error)?.message || e);
  });

  return event.id;
}

async function deliverWithBackoff(
  endpoint: WebhookEndpoint,
  eventId: string,
  payloadStr: string
): Promise<void> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const ts = Math.floor(Date.now() / 1000);
    const signature = signPayload(endpoint.secret, payloadStr, ts);

    const result = await postOnce(endpoint.url, signature, payloadStr);

    const nextAttemptAt =
      result.delivered || attempt >= MAX_ATTEMPTS
        ? null
        : new Date(Date.now() + BACKOFF_SECONDS[attempt - 1] * 1000);

    await db.webhookEvent
      .update({
        where: { id: eventId },
        data: {
          delivered: result.delivered,
          attempts: attempt,
          lastAttemptAt: new Date(),
          responseCode: result.status || null,
          nextAttemptAt,
        },
      })
      .catch(() => {});

    if (result.delivered) return;

    if (attempt < MAX_ATTEMPTS) {
      // Note: in production this would be a delayed queue, not an in-process
      // sleep. For the demo we honor the backoff schedule inline.
      await delay(BACKOFF_SECONDS[attempt - 1] * 1000);
    }
  }
}

/**
 * Convenience: fan out an event to every enabled endpoint for a user that
 * subscribes to the event type. Returns the list of created event ids.
 */
export async function dispatchToUserEndpoints(
  userId: string,
  eventType: string,
  payload: Record<string, any>
): Promise<string[]> {
  const endpoints = await db.webhookEndpoint.findMany({
    where: { userId, enabled: true },
  });
  const ids: string[] = [];
  for (const ep of endpoints) {
    const id = await dispatchWebhook(ep, eventType, payload);
    if (id) ids.push(id);
  }
  return ids;
}
