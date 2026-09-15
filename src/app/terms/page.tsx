import type { Metadata } from "next";
import { ThemeProvider } from "@/components/site/theme-provider";
import { AuroraBackground } from "@/components/site/aurora-background";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/sections/footer";

export const metadata: Metadata = {
  title: "Terms of Service — Nexa Pay",
  description:
    "The Nexa Pay payment switch platform Terms of Service, governed by the laws of the Federal Republic of Nigeria.",
};

const LAST_UPDATED = "12 January 2026";

export default function TermsPage() {
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
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

            <div className="prose-legal mt-12 space-y-10">
              <p className="text-base text-muted-foreground">
                These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;) form a legally
                binding agreement between{" "}
                <strong className="text-foreground">Nexa Pay Technologies Ltd</strong> (&quot;Nexa Pay&quot;,
                &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) and you (&quot;User&quot;,
                &quot;you&quot;, &quot;your&quot;) governing your access to and use of the Nexa Pay
                payment switch platform, including our website, mobile applications, developer APIs,
                webhooks, SDKs, and any related services (collectively, the &quot;Services&quot;).
                By creating an account, generating an API key, or otherwise using the Services, you
                acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>

              <Block id="service-description" title="1. Description of Service">
                <p>
                  Nexa Pay operates a payment switch platform that centralizes multiple payment methods
                  for individuals and businesses in Nigeria and across Africa. The Services include:
                </p>
                <List
                  items={[
                    "Domestic and cross-border money transfers in NGN, USD, GBP, EUR and CNY;",
                    "Named foreign bank accounts (USD with routing number, GBP with sort code, EUR with IBAN, CNY with CNAPS);",
                    "Issuance and management of virtual cards (USD, GBP, EUR, NGN);",
                    "Stablecoin (USDC, USDT, PYUSD) wallets, with conversion to NGN;",
                    "eSIM data plans for 190+ countries;",
                    "Bill payments, airtime and data top-ups;",
                    "Savings products (Piggy Savings and Locked Savings);",
                    "Business tools including multi-currency payroll, branded invoices, payment & payout links, spend analytics, team roles and developer API access.",
                  ]}
                />
                <p>
                  The Services are provided through partner banks and licensed payment processors.
                  Nexa Pay is a technology and intermediary provider and is not a deposit-taking bank.
                  Funds held in foreign currencies are held with our regulated partner banks in the
                  relevant jurisdictions; NGN balances are held with Nigerian partner banks.
                </p>
              </Block>

              <Block id="eligibility" title="2. Eligibility">
                <p>
                  You may use the Services only if you satisfy all of the following conditions:
                </p>
                <List
                  items={[
                    "You are at least eighteen (18) years of age and have the legal capacity to enter into a binding contract under the laws of the Federal Republic of Nigeria;",
                    "For a Personal account: you hold a valid Bank Verification Number (BVN) issued by the Central Bank of Nigeria (CBN) and a valid government-issued identification document (NIN, Driver\u2019s Licence, Nigerian International Passport, or Voter\u2019s Card);",
                    "For a Business account: your business is duly registered with the Corporate Affairs Commission (CAC) and you are authorized to bind the business to these Terms;",
                    "You are not located in, ordinarily resident in, or acting on behalf of any person or entity located in a country subject to comprehensive sanctions by the United Nations, the African Union, or the Federal Republic of Nigeria;",
                    "You are not a Specially Designated National (SDN) nor a Politically Exposed Person (PEP) who has failed to disclose that status; and",
                    "You have not been previously suspended or removed from the Services by Nexa Pay.",
                  ]}
                />
                <p>
                  We reserve the right to require additional Know-Your-Customer (KYC) documentation
                  at any onboarding tier and to refuse or restrict the Services where required by law
                  or by our partner banks.
                </p>
              </Block>

              <Block id="accounts" title="3. Account Registration & Security">
                <p>
                  You agree to provide accurate, current, and complete information during registration
                  and to keep such information updated. You are solely responsible for maintaining the
                  confidentiality of all passwords, API keys, and authentication credentials issued by
                  Nexa Pay, and for all activities that occur under your account.
                </p>
                <p>
                  API keys must be transmitted only over TLS-secured channels and must never be
                  committed to source control. You must rotate any key you suspect has been
                  compromised immediately via the dashboard or the <code>/v1/api-keys</code> endpoint.
                </p>
              </Block>

              <Block id="prohibited" title="4. Prohibited Uses">
                <p>You shall not use the Services, directly or indirectly, to:</p>
                <List
                  items={[
                    "Launder the proceeds of any unlawful activity, or engage in any conduct that would breach the Money Laundering (Prevention and Prohibition) Act 2022 or the CBN Anti-Money Laundering, Combating the Financing of Terrorism and Countering Proliferation Financing (AML/CFT/CPF) Regulations 2022 (as amended);",
                    "Commit, attempt, or facilitate any fraud, theft, embezzlement, or financial crime, including card-not-present fraud, chargeback fraud, or first-party fraud;",
                    "Evade, circumvent, or violate any economic or financial sanctions administered by the United Nations Security Council, the African Union, the Nigerian Financial Intelligence Unit (NFIU), the U.S. Office of Foreign Assets Control (OFAC), the European Union, or His Majesty\u2019s Treasury;",
                    "Process payments for goods or services that are illegal in Nigeria, including but not limited to narcotics, unlicensed gambling, weapons, counterfeit goods, or unregistered securities;",
                    "Layer, structure, or split transactions for the purpose of evading reporting thresholds under the CBN AML/CFT Reg. 26 or any successor regulation;",
                    "Operate as an unlicensed money transmission business, bureau-de-change, or payment service provider without the required CBN or Securities and Exchange Commission (SEC) licences;",
                    "Use another User\u2019s BVN, NIN, or identity document without lawful authority;",
                    "Reverse-engineer, scrape, or otherwise attempt to extract the source code, datasets, or proprietary models of the Services, except to the extent permitted by applicable law.",
                  ]}
                />
                <p>
                  Any breach of this Section 4 entitles Nexa Pay to immediately suspend or terminate your
                  account, freeze affected funds pending regulatory review, and report the matter to
                  the NFIU, NDPC, CBN, or other competent authority.
                </p>
              </Block>

              <Block id="fees" title="5. Fees">
                <p>
                  Nexa Pay&apos;s current fees, including subscription pricing for Personal, Plus and
                  Business accounts, FX conversion fees, crypto trading fees, virtual card fees, and
                  payout fees, are published on our{" "}
                  <a href="/#pricing" className="legal-link">pricing page</a> and may be updated from
                  time to time. Fees are denominated in the currency most relevant to your account.
                </p>
                <p>
                  By initiating a transaction, you authorize Nexa Pay (and our partner banks) to deduct
                  all applicable fees from the transaction amount or from your wallet balance. Unless
                  otherwise stated, fees are non-refundable. Third-party network fees (e.g. SWIFT,
                  SEPA, ACH, card network fees, gas fees for on-chain stablecoin transfers) are
                  passed through at cost.
                </p>
              </Block>

              <Block id="chargebacks" title="6. Chargeback & Dispute Policy">
                <p>
                  If you believe a card transaction processed through the Services is unauthorized or
                  incorrect, you must notify Nexa Pay in writing within thirty (30) days of the
                  transaction date by contacting{" "}
                  <a href="mailto:disputes@nexapay.africa" className="legal-link">disputes@nexapay.africa</a>{" "}
                  and providing all required supporting documentation.
                </p>
                <p>
                  Chargebacks initiated through your card issuer (&quot;first-party&quot; chargebacks)
                  are subject to verification by Nexa Pay. We reserve the right to recover the
                  disputed amount, chargeback fees, and associated costs from your wallet balance
                  where the dispute is found to be without merit or where the underlying transaction
                  has already been settled to the beneficiary. Repeated or abusive chargebacks may
                  result in account suspension under Section 11 (Termination).
                </p>
              </Block>

              <Block id="liability" title="7. Limitation of Liability">
                <p>
                  To the maximum extent permitted by applicable law, in no event shall Nexa Pay, its
                  directors, officers, employees, affiliates, or partner banks be liable to you for
                  any indirect, incidental, special, consequential, or punitive damages, or for any
                  loss of profits, loss of business, loss of anticipated savings, loss of data, or
                  loss of goodwill, arising out of or in connection with these Terms or the Services,
                  whether in contract, tort (including negligence), under statute, or otherwise.
                </p>
                <p>
                  Our aggregate liability for any claim arising out of or relating to the Services
                  shall not exceed the total fees paid by you to Nexa Pay in the six (6) months
                  immediately preceding the event giving rise to the claim. Nothing in these Terms
                  shall limit liability which cannot be limited under Nigerian law, including
                  liability for fraud, wilful misconduct, or death or personal injury caused by
                  negligence.
                </p>
              </Block>

              <Block id="dispute" title="8. Dispute Resolution & Arbitration">
                <p>
                  In the event of any dispute, controversy, or claim arising out of or relating to
                  these Terms or the Services (&quot;Dispute&quot;), the parties shall first attempt
                  in good faith to resolve the Dispute through negotiation. A party must give written
                  notice of the Dispute to the other party, and the parties shall attempt to resolve
                  the Dispute within thirty (30) days of such notice.
                </p>
                <p>
                  If the Dispute is not resolved within that period, it shall be finally resolved by
                  arbitration administered by the Lagos Arbitration Centre (LAC) under the Lagos
                  Arbitration Centre Rules in force at the time of the commencement of the arbitration.
                  The arbitration shall be conducted in accordance with the Arbitration and
                  Conciliation Act 2023 (Federal Republic of Nigeria).
                </p>
                <List
                  items={[
                    "Seat of arbitration: Lagos, Federal Republic of Nigeria;",
                    "Number of arbitrators: one (1), unless the amount in dispute exceeds NGN 100,000,000 in which case three (3);",
                    "Language of the arbitration: English;",
                    "The arbitral award shall be final and binding on the parties, and judgment thereon may be entered in any court of competent jurisdiction.",
                  ]}
                />
                <p>
                  Nothing in this Section shall prevent either party from seeking interim or
                  injunctive relief from a court of competent jurisdiction, including the Federal
                  High Court of Nigeria, where necessary to preserve the status quo or to prevent
                  imminent harm.
                </p>
              </Block>

              <Block id="governing-law" title="9. Governing Law">
                <p>
                  These Terms and any non-contractual obligations arising out of or in connection
                  with them shall be governed by and construed in accordance with the laws of the
                  Federal Republic of Nigeria, without giving effect to any conflict of laws
                  principles. The competent courts of Nigeria shall have non-exclusive jurisdiction
                  over any matter not submitted to arbitration under Section 8.
                </p>
              </Block>

              <Block id="amendments" title="10. Amendment Procedure">
                <p>
                  We may amend these Terms from time to time. We will notify registered Users of any
                  material amendment by email to the address on file and by posting a notice in the
                  Nexa Pay dashboard at least fourteen (14) days before the amendment takes effect
                  (&quot;Notice Period&quot;).
                </p>
                <p>
                  If you continue to use the Services after the expiry of the Notice Period, you shall
                  be deemed to have accepted the amended Terms. If you do not agree to the amended
                  Terms, you must stop using the Services and request account closure in accordance
                  with Section 11. This Section does not apply to non-material corrections (such as
                  typographical fixes) which may be made at any time without notice.
                </p>
              </Block>

              <Block id="termination" title="11. Termination">
                <p>
                  You may close your account at any time by submitting a request through the Nexa Pay
                  dashboard or by emailing{" "}
                  <a href="mailto:support@nexapay.africa" className="legal-link">support@nexapay.africa</a>.
                  Closure is subject to settlement of all outstanding transactions and fees and to
                  compliance with applicable anti-money-laundering record-keeping obligations.
                </p>
                <p>
                  Nexa Pay may suspend or terminate your account and access to the Services immediately
                  and without prior notice where: (a) you breach these Terms; (b) we are required to
                  do so by law, regulation, court order, or request from a competent authority
                  (including the CBN, NFIU, NDPC, or EFCC); (c) we suspect fraudulent, sanctioned,
                  or prohibited activity; or (d) we discontinue a Service or the platform entirely.
                </p>
                <p>
                  Upon termination, all licenses granted to you under these Terms shall immediately
                  cease. Sections which by their nature should survive termination — including
                  Sections 4 (Prohibited Uses), 7 (Limitation of Liability), 8 (Dispute Resolution),
                  9 (Governing Law), and any accrued payment obligations — shall survive.
                </p>
              </Block>

              <Block id="contact" title="12. Contact">
                <p>
                  Nexa Pay Technologies Ltd is the data controller and service provider under these
                  Terms. For any question, notice, or complaint regarding these Terms, please contact
                  us at:
                </p>
                <p>
                  Nexa Pay Technologies Ltd<br />
                  Victoria Island, Lagos, Federal Republic of Nigeria<br />
                  Email:{" "}
                  <a href="mailto:legal@nexapay.africa" className="legal-link">legal@nexapay.africa</a>
                </p>
                <p>
                  Related documents:{" "}
                  <a href="/privacy" className="legal-link">Privacy Policy</a>,{" "}
                  <a href="/cookies" className="legal-link">Cookie Policy</a>.
                </p>
              </Block>

              <p className="border-t border-border/60 pt-6 text-xs text-muted-foreground">
                © {new Date().getFullYear()} Nexa Pay Technologies Ltd. All rights reserved.
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
