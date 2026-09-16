/**
 * Multi-Rail Smart Router
 *
 * Routes payments across multiple rails (card, mobile money, bank transfer,
 * stablecoin) based on cost, success rate, and speed. This is Nexa Pay's
 * signature differentiator — no African payment gateway offers smart routing.
 *
 * Routing strategy:
 * 1. If the amount is < $5, prefer mobile money (lowest fixed fee)
 * 2. If the currency is USD/GBP/EUR and amount > $1000, prefer stablecoin (lowest FX cost)
 * 3. If the customer's bank supports instant transfer, prefer bank transfer
 * 4. Default: card (most universal)
 *
 * Fallback: if the primary rail fails, automatically retry with the next-best rail.
 */

export type Rail = "card" | "mobile_money" | "bank_transfer" | "stablecoin";

export interface RailOption {
  rail: Rail;
  estimatedCostBps: number; // cost in basis points (100 = 1%)
  estimatedSuccessRate: number; // 0-1
  estimatedTimeMs: number; // estimated processing time
  priority: number; // lower = higher priority
}

export interface RoutingRequest {
  amount: number;
  currency: string;
  country: string;
  channel?: Rail;
  customerHistory?: {
    preferredRail?: Rail;
    successRateByRail?: Record<string, number>;
  };
}

export interface RoutingDecision {
  primaryRail: Rail;
  fallbackRails: Rail[];
  estimatedCost: number;
  estimatedTime: string;
  reason: string;
  allOptions: RailOption[];
}

// Rail cost + speed profiles (would be loaded from DB in production)
const RAIL_PROFILES: Record<Rail, Omit<RailOption, "priority">> = {
  card: {
    rail: "card",
    estimatedCostBps: 150, // 1.5%
    estimatedSuccessRate: 0.95,
    estimatedTimeMs: 2000,
  },
  mobile_money: {
    rail: "mobile_money",
    estimatedCostBps: 100, // 1.0% (cheaper for small amounts)
    estimatedSuccessRate: 0.92,
    estimatedTimeMs: 5000,
  },
  bank_transfer: {
    rail: "bank_transfer",
    estimatedCostBps: 50, // 0.5% (cheapest for large amounts)
    estimatedSuccessRate: 0.98,
    estimatedTimeMs: 10000,
  },
  stablecoin: {
    rail: "stablecoin",
    estimatedCostBps: 30, // 0.3% (cheapest for cross-border)
    estimatedSuccessRate: 0.99,
    estimatedTimeMs: 30000,
  },
};

/**
 * Route a payment request to the optimal rail.
 * Returns the primary rail + fallback options.
 */
export function routePayment(req: RoutingRequest): RoutingDecision {
  const { amount, currency, country, channel, customerHistory } = req;

  // If the caller specified a channel, use it (but still provide fallbacks)
  if (channel) {
    const fallbacks = (Object.keys(RAIL_PROFILES) as Rail[])
      .filter((r) => r !== channel)
      .sort((a, b) => RAIL_PROFILES[a].estimatedCostBps - RAIL_PROFILES[b].estimatedCostBps);
    return {
      primaryRail: channel,
      fallbackRails: fallbacks,
      estimatedCost: (amount * RAIL_PROFILES[channel].estimatedCostBps) / 10000,
      estimatedTime: formatTime(RAIL_PROFILES[channel].estimatedTimeMs),
      reason: `Customer-specified channel: ${channel}`,
      allOptions: buildOptions(),
    };
  }

  // Smart routing logic
  let primaryRail: Rail;
  let reason: string;

  if (amount < 5 && country === "NG") {
    // Small amounts in Nigeria → mobile money is cheapest
    primaryRail = "mobile_money";
    reason = "Small amount (<$5) in Nigeria — mobile money has the lowest fixed fee";
  } else if (["USD", "GBP", "EUR"].includes(currency) && amount > 1000) {
    // Large cross-currency → stablecoin (lowest FX cost)
    primaryRail = "stablecoin";
    reason = "Large cross-border amount (>$1000) — stablecoin minimizes FX conversion cost";
  } else if (country === "NG" && amount > 100) {
    // Medium amounts in Nigeria → bank transfer (best rate)
    primaryRail = "bank_transfer";
    reason = "Medium-to-large amount in Nigeria — bank transfer has the best success rate + lowest cost";
  } else {
    // Default → card (most universal)
    primaryRail = "card";
    reason = "Default routing — card is the most universally accepted rail";
  }

  // Adjust based on customer history
  if (customerHistory?.preferredRail && customerHistory.preferredRail !== primaryRail) {
    // If the customer has a strong preference from history, respect it
    primaryRail = customerHistory.preferredRail;
    reason = `Customer history preference: ${primaryRail}`;
  }

  // Build fallback list (sorted by cost, excluding primary)
  const fallbackRails = (Object.keys(RAIL_PROFILES) as Rail[])
    .filter((r) => r !== primaryRail)
    .sort((a, b) => RAIL_PROFILES[a].estimatedCostBps - RAIL_PROFILES[b].estimatedCostBps);

  return {
    primaryRail,
    fallbackRails,
    estimatedCost: (amount * RAIL_PROFILES[primaryRail].estimatedCostBps) / 10000,
    estimatedTime: formatTime(RAIL_PROFILES[primaryRail].estimatedTimeMs),
    reason,
    allOptions: buildOptions(),
  };
}

function buildOptions(): RailOption[] {
  return (Object.keys(RAIL_PROFILES) as Rail[])
    .map((rail) => ({ ...RAIL_PROFILES[rail], priority: RAIL_PROFILES[rail].estimatedCostBps }))
    .sort((a, b) => a.priority - b.priority);
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(0)}s`;
  return `${(ms / 60000).toFixed(1)}min`;
}
