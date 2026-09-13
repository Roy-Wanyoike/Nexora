import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, parseBody, toMinorUnit, randomId, isValidAmount } from "@/lib/api";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const body = await parseBody<any>(req);
  if (!body || !isValidAmount(body.amount)) {
    return errorResponse("`amount` must be a positive finite number ≤ 1,000,000", 422, "validation_error");
  }
  if (!body.currency || !body.destination) {
    return errorResponse("`currency` and `destination` are required", 422, "validation_error");
  }

  const dest = body.destination;

  // Idempotency: if reference exists, return the existing payout
  if (body.reference) {
    const existing = await db.payout.findUnique({ where: { reference: body.reference } });
    if (existing) {
      return okResponse({
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
      });
    }
  }

  let reference = body.reference || randomId(12, "payout-");
  let attempts = 0;

  while (attempts < 5) {
    try {
      // Atomic: create payout + ledger entry in a single transaction
      const payout = await db.$transaction(async (tx) => {
        const p = await tx.payout.create({
          data: {
            amount: toMinorUnit(body.amount),
            currency: body.currency.toUpperCase(),
            status: "pending",
            destType: dest.type || "bank",
            destCountry: dest.country || "NG",
            reference,
            reason: body.reason ? String(body.reason).slice(0, 500) : null,
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

      return okResponse({
        id: `pout_${payout.id.slice(-10)}`,
        object: "payout",
        amount: body.amount,
        currency: payout.currency,
        status: payout.status,
        destination: { type: payout.destType, country: payout.destCountry },
        reference: payout.reference,
        estimated_arrival: new Date(payout.createdAt.getTime() + 3 * 3600_000).toISOString(),
        created_at: payout.createdAt.toISOString(),
      });
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
