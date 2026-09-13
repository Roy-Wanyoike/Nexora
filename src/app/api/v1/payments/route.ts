import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, parseBody, toMinorUnit, randomId, getOrCreateDemoCustomer, isValidAmount } from "@/lib/api";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key. Send `Authorization: Bearer nxp_test_...`", 401, "auth_error");

  const body = await parseBody<any>(req);
  if (!body || !isValidAmount(body.amount)) {
    return errorResponse("`amount` must be a positive finite number ≤ 1,000,000", 422, "validation_error");
  }
  if (!body.currency || typeof body.currency !== "string") {
    return errorResponse("`currency` is required (e.g. NGN, USD)", 422, "validation_error");
  }

  const { amount, currency, channel = "card", reference, description, customer: customerId } = body;
  const demoCustomer = await getOrCreateDemoCustomer();

  // If a customerId is provided, verify it exists; otherwise use demo customer
  let finalCustomerId = demoCustomer.id;
  if (customerId) {
    const exists = await db.customer.findUnique({ where: { id: customerId } });
    if (exists) finalCustomerId = exists.id;
  }

  // If a reference is provided, check for idempotency (return existing payment)
  if (reference) {
    const existing = await db.payment.findUnique({ where: { reference } });
    if (existing) {
      return okResponse({
        id: `pay_${existing.id.slice(-10)}`,
        object: "payment",
        amount: existing.amount / 100,
        currency: existing.currency,
        status: existing.status,
        channel: existing.channel,
        customer: existing.customerId,
        reference: existing.reference,
        created_at: existing.createdAt.toISOString(),
        fees: existing.fees / 100,
        net: (existing.amount - existing.fees) / 100,
        idempotent_replay: true,
      });
    }
  }

  // Generate a unique reference (handle collisions on @unique)
  let finalRef = reference || randomId(12, "nxp-");
  let attempts = 0;
  while (attempts < 5) {
    try {
      // Atomic: create payment + ledger entry in a single transaction
      const result = await db.$transaction(async (tx) => {
        const payment = await tx.payment.create({
          data: {
            amount: toMinorUnit(amount),
            currency: currency.toUpperCase(),
            channel,
            status: "succeeded",
            reference: finalRef,
            description: description ? String(description).slice(0, 500) : null,
            fees: Math.round(toMinorUnit(amount) * 0.015),
            customerId: finalCustomerId,
          },
        });

        await tx.transaction.create({
          data: {
            type: "payment",
            amount: payment.amount,
            currency: payment.currency,
            status: "succeeded",
            description: description || `Payment ${payment.reference}`,
          },
        });

        return payment;
      });

      return okResponse({
        id: `pay_${result.id.slice(-10)}`,
        object: "payment",
        amount,
        currency: result.currency,
        status: result.status,
        channel: result.channel,
        customer: result.customerId,
        reference: result.reference,
        created_at: result.createdAt.toISOString(),
        fees: result.fees / 100,
        net: (result.amount - result.fees) / 100,
      });
    } catch (e: any) {
      if (e?.code === "P2002" && attempts < 4) {
        finalRef = randomId(12, "nxp-");
        attempts++;
        continue;
      }
      console.error("Payment creation failed:", e?.code || e?.message);
      return errorResponse("Failed to create payment", 500, "internal_error");
    }
  }
  return errorResponse("Failed to create payment after 5 attempts", 500, "internal_error");
}
