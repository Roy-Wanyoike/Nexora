"use client";

import { motion } from "framer-motion";
import { CreditCard, Snowflake, Trash2, SlidersHorizontal, Globe2, Check } from "lucide-react";
import { Section, SectionHeading } from "../section";

const CARDS = [
  {
    name: "USD Virtual Card",
    tag: "International",
    desc: "Pay international merchants — subscriptions, ads, SaaS and online stores — in dollars, no domiciliary account needed.",
    gradient: "from-emerald-600 via-brand to-cyan-500",
    chips: ["Subscriptions", "SaaS", "Ads", "Online stores"],
  },
  {
    name: "Naira Virtual Card",
    tag: "Local",
    desc: "A secure card for everyday online payments across Nigeria, funded straight from your Nexa Pay balance.",
    gradient: "from-violet-700 via-fuchsia-600 to-rose-500",
    chips: ["Local merchants", "Food delivery", "Ride-hail", "Top-ups"],
  },
];

const PERKS = [
  { icon: Check, label: "Create a card in seconds — no physical card required" },
  { icon: Snowflake, label: "Freeze, unfreeze or delete a card anytime" },
  { icon: SlidersHorizontal, label: "Set spending limits and see every charge, clearly" },
  { icon: Globe2, label: "Accepted by online merchants worldwide" },
];

export function VirtualCards() {
  return (
    <Section className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="Virtual Cards"
        title={<>USD & Naira Virtual Cards, <span className="text-gradient">in Seconds</span></>}
        desc="Create secure virtual cards in dollars and naira the moment you need them — pay online anywhere, cover subscriptions, and stay fully in control."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur lift"
          >
            {/* Card visual */}
            <div className={`relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} p-5 text-white shadow-xl`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Nexa Pay · Virtual</p>
                  <p className="mt-1 text-xs font-semibold opacity-90">{c.tag}</p>
                </div>
                <CreditCard className="h-5 w-5 opacity-80" />
              </div>
              <div className="mt-5 mb-3 h-8 w-11 rounded bg-yellow-300/70" />
              <p className="font-mono text-sm tracking-widest sm:text-base">4123 •••• •••• 4591</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-[11px] font-medium">JOHN DOE</p>
                <p className="text-[10px] opacity-80">08/29</p>
              </div>
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            </div>

            <h3 className="mt-5 font-display text-lg font-semibold">{c.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {c.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[11px] text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PERKS.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="flex items-start gap-2 rounded-xl border border-border/50 bg-card/30 p-3"
          >
            <p.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p className="text-xs text-muted-foreground">{p.label}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
