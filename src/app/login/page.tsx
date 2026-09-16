"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/logo";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email && password && !submitting;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Sign in failed");
        return;
      }

      toast.success("Welcome back!", { description: data.data?.name || email });
      router.push("/dashboard");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card/40 p-8 backdrop-blur">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-5 w-5 text-brand" />
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Sign in to your Nexa Pay account.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Your password"
            />
          </div>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground"
          >
            {submitting ? "Signing in..." : "Sign in"}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
