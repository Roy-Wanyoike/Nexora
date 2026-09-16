import type { Metadata } from "next";
export const metadata: Metadata = { title: "System Status — Nexa Pay", description: "Real-time Nexa Pay system status." };
export const dynamic = "force-dynamic";

async function getHealth() {
  try {
    const res = await fetch("http://localhost:3000/api/health", { cache: "no-store" });
    if (!res.ok) return { status: "degraded", db: "down" };
    return await res.json();
  } catch {
    return { status: "down", db: "down" };
  }
}

export default async function StatusPage() {
  const health = await getHealth();
  const isOk = health.status === "ok";
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">System Status</h1>
        <div className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-6">
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${isOk ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
            <p className="font-display text-lg font-semibold">{isOk ? "All systems operational" : "Degraded performance"}</p>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">API</span><span className={isOk ? "text-emerald-400" : "text-rose-400"}>{isOk ? "Operational" : "Down"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Database</span><span className={health.db === "up" ? "text-emerald-400" : "text-rose-400"}>{health.db === "up" ? "Operational" : "Down"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Latency</span><span>{health.latency_ms || "—"}ms</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="font-mono">{health.version || "—"}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
