"use client";

import { motion } from "framer-motion";
import { Smartphone, Tv, Zap, Droplet, Plus } from "lucide-react";
import { Section, SectionHeading } from "../section";

const BILLS = [
  { icon: Smartphone, title: "Airtime & Data", desc: "MTN, Airtel, Glo, 9mobile — top up in seconds", color: "from-emerald-500/20 to-teal-500/10" },
  { icon: Zap, title: "Electricity", desc: "IKEDC, EKEDC, AEDC, PHED & more — instant token", color: "from-amber-500/20 to-orange-500/10" },
  { icon: Tv, title: "DStv / GOtv / StarTimes", desc: "Renew subscriptions and stay subscribed", color: "from-violet-500/20 to-purple-500/10" },
  { icon: Droplet, title: "Water & Internet", desc: "Pay water boards & ISPs in a few taps", color: "from-cyan-500/20 to-blue-500/10" },
];

const RECENT = [
  { name: "MTN · 0803 ••• 4521", time: "Today, 14:02", amt: "₦2,000" },
  { name: "IKEDC · prepaid meter", time: "Today, 11:30", amt: "₦10,000" },
  { name: "DStv Compact Plus", time: "Yesterday", amt: "₦14,250" },
  { name: "Glo · 0805 ••• 8820", time: "2 days ago", amt: "₦1,500" },
];

export function Bills() {
  return (
    <Section className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="Bills & Top-ups"
        title={<>Airtime, Data & Bills — <span className="text-gradient">All In A Few Taps</span></>}
        desc="Top up airtime and data, pay electricity bills, and renew DStv, GOtv & StarTimes subscriptions — all in a few taps."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Bill categories */}
        <div className="grid gap-4 sm:grid-cols-2">
          {BILLS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`rounded-2xl border border-border/60 bg-gradient-to-br ${b.color} p-5 backdrop-blur lift`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/60 text-brand">
                <b.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold">{b.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
              <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                Pay now <Plus className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Recent payments */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur"
        >
          <p className="text-sm font-semibold">Recent payments</p>
          <p className="text-xs text-muted-foreground">Saved beneficiaries · 1-tap repeat</p>
          <div className="mt-4 space-y-2">
            {RECENT.map((r) => (
              <div
                key={r.name}
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 p-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold">
                  {r.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.time}</p>
                </div>
                <p className="text-sm font-semibold">{r.amt}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-xl border border-dashed border-border/60 py-2 text-xs text-muted-foreground hover:text-foreground">
            + Add new beneficiary
          </button>
        </motion.div>
      </div>
    </Section>
  );
}
