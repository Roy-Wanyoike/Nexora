"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "../section";

const FAQS = [
  {
    q: "What is Nexa Pay?",
    a: "Nexa Pay is a single, secure app that centralizes every payment method for Africans — domestic and foreign bank accounts, virtual cards, crypto wallets, eSIM, bills, business payroll, and savings. Think of it as your entire financial life in one tab.",
  },
  {
    q: "Are the foreign accounts real bank accounts?",
    a: "Yes. USD accounts come with dedicated routing & account numbers and can receive ACH, wire and SWIFT transfers. GBP accounts have a UK sort code and receive Faster Payments & CHAPS. EUR accounts have a real IBAN and receive SEPA transfers across 36 European countries. CNY accounts use CNAPS & CIPS rails. These are not wallets — they are genuine, named bank accounts.",
  },
  {
    q: "How fast are transfers?",
    a: "Transfers between Nexa Pay users settle instantly — typically in milliseconds. Bank transfers to Nigerian banks usually clear within minutes. International wires (SWIFT) take 1–3 business days depending on the sending bank. FX conversions are real-time.",
  },
  {
    q: "Is my money safe?",
    a: "Funds in your USD, GBP and EUR accounts are held with our regulated partner banks in those jurisdictions. NGN balances are held with Nigerian banks. We use bank-grade encryption (TLS 1.3, AES-256 at rest), biometric authentication, and per-transaction 2FA. Crypto holdings are stored in segregated wallets.",
  },
  {
    q: "What are the fees?",
    a: "Personal accounts are free forever. We charge 1% on crypto buys/sells (min $0.25), 1.25% on crypto withdrawals to NGN (min $0.25), and pass network fees on at cost with zero spread or conversion markup. Virtual cards have no monthly fee. See the full pricing page for details.",
  },
  {
    q: "Who can sign up?",
    a: "Anyone in Nigeria aged 18 and over with a valid BVN can open a Personal account. Business accounts require CAC registration. We are rolling out to Ghana, Kenya, South Africa and the rest of Africa through 2026 — join the waitlist to be notified.",
  },
  {
    q: "Do you support crypto?",
    a: "Yes — you can buy, sell, send, receive and store USDC, USDT and PYUSD stablecoins inside the Nexa Pay app. You can convert stablecoins to NGN anytime. Crypto is volatile; only transact with funds you can afford to lose. Crypto services may not be regulated in your jurisdiction.",
  },
  {
    q: "Can I use Nexa Pay for my business?",
    a: "Absolutely. Nexa Pay Business adds multi-currency payroll, payment & payout links, branded invoices, spend analytics, team roles, and API access. It replaces Wise + Paystack + your bank's business portal in one dashboard.",
  },
];

export function FAQ() {
  return (
    <Section id="faq" className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="FAQ"
        title={<>Questions, <span className="text-gradient">Answered</span></>}
        desc="Everything you need to know about Nexa Pay. Can't find what you're looking for? Reach out to support@nexapay.africa."
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-border/60 bg-card/40 px-5 backdrop-blur"
            >
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
