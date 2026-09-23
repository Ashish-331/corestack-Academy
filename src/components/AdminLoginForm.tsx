"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Loader2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Badge, buttonClass, inputClass } from "@/components/ui";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("author@corestack.dev");
  const [password, setPassword] = useState("corestack123");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function fillDemoAdmin() {
    setEmail("author@corestack.dev");
    setPassword("corestack123");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { error?: string; user?: { role: string; email: string } };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to authenticate administrator");
      }

      if (data.user?.role !== "admin") {
        await fetch("/api/auth/logout", { method: "POST" });
        throw new Error(
          "Access denied: This account lacks administrative privileges. Please log in as author@corestack.dev.",
        );
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="panel animate-fade-up border-amber-400/20 bg-slate-900/70 p-7 shadow-2xl backdrop-blur-md">
        {/* Header with Icon & Role Badges */}
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-300 shadow-inner">
            <Lock className="h-6 w-6" />
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Author Studio
          </span>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">Admin & Author Sign In</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Enter administrative credentials to manage course curricula, import HTML, and edit catalog lessons.
        </p>

        {/* Role Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="amber">Author Privileges</Badge>
          <Badge tone="indigo">Curriculum Editor</Badge>
          <Badge tone="indigo">HTML Ingestion</Badge>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="author@corestack.dev"
              required
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
              required
            />
          </div>

          {error ? (
            <p
              className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-200"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className={buttonClass(
              "primary",
              "w-full py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 font-semibold shadow-lg shadow-amber-500/20",
            )}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {busy ? "Authenticating…" : "Sign In to Admin Studio"}
            {!busy ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>

        {/* 1-Click Fill Demo Credentials */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="focus-ring flex w-full items-center justify-between rounded-xl border border-amber-400/30 bg-amber-400/5 px-3.5 py-2.5 text-left text-xs font-medium text-amber-200 transition hover:bg-amber-400/15"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>
                <strong className="text-white">1-Click Fill Demo Admin</strong>
                <span className="block text-[11px] text-amber-300/80">author@corestack.dev / corestack123</span>
              </span>
            </span>
            <span className="rounded-lg bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
              Auto-fill
            </span>
          </button>
        </div>

        {/* Learner return link */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Looking for student dashboard?{" "}
          <Link href="/login" className="font-semibold text-indigo-300 transition hover:text-indigo-200">
            Learner sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
