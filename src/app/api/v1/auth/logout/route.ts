import { errorResponse, okResponse } from "@/lib/api";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  await clearSessionCookie();
  return okResponse({ loggedOut: true });
}
