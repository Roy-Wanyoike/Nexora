"use client";

import { motion } from "framer-motion";
import { ArrowRight, Apple, Play } from "lucide-react";
import { Section } from "../section";

export function CTA() {
  return (
    <Section className="py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-card/80 via-background/40 to-card/60 p-8 backdrop-blur sm:p-12 lg:p-16"
      >
        <div className="aurora a1" style={{ top: -160, left: -100, opacity: 0.4 }} />
        <div className="aurora a3" style={{ top: 80, left: "55%", opacity: 0.35 }} />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Ready to <span className="text-gradient">switch</span> how you move money?
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Join 44,000+ Africans already using Nexa Pay. Open your free account in minutes —
              no paperwork, no minimum balance, no hidden fees.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#app-demo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_14px_40px_-18px_var(--brand)] hover:opacity-95"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <div className="flex gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-3 text-xs font-medium backdrop-blur hover:border-brand/50"
              >
                <Apple className="h-4 w-4" />
                App Store
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-3 text-xs font-medium backdrop-blur hover:border-brand/50"
              >
                <Play className="h-4 w-4" />
                Google Play
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
