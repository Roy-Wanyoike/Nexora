import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  authenticate, errorResponse, okResponse, parseBody, toMinorUnit, randomId,
  checkIdempotency, saveIdempotencyRecord, hashRequestBody, auditLog,
} from "@/lib/api";
import { createPayoutSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = createPayoutSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error");
  }
  const body = parsed.data;

  // Idempotency
  const bodyHash = hashRequestBody(body);
  const idem = await checkIdempotency(req, bodyHash, "POST /v1/payouts");
  if (idem.replay || idem.conflict) return idem.response!;

  // Reference dedup
  if (body.reference) {
    const existing = await db.payout.findUnique({ where: { reference: body.reference } });
    if (existing) {
      const replayBody = {
        id: `pout_${existing.id.slice(-10)}`,
        object: "payout",
        amount: existing.amount / 100,
        currency: existing.currency,
        status: existing.status,
        destination: { type: existing.destType, country: existing.destCountry },
        reference: existing.reference,
        estimated_arrival: new Date(existing.createdAt.getTime() + 3 * 3600_000).toISOString(),
        created_at: existing.createdAt.toISOString(),
        idempotent_replay: true,
      };
      await saveIdempotencyRecord(req, bodyHash, "POST /v1/payouts", { data: replayBody }, 200, key.userId);
      return okResponse(replayBody);
    }
  }

  let reference = body.reference || randomId(12, "payout-");
  let attempts = 0;

  while (attempts < 5) {
    try {
      const payout = await db.$transaction(async (tx) => {
        const p = await tx.payout.create({
          data: {
            amount: toMinorUnit(body.amount),
            currency: body.currency,
            status: "pending",
            destType: body.destination.type,
            destCountry: body.destination.country,
            reference,
            reason: body.reason ? String(body.reason).slice(0, 500) : null,
            userId: key.userId,
          },
        });

        await tx.transaction.create({
          data: {
            type: "payout",
            amount: p.amount,
            currency: p.currency,
            status: "pending",
            description: body.reason || `Payout ${p.reference}`,
          },
        });

        return p;
      });

      auditLog({
        actorUserId: key.userId,
        apiKeyId: key.id,
        action: "payout.create",
        resourceType: "payout",
        resourceId: payout.id,
        req,
        metadata: { amount: body.amount, currency: body.currency, destination: body.destination },
      });

      const responseBody = {
        id: `pout_${payout.id.slice(-10)}`,
        object: "payout",
        amount: body.amount,
        currency: payout.currency,
        status: payout.status,
        destination: { type: payout.destType, country: payout.destCountry },
        reference: payout.reference,
        estimated_arrival: new Date(payout.createdAt.getTime() + 3 * 3600_000).toISOString(),
        created_at: payout.createdAt.toISOString(),
      };

      await saveIdempotencyRecord(req, bodyHash, "POST /v1/payouts", { data: responseBody }, 200, key.userId);
      return okResponse(responseBody);
    } catch (e: any) {
      if (e?.code === "P2002" && attempts < 4) {
        reference = randomId(12, "payout-");
        attempts++;
        continue;
      }
      console.error("Payout creation failed:", e?.code || e?.message);
      return errorResponse("Failed to create payout", 500, "internal_error");
    }
  }
  return errorResponse("Failed to create payout after 5 attempts", 500, "internal_error");
}
