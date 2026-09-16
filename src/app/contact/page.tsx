import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact — Nexa Pay", description: "Get in touch with Nexa Pay." };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">We're here to help. Reach out through any of these channels.</p>
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <h2 className="font-display text-lg font-semibold">General Support</h2>
            <p className="mt-1 text-sm text-muted-foreground">Email <a href="mailto:support@nexapay.africa" className="legal-link">support@nexapay.africa</a> · 24/7 in-app support</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <h2 className="font-display text-lg font-semibold">Sales & Business</h2>
            <p className="mt-1 text-sm text-muted-foreground">Email <a href="mailto:sales@nexapay.africa" className="legal-link">sales@nexapay.africa</a> · Response within 1 business day</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <h2 className="font-display text-lg font-semibold">Data Protection Officer</h2>
            <p className="mt-1 text-sm text-muted-foreground">Email <a href="mailto:dpo@nexapay.africa" className="legal-link">dpo@nexapay.africa</a> · NDPR/NDPC enquiries</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <h2 className="font-display text-lg font-semibold">Security Reports</h2>
            <p className="mt-1 text-sm text-muted-foreground">Email <a href="mailto:security@nexapay.africa" className="legal-link">security@nexapay.africa</a> · Responsible disclosure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
