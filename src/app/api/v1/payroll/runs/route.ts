import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  authenticate, errorResponse, okResponse, parseBody, toMinorUnit,
  checkIdempotency, saveIdempotencyRecord, hashRequestBody, auditLog, methodNotAllowed } from "@/lib/api";
import { createPayrollRunSchema, formatZodError, listTransactionsSchema } from "@/lib/schemas";

/** GET /api/v1/payroll/runs — list payroll runs scoped to key.userId. */
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
    db.payrollRun.findMany({
      where: { userId: key.userId, ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.payrollRun.count({ where: { userId: key.userId, ...(status ? { status } : {}) } }),
  ]);

  return okResponse({
    object: "list",
    has_more: offset + items.length < total,
    url: "/v1/payroll/runs",
    data: items.map((r) => ({
      id: `prl_${r.id.slice(-10)}`,
      object: "payroll_run",
      status: r.status,
      total_amount: r.totalAmount / 100,
      total_currency: r.totalCurrency,
      items_count: r.itemsCount,
      scheduled_for: r.scheduledFor.toISOString(),
      created_at: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = createPayrollRunSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }
  const body = parsed.data;

  // Idempotency
  const bodyHash = hashRequestBody(body);
  const idem = await checkIdempotency(req, bodyHash, "POST /v1/payroll/runs");
  if (idem.replay || idem.conflict) return idem.response!;

  // Validate all item currencies match the run currency (audit finding)
  const mixedCurrencies = body.items.some((item) => item.currency !== body.currency);
  if (mixedCurrencies) {
    return errorResponse(
      `All item currencies must match the run currency (${body.currency}). Use separate runs for different currencies.`,
      422,
      "validation_error"
    );
  }

  const totalMinor = body.items.reduce(
    (sum, item) => sum + toMinorUnit(item.amount),
    0
  );
  const itemsCount = body.items.length;
  const scheduledFor = body.schedule === "now"
    ? new Date(Date.now() + 5 * 60_000)
    : body.scheduled_for
    ? new Date(body.scheduled_for)
    : new Date(Date.now() + 7 * 86400_000);

  const run = await db.payrollRun.create({
    data: {
      status: "scheduled",
      totalAmount: totalMinor,
      totalCurrency: body.currency,
      itemsCount,
      scheduledFor,
      userId: key.userId,
    },
  });

  auditLog({
    actorUserId: key.userId,
    apiKeyId: key.id,
    action: "payroll_run.create",
    resourceType: "payroll_run",
    resourceId: run.id,
    req,
    metadata: { total: totalMinor / 100, currency: body.currency, items_count: itemsCount },
  });

  const responseBody = {
    id: `prl_${run.id.slice(-10)}`,
    object: "payroll_run",
    status: run.status,
    total_amount: totalMinor / 100,
    total_currency: run.totalCurrency,
    items_count: itemsCount,
    scheduled_for: run.scheduledFor.toISOString(),
    created_at: run.createdAt.toISOString(),
  };

  await saveIdempotencyRecord(req, bodyHash, "POST /v1/payroll/runs", { data: responseBody }, 201, key.userId);
  return okResponse(responseBody, 201);
}
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
