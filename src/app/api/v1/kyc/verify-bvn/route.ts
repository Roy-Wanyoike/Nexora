import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  authenticate,
  errorResponse,
  okResponse,
  parseBody,
  hashKey,
  getOrCreateDemoCustomer,
  auditLog, methodNotAllowed } from "@/lib/api";

/**
 * POST /api/v1/kyc/verify-bvn
 *
 * Accepts a Customer's 11-digit BVN, hashes it with SHA-256 (the raw BVN is
 * NEVER stored), and updates the Customer's KYC record.
 *
 * - In dev mode: marks kycStatus = "verified", kycTier = 1 immediately.
 * - In prod mode: would call Youverify / Smile Identity to verify the BVN
 *   against the CBN / NIBSS database. That integration is stubbed below with
 *   a TODO.
 *
 * Requires a valid `Authorization: Bearer nxp_test_...` or `nxp_live_...` key.
 */

const verifyBvnSchema = z.object({
  bvn: z
    .string()
    .length(11, "bvn must be exactly 11 digits")
    .regex(/^\d{11}$/, "bvn must contain only digits"),
  id_type: z
    .enum(["nin", "drivers_license", "passport", "voters_card"])
    .optional(),
  id_number: z
    .string()
    .max(32, "id_number must be ≤ 32 chars")
    .optional(),
});

// TODO(prod): integrate with Youverify / Smile Identity for real BVN verification.
// 1. POST the BVN (over TLS) to the vendor's verify endpoint with our API key.
// 2. Validate the returned name/DOB against the Customer's profile.
// 3. Run sanctions & PEP screening (OFAC, UN, EU, HMT, NFIU lists).
// 4. On success: set kycStatus="verified", kycTier=1, bvnVerifiedAt=now.
// 5. On failure: set kycStatus="rejected" and return a reason.
// 6. Persist the vendor's verification reference in an AuditLog entry.
async function verifyBvnViaVendor(_bvn: string): Promise<{
  verified: boolean;
  reason?: string;
}> {
  // DEV STUB: pretend every BVN is valid so the demo flow works end-to-end.
  // In production this function would call the vendor and return real results.
  return { verified: true };
}

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) {
    return errorResponse(
      "Invalid or missing API key. Send `Authorization: Bearer nxp_test_...`",
      401,
      "auth_error"
    );
  }

  const rawBody = await parseBody<any>(req);
  if (!rawBody) {
    return errorResponse("Request body is required", 422, "validation_error");
  }

  const parsed = verifyBvnSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse(
      "Validation failed: " + parsed.error.issues.map((i) => i.message).join("; "),
      422,
      "validation_error"
    );
  }
  const { bvn, id_type, id_number } = parsed.data;

  // Hash the BVN with SHA-256 — the raw 11-digit value is never persisted to disk.
  const bvnHash = hashKey(bvn);

  // Resolve the Customer record to update. In this demo we use the shared
  // demo customer; in production, the authenticated API key's userId would
  // resolve to a specific Customer via a user ↔ customer link.
  const demoCustomer = await getOrCreateDemoCustomer();
  const customer = await db.customer.findUnique({ where: { id: demoCustomer.id } });
  if (!customer) {
    return errorResponse("Customer not found", 404, "not_found");
  }

  // Prevent reuse of a BVN that is already linked to a different Customer.
  // (bvnHash is @unique, so the DB will also enforce this; we surface a
  // friendlier error here.)
  const existingBvn = await db.customer.findFirst({
    where: { bvnHash, id: { not: customer.id } },
    select: { id: true },
  });
  if (existingBvn) {
    return errorResponse(
      "This BVN is already linked to another customer.",
      409,
      "bvn_already_in_use"
    );
  }

  const isProd = process.env.NODE_ENV === "production" && process.env.KYC_LIVE === "1";

  let kycStatus: "verified" | "rejected" | "pending" = "pending";
  let kycTier = 0;
  let rejectReason: string | undefined;

  if (isProd) {
    // TODO(prod): call Youverify / Smile Identity here and act on the real result.
    const result = await verifyBvnViaVendor(bvn);
    if (result.verified) {
      kycStatus = "verified";
      kycTier = 1;
    } else {
      kycStatus = "rejected";
      rejectReason = result.reason || "BVN could not be verified.";
    }
  } else {
    // DEV MODE: short-circuit to "verified" so the demo flow works end-to-end.
    kycStatus = "verified";
    kycTier = 1;
  }

  const now = new Date();

  // Persist the (hashed) BVN + KYC state. Raw BVN is never written.
  const updated = await db.customer.update({
    where: { id: customer.id },
    data: {
      bvnHash,
      bvnVerifiedAt: kycStatus === "verified" ? now : null,
      idType: id_type ?? customer.idType,
      idNumber: id_number ?? customer.idNumber,
      kycStatus,
      kycTier: kycStatus === "verified" ? kycTier : customer.kycTier,
      kycVerifiedAt: kycStatus === "verified" ? now : null,
      // Default screening results — replaced by real screening in prod.
      pepStatus: customer.pepStatus ?? "unknown",
      sanctionsStatus: customer.sanctionsStatus ?? "unknown",
    },
    select: {
      id: true,
      kycStatus: true,
      kycTier: true,
      kycVerifiedAt: true,
    },
  });

  // Fire-and-forget audit log entry — never block the response on this.
  auditLog({
    actorUserId: key.userId,
    apiKeyId: key.id,
    action: "kyc.bvn_verify",
    resourceType: "customer",
    resourceId: customer.id,
    req,
    metadata: {
      kyc_status: kycStatus,
      kyc_tier: kycStatus === "verified" ? kycTier : undefined,
      id_type: id_type ?? undefined,
      // NOTE: the raw BVN is intentionally NOT included in the audit log.
      bvn_hash_prefix: bvnHash.slice(0, 8),
    },
  });

  if (kycStatus === "rejected") {
    return errorResponse(rejectReason || "BVN verification failed.", 422, "kyc_rejected");
  }

  return okResponse({
    customer_id: updated.id,
    kyc_status: updated.kycStatus,
    kyc_tier: updated.kycTier,
    verified_at: updated.kycVerifiedAt?.toISOString() ?? null,
  });
}

/** GET /api/v1/kyc/verify-bvn — return the current KYC status of the demo customer. */
export async function GET(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) {
    return errorResponse(
      "Invalid or missing API key. Send `Authorization: Bearer nxp_test_...`",
      401,
      "auth_error"
    );
  }

  const demoCustomer = await getOrCreateDemoCustomer();
  const customer = await db.customer.findUnique({
    where: { id: demoCustomer.id },
    select: {
      id: true,
      kycStatus: true,
      kycTier: true,
      kycVerifiedAt: true,
      bvnVerifiedAt: true,
      idType: true,
      pepStatus: true,
      sanctionsStatus: true,
    },
  });
  if (!customer) {
    return errorResponse("Customer not found", 404, "not_found");
  }

  return okResponse({
    customer_id: customer.id,
    kyc_status: customer.kycStatus,
    kyc_tier: customer.kycTier,
    bvn_verified: !!customer.bvnVerifiedAt,
    id_type: customer.idType,
    pep_status: customer.pepStatus,
    sanctions_status: customer.sanctionsStatus,
    verified_at: customer.kycVerifiedAt?.toISOString() ?? null,
  });
}
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
