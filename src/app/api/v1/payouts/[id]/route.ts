import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, auditLog } from "@/lib/api";
import { formatZodError } from "@/lib/schemas";

const patchPayoutSchema = z.object({
  status: z.literal("cancelled"),
});

/** GET /api/v1/payouts/:id — retrieve a payout, scoped to key.userId. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const { id } = await params;
  const payout = await db.payout.findFirst({
    where: {
      userId: key.userId,
      id: { endsWith: id.startsWith("pout_") ? id.slice(5) : id },
    },
  });
  if (!payout) {
    return errorResponse("Payout not found", 404, "not_found");
  }

  return okResponse({
    id: `pout_${payout.id.slice(-10)}`,
    object: "payout",
    amount: payout.amount / 100,
    currency: payout.currency,
    status: payout.status,
    destination: { type: payout.destType, country: payout.destCountry },
    reference: payout.reference,
    reason: payout.reason,
    estimated_arrival: new Date(payout.createdAt.getTime() + 3 * 3600_000).toISOString(),
    created_at: payout.createdAt.toISOString(),
    updated_at: payout.updatedAt.toISOString(),
  });
}

/**
 * PATCH /api/v1/payouts/:id
 *
 * Currently supports a single transition: `status: "cancelled"` while the
 * payout is still `pending`. Once it has moved to `paid` it cannot be
 * cancelled. Failed payouts also cannot be cancelled (they're already
 * terminal).
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const { id } = await params;
  const payout = await db.payout.findFirst({
    where: {
      userId: key.userId,
      id: { endsWith: id.startsWith("pout_") ? id.slice(5) : id },
    },
  });
  if (!payout) {
    return errorResponse("Payout not found", 404, "not_found");
  }

  const text = await req.text().catch(() => "");
  let rawBody: any = null;
  try {
    rawBody = text ? JSON.parse(text) : {};
  } catch {
    return errorResponse("Invalid JSON body", 422, "validation_error");
  }

  const parsed = patchPayoutSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }

  if (payout.status !== "pending") {
    return errorResponse(
      `Payout cannot be cancelled in its current state (${payout.status}). Only pending payouts can be cancelled.`,
      409,
      "invalid_state"
    );
  }

  const updated = await db.payout.update({
    where: { id: payout.id },
    data: { status: "failed" }, // cancelled → recorded as failed (terminal)
  });

  // Mirror state on the ledger row.
  await db.transaction
    .updateMany({
      where: { type: "payout", amount: payout.amount, currency: payout.currency, status: "pending", userId: key.userId },
      data: { status: "failed" },
    })
    .catch(() => {});

  auditLog({
    actorUserId: key.userId,
    apiKeyId: key.id,
    action: "payout.cancel",
    resourceType: "payout",
    resourceId: payout.id,
    req,
    metadata: { reference: payout.reference, previous_status: payout.status },
  });

  return okResponse({
    id: `pout_${updated.id.slice(-10)}`,
    object: "payout",
    amount: updated.amount / 100,
    currency: updated.currency,
    status: "cancelled",
    destination: { type: updated.destType, country: updated.destCountry },
    reference: updated.reference,
    reason: updated.reason,
    created_at: updated.createdAt.toISOString(),
    updated_at: updated.updatedAt.toISOString(),
  });
}
