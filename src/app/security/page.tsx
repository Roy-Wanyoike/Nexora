import type { Metadata } from "next";
export const metadata: Metadata = { title: "Security — Nexa Pay", description: "Nexa Pay security practices and responsible disclosure." };

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Security</h1>
        <div className="prose-legal mt-8 space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Encryption</h2>
            <p>All data in transit is encrypted with TLS 1.3. Data at rest is encrypted with AES-256. API keys are stored as SHA-256 hashes — we never store raw keys.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">PCI-DSS</h2>
            <p>Nexa Pay does not store full card numbers (PAN) or CVV. Card data is tokenized by our PCI-DSS Level 1 payment processors. We operate under SAQ-A scope.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Authentication</h2>
            <p>API authentication uses Bearer tokens with SHA-256 hashed keys. Master key operations require a separate x-master-key header. All authentication attempts are audit-logged.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Responsible Disclosure</h2>
            <p>If you discover a security vulnerability, please email <a href="mailto:security@nexapay.africa" className="legal-link">security@nexapay.africa</a> with details. We acknowledge reports within 48 hours and provide updates every 7 days until resolved. Bounty rewards may be offered for verified vulnerabilities.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Headers</h2>
            <p>We enforce Content-Security-Policy, Strict-Transport-Security, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, and Referrer-Policy: no-referrer on all responses.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
