import { NextResponse } from "next/server";

/**
 * GET /api/v1/sandbox-key
 * Returns a sandbox API key for the public endpoint explorer.
 *
 * Security: Returns only the key PREFIX (first 12 chars) for display.
 * The full key is never sent to anonymous callers. The endpoint explorer
 * on /docs fetches this and displays the prefix; the actual Send button
 * uses a server-side proxy to make authenticated requests.
 *
 * To get a full key, use POST /api/v1/api-keys with the master key.
 */
export async function GET() {
  const key = process.env.NEXORA_SANDBOX_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Sandbox key not configured. Set NEXORA_SANDBOX_KEY env var.", code: "not_configured" },
      { status: 503 }
    );
  }
  // Return only the prefix for display — never the full key
  const keyPrefix = key.slice(0, 12);
  return NextResponse.json({
    data: {
      keyPrefix,
      mode: "test" as const,
      note: "Use POST /api/v1/api-keys with a master key to get a full key.",
    },
  });
}
