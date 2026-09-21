import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, okResponse, parseBody, methodNotAllowed } from "@/lib/api";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { z } from "zod";
import { formatZodError } from "@/lib/schemas";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Dummy bcrypt hash used when the user is not found, to equalize the
// response time and prevent username enumeration via timing side-channel.
// 10 rounds, "timing-equalization-dummy-do-not-use".
const DUMMY_PASSWORD_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export async function POST(req: NextRequest) {
  const body = await parseBody<any>(req);
  if (!body) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }

  const { email, password } = parsed.data;

  // Find the user. Always run a bcrypt compare, even when the user is
  // missing, so the response time doesn't leak which emails are registered.
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    await verifyPassword(password, DUMMY_PASSWORD_HASH);
    return errorResponse("Invalid email or password", 401, "auth_error");
  }

  // Verify the password
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return errorResponse("Invalid email or password", 401, "auth_error");
  }

  // Create session + set cookie
  const token = await createSession({ userId: user.id, email: user.email, name: user.name || undefined });
  await setSessionCookie(token);

  return okResponse({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}

export async function GET(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PUT(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
