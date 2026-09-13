import type { Metadata } from "next";
import { ThemeProvider } from "@/components/site/theme-provider";
import { AuroraBackground } from "@/components/site/aurora-background";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/sections/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Nexora",
  description:
    "Nexora's NDPR 2023-compliant privacy notice explaining how we collect, use, and protect personal data.",
};

const LAST_UPDATED = "12 January 2026";

export default function PrivacyPage() {
  return (
    <ThemeProvider>
      <AuroraBackground />
      <Nav />
      <main className="relative flex min-h-screen flex-col">
        <section className="relative py-24 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              Legal
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

            <div className="prose-legal mt-12 space-y-10">
              <p className="text-base text-muted-foreground">
                This Privacy Notice describes how{" "}
                <strong className="text-foreground">Nexora Technologies Ltd</strong> (&quot;Nexora&quot;,
                &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, discloses, retains,
                and protects your personal data in connection with the Nexora payment switch
                platform and related Services. It is published in accordance with the{" "}
                <strong className="text-foreground">Nigeria Data Protection Act 2023</strong> (the
                &quot;NDPA&quot;) and the Nigeria Data Protection Regulations (NDPR) 2019, as
                implemented by the Nigeria Data Protection Commission (&quot;NDPC&quot;).
              </p>

              <Block id="controller" title="1. Identity and Contact of the Controller">
                <p>
                  Nexora Technologies Ltd is the data controller responsible for your personal data
                  under the NDPA. Our contact details are:
                </p>
                <p>
                  Nexora Technologies Ltd<br />
                  Victoria Island, Lagos, Federal Republic of Nigeria<br />
                  Email (Data Protection Officer):{" "}
                  <a href="mailto:dpo@nexora.africa" className="legal-link">dpo@nexora.africa</a><br />
                  Email (general):{" "}
                  <a href="mailto:support@nexora.africa" className="legal-link">support@nexora.africa</a>
                </p>
                <p>
                  Our Data Protection Officer (DPO) is responsible for overseeing questions relating
                  to this Privacy Notice and your rights under the NDPA. You may contact the DPO at
                  any time using the email address above.
                </p>
              </Block>

              <Block id="purposes" title="2. Purposes and Legal Basis of Processing">
                <p>
                  We process your personal data only where we have a lawful basis under Section 6 of
                  the NDPA. The table below summarizes the purposes and the corresponding legal
                  basis:
                </p>
                <List
                  items={[
                    "Performance of a contract: to open and operate your Nexora account, to execute your payment, payout, FX, payroll, and card instructions, and to deliver the Services you have requested (NDPA §6(1)(b));",
                    "Compliance with legal obligations: to verify your identity (BVN, NIN, ID document), to screen against sanctions and PEP lists, to monitor transactions for money laundering and terrorism financing, and to file reports to the NFIU, CBN, and EFCC as required (NDPA §6(1)(c));",
                    "Consent: to send you non-essential marketing communications, to place non-essential cookies on your device, and to use biometric facial matching during KYC verification (NDPA §6(1)(a));",
                    "Legitimate interests: to detect, prevent, and investigate fraud; to maintain the security and integrity of the platform; and to conduct internal analytics for service improvement, provided such interests are not overridden by your rights and freedoms (NDPA §6(1)(d));",
                    "Vital interests: in rare cases, to protect your vital interests or those of another natural person, for example where we suspect financial exploitation of a vulnerable customer.",
                  ]}
                />
                <p>
                  Where we rely on consent, you may withdraw it at any time by contacting{" "}
                  <a href="mailto:dpo@nexora.africa" className="legal-link">dpo@nexora.africa</a>.
                  Withdrawing consent will not affect the lawfulness of any processing carried out
                  before the withdrawal.
                </p>
              </Block>

              <Block id="categories" title="3. Categories of Personal Data We Collect">
                <p>We collect and process the following categories of personal data:</p>
                <List
                  items={[
                    "Identification data: full name, date of birth, nationality, and gender;",
                    "Contact data: email address, phone number, and residential address;",
                    "Identity verification data: Bank Verification Number (BVN), National Identification Number (NIN), Driver\u2019s Licence, Nigerian International Passport, or Voter\u2019s Card number, and any document images or biometric data submitted for KYC;",
                    "Financial and transaction data: account balances, transaction amounts, counterparties, payment channel, currency, references, and device fingerprint at the time of each transaction;",
                    "Foreign account data: named USD, GBP, EUR and CNY account numbers, routing numbers, sort codes, and IBANs issued by our partner banks;",
                    "Card data: virtual card last4, expiry, brand, spending limits, and authorization metadata (we do not store full PANs or CVVs);",
                    "Device and technical data: IP address, browser and operating system type, device identifiers, and usage logs from our APIs and dashboards;",
                    "Communications data: the content of your support requests, chat transcripts, and recorded phone calls (where you consent);",
                    "Marketing data: your communication preferences and engagement with our marketing content, where you have opted in.",
                  ]}
                />
              </Block>

              <Block id="recipients" title="4. Recipients of Your Personal Data">
                <p>
                  We do not sell your personal data. We may share your personal data with the
                  following categories of recipients, strictly on a need-to-know basis and under
                  appropriate data-sharing or data-processing agreements:
                </p>
                <List
                  items={[
                    "Partner banks and licensed payment processors who hold your funds and execute your payment instructions, including banks in Nigeria, the United States, the United Kingdom, the European Union, and China;",
                    "Identity verification providers (e.g. Youverify, Smile Identity, VerifyMe) who verify your BVN, NIN, and ID documents against CBN and NIMC databases;",
                    "Sanctions and PEP screening providers who screen your name against UN, OFAC, EU, HMT, and Nigerian sanctions lists;",
                    "Card networks (Visa, Mastercard, Verve) and card issuers involved in authorizing and settling your card transactions;",
                    "Regulators and competent authorities, including the Central Bank of Nigeria (CBN), the Nigeria Data Protection Commission (NDPC), the Nigeria Financial Intelligence Unit (NFIU), the Economic and Financial Crimes Commission (EFCC), and the Securities and Exchange Commission (SEC), where we are required to do so by law or court order;",
                    "Cloud infrastructure and sub-processors (e.g. hosting, logging, analytics, email delivery) listed in our sub-processor register, which is available on request from the DPO;",
                    "Professional advisers (lawyers, auditors) to the extent necessary for the provision of their services to Nexora.",
                  ]}
                />
              </Block>

              <Block id="cross-border" title="5. Cross-Border Transfers">
                <p>
                  Because the Services include named foreign bank accounts and cross-border payments,
                  your personal data may be transferred to, and processed in, countries outside
                  Nigeria — including the United States, the United Kingdom, the European Union, and
                  China — for the purposes described in Section 2.
                </p>
                <p>
                  We only transfer personal data to countries that provide an adequate level of
                  protection under the NDPA, or where the transfer is made subject to appropriate
                  safeguards such as the Standard Contractual Clauses, binding corporate rules, or
                  other lawful transfer mechanisms recognized by the NDPC. A copy of the safeguards
                  relied upon is available on request from the DPO at{" "}
                  <a href="mailto:dpo@nexora.africa" className="legal-link">dpo@nexora.africa</a>.
                </p>
              </Block>

              <Block id="retention" title="6. Retention Period">
                <p>
                  We retain your personal data for as long as your account is active and for the
                  minimum period required thereafter by applicable law. Specifically:
                </p>
                <List
                  items={[
                    "Transaction records and KYC documentation are retained for a minimum of seven (7) years after the date of the transaction or the end of the business relationship, in accordance with Regulation 26 of the CBN Anti-Money Laundering, Combating the Financing of Terrorism and Countering Proliferation Financing (AML/CFT/CPF) Regulations 2022;",
                    "Sanctions and PEP screening records are retained for five (5) years;",
                    "Audit logs are retained for a minimum of seven (7) years;",
                    "Marketing data is retained until you withdraw consent or your account is closed, whichever is earlier;",
                    "Web server logs and other technical data are retained for ninety (90) days, except where retained longer for security or legal hold.",
                  ]}
                />
                <p>
                  At the end of the retention period, your personal data is either securely erased,
                  anonymized, or — where legal record-keeping obligations require — archived under
                  enhanced access controls.
                </p>
              </Block>

              <Block id="rights" title="7. Your Data Subject Rights">
                <p>
                  Under Sections 34 and 35 of the NDPA and the Nigerian Constitution, you have the
                  following rights with respect to your personal data:
                </p>
                <List
                  items={[
                    "Right of access: to be informed whether we are processing your personal data and to receive a copy of that data;",
                    "Right to rectification: to have inaccurate or incomplete personal data corrected without undue delay;",
                    "Right to erasure: to have your personal data erased where it is no longer necessary for the purposes for which it was collected, where you withdraw consent, or where processing is unlawful — subject to our legal record-keeping obligations under Section 6;",
                    "Right to restriction of processing: to require us to restrict the processing of your personal data in specified circumstances, for example while a rectification request is being investigated;",
                    "Right to data portability: to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller;",
                    "Right to object: to object to processing based on legitimate interests or carried out for direct marketing, including the right to object to automated decision-making;",
                    "Rights in relation to automated decision-making, including profiling: not to be subject to a decision based solely on automated processing that produces legal or similarly significant effects, except where necessary for a contract, authorized by law, or based on your explicit consent.",
                  ]}
                />
                <p>
                  To exercise any of these rights, please contact the DPO at{" "}
                  <a href="mailto:dpo@nexora.africa" className="legal-link">dpo@nexora.africa</a>. We
                  will respond to your request within thirty (30) days, in accordance with the NDPA.
                  Where we decline a request, we will provide our reasons and inform you of your
                  right to complain.
                </p>
              </Block>

              <Block id="complaint" title="8. Right to Lodge a Complaint with the NDPC">
                <p>
                  If you believe that Nexora has processed your personal data in breach of the NDPA,
                  you have the right to lodge a complaint with the Nigeria Data Protection Commission
                  (NDPC). We encourage you to contact our DPO first so that we have the opportunity
                  to investigate and resolve your concerns, but you are not obliged to do so.
                </p>
                <p>
                  The NDPC may be contacted at:<br />
                  Nigeria Data Protection Commission<br />
                  No. 32 Ndola Crescent, Wuse Zone 5, Abuja, Federal Republic of Nigeria<br />
                  Email:{" "}
                  <a href="mailto:complaints@ndpc.gov.ng" className="legal-link">complaints@ndpc.gov.ng</a><br />
                  Website:{" "}
                  <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="legal-link">
                    https://ndpc.gov.ng
                  </a>
                </p>
              </Block>

              <Block id="security" title="9. Security of Personal Data">
                <p>
                  We implement appropriate technical and organizational measures to protect your
                  personal data against unauthorized access, loss, destruction, or alteration. These
                  measures include TLS 1.3 in transit, AES-256 encryption at rest, hashing of all
                  BVNs and API keys with SHA-256 (raw values are never stored), strict role-based
                  access controls, least-privilege database permissions, audit logging of every
                  state-changing action, and regular security testing and staff training. Despite
                  these measures, no system can be guaranteed to be 100% secure, and we will notify
                  you and the NDPC of any personal data breach in accordance with Section 19 of the
                  NDPA.
                </p>
              </Block>

              <Block id="cookies" title="10. Cookie Policy Summary">
                <p>
                  We use cookies and similar technologies to operate the platform, to remember your
                  preferences, to secure your account, and — only with your consent — to measure and
                  improve our Services. We categorize our cookies as strictly necessary, functional,
                  analytics, and marketing. You can manage your cookie preferences at any time via
                  the cookie banner or the cookie settings page.
                </p>
                <p>
                  For the full list of cookies we use, their purposes, and their retention periods,
                  please see our{" "}
                  <a href="/cookies" className="legal-link">Cookie Policy</a>.
                </p>
              </Block>

              <Block id="children" title="11. Children&apos;s Data">
                <p>
                  The Services are not directed at children under the age of eighteen (18), and we do
                  not knowingly collect personal data from children. If you believe that we have
                  collected personal data from a child, please contact the DPO immediately so that we
                  can investigate and delete the data.
                </p>
              </Block>

              <Block id="changes" title="12. Changes to this Privacy Notice">
                <p>
                  We may update this Privacy Notice from time to time to reflect changes in our
                  practices, the Services, or applicable law. We will notify registered Users of any
                  material change by email to the address on file and by posting a notice in the
                  Nexora dashboard at least fourteen (14) days before the change takes effect. The
                  &quot;Last updated&quot; date at the top of this page indicates when this Notice
                  was last revised.
                </p>
              </Block>

              <Block id="contact" title="13. Contact">
                <p>
                  For any question, request, or complaint regarding this Privacy Notice or your
                  personal data, please contact our Data Protection Officer:
                </p>
                <p>
                  Data Protection Officer<br />
                  Nexora Technologies Ltd<br />
                  Victoria Island, Lagos, Federal Republic of Nigeria<br />
                  Email:{" "}
                  <a href="mailto:dpo@nexora.africa" className="legal-link">dpo@nexora.africa</a>
                </p>
                <p>
                  Related documents:{" "}
                  <a href="/terms" className="legal-link">Terms of Service</a>,{" "}
                  <a href="/cookies" className="legal-link">Cookie Policy</a>.
                </p>
              </Block>

              <p className="border-t border-border/60 pt-6 text-xs text-muted-foreground">
                © {new Date().getFullYear()} Nexora Technologies Ltd. All rights reserved.
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </ThemeProvider>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-[1.75rem]">{title}</h2>
      <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
