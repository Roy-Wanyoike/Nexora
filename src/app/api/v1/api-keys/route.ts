import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, okResponse, parseBody, generateApiKey, hashKey, auditLog } from "@/lib/api";
import { createApiKeySchema } from "@/lib/schemas";

/** GET /api/v1/api-keys?mode=test|live — list keys (never returns the full key) */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");

  const keys = await db.apiKey.findMany({
    where: {
      revokedAt: null,
      ...(mode ? { mode } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      label: true,
      keyPrefix: true,
      mode: true,
      createdAt: true,
    },
  });

  return okResponse(
    keys.map((k) => ({
      id: k.id,
      label: k.label,
      keyPrefix: k.keyPrefix,
      mode: k.mode,
      created: k.createdAt.toISOString().slice(0, 10),
    }))
  );
}

/** POST /api/v1/api-keys — create a new key. Returns the full key ONCE. */
export async function POST(req: NextRequest) {
  const rawBody = await parseBody<any>(req);
  if (!rawBody) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = createApiKeySchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error");
  }
  const body = parsed.data;

  // Find or create demo user
  let user = await db.user.findFirst({ where: { email: "john.doe@nexora.africa" } });
  if (!user) {
    user = await db.user.create({ data: { email: "john.doe@nexora.africa", name: "John Doe" } });
  }

  const rawKey = generateApiKey(body.mode);
  const keyHash = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, 12);

  const k = await db.apiKey.create({
    data: {
      label: body.label,
      keyHash,
      keyPrefix,
      mode: body.mode,
      userId: user.id,
    },
  });

  auditLog({
    actorUserId: user.id,
    action: "api_key.create",
    resourceType: "api_key",
    resourceId: k.id,
    req,
    metadata: { label: body.label, mode: body.mode },
  });

  return okResponse({
    id: k.id,
    label: k.label,
    key: rawKey, // full key — shown ONCE
    keyPrefix: k.keyPrefix,
    mode: k.mode,
    created: k.createdAt.toISOString().slice(0, 10),
  }, 201);
}
