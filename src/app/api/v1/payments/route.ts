import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  authenticate, errorResponse, okResponse, parseBody, toMinorUnit, randomId,
  getOrCreateDemoCustomer, checkIdempotency, saveIdempotencyRecord, hashRequestBody, auditLog,
} from "@/lib/api";
import { createPaymentSchema, formatZodError } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key. Send `Authorization: Bearer nxp_test_...`", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  // Strict zod validation
  const parsed = createPaymentSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error");
  }
  const body = parsed.data;

  // Idempotency check (if Idempotency-Key header present)
  const bodyHash = hashRequestBody(body);
  const idem = await checkIdempotency(req, bodyHash, "POST /v1/payments");
  if (idem.replay || idem.conflict) return idem.response!;

  const { amount, currency, channel, reference, description, customer: customerId } = body;
  const demoCustomer = await getOrCreateDemoCustomer();

  // Resolve customer: prefer provided ID (must exist), else demo
  let finalCustomerId = demoCustomer.id;
  if (customerId) {
    const exists = await db.customer.findUnique({ where: { id: customerId } });
    if (exists) finalCustomerId = exists.id;
  }

  // Reference dedup (idempotency-by-reference)
  if (reference) {
    const existing = await db.payment.findUnique({ where: { reference } });
    if (existing) {
      const replayBody = {
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
      };
      await saveIdempotencyRecord(req, bodyHash, "POST /v1/payments", { data: replayBody }, 200, key.userId);
      return okResponse(replayBody);
    }
  }

  let finalRef = reference || randomId(12, "nxp-");
  let attempts = 0;
  while (attempts < 5) {
    try {
      const result = await db.$transaction(async (tx) => {
        const payment = await tx.payment.create({
          data: {
            amount: toMinorUnit(amount),
            currency,
            channel,
            status: "succeeded",
            reference: finalRef,
            description: description ? String(description).slice(0, 500) : null,
            fees: Math.round(toMinorUnit(amount) * 0.015),
            customerId: finalCustomerId,
            userId: key.userId,
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

      // Audit log (fire-and-forget)
      auditLog({
        actorUserId: key.userId,
        apiKeyId: key.id,
        action: "payment.create",
        resourceType: "payment",
        resourceId: result.id,
        req,
        metadata: { amount, currency, reference: result.reference },
      });

      const responseBody = {
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
      };

      await saveIdempotencyRecord(req, bodyHash, "POST /v1/payments", { data: responseBody }, 200, key.userId);
      return okResponse(responseBody);
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
