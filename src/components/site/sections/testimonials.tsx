"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Section, SectionHeading } from "../section";

const REVIEWS = [
  {
    name: "Sarah Adeyemi",
    role: "Engineering Lead, Lagos",
    avatar: "SA",
    text: "I switched my entire team to Nexa Pay Business payroll. What used to be a 2-day spreadsheet nightmare now takes one click — across USD & NGN. The foreign accounts alone have saved us thousands in FX fees.",
    rating: 5,
  },
  {
    name: "Tunde Bello",
    role: "Freelance Designer, Abuja",
    avatar: "TB",
    text: "Getting paid by international clients used to mean waiting weeks for wire transfers. Now I just share my USD account details, get paid in 2 days, and convert to Naira instantly. Game changer.",
    rating: 5,
  },
  {
    name: "Aisha Mohammed",
    role: "E-commerce Owner, Kano",
    avatar: "AM",
    text: "Payment Links let me collect from customers without building a checkout. I just send a link on WhatsApp, they pay, and I see it instantly. My conversion rate doubled overnight.",
    rating: 5,
  },
  {
    name: "Kwame Mensah",
    role: "Digital Nomad, Accra",
    avatar: "KM",
    text: "The eSIM is the killer feature for me. I land in a new country, tap a button, and I'm online before I leave the airport. No more hunting for SIM cards or getting ripped off at kiosks.",
    rating: 5,
  },
  {
    name: "Chiamaka Eze",
    role: "Student, Nsukka",
    avatar: "CE",
    text: "Piggy savings helped me save ₦840,000 toward my final year tuition without thinking about it. The locked vault at 12% APY is wild — my money actually grows while I focus on school.",
    rating: 5,
  },
  {
    name: "David Okafor",
    role: "Startup Founder, Lagos",
    avatar: "DO",
    text: "We replaced Stripe + Wise + Paystack + a Nigerian bank with just Nexa Pay. One dashboard, one reconciliation, half the fees. The spend analytics finally gave me real visibility into burn.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <Section className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="Loved across Africa"
        title={<>Trusted by <span className="text-gradient">44,000+ Africans</span></>}
        desc="From students to startup founders — Nexa Pay is how Africa moves money today."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur lift"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-sm text-foreground/90">"{r.text}"</blockquote>
            <figcaption className="mt-auto flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand/30 to-brand-3/20 text-xs font-bold text-brand">
                {r.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
