import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, auditLog } from "@/lib/api";
import { formatZodError } from "@/lib/schemas";

const patchCardSchema = z.object({
  status: z.enum(["freeze", "unfreeze"]),
});

/** GET /api/v1/virtual-cards/:id — retrieve a card, scoped to key.userId. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const { id } = await params;
  const card = await db.virtualCard.findFirst({
    where: {
      userId: key.userId,
      id: { endsWith: id.startsWith("card_") ? id.slice(5) : id },
    },
  });
  if (!card) {
    return errorResponse("Virtual card not found", 404, "not_found");
  }

  return okResponse({
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
    updated_at: card.updatedAt.toISOString(),
  });
}

/**
 * PATCH /api/v1/virtual-cards/:id
 *
 * Body: `{ "status": "freeze" | "unfreeze" }`.
 * Toggles the card between `active` and `frozen`. Cards that are `deleted`
 * cannot be modified.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const { id } = await params;
  const card = await db.virtualCard.findFirst({
    where: {
      userId: key.userId,
      id: { endsWith: id.startsWith("card_") ? id.slice(5) : id },
    },
  });
  if (!card) {
    return errorResponse("Virtual card not found", 404, "not_found");
  }

  const text = await req.text().catch(() => "");
  let rawBody: any = null;
  try {
    rawBody = text ? JSON.parse(text) : {};
  } catch {
    return errorResponse("Invalid JSON body", 422, "validation_error");
  }

  const parsed = patchCardSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }

  if (card.status === "deleted") {
    return errorResponse("Cannot modify a deleted card", 409, "invalid_state");
  }

  const nextStatus = parsed.data.status === "freeze" ? "frozen" : "active";
  if (card.status === nextStatus) {
    // Idempotent — return current state, no audit log entry.
    return okResponse({
      id: `card_${card.id.slice(-10)}`,
      object: "virtual_card",
      status: card.status,
      updated_at: card.updatedAt.toISOString(),
    });
  }

  const updated = await db.virtualCard.update({
    where: { id: card.id },
    data: { status: nextStatus },
  });

  auditLog({
    actorUserId: key.userId,
    apiKeyId: key.id,
    action: nextStatus === "frozen" ? "virtual_card.freeze" : "virtual_card.unfreeze",
    resourceType: "virtual_card",
    resourceId: card.id,
    req,
    metadata: { previous_status: card.status, next_status: nextStatus },
  });

  return okResponse({
    id: `card_${updated.id.slice(-10)}`,
    object: "virtual_card",
    brand: updated.brand,
    last4: updated.last4,
    exp_month: updated.expMonth,
    exp_year: updated.expYear,
    currency: updated.currency,
    spending_limit: updated.spendingLimit ? updated.spendingLimit / 100 : null,
    spending_interval: updated.spendingInterval,
    label: updated.label,
    status: updated.status,
    created_at: updated.createdAt.toISOString(),
    updated_at: updated.updatedAt.toISOString(),
  });
}
