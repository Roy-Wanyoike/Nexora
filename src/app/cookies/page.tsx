import type { Metadata } from "next";
export const metadata: Metadata = { title: "Cookie Policy — Nexa Pay", description: "How Nexa Pay uses cookies." };

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Cookie Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 16 September 2026</p>
        <div className="prose-legal mt-8 space-y-4 text-sm text-muted-foreground">
          <p>Nexa Pay Technologies Ltd uses cookies and similar technologies to operate, maintain, and improve our services. This policy explains what we use and why.</p>
          <h2 className="font-display text-lg font-semibold text-foreground">Essential cookies</h2>
          <p>Required for core functionality — authentication, security, and session management. These cannot be disabled.</p>
          <h2 className="font-display text-lg font-semibold text-foreground">Analytics cookies</h2>
          <p>Help us understand how merchants use our API and dashboard. Opt out at any time via your dashboard settings.</p>
          <h2 className="font-display text-lg font-semibold text-foreground">Managing cookies</h2>
          <p>You can control cookies through your browser settings. Disabling non-essential cookies may affect some features.</p>
          <p>For questions, contact <a href="mailto:dpo@nexapay.africa" className="legal-link">dpo@nexapay.africa</a>.</p>
        </div>
      </div>
    </div>
  );
}
