import { NextRequest, NextResponse } from "next/server";

/**
 * Catch-all 404 for unknown /api/v1/* routes.
 *
 * Without this, Next.js serves the root HTML not-found.tsx for unknown API
 * paths, which is wrong for an API (clients expect JSON). This handler
 * guarantees a JSON 404 for any unmatched /api/v1/* path.
 *
 * Existing route handlers (e.g. /api/v1/payments/route.ts) take precedence
 * over this catch-all, so real endpoints are unaffected.
 */

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;

export async function GET(req: NextRequest)      { return notFound(req); }
export async function POST(req: NextRequest)     { return notFound(req); }
export async function PUT(req: NextRequest)      { return notFound(req); }
export async function PATCH(req: NextRequest)    { return notFound(req); }
export async function DELETE(req: NextRequest)   { return notFound(req); }
export async function HEAD(req: NextRequest)     { return notFound(req); }
export async function OPTIONS(req: NextRequest)  { return notFound(req); }

function notFound(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || "unknown";
  return NextResponse.json(
    {
      error: "Not found",
      code: "not_found",
      path: req.nextUrl.pathname,
      request_id: requestId,
    },
    { status: 404 }
  );
}
