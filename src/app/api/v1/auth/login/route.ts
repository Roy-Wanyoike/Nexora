import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, okResponse, parseBody } from "@/lib/api";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  const body = await parseBody<any>(req);
  if (!body) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error");
  }

  const { email, password } = parsed.data;

  // Find the user
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
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
