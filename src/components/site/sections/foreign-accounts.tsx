"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Repeat, Check, Landmark } from "lucide-react";
import { Section, SectionHeading } from "../section";

const ACCOUNTS = [
  {
    code: "USD",
    name: "US Dollar",
    badge: "Popular",
    desc: "Routing & account number · ACH, wire & SWIFT",
    details: [
      { k: "Account name", v: "John Doe" },
      { k: "Account number", v: "•••• 4591" },
      { k: "Routing", v: "084009519" },
      { k: "Bank", v: "Nexa Pay / Evolve" },
    ],
    balance: "$4,876,907.65",
    ngn: "≈ ₦7,859,861,365 NGN",
  },
  {
    code: "GBP",
    name: "British Pound",
    badge: "Available",
    desc: "UK sort code & account · Faster Payments & CHAPS",
    details: [
      { k: "Account name", v: "John Doe" },
      { k: "Account number", v: "•••• 8821" },
      { k: "Sort code", v: "04-00-19" },
      { k: "Bank", v: "Nexa Pay UK Ltd" },
    ],
    balance: "£214,508.10",
    ngn: "≈ ₦431,853,612 NGN",
  },
  {
    code: "EUR",
    name: "Euro",
    badge: "Available",
    desc: "IBAN · SEPA across 36 European countries",
    details: [
      { k: "Account name", v: "John Doe" },
      { k: "IBAN", v: "DE89 •••• •••• 4591" },
      { k: "BIC", v: "PAYSDEMM" },
      { k: "Bank", v: "Nexa Pay EU GmbH" },
    ],
    balance: "€98,217.40",
    ngn: "≈ ₦173,904,788 NGN",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    badge: "Available",
    desc: "Renminbi (RMB) · CNAPS & CIPS · UnionPay",
    details: [
      { k: "Account name", v: "John Doe" },
      { k: "Account number", v: "•••• 7720" },
      { k: "CNAPS code", v: "104100000004" },
      { k: "Bank", v: "Nexa Pay China" },
    ],
    balance: "¥328,490.00",
    ngn: "≈ ₦71,924,924 NGN",
  },
];

const PERKS = [
  "Dedicated routing & account numbers for US accounts",
  "Receive ACH, wire, SWIFT & SEPA transfers",
  "Real-time FX rates — convert to NGN instantly",
  "Available for Individuals & Businesses",
];

export function ForeignAccounts() {
  const [idx, setIdx] = useState(0);
  const a = ACCOUNTS[idx];

  return (
    <Section id="foreign" className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="Foreign Accounts"
        title={<>Open a Real <span className="text-gradient">Foreign Bank Account</span></>}
        desc="Genuine foreign bank accounts — not just wallets. Receive international payments, hold balances, and spend in USD, GBP, EUR and more, right from the Nexa Pay app."
      />

      {/* Tabs */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {ACCOUNTS.map((c, i) => (
          <button
            key={c.code}
            onClick={() => setIdx(i)}
            className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
              i === idx
                ? "border-brand/60 bg-gradient-to-r from-brand/15 to-brand-2/10 text-foreground"
                : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-semibold">{c.code}</span>
            <span className="text-xs text-muted-foreground">· {c.badge}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        {/* Left: account details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={a.code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 to-background/40 p-6 backdrop-blur"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{a.name}</p>
                <p className="mt-1 font-display text-3xl font-bold tracking-tight">
                  <span className="text-gradient">{a.balance}</span>
                </p>
                <p className="text-xs text-muted-foreground">{a.ngn}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/25 to-brand-2/15 text-brand">
                <Landmark className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {a.details.map((d) => (
                <div
                  key={d.k}
                  className="flex items-center justify-between rounded-lg border border-border/40 bg-background/30 px-3 py-2 text-sm"
                >
                  <span className="text-muted-foreground">{d.k}</span>
                  <span className="font-mono text-sm">{d.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { icon: ArrowDownLeft, label: "Top Up" },
                { icon: ArrowUpRight, label: "Cash Out" },
                { icon: Repeat, label: "Transfer" },
              ].map((b) => (
                <button
                  key={b.label}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_var(--brand)]"
                >
                  <b.icon className="h-3.5 w-3.5" />
                  {b.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right: perks */}
        <div className="flex flex-col gap-5">
          <p className="text-sm text-muted-foreground">{a.desc}</p>
          <ul className="flex flex-col gap-3">
            {PERKS.map((p, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/30 p-3"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm">{p}</span>
              </motion.li>
            ))}
          </ul>

          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-brand/10 to-brand-3/10 p-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Foreign Account · Active</span> — {a.code} · Individual
            </p>
            <p className="mt-1 font-mono text-lg font-bold">{a.balance}</p>
            <p className="text-xs text-muted-foreground">{a.ngn}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
