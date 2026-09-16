import { NextRequest } from "next/server";
import { authenticate, errorResponse, okResponse, parseBody, methodNotAllowed } from "@/lib/api";
import { scoreFraud } from "@/lib/fraud-detection";
import { z } from "zod";

const fraudSchema = z.object({
  amount: z.number().finite().positive(),
  currency: z.string().length(3),
  channel: z.string(),
  country: z.string().length(2),
  ipAddress: z.string().optional(),
  userId: z.string().optional(),
  customerAvgAmount: z.number().optional(),
  customerTransactionCount24h: z.number().optional(),
  customerCountry: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const body = await parseBody<any>(req);
  if (!body) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = fraudSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error");
  }

  const result = scoreFraud({
    ...parsed.data,
    timestamp: new Date(),
  });

  return okResponse(result, 201);
}

export async function GET(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
