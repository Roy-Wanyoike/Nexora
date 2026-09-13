import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, okResponse, parseBody, randomId } from "@/lib/api";

/** GET /api/v1/api-keys?mode=test|live — list keys for the dashboard UI */
export async function GET(req: NextRequest) {
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
      key: true,
      mode: true,
      createdAt: true,
    },
  });

  return okResponse(
    keys.map((k) => ({
      id: k.id,
      label: k.label,
      key: k.key,
      mode: k.mode,
      created: k.createdAt.toISOString().slice(0, 10),
    }))
  );
}

/** POST /api/v1/api-keys — create a new key { label, mode } */
export async function POST(req: NextRequest) {
  const body = await parseBody<any>(req);
  if (!body || !body.label || !body.mode) {
    return errorResponse("`label` and `mode` (test|live) are required", 422, "validation_error");
  }

  // Find or create demo user
  let user = await db.user.findFirst({ where: { email: "john.doe@nexapay.africa" } });
  if (!user) {
    user = await db.user.create({ data: { email: "john.doe@nexapay.africa", name: "John Doe" } });
  }

  const tag = body.mode === "live" ? "live" : "test";
  const keyStr = `nxp_${tag}_${randomId(24, "")}`;

  const k = await db.apiKey.create({
    data: {
      label: body.label,
      key: keyStr,
      mode: tag,
      userId: user.id,
    },
  });

  return okResponse({
    id: k.id,
    label: k.label,
    key: k.key,
    mode: k.mode,
    created: k.createdAt.toISOString().slice(0, 10),
  });
}
