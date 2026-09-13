import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  authenticate, errorResponse, okResponse, parseBody,
  checkIdempotency, saveIdempotencyRecord, hashRequestBody, auditLog, randomId,
} from "@/lib/api";
import { createPaymentLinkSchema, formatZodError } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = createPaymentLinkSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }
  const body = parsed.data;

  // Idempotency
  const bodyHash = hashRequestBody(body);
  const idem = await checkIdempotency(req, bodyHash, "POST /v1/payment-links");
  if (idem.replay || idem.conflict) return idem.response!;

  const id = randomId(8, "plink_");
  const slug = randomId(8, "nxp-");

  // Note: no PaymentLink model in schema — for demo we generate the URL on the fly.
  // In production, persist to a PaymentLink model with slug, amount, currency,
  // redirect_url, status, userId, expiresAt.
  auditLog({
    actorUserId: key.userId,
    apiKeyId: key.id,
    action: "payment_link.create",
    resourceType: "payment_link",
    resourceId: id,
    req,
    metadata: { amount: body.amount, currency: body.currency, slug },
  });

  const responseBody = {
    id,
    object: "payment_link",
    url: `https://pay.nexora.africa/l/${slug}`,
    amount: body.amount,
    currency: body.currency,
    title: body.title || "Payment",
    description: body.description,
    status: "active",
    redirect_url: body.redirect_url || null,
    created_at: new Date().toISOString(),
  };

  await saveIdempotencyRecord(req, bodyHash, "POST /v1/payment-links", { data: responseBody }, 201, key.userId);
  return okResponse(responseBody, 201);
}
