import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  authenticate, errorResponse, okResponse, parseBody, randomId, getOrCreateDemoCustomer,
  checkIdempotency, saveIdempotencyRecord, hashRequestBody, auditLog, methodNotAllowed } from "@/lib/api";
import { createForeignAccountSchema, formatZodError, listTransactionsSchema } from "@/lib/schemas";

const BANKS: Record<string, { name: string; routingLabel: string }> = {
  USD: { name: "Nexa Pay / Evolve", routingLabel: "routing_number" },
  GBP: { name: "Nexa Pay UK Ltd", routingLabel: "sort_code" },
  EUR: { name: "Nexa Pay EU GmbH", routingLabel: "bic" },
  CNY: { name: "Nexa Pay China", routingLabel: "cnaps" },
};

const ROUTING: Record<string, string> = {
  USD: "084009519",
  GBP: "04-00-19",
  EUR: "PAYSDEMM",
  CNY: "104100000004",
};

const RAILS: Record<string, string[]> = {
  USD: ["ach", "wire", "swift"],
  GBP: ["faster_payments", "chaps"],
  EUR: ["sepa", "target2"],
  CNY: ["cnaps", "cips"],
};

/** GET /api/v1/foreign-accounts — list accounts scoped to key.userId. */
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

  const currency = url.searchParams.get("currency")?.toUpperCase() || undefined;

  const [items, total] = await Promise.all([
    db.foreignAccount.findMany({
      where: { userId: key.userId, ...(currency ? { currency } : {}) },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.foreignAccount.count({ where: { userId: key.userId, ...(currency ? { currency } : {}) } }),
  ]);

  return okResponse({
    object: "list",
    has_more: offset + items.length < total,
    url: "/v1/foreign-accounts",
    data: items.map((a) => ({
      id: `fac_${a.id.slice(-10)}`,
      object: "foreign_account",
      currency: a.currency,
      account_name: a.accountName,
      account_number: a.accountNumber,
      routing_number: a.routingNumber,
      bank_name: a.bankName,
      supported_rails: RAILS[a.currency] || [],
      status: a.status,
      created_at: a.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = createForeignAccountSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }
  const body = parsed.data;

  // Idempotency
  const bodyHash = hashRequestBody(body);
  const idem = await checkIdempotency(req, bodyHash, "POST /v1/foreign-accounts");
  if (idem.replay || idem.conflict) return idem.response!;

  const cur = body.currency;
  const bank = BANKS[cur];
  const accountNumber = cur === "EUR"
    ? `DE89${randomId(16, "")}`
    : String(Math.floor(1_000_000_000 + Math.random() * 8_999_999_999));

  const customer = await getOrCreateDemoCustomer();

  const acct = await db.foreignAccount.create({
    data: {
      currency: cur,
      accountName: body.account_name || "John Doe",
      accountNumber,
      routingNumber: ROUTING[cur],
      bankName: bank.name,
      customerType: body.customer_type,
      status: "active",
      customerId: customer.id,
      userId: key.userId,
    },
  });

  auditLog({
    actorUserId: key.userId,
    apiKeyId: key.id,
    action: "foreign_account.create",
    resourceType: "foreign_account",
    resourceId: acct.id,
    req,
    metadata: { currency: cur, customer_type: body.customer_type },
  });

  const responseBody = {
    id: `fac_${acct.id.slice(-10)}`,
    object: "foreign_account",
    currency: acct.currency,
    account_name: acct.accountName,
    account_number: acct.accountNumber,
    routing_number: acct.routingNumber,
    bank_name: acct.bankName,
    supported_rails: RAILS[cur],
    status: acct.status,
    created_at: acct.createdAt.toISOString(),
  };

  await saveIdempotencyRecord(req, bodyHash, "POST /v1/foreign-accounts", { data: responseBody }, 201, key.userId);
  return okResponse(responseBody, 201);
}
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
