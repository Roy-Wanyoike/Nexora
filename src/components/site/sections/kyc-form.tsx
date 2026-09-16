"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Loader2, CheckCircle2, XCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ID_TYPES = [
  { value: "nin", label: "National Identification Number (NIN)" },
  { value: "drivers_license", label: "Driver's Licence" },
  { value: "passport", label: "Nigerian International Passport" },
  { value: "voters_card", label: "Voter's Card" },
];

type KycStatus = "idle" | "loading" | "success" | "error";

type VerifyResponse = {
  kyc_status: string;
  kyc_tier: number;
  verified_at: string | null;
};

export function KycForm() {
  const [bvn, setBvn] = useState("");
  const [idType, setIdType] = useState<string>("");
  const [idNumber, setIdNumber] = useState("");
  const [status, setStatus] = useState<KycStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [apiKey, setApiKey] = useState<string>("");

  // Fetch the sandbox API key on mount (no hardcoded key in client bundle)
  useEffect(() => {
    fetch("/api/v1/sandbox-key")
      .then((r) => r.json())
      .then((d) => setApiKey(d.data?.key || ""))
      .catch(() => {});
  }, []);

  const bvnValid = /^\d{0,11}$/.test(bvn);
  const canSubmit =
    bvn.length === 11 && bvnValid && idType !== "" && idNumber.length > 0 && status !== "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    setMessage("");
    setResult(null);

    try {
      const res = await fetch("/api/v1/kyc/verify-bvn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          bvn,
          id_type: idType,
          id_number: idNumber,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(json?.error || "Verification failed. Please try again.");
        return;
      }

      setStatus("success");
      setResult(json?.data ?? null);
      setMessage("BVN verified successfully.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Network error. Please try again.");
    }
  }

  return (
    <div className="relative rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/30 to-brand-2/20 text-brand">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Verify your identity (KYC)</h3>
          <p className="text-xs text-muted-foreground">
            Tier 1 verification — required to unlock all payment methods.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
          <Input
            id="bvn"
            name="bvn"
            inputMode="numeric"
            autoComplete="off"
            placeholder="11-digit BVN"
            value={bvn}
            maxLength={11}
            onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
            aria-invalid={!bvnValid || (bvn.length > 0 && bvn.length !== 11)}
            className="font-mono tracking-wider"
          />
          <p className="text-[11px] text-muted-foreground">
            Your BVN is hashed with SHA-256 before storage. We never persist the raw 11-digit value.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="id_type">ID type</Label>
            <Select value={idType} onValueChange={setIdType}>
              <SelectTrigger id="id_type" className="w-full">
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                {ID_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="id_number">ID number</Label>
            <Input
              id="id_number"
              name="id_number"
              autoComplete="off"
              placeholder="e.g. 12345678901"
              value={idNumber}
              maxLength={32}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-border/50 bg-background/40 p-3 text-xs text-muted-foreground">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
          <span>
            By submitting, you consent to identity verification against CBN / NIMC databases and
            sanctions & PEP screening, as described in our{" "}
            <a href="/privacy" className="legal-link">Privacy Policy</a>.
          </span>
        </div>

        <Button
          type="submit"
          disabled={!canSubmit}
          className="gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground shadow-[0_10px_30px_-12px_var(--brand)] hover:opacity-95"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Verify BVN
            </>
          )}
        </Button>

        {status === "success" && result && (
          <div className="flex items-start gap-3 rounded-xl border border-brand/40 bg-brand/10 p-4 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-foreground">{message}</p>
              <p className="text-xs text-muted-foreground">
                KYC status:{" "}
                <span className="font-mono text-foreground">{result.kyc_status}</span> · Tier{" "}
                <span className="font-mono text-foreground">{result.kyc_tier}</span>
                {result.verified_at && (
                  <>
                    {" "}
                    · Verified at{" "}
                    <span className="font-mono text-foreground">
                      {new Date(result.verified_at).toLocaleString()}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-foreground">Verification failed</p>
              <p className="text-xs text-muted-foreground">{message}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
