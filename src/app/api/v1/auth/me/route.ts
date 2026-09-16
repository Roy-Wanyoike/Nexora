import { NextRequest } from "next/server";
import { errorResponse, okResponse, methodNotAllowed } from "@/lib/api";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return errorResponse("Not authenticated", 401, "auth_error");
  }
  return okResponse(session);
}

export async function POST(req: NextRequest) { return methodNotAllowed(req, ["GET"]); }
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["GET"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["GET"]); }
