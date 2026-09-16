import { NextRequest } from "next/server";
import { authenticate, errorResponse, okResponse, parseBody, methodNotAllowed } from "@/lib/api";
import { routePayment, type Rail } from "@/lib/smart-router";
import { z } from "zod";

const routingSchema = z.object({
  amount: z.number().finite().positive(),
  currency: z.string().length(3),
  country: z.string().length(2),
  channel: z.enum(["card", "mobile_money", "bank_transfer", "stablecoin"]).optional(),
});

export async function POST(req: NextRequest) {
  const key = await authenticate(req);
  if (!key) return errorResponse("Invalid or missing API key.", 401, "auth_error");

  const body = await parseBody<any>(req);
  if (!body) return errorResponse("Request body is required", 422, "validation_error");

  const parsed = routingSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, "validation_error");
  }

  const decision = routePayment({
    ...parsed.data,
    channel: parsed.data.channel as Rail | undefined,
  });

  return okResponse(decision, 201);
}

export async function GET(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function PATCH(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
export async function DELETE(req: NextRequest) { return methodNotAllowed(req, ["POST"]); }
