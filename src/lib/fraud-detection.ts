/**
 * AI Fraud Detection Engine
 *
 * Scores transactions for fraud risk using a rule-based + statistical model.
 * This is Nexa Pay's second differentiator — no African gateway offers
 * real-time, explainable fraud scoring.
 *
 * Risk factors:
 * 1. Velocity: too many transactions in a short window
 * 2. Amount anomaly: transaction amount deviates from user's average
 * 3. Time anomaly: transaction at unusual hours (2am-5am)
 * 4. Geographic anomaly: transaction from a new country
 * 5. Card testing: multiple small amounts in sequence
 * 6. Round amounts: exact round numbers are often fraud tests
 */

export interface FraudScore {
  score: number; // 0-100 (higher = more risky)
  riskLevel: "low" | "medium" | "high" | "critical";
  reasons: string[];
  recommendedAction: "allow" | "review" | "block";
}

export interface TransactionContext {
  amount: number;
  currency: string;
  channel: string;
  country: string;
  ipAddress?: string;
  userId?: string;
  customerAvgAmount?: number;
  customerTransactionCount24h?: number;
  customerCountry?: string;
  timestamp?: Date;
}

/**
 * Score a transaction for fraud risk.
 * Returns a 0-100 score with explainable reasons.
 */
export function scoreFraud(ctx: TransactionContext): FraudScore {
  let score = 0;
  const reasons: string[] = [];

  // 1. Velocity check (max 40 points)
  if (ctx.customerTransactionCount24h !== undefined) {
    if (ctx.customerTransactionCount24h > 50) {
      score += 40;
      reasons.push(`High velocity: ${ctx.customerTransactionCount24h} transactions in 24h`);
    } else if (ctx.customerTransactionCount24h > 20) {
      score += 20;
      reasons.push(`Elevated velocity: ${ctx.customerTransactionCount24h} transactions in 24h`);
    }
  }

  // 2. Amount anomaly (max 25 points)
  if (ctx.customerAvgAmount !== undefined && ctx.customerAvgAmount > 0) {
    const deviation = Math.abs(ctx.amount - ctx.customerAvgAmount) / ctx.customerAvgAmount;
    if (deviation > 10) {
      score += 25;
      reasons.push(`Amount anomaly: ${deviation.toFixed(1)}x the customer's average`);
    } else if (deviation > 5) {
      score += 15;
      reasons.push(`Amount deviation: ${deviation.toFixed(1)}x the customer's average`);
    }
  }

  // 3. Time anomaly (max 15 points)
  const hour = (ctx.timestamp || new Date()).getHours();
  if (hour >= 2 && hour <= 5) {
    score += 15;
    reasons.push(`Unusual time: transaction at ${hour}:00 (2am-5am window)`);
  }

  // 4. Geographic anomaly (max 10 points)
  if (ctx.customerCountry && ctx.country !== ctx.customerCountry) {
    score += 10;
    reasons.push(`Geographic anomaly: transaction from ${ctx.country}, customer is in ${ctx.customerCountry}`);
  }

  // 5. Round amount (max 5 points)
  if (ctx.amount % 1000 === 0 && ctx.amount >= 1000) {
    score += 5;
    reasons.push("Round amount: often used in card testing fraud");
  }

  // 6. Very small amount (card testing pattern)
  if (ctx.amount < 1) {
    score += 10;
    reasons.push("Micro-amount: consistent with card testing patterns");
  }

  // Clamp to 0-100
  score = Math.min(score, 100);

  // Determine risk level + action
  let riskLevel: FraudScore["riskLevel"];
  let recommendedAction: FraudScore["recommendedAction"];

  if (score >= 70) {
    riskLevel = "critical";
    recommendedAction = "block";
  } else if (score >= 40) {
    riskLevel = "high";
    recommendedAction = "review";
  } else if (score >= 20) {
    riskLevel = "medium";
    recommendedAction = "allow";
  } else {
    riskLevel = "low";
    recommendedAction = "allow";
  }

  return { score, riskLevel, reasons, recommendedAction };
}
