import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  authenticate, errorResponse, okResponse, parseBody, randomId, randomLast4,
  getOrCreateDemoCustomer, checkIdempotency, saveIdempotencyRecord, hashRequestBody, auditLog,
} from "@/lib/api";
import { createVirtualCardSchema, formatZodError, listTransactionsSchema } from "@/lib/schemas";

/** GET /api/v1/virtual-cards — list cards scoped to key.userId. */
export async function GET(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const url = new URL(req.url);
  const parsed = listTransactionsSchema.safeParse({
    limit: url.searchParams.get("limit") ?? undefined,
    offset: url.searchParams.get("offset") ?? undefined,
  });
  if (!parsed.success) {
    return errorResponse("Invalid pagination parameters", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }
  const { limit, offset } = parsed.data;

  const status = url.searchParams.get("status") || undefined;

  const [items, total] = await Promise.all([
    db.virtualCard.findMany({
      where: { userId: key.userId, ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.virtualCard.count({ where: { userId: key.userId, ...(status ? { status } : {}) } }),
  ]);

  return okResponse({
    object: "list",
    has_more: offset + items.length < total,
    url: "/v1/virtual-cards",
    data: items.map((c) => ({
      id: `card_${c.id.slice(-10)}`,
      object: "virtual_card",
      brand: c.brand,
      last4: c.last4,
      exp_month: c.expMonth,
      exp_year: c.expYear,
      currency: c.currency,
      spending_limit: c.spendingLimit ? c.spendingLimit / 100 : null,
      spending_interval: c.spendingInterval,
      label: c.label,
      status: c.status,
      created_at: c.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = createVirtualCardSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error", { fields: formatZodError(parsed.error) });
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

  await saveIdempotencyRecord(req, bodyHash, "POST /v1/virtual-cards", { data: responseBody }, 201, key.userId);
  return okResponse(responseBody, 201);
}
