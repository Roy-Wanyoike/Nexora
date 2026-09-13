/**
 * Zod validation schemas for all /api/v1/* routes.
 * Replaces ad-hoc `typeof` checks with strict, typed validation.
 */
import { z } from "zod";

// ── Primitives ──────────────────────────────────────────────────────

export const currencySchema = z.enum(["NGN", "USD", "GBP", "EUR", "CNY"]);
export const foreignCurrencySchema = z.enum(["USD", "GBP", "EUR", "CNY"]);
export const cardCurrencySchema = z.enum(["USD", "NGN", "GBP", "EUR"]);

export const amountSchema = z
  .number()
  .finite()
  .positive("amount must be positive")
  .max(1_000_000, "amount must be ≤ 1,000,000");

export const referenceSchema = z
  .string()
  .max(64, "reference must be ≤ 64 chars")
  .optional();

export const descriptionSchema = z
  .string()
  .max(500, "description must be ≤ 500 chars")
  .optional();

// ── Route bodies ────────────────────────────────────────────────────

export const createPaymentSchema = z.object({
  amount: amountSchema,
  currency: currencySchema,
  channel: z.enum(["card", "bank", "wallet"]).default("card"),
  reference: referenceSchema,
  description: descriptionSchema,
  customer: z.string().cuid().optional(),
});

export const createPaymentLinkSchema = z.object({
  amount: amountSchema,
  currency: currencySchema,
  title: z.string().max(120).optional(),
  description: descriptionSchema,
  redirect_url: z.string().url().optional().or(z.literal("")),
  collect_billing: z.boolean().optional(),
});

export const createVirtualCardSchema = z.object({
  currency: cardCurrencySchema,
  brand: z.enum(["visa", "mastercard", "verve"]).default("visa"),
  type: z.literal("virtual").optional(),
  spending_limit: z.number().finite().positive().max(100_000).optional(),
  spending_interval: z.enum(["daily", "monthly", "yearly"]).default("monthly"),
  label: z.string().max(60).optional(),
  exp_month: z.number().int().min(1).max(12).optional(),
  exp_year: z.number().int().min(2026).max(2099).optional(),
});

export const createForeignAccountSchema = z.object({
  currency: foreignCurrencySchema,
  customer_type: z.enum(["individual", "business"]).default("individual"),
  account_name: z.string().max(120).optional(),
  customer: z.string().cuid().optional(),
});

export const createPayoutSchema = z.object({
  amount: amountSchema,
  currency: currencySchema,
  destination: z.object({
    type: z.enum(["bank", "mobile", "wallet"]),
    country: z.string().length(2),
    account_number: z.string().optional(),
    bank_code: z.string().optional(),
  }),
  reference: referenceSchema,
  reason: descriptionSchema,
});

export const createPayrollRunSchema = z.object({
  schedule: z.enum(["now", "scheduled"]).default("now"),
  scheduled_for: z.string().datetime().optional(),
  currency: currencySchema,
  items: z
    .array(
      z.object({
        employee: z.string().max(120),
        amount: amountSchema,
        currency: currencySchema,
      })
    )
    .min(1, "at least one item required")
    .max(500, "max 500 items per run"),
});

export const verifyWebhookSchema = z.object({
  signature: z.string().min(1, "signature is required"),
  payload: z.string().min(1, "payload is required"),
});

export const createApiKeySchema = z.object({
  label: z.string().min(1, "label is required").max(100),
  mode: z.enum(["test", "live"]),
});

export const listTransactionsSchema = z.object({
  limit: z.coerce.number().int().min(0).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// ── Helper ──────────────────────────────────────────────────────────

export type ValidationError = { path: string; message: string };

export function formatZodError(error: z.ZodError): ValidationError[] {
  return error.issues.map((i) => ({
    path: i.path.join("."),
    message: i.message,
  }));
}
