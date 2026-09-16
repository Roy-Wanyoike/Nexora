import { NextResponse } from "next/server";

/**
 * GET /api/v1/sandbox-key
 * Returns a sandbox API key for the public endpoint explorer.
 * The key MUST be set via NEXORA_SANDBOX_KEY env var — no hardcoded fallback.
 */
export async function GET() {
  const key = process.env.NEXORA_SANDBOX_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Sandbox key not configured. Set NEXORA_SANDBOX_KEY env var.", code: "not_configured" },
      { status: 503 }
    );
  }
  return NextResponse.json({ data: { key, mode: "test" as const } });
}
