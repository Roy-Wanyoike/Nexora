import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse } from "@/lib/api";

const RAILS: Record<string, string[]> = {
  USD: ["ach", "wire", "swift"],
  GBP: ["faster_payments", "chaps"],
  EUR: ["sepa", "target2"],
  CNY: ["cnaps", "cips"],
};

/** GET /api/v1/foreign-accounts/:id — retrieve an account, scoped to key.userId. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const { id } = await params;
  const acct = await db.foreignAccount.findFirst({
    where: {
      userId: key.userId,
      id: { endsWith: id.startsWith("fac_") ? id.slice(4) : id },
    },
  });
  if (!acct) {
    return errorResponse("Foreign account not found", 404, "not_found");
  }

  return okResponse({
    id: `fac_${acct.id.slice(-10)}`,
    object: "foreign_account",
    currency: acct.currency,
    account_name: acct.accountName,
    account_number: acct.accountNumber,
    routing_number: acct.routingNumber,
    bank_name: acct.bankName,
    customer_type: acct.customerType,
    supported_rails: RAILS[acct.currency] || [],
    status: acct.status,
    created_at: acct.createdAt.toISOString(),
  });
}
