import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, okResponse, auditLog } from "@/lib/api";

/** DELETE /api/v1/api-keys/:id — revoke a key (soft delete) */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await db.apiKey.findUnique({ where: { id } });
  if (!existing) return errorResponse("API key not found", 404, "not_found");

  await db.apiKey.update({
    where: { id },
    data: { revokedAt: new Date() },
  });

  auditLog({
    actorUserId: existing.userId,
    action: "api_key.revoke",
    resourceType: "api_key",
    resourceId: id,
    req,
    metadata: { label: existing.label, mode: existing.mode },
  });

  return okResponse({ id, revoked: true });
}
