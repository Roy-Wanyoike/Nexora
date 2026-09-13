import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, parseBody, randomId } from "@/lib/api";

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const body = await parseBody<any>(req);
  if (!body || typeof body.amount !== "number" || !body.currency) {
    return errorResponse("`amount` and `currency` are required", 422, "validation_error");
  }

  const id = randomId(8, "plink_");
  const slug = randomId(8, "nxp-");

  return okResponse({
    id,
    object: "payment_link",
    url: `https://pay.nexapay.africa/l/${slug}`,
    amount: body.amount,
    currency: body.currency.toUpperCase(),
    title: body.title || "Payment",
    description: body.description,
    status: "active",
    redirect_url: body.redirect_url,
    created_at: new Date().toISOString(),
  });
}
