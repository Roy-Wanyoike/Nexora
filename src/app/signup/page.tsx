"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/logo";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [bvn, setBvn] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = password === confirm;
  const canSubmit = email && password.length >= 8 && passwordsMatch && !submitting;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, bvn: bvn || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Sign up failed");
        return;
      }

      toast.success("Account created!", { description: "Welcome to Nexa Pay." });
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
          <Sparkles className="h-5 w-5 text-brand" />
          <h1 className="font-display text-2xl font-bold">Create your account</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Start managing every payment method from one secure dashboard.
        </p>
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
            />
            {confirm && !passwordsMatch && (
              <p className="mt-1 text-xs text-rose-400">Passwords do not match</p>
            )}
          </div>
          <div>
            <Label htmlFor="bvn">BVN (optional)</Label>
            <Input
              id="bvn"
              type="text"
              inputMode="numeric"
              value={bvn}
              onChange={(e) => setBvn(e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="11-digit BVN"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Required to verify your identity. Stored as SHA-256 hash only.
            </p>
          </div>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground"
          >
            {submitting ? "Creating account..." : "Create account"}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Bank-grade encryption · BVN hashed with SHA-256
        </div>
      </div>
    </div>
  );
}
