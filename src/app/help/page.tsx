import type { Metadata } from "next";
export const metadata: Metadata = { title: "Help Center — Nexa Pay", description: "Nexa Pay help center and knowledge base." };

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Help Center</h1>
        <p className="mt-2 text-muted-foreground">Find answers, guides, and contact options.</p>
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <h2 className="font-display text-lg font-semibold">Developer Documentation</h2>
            <p className="mt-1 text-sm text-muted-foreground">Full API reference, SDKs, and integration guides.</p>
            <a href="/docs" className="mt-2 inline-flex text-sm font-semibold text-brand">View docs →</a>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <h2 className="font-display text-lg font-semibold">Contact Support</h2>
            <p className="mt-1 text-sm text-muted-foreground">24/7 support via in-app chat or email.</p>
            <a href="/contact" className="mt-2 inline-flex text-sm font-semibold text-brand">Contact us →</a>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <h2 className="font-display text-lg font-semibold">System Status</h2>
            <p className="mt-1 text-sm text-muted-foreground">Check real-time system status and uptime.</p>
            <a href="/status" className="mt-2 inline-flex text-sm font-semibold text-brand">View status →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
