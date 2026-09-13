import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, parseBody, randomId, randomLast4, getOrCreateDemoCustomer } from "@/lib/api";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const body = await parseBody<any>(req);
  if (!body || !body.currency) {
    return errorResponse("`currency` is required (USD or NGN)", 422, "validation_error");
  }
  const allowedCurrencies = ["USD", "NGN", "GBP", "EUR"];
  const cur = String(body.currency).toUpperCase();
  if (!allowedCurrencies.includes(cur)) {
    return errorResponse(`Unsupported currency: ${cur}. Allowed: ${allowedCurrencies.join(", ")}`, 422, "validation_error");
  }

  const customer = await getOrCreateDemoCustomer();
  const now = new Date();
  const expMonth = body.exp_month || (now.getMonth() + 1);
  const expYear = body.exp_year || (now.getFullYear() + 4);

  const card = await db.virtualCard.create({
    data: {
      brand: body.brand || "visa",
      last4: randomLast4(),
      expMonth,
      expYear,
      currency: cur,
      spendingLimit: body.spending_limit ? Math.round(body.spending_limit * 100) : null,
      spendingInterval: body.spending_interval || "monthly",
      label: body.label,
      status: "active",
      customerId: customer.id,
    },
  });

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
  });
}
