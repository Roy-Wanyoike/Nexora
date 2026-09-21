import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { methodNotAllowed } from "@/lib/api";
import packageJson from "@/../package.json";

export const dynamic = "force-dynamic";

const VERSION = packageJson.version;

/**
 * GET /api/health
 *
 * Liveness + DB-readiness probe.
 *   - 200 { status: "ok", db: "up", latency_ms, version, timestamp }
 *   - 503 { status: "degraded", db: "down", error, latency_ms, version, timestamp }
 *
 * The DB ping is a single `SELECT 1` via $queryRaw.
 */
export async function GET() {
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    const latency_ms = Date.now() - start;
    return NextResponse.json(
      {
        status: "ok",
        db: "up",
        latency_ms,
        version: VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (e: any) {
    const latency_ms = Date.now() - start;
    return NextResponse.json(
      {
        status: "degraded",
        db: "down",
        error: e?.message || "unknown_error",
        latency_ms,
        version: VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) { return methodNotAllowed(req, ["GET"]); }
export async function PUT(req: NextRequest) { return methodNotAllowed(req, ["GET"]); }
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["GET"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["GET"]); }
