"use client";

import { motion } from "framer-motion";
import { Users, Link2, Receipt, BarChart3, ArrowRight, Check } from "lucide-react";
import { Section, SectionHeading } from "../section";

const MODULES = [
  {
    icon: Users,
    title: "Automated Payroll",
    desc: "Pay your whole team in one click — across NGN, USD, GBP & EUR. Schedule runs, automate tax & pension deductions, and let staff withdraw to any bank or wallet.",
  },
  {
    icon: Link2,
    title: "Payment & Payout Links",
    desc: "Collect from customers with Payment Links, send to vendors with Payout Links. No code, no integration — just share a URL and get paid in any currency.",
  },
  {
    icon: Receipt,
    title: "Invoices & Statements",
    desc: "Send branded invoices, track who's paid, and reconcile automatically. Export full statements in PDF or CSV for accounting in seconds.",
  },
  {
    icon: BarChart3,
    title: "Spend Analytics",
    desc: "Live dashboards on team spend, merchant breakdowns and FX exposure. Set budgets per department, per card, or per merchant — and get alerted on overruns.",
  },
];

export function Business() {
  return (
    <Section id="business" className="py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Business"
            title={<>Run Your Business Finances, <span className="text-gradient">All In One</span></>}
            desc="From payroll to payouts to spend analytics — Nexa Pay Business replaces the spreadsheet mess with one clean, audit-ready dashboard."
          />

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {MODULES.map((m, i) => (
              <motion.li
                key={m.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur lift"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand/25 to-brand-2/15 text-brand">
                  <m.icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-semibold">{m.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
              </motion.li>
            ))}
          </ul>

          <a
            href="#app-demo"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            See the Business dashboard
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Right: payroll mock */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 to-background/40 p-6 backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Payroll · September 2026</p>
              <p className="font-display text-2xl font-bold">$48,210.00</p>
              <p className="text-xs text-muted-foreground">28 employees · USD & NGN</p>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              <Check className="h-3.5 w-3.5" />
              Run payroll
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {[
              { name: "Sarah Adeyemi", role: "Engineering Lead", amount: "$8,400.00", cur: "USD" },
              { name: "Tunde Bello", role: "Product Designer", amount: "$5,200.00", cur: "USD" },
              { name: "Aisha Mohammed", role: "Customer Success", amount: "₦920,000", cur: "NGN" },
              { name: "Kwame Mensah", role: "Operations", amount: "£3,800.00", cur: "GBP" },
            ].map((r) => (
              <div
                key={r.name}
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand/30 to-brand-3/20 text-xs font-bold text-brand">
                  {r.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{r.amount}</p>
                  <p className="text-[10px] text-muted-foreground">{r.cur}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {["Approved", "Pending", "Paid"].map((s, i) => (
              <div
                key={s}
                className={`rounded-xl border p-2 text-center ${
                  i === 0
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : i === 1
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-border/40 bg-background/30 text-muted-foreground"
                }`}
              >
                <p className="text-[10px] uppercase">{s}</p>
                <p className="text-sm font-semibold">{[20, 5, 3][i]}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
