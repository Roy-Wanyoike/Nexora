import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, okResponse, parseBody, generateApiKey, hashKey } from "@/lib/api";

/** GET /api/v1/api-keys?mode=test|live — list keys (never returns the full key, only the prefix) */
export async function GET(req: NextRequest) {
  // NOTE: In a real app this would require a session cookie or master key.
  // For the demo we allow it but only return the prefix (never the full key).
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode"); // "test" | "live" | undefined (all)

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

/** POST /api/v1/api-keys — create a new key { label, mode }. Returns the full key ONCE. */
export async function POST(req: NextRequest) {
  const body = await parseBody<any>(req);
  if (!body || !body.label || !body.mode) {
    return errorResponse("`label` and `mode` (test|live) are required", 422, "validation_error");
  }
  if (body.mode !== "test" && body.mode !== "live") {
    return errorResponse("`mode` must be 'test' or 'live'", 422, "validation_error");
  }

  // Find or create demo user
  let user = await db.user.findFirst({ where: { email: "john.doe@nexora.africa" } });
  if (!user) {
    user = await db.user.create({ data: { email: "john.doe@nexora.africa", name: "John Doe" } });
  }

  const rawKey = generateApiKey(body.mode);
  const keyHash = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, 12); // "nxp_test_8h2k"

  const k = await db.apiKey.create({
    data: {
      label: String(body.label).slice(0, 100),
      keyHash,
      keyPrefix,
      mode: body.mode,
      userId: user.id,
    },
  });

  // Return the full key ONLY at creation time (caller must store it — it's never retrievable again)
  return okResponse({
    id: k.id,
    label: k.label,
    key: rawKey, // full key — shown ONCE
    keyPrefix: k.keyPrefix,
    mode: k.mode,
    created: k.createdAt.toISOString().slice(0, 10),
  }, 201);
}
