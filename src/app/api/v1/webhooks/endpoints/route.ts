import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  authenticate, errorResponse, okResponse, parseBody, randomId,
  checkIdempotency, saveIdempotencyRecord, hashRequestBody, auditLog, methodNotAllowed } from "@/lib/api";
import { formatZodError } from "@/lib/schemas";

const createEndpointSchema = z.object({
  url: z.string().url("url must be a valid https URL").refine(
    (u) => u.startsWith("https://"),
    "url must use https"
  ),
  event_types: z
    .string()
    .max(500, "event_types must be ≤ 500 chars")
    .optional()
    .describe("Comma-separated list of event types, e.g. 'payment.succeeded,payout.paid'. Omit to subscribe to all."),
});

/**
 * POST /api/v1/webhooks/endpoints
 *
 * Register a new outbound-webhook endpoint for the calling API key's user.
 * Generates a per-endpoint signing secret (returned ONCE, like an API key —
 * only a hash would be stored in a real deployment; here we store it
 * plaintext so the dispatcher can sign without a KMS).
 *
 * Returns 201 on first registration, 200 on idempotent replay.
 */
export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = createEndpointSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }
  const body = parsed.data;

  // Idempotency
  const bodyHash = hashRequestBody(body);
  const idem = await checkIdempotency(req, bodyHash, "POST /v1/webhooks/endpoints");
  if (idem.replay || idem.conflict) return idem.response!;

  const secret = `whsec_${randomId(32, "")}`;

  const endpoint = await db.webhookEndpoint.create({
    data: {
      userId: key.userId,
      url: body.url,
      secret,
      enabled: true,
      eventTypes: body.event_types || "",
    },
  });

  auditLog({
    actorUserId: key.userId,
    apiKeyId: key.id,
    action: "webhook_endpoint.create",
    resourceType: "webhook_endpoint",
    resourceId: endpoint.id,
    req,
    metadata: { url: body.url, event_types: body.event_types || "*" },
  });

  const responseBody = {
    id: `whep_${endpoint.id.slice(-10)}`,
    object: "webhook_endpoint",
    url: endpoint.url,
    enabled: endpoint.enabled,
    event_types: endpoint.eventTypes ? endpoint.eventTypes.split(",").map((s) => s.trim()).filter(Boolean) : [],
    secret, // shown ONCE
    created_at: endpoint.createdAt.toISOString(),
  };

  await saveIdempotencyRecord(req, bodyHash, "POST /v1/webhooks/endpoints", { data: responseBody }, 201, key.userId);
  return okResponse(responseBody, 201);
}

/** GET /api/v1/webhooks/endpoints — list the caller's endpoints (without secrets). */
export async function GET(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const endpoints = await db.webhookEndpoint.findMany({
    where: { userId: key.userId },
    orderBy: { createdAt: "desc" },
  });

  return okResponse({
    object: "list",
    url: "/v1/webhooks/endpoints",
    data: endpoints.map((e) => ({
      id: `whep_${e.id.slice(-10)}`,
      object: "webhook_endpoint",
      url: e.url,
      enabled: e.enabled,
      event_types: e.eventTypes ? e.eventTypes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      created_at: e.createdAt.toISOString(),
    })),
  });
}
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
