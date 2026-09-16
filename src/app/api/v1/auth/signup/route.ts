import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, okResponse, parseBody } from "@/lib/api";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().max(100).optional(),
  bvn: z.string().regex(/^\d{11}$/, "BVN must be exactly 11 digits").optional(),
});

export async function POST(req: NextRequest) {
  const body = await parseBody<any>(req);
  if (!body) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error");
  }

  const { email, password, name, bvn } = parsed.data;

  // Check if user already exists
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return errorResponse("An account with this email already exists", 409, "email_taken");
  }

  // Hash the password
  const passwordHash = await hashPassword(password);

  // Create the user
  const user = await db.user.create({
    data: {
      email,
      name: name || null,
      passwordHash,
    },
  });

  // Create a customer record for this user
  await db.customer.create({
    data: {
      email,
      name: name || null,
      userId: user.id,
    },
  });

  // Create session + set cookie
  const token = await createSession({ userId: user.id, email, name });
  await setSessionCookie(token);

  return okResponse({
    id: user.id,
    email: user.email,
    name: user.name,
  }, 201);
}
