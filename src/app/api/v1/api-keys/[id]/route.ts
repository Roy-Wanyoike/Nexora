import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, okResponse } from "@/lib/api";

/** DELETE /api/v1/api-keys/:id — revoke a key (soft delete) */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await db.apiKey.findUnique({ where: { id } });
  if (!existing) return errorResponse("API key not found", 404, "not_found");

  await db.apiKey.update({
    where: { id },
    data: { revokedAt: new Date() },
  });

  return okResponse({ id, revoked: true });
}
