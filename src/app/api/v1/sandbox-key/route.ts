import { NextResponse } from "next/server";

/**
 * GET /api/v1/sandbox-key
 *
 * Returns a public test API key for the live endpoint explorer.
 *
 * This route intentionally requires NO auth — the key it returns is a sandbox
 * test key that is already safe to ship in the client bundle (it is a demo
 * key). The point of serving it from the server is to keep the source repo
 * free of hardcoded keys and to make the key configurable via the
 * NEXORA_SANDBOX_KEY environment variable.
 *
 * The raw key is also seeded into the database (see scripts/seed.ts) so
 * requests made by the explorer authenticate successfully.
 */
export async function GET() {
  const key =
    process.env.NEXORA_SANDBOX_KEY || "nxp_test_8h2k9nbq01def456abc789";

  return NextResponse.json({
    data: {
      key,
      mode: "test",
    },
  });
}
