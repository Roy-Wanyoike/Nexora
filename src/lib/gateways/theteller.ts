/**
 * PaySwitch / TheTeller gateway integration.
 *
 * TheTeller (https://theteller.net) is the public API behind the "PaySwitch"
 * brand in Ghana. This module wraps:
 *   - initiatePayment: POST /initiate with HTTP Basic auth
 *   - verifyTransaction: GET /v1.1/users/transactions/{id}/status
 *
 * All network calls use fetch with a 15s timeout. Errors are returned as
 * `{ ok: false, error }` — the caller decides how to surface them.
 */

const DEFAULT_BASE_URL = "https://test.theteller.net";
const REQUEST_TIMEOUT_MS = 15_000;

export interface InitiatePaymentArgs {
  amount: number;       // major units (e.g. 50.00)
  currency: string;     // ISO 4217 (GHS, USD, NGN, …)
  reference: string;    // merchant order id (must be unique)
  description?: string;
  redirectUrl?: string;
}

export interface InitiatePaymentResult {
  ok: boolean;
  checkoutUrl?: string;
  transactionId?: string;
  raw?: any;
  error?: string;
}

export interface VerifyTransactionResult {
  ok: boolean;
  status?: "succeeded" | "failed" | "pending";
  raw?: any;
  error?: string;
}

function baseUrl(): string {
  return (process.env.THETELLER_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
}

function basicAuthHeader(): string {
  const user = process.env.THETELLER_API_USER || "";
  const key = process.env.THETELLER_API_KEY || "";
  return "Basic " + Buffer.from(`${user}:${key}`).toString("base64");
}

function merchantId(): string {
  return process.env.THETELLER_MERCHANT_ID || "";
}

function withTimeout<T>(p: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("gateway_timeout")), REQUEST_TIMEOUT_MS);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

/**
 * Initiate a checkout session with TheTeller.
 *
 * Returns the hosted-checkout URL the client should be redirected to, plus
 * the gateway-side transaction id (used to verify later).
 */
export async function initiatePayment(
  args: InitiatePaymentArgs
): Promise<InitiatePaymentResult> {
  const url = `${baseUrl()}/initiate`;
  // TheTeller expects amount as a zero-padded 12-digit integer in minor units.
  // We default to 2-decimal currencies (most GHS/USD/NGN/EUR); the API also
  // accepts a numeric string so we coerce generously.
  const amountMinor = String(Math.round(args.amount * 100)).padStart(12, "0");

  const body: Record<string, any> = {
    merchant_id: merchantId(),
    transaction_id: args.reference,
    desc: args.description || `Payment ${args.reference}`,
    amount: amountMinor,
    currency: args.currency,
    redirect_url:
      args.redirectUrl ||
      process.env.THETELLER_REDIRECT_URL ||
      "http://localhost:3000/payment/callback",
  };

  try {
    const res = await withTimeout(
      fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: basicAuthHeader(),
          "merchant-id": merchantId(),
        },
        body: JSON.stringify(body),
      })
    );

    const text = await res.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // not JSON — keep raw text in raw
      json = { raw: text };
    }

    if (!res.ok) {
      return {
        ok: false,
        error: `gateway_http_${res.status}`,
        raw: json,
      };
    }

    // TheTeller response shape is loose; tolerate a few common keys.
    const checkoutUrl =
      json?.checkout_url ||
      json?.checkoutUrl ||
      json?.redirect_url ||
      json?.redirectUrl ||
      (process.env.THETELLER_CHECKOUT_URL
        ? `${process.env.THETELLER_CHECKOUT_URL}?transaction_id=${encodeURIComponent(
            args.reference
          )}`
        : undefined);

    const txnId =
      json?.transaction_id ||
      json?.transactionId ||
      json?.id ||
      args.reference;

    if (!checkoutUrl) {
      return {
        ok: false,
        error: "no_checkout_url",
        raw: json,
      };
    }

    return {
      ok: true,
      checkoutUrl,
      transactionId: txnId,
      raw: json,
    };
  } catch (e: any) {
    return { ok: false, error: e?.message || "network_error" };
  }
}

/**
 * Verify the status of a TheTeller transaction by id.
 *
 * GET /v1.1/users/transactions/{id}/status with the Merchant-Id header.
 */
export async function verifyTransaction(
  transactionId: string
): Promise<VerifyTransactionResult> {
  const url = `${baseUrl()}/v1.1/users/transactions/${encodeURIComponent(
    transactionId
  )}/status`;

  try {
    const res = await withTimeout(
      fetch(url, {
        method: "GET",
        headers: {
          authorization: basicAuthHeader(),
          "merchant-id": merchantId(),
          accept: "application/json",
        },
      })
    );

    const text = await res.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      return { ok: false, error: `gateway_http_${res.status}`, raw: json };
    }

    // TheTeller uses status codes / strings — normalize to our vocabulary.
    const statusRaw: string = String(
      json?.status || json?.code || json?.state || ""
    ).toLowerCase();

    let status: VerifyTransactionResult["status"] = "pending";
    if (["success", "succeeded", "successful", "approved", "ok", "1", "000", "0000"].includes(statusRaw)) {
      status = "succeeded";
    } else if (["failed", "declined", "rejected", "error", "2", "100"].includes(statusRaw)) {
      status = "failed";
    }

    return { ok: true, status, raw: json };
  } catch (e: any) {
    return { ok: false, error: e?.message || "network_error" };
  }
}
