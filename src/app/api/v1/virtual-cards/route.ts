import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  authenticate, errorResponse, okResponse, parseBody, randomId, randomLast4,
  getOrCreateDemoCustomer, checkIdempotency, saveIdempotencyRecord, hashRequestBody, auditLog,
} from "@/lib/api";
import { createVirtualCardSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = createVirtualCardSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error");
  }
  const body = parsed.data;

  // Idempotency
  const bodyHash = hashRequestBody(body);
  const idem = await checkIdempotency(req, bodyHash, "POST /v1/virtual-cards");
  if (idem.replay || idem.conflict) return idem.response!;

  const customer = await getOrCreateDemoCustomer();
  const now = new Date();
  const expMonth = body.exp_month || (now.getMonth() + 1);
  const expYear = body.exp_year || (now.getFullYear() + 4);

  const card = await db.virtualCard.create({
    data: {
      brand: body.brand,
      last4: randomLast4(),
      expMonth,
      expYear,
      currency: body.currency,
      spendingLimit: body.spending_limit ? Math.round(body.spending_limit * 100) : null,
      spendingInterval: body.spending_interval,
      label: body.label,
      status: "active",
      customerId: customer.id,
      userId: key.userId,
    },
  });

  auditLog({
    actorUserId: key.userId,
    apiKeyId: key.id,
    action: "virtual_card.create",
    resourceType: "virtual_card",
    resourceId: card.id,
    req,
    metadata: { currency: body.currency, label: body.label },
  });

  const responseBody = {
    id: `card_${card.id.slice(-10)}`,
    object: "virtual_card",
    brand: card.brand,
    last4: card.last4,
    exp_month: card.expMonth,
    exp_year: card.expYear,
    currency: card.currency,
    spending_limit: card.spendingLimit ? card.spendingLimit / 100 : null,
    spending_interval: card.spendingInterval,
    label: card.label,
    status: card.status,
    created_at: card.createdAt.toISOString(),
  };

  await saveIdempotencyRecord(req, bodyHash, "POST /v1/virtual-cards", { data: responseBody }, 200, key.userId);
  return okResponse(responseBody);
}
