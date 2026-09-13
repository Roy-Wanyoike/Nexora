"use client";

import { motion } from "framer-motion";
import { Section } from "../section";

const STATS = [
  { value: "44K+", label: "Active Users", sub: "across Africa" },
  { value: "107K+", label: "Issued Cards", sub: "virtual + physical" },
  { value: "1M+", label: "Transactions", sub: "processed" },
  { value: "4.8★", label: "App Store Rating", sub: "iOS + Android" },
];

export function Stats() {
  return (
    <Section className="py-12 sm:py-14">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass-soft rounded-2xl p-5 text-center lift sm:p-6"
          >
            <p className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span className="text-gradient ticker-num">{s.value}</span>
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
