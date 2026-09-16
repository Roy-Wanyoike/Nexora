"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Building2 } from "lucide-react";
import { Section, SectionHeading } from "../section";

const TIERS = [
  {
    name: "Personal",
    desc: "For individuals who want every payment method in one app.",
    monthly: 0,
    annual: 0,
    cta: "Get Started Free",
    highlight: false,
    features: [
      "Free USD, GBP & EUR accounts",
      "1 free virtual card (USD or NGN)",
      "Send & receive money in 190+ countries",
      "Buy airtime, data & pay bills",
      "eSIM data plans for 190+ countries",
      "Piggy Savings — up to 8% APY",
      "24/7 in-app support",
    ],
  },
  {
    name: "Plus",
    desc: "For power users who transact frequently and need crypto.",
    monthly: 9.99,
    annual: 95.90,
    cta: "Start 14-day trial",
    highlight: true,
    features: [
      "Everything in Personal",
      "Up to 5 virtual cards (USD, GBP, EUR, NGN)",
      "Crypto wallet — USDC, USDT, PYUSD",
      "Locked savings — up to 12% APY",
      "Free unlimited payment & payout links",
      "Priority 24/7 support",
      "Zero FX markup on conversions",
    ],
  },
  {
    name: "Business",
    desc: "For teams & companies running payroll and payouts.",
    monthly: 49.00,
    annual: 470.00,
    cta: "Talk to sales",
    highlight: false,
    features: [
      "Everything in Plus",
      "Automated payroll — multi-currency",
      "Unlimited team members & roles",
      "Spend analytics & budgets",
      "Branded invoices & statements",
      "Dedicated account manager",
      "API & webhook access",
    ],
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <Section id="pricing" className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="Pricing"
        title={<>Simple, Transparent <span className="text-gradient">Pricing</span></>}
        desc="No hidden fees, ever. Start free, upgrade when you need more. Cancel anytime."
      />

      {/* Billing toggle */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <span className={`text-sm ${!annual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
        <button
          onClick={() => setAnnual((v) => !v)}
          className="relative h-7 w-12 rounded-full border border-border/60 bg-card/40 backdrop-blur"
          aria-label="Toggle annual billing"
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-gradient-to-br from-brand to-brand-2 ${
              annual ? "right-0.5" : "left-0.5"
            }`}
          />
        </button>
        <span className={`text-sm ${annual ? "text-foreground" : "text-muted-foreground"}`}>
          Annual <span className="text-brand">· save 20%</span>
        </span>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className={`relative flex flex-col rounded-3xl border p-6 backdrop-blur ${
              t.highlight
                ? "border-brand/50 bg-gradient-to-b from-brand/10 to-brand-3/5 shadow-[0_24px_60px_-30px_var(--brand)]"
                : "border-border/60 bg-card/40"
            }`}
          >
            {t.highlight && (
              <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-brand to-brand-2 px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Sparkles className="h-3 w-3" /> Most popular
              </span>
            )}
            <div className="flex items-center gap-2">
              {t.name === "Business" ? (
                <Building2 className="h-4 w-4 text-brand" />
              ) : (
                <Sparkles className="h-4 w-4 text-brand" />
              )}
              <h3 className="font-display text-lg font-semibold">{t.name}</h3>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{t.desc}</p>

            <div className="mt-5 flex items-end gap-1">
              <span className="font-display text-4xl font-extrabold tracking-tight">
                ${annual ? t.annual : t.monthly}
              </span>
              <span className="mb-1 text-xs text-muted-foreground">
                {t.monthly === 0 ? "forever" : annual ? "/year" : "/month"}
              </span>
            </div>

            <Link
              href="/signup"
              className={`mt-5 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                t.highlight
                  ? "bg-gradient-to-r from-brand to-brand-2 text-primary-foreground shadow-[0_10px_30px_-12px_var(--brand)]"
                  : "border border-border/60 bg-card/40 hover:border-brand/50"
              }`}
            >
              {t.cta}
            </Link>

            <ul className="mt-6 flex flex-col gap-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
