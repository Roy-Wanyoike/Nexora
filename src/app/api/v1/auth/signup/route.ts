import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, okResponse, parseBody, methodNotAllowed } from "@/lib/api";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";
import { z } from "zod";
import { formatZodError } from "@/lib/schemas";
import { createHash } from "node:crypto";

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
    return errorResponse("Validation failed", 422, "validation_error", { fields: formatZodError(parsed.error) });
  }

  const { email, password, name, bvn } = parsed.data;

  // Check if user already exists
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return errorResponse("An account with this email already exists", 409, "email_taken");
  }

  // Hash the password
  const passwordHash = await hashPassword(password);

  // Hash the BVN (if provided) before persistence — never store raw.
  const bvnHash = bvn ? createHash("sha256").update(bvn).digest("hex") : null;

  // Create the user
  const user = await db.user.create({
    data: {
      email,
      name: name || null,
      passwordHash,
    },
  });

  // Create a customer record for this user — properly tenant-scoped,
  // unlike the shared demo customer. Persist BVN hash + KYC status here.
  await db.customer.create({
    data: {
      email,
      name: name || null,
      userId: user.id,
      bvnHash,
      bvnVerifiedAt: bvn ? new Date() : null,
      kycStatus: bvn ? "verified" : "unverified",
      kycTier: bvn ? 1 : 0,
      kycVerifiedAt: bvn ? new Date() : null,
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

export async function GET(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PUT(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
