import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, parseBody, toMinorUnit } from "@/lib/api";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const body = await parseBody<any>(req);
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return errorResponse("`items` array is required", 422, "validation_error");
  }

  const currency = (body.currency || "USD").toUpperCase();
  const totalMinor = body.items.reduce(
    (sum: number, item: any) => sum + toMinorUnit(Number(item.amount)),
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
      totalCurrency: currency,
      itemsCount,
      scheduledFor,
    },
  });

  return okResponse({
    id: `prl_${run.id.slice(-10)}`,
    object: "payroll_run",
    status: run.status,
    total_amount: totalMinor / 100,
    total_currency: run.totalCurrency,
    items_count: itemsCount,
    scheduled_for: run.scheduledFor.toISOString(),
    created_at: run.createdAt.toISOString(),
  });
}
