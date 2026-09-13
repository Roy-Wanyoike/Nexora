import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, parseBody, randomId } from "@/lib/api";

/**
 * POST /v1/webhooks/verify
 * Verify a webhook signature (demo: accepts any well-formed "t=...,v1=..." signature).
 * In production, this would HMAC-SHA256 the payload with the user's webhook secret
 * and constant-time-compare against the v1 value.
 */
export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const body = await parseBody<any>(req);
  if (!body || !body.signature || !body.payload) {
    return errorResponse("`signature` and `payload` are required", 422, "validation_error");
  }

  // Demo: accept any signature matching the standard format "t=<unix>,v1=<hex>"
  const verified = /^t=\d+,v1=[a-f0-9]+$/i.test(body.signature);

  // Record the webhook event in the DB for audit trail
  const event = await db.webhookEvent.create({
    data: {
      type: verified ? "payment.succeeded" : "unverified",
      payload: JSON.stringify({ signature: body.signature, payloadSample: String(body.payload).slice(0, 500) }),
      delivered: verified,
    },
  });

  return okResponse({
    verified,
    event_type: verified ? "payment.succeeded" : "unverified",
    event_id: `evt_${event.id.slice(-10)}`,
    timestamp: Math.floor(Date.now() / 1000),
  });
}
