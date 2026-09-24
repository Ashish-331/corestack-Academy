"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Loader2, Lock, ShieldCheck } from "lucide-react";
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
      <div className="panel p-7">
        {/* Header with Icon & Role Badges */}
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200">
            <Lock className="h-5 w-5" />
          </div>
          <span className="flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" /> Author Studio
          </span>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">Admin & Author Sign In</h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Enter administrative credentials to manage course curricula, import HTML, and edit catalog lessons.
        </p>

        {/* Role Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>Author Privileges</Badge>
          <Badge>Curriculum Editor</Badge>
          <Badge>HTML Ingestion</Badge>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
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
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
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
              className="rounded-lg border border-rose-950/80 bg-rose-950/30 px-3.5 py-2.5 text-sm text-rose-300"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className={buttonClass("primary", "w-full py-2.5")}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {busy ? "Authenticating…" : "Sign In to Admin Studio"}
            {!busy ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>

        {/* 1-Click Fill Demo Credentials */}
        <div className="mt-5 border-t border-zinc-800 pt-4">
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="focus-ring flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 text-left text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800/60"
          >
            <span className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-zinc-400" />
              <span>
                <strong className="text-zinc-100">1-Click Fill Demo Admin</strong>
                <span className="block text-[11px] text-zinc-400">author@corestack.dev / corestack123</span>
              </span>
            </span>
            <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-300">
              Auto-fill
            </span>
          </button>
        </div>

        {/* Learner return link */}
        <p className="mt-5 text-center text-xs text-zinc-500">
          Looking for student dashboard?{" "}
          <Link href="/login" className="font-medium text-zinc-300 underline underline-offset-2 transition hover:text-white">
            Learner sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
