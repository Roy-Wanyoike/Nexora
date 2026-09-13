import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, parseBody, randomId, auditLog } from "@/lib/api";
import { verifyWebhookSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = verifyWebhookSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error");
  }
  const body = parsed.data;

  // Demo: accept any signature matching the standard format "t=<unix>,v1=<hex>"
  // In production: HMAC-SHA256 the payload with the user's webhook secret
  // and constant-time-compare against the v1 value.
  const verified = /^t=\d+,v1=[a-f0-9]+$/i.test(body.signature);

  const event = await db.webhookEvent.create({
    data: {
      type: verified ? "payment.succeeded" : "unverified",
      payload: JSON.stringify({
        signature: body.signature,
        payloadSample: String(body.payload).slice(0, 500),
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
      metadata: { verified: true },
    });
  }

  return okResponse({
    verified,
    event_type: verified ? "payment.succeeded" : "unverified",
    event_id: `evt_${event.id.slice(-10)}`,
    timestamp: Math.floor(Date.now() / 1000),
  });
}
