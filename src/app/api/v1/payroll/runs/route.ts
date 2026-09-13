import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  authenticate, errorResponse, okResponse, parseBody, toMinorUnit,
  checkIdempotency, saveIdempotencyRecord, hashRequestBody, auditLog,
} from "@/lib/api";
import { createPayrollRunSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = createPayrollRunSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error");
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

  await saveIdempotencyRecord(req, bodyHash, "POST /v1/payroll/runs", { data: responseBody }, 200, key.userId);
  return okResponse(responseBody);
}
