import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse } from "@/lib/api";

/** GET /api/v1/payroll/runs/:id — retrieve a payroll run, scoped to key.userId. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const { id } = await params;
  const run = await db.payrollRun.findFirst({
    where: {
      userId: key.userId,
      id: { endsWith: id.startsWith("prl_") ? id.slice(4) : id },
    },
  });
  if (!run) {
    return errorResponse("Payroll run not found", 404, "not_found");
  }

  return okResponse({
    id: `prl_${run.id.slice(-10)}`,
    object: "payroll_run",
    status: run.status,
    total_amount: run.totalAmount / 100,
    total_currency: run.totalCurrency,
    items_count: run.itemsCount,
    scheduled_for: run.scheduledFor.toISOString(),
    created_at: run.createdAt.toISOString(),
    updated_at: run.updatedAt.toISOString(),
  });
}
