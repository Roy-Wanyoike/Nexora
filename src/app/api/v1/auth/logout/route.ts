import { errorResponse, okResponse, methodNotAllowed } from "@/lib/api";
import { clearSessionCookie } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST() {
  await clearSessionCookie();
  return okResponse({ loggedOut: true });
}

export async function GET(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PUT(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
