import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHash } from "node:crypto";

/**
 * POST /api/v1/kyc/verify-bvn-public
 * Public KYC verification for the /kyc page demo.
 * Uses the NEXORA_SANDBOX_KEY internally — no key exposed to the client.
 */
export async function POST(req: NextRequest) {
  const sandboxKey = process.env.NEXORA_SANDBOX_KEY;
  if (!sandboxKey) {
    return NextResponse.json(
      { error: "KYC demo not configured.", code: "not_configured" },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.bvn) {
    return NextResponse.json(
      { error: "BVN is required", code: "validation_error" },
      { status: 422 }
    );
  }

  const bvn = String(body.bvn);
  if (!/^\d{11}$/.test(bvn)) {
    return NextResponse.json(
      { error: "BVN must be exactly 11 digits", code: "validation_error" },
      { status: 422 }
    );
  }

  // Hash BVN (never store raw)
  const bvnHash = createHash("sha256").update(bvn).digest("hex");

  // Find or create the demo customer
  let customer = await db.customer.findFirst({ where: { email: "john.doe@nexapay.africa" } });
  if (!customer) {
    customer = await db.customer.create({
      data: { email: "john.doe@nexapay.africa", name: "John Doe", phone: "+2348000000000" },
    });
  }

  // Check if already verified
  if (customer.bvnHash === bvnHash && customer.kycStatus === "verified") {
    return NextResponse.json({
      data: {
        customer_id: customer.id,
        kyc_status: customer.kycStatus,
        kyc_tier: customer.kycTier,
        verified_at: customer.kycVerifiedAt?.toISOString() ?? null,
      },
    });
  }

  // Dev mode: auto-verify
  const updated = await db.customer.update({
    where: { id: customer.id },
    data: {
      bvnHash,
      bvnVerifiedAt: new Date(),
      kycStatus: "verified",
      kycTier: 1,
      kycVerifiedAt: new Date(),
    },
  });

  return NextResponse.json({
    data: {
      customer_id: updated.id,
      kyc_status: updated.kycStatus,
      kyc_tier: updated.kycTier,
      verified_at: updated.kycVerifiedAt?.toISOString() ?? null,
    },
  }, { status: 201 });
}
