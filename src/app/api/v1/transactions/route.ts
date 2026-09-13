import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, fromMinorUnit } from "@/lib/api";

export async function GET(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const url = new URL(req.url);
  const limitRaw = parseInt(url.searchParams.get("limit") || "20", 10);
  const offsetRaw = parseInt(url.searchParams.get("offset") || "0", 10);
  if (Number.isNaN(limitRaw) || Number.isNaN(offsetRaw) || limitRaw < 0 || offsetRaw < 0) {
    return errorResponse("`limit` and `offset` must be non-negative integers", 422, "validation_error");
  }
  const limit = Math.min(limitRaw, 100);
  const offset = offsetRaw;

  const [items, total] = await Promise.all([
    db.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.transaction.count(),
  ]);

  return okResponse({
    object: "list",
    has_more: offset + items.length < total,
    url: "/v1/transactions",
    data: items.map((t) => ({
      id: `txn_${t.id.slice(-10)}`,
      type: t.type,
      amount: fromMinorUnit(t.amount),
      currency: t.currency,
      status: t.status,
      description: t.description,
      created_at: t.createdAt.toISOString(),
    })),
  });
}
