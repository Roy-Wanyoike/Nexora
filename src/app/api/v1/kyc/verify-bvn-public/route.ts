import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHash } from "node:crypto";
import { z } from "zod";
import { auditLog, methodNotAllowed } from "@/lib/api";
import { formatZodError } from "@/lib/schemas";

const verifyBvnPublicSchema = z.object({
  bvn: z.string().regex(/^\d{11}$/, "BVN must be exactly 11 digits"),
});

/**
 * POST /api/v1/kyc/verify-bvn-public
 * Public KYC verification for the /kyc page demo.
 *
 * Gates on NEXORA_SANDBOX_KEY being configured server-side; the key
 * itself is never sent to the client. Abuse is mitigated by the global
 * rate limiter in src/middleware.ts (30/min per IP for anon callers).
 *
 * Returns 503 when KYC is not configured for the demo.
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
  const parsed = verifyBvnPublicSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", code: "validation_error", fields: formatZodError(parsed.error) },
      { status: 422 }
    );
  }

  const bvn = parsed.data.bvn;
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

  // Dev mode: auto-verify. Prod should require a real vendor (Youverify/Smile Identity).
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

  await auditLog({
    action: "kyc.verify_bvn_public",
    resourceType: "customer",
    resourceId: customer.id,
    req,
    metadata: { kyc_status: "verified", kyc_tier: 1 },
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

export async function GET(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PUT(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
