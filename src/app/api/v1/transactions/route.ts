import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authenticate, errorResponse, okResponse, fromMinorUnit } from "@/lib/api";
import { listTransactionsSchema, formatZodError } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const url = new URL(req.url);
  const parsed = listTransactionsSchema.safeParse({
    limit: url.searchParams.get("limit") ?? undefined,
    offset: url.searchParams.get("offset") ?? undefined,
  });
  if (!parsed.success) {
    return errorResponse("Invalid pagination parameters", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }
  const { limit, offset } = parsed.data;

  const type = url.searchParams.get("type") || undefined;
  const status = url.searchParams.get("status") || undefined;

  // Scope to the calling API key's userId — never leak another tenant's ledger.
  const where = {
    userId: key.userId,
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
  };

  const [items, total] = await Promise.all([
    db.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.transaction.count({ where }),
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
