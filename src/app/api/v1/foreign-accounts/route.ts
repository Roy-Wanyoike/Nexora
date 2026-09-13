import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, parseBody, randomId, getOrCreateDemoCustomer } from "@/lib/api";

const BANKS: Record<string, { name: string; routingLabel: string }> = {
  USD: { name: "Nexa Pay / Evolve", routingLabel: "routing_number" },
  GBP: { name: "Nexa Pay UK Ltd", routingLabel: "sort_code" },
  EUR: { name: "Nexa Pay EU GmbH", routingLabel: "bic" },
  CNY: { name: "Nexa Pay China", routingLabel: "cnaps" },
};

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const body = await parseBody<any>(req);
  if (!body || !body.currency) {
    return errorResponse("`currency` is required (USD | GBP | EUR | CNY)", 422, "validation_error");
  }

  const cur = body.currency.toUpperCase();
  if (!BANKS[cur]) return errorResponse(`Unsupported currency: ${cur}`, 422, "validation_error");

  const customer = await getOrCreateDemoCustomer();
  const bank = BANKS[cur];
  const accountNumber = cur === "EUR"
    ? `DE89${randomId(16, "")}`
    : String(Math.floor(1_000_000_000 + Math.random() * 8_999_999_999));
  const routingNumber = cur === "USD"
    ? "084009519"
    : cur === "GBP"
    ? "04-00-19"
    : cur === "EUR"
    ? "PAYSDEMM"
    : "104100000004";

  const acct = await db.foreignAccount.create({
    data: {
      currency: cur,
      accountName: body.account_name || "John Doe",
      accountNumber,
      routingNumber,
      bankName: bank.name,
      customerType: body.customer_type || "individual",
      status: "active",
      customerId: customer.id,
    },
  });

  return okResponse({
    id: `fac_${acct.id.slice(-10)}`,
    object: "foreign_account",
    currency: acct.currency,
    account_name: acct.accountName,
    account_number: acct.accountNumber,
    routing_number: acct.routingNumber,
    bank_name: acct.bankName,
    supported_rails: cur === "USD" ? ["ach", "wire", "swift"] : cur === "GBP" ? ["faster_payments", "chaps"] : cur === "EUR" ? ["sepa", "target2"] : ["cnaps", "cips"],
    status: acct.status,
    created_at: acct.createdAt.toISOString(),
  });
}
