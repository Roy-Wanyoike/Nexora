import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse } from "@/lib/api";

/**
 * GET /api/v1/payments/:id
 *
 * Retrieve a payment by its public id (`pay_<10>` suffix) or full cuid.
 * Scoped to the calling API key's userId — a 404 is returned if the id
 * belongs to a different tenant.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const { id } = await params;

  // Allow lookup by either our public id (`pay_<10>`) or the raw cuid.
  let payment = await db.payment.findFirst({
    where: {
      userId: key.userId,
      id: { endsWith: id.startsWith("pay_") ? id.slice(4) : id },
    },
  });
  if (!payment) {
    payment = await db.payment.findFirst({
      where: {
        userId: key.userId,
        reference: id,
      },
    });
  }
  if (!payment) {
    return errorResponse("Payment not found", 404, "not_found");
  }

  return okResponse({
    id: `pay_${payment.id.slice(-10)}`,
    object: "payment",
    amount: payment.amount / 100,
    currency: payment.currency,
    status: payment.status,
    channel: payment.channel,
    customer: payment.customerId,
    reference: payment.reference,
    gateway_txn_id: payment.gatewayTxnId,
    description: payment.description,
    fees: payment.fees / 100,
    net: (payment.amount - payment.fees) / 100,
    created_at: payment.createdAt.toISOString(),
    updated_at: payment.updatedAt.toISOString(),
  });
}
