"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { buttonClass, inputClass } from "@/components/ui";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";

  async function submit(payload: { email: string; password: string; name?: string }, endpoint: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      router.replace("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="panel p-5 sm:p-7">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
          {isLogin ? "Welcome back to CoreStack Academy" : "Create your CoreStack Academy account"}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
          {isLogin
            ? "Pick up exactly where you left off — progress, notes and quiz answers are waiting."
            : "Track every lesson, save notes inline and keep quiz history across devices."}
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit(isLogin ? { email, password } : { email, password, name }, isLogin ? "/api/auth/login" : "/api/auth/register");
          }}
        >
          {!isLogin ? (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Name
              </label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Riya Sharma" required minLength={2} />
            </div>
          ) : null}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Email
            </label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" required />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Password
            </label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required minLength={isLogin ? 1 : 8} />
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-950/80 bg-rose-950/30 px-3 py-2 text-sm text-rose-300" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={busy} className={buttonClass("primary", "w-full py-2.5 min-h-[44px]")}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isLogin ? "Sign in" : "Create account"}
            {!busy ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>

        <p className="mt-5 text-center text-xs sm:text-sm text-zinc-400">
          {isLogin ? (
            <>
              New here?{" "}
              <Link href="/register" className="font-medium text-zinc-200 underline underline-offset-2 hover:text-white">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-zinc-200 underline underline-offset-2 hover:text-white">
                Sign in
              </Link>
            </>
          )}
        </p>

        {isLogin ? (
          <div className="mt-4 border-t border-zinc-800 pt-3 text-center">
            <Link
              href="/admin-login"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-300"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Author / Admin Sign In &rarr;
            </Link>
          </div>
        ) : null}
      </div>

      <div className="panel mt-4 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" /> Demo accounts
        </p>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={() => {
              setEmail("demo@corestack.dev");
              setPassword("corestack123");
              if (!isLogin) setName("Riya Sharma");
            }}
            className="focus-ring flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-left text-xs sm:text-sm text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/60 active:scale-[0.99]"
          >
            <span className="min-w-0">
              <span className="font-medium text-zinc-100">Learner</span> · demo@corestack.dev
            </span>
            <span className="self-start xs:self-center shrink-0 text-[10px] text-zinc-400 rounded bg-zinc-800 px-1.5 py-0.5 border border-zinc-700/60">
              33 lessons done
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail("author@corestack.dev");
              setPassword("corestack123");
              if (!isLogin) setName("Ashish Kumar");
            }}
            className="focus-ring flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-left text-xs sm:text-sm text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/60 active:scale-[0.99]"
          >
            <span className="min-w-0">
              <span className="font-medium text-zinc-100">Author / admin</span> · author@corestack.dev
            </span>
            <span className="self-start xs:self-center shrink-0 text-[10px] text-zinc-400 rounded bg-zinc-800 px-1.5 py-0.5 border border-zinc-700/60">
              can edit catalog
            </span>
          </button>
          <p className="text-center text-[11px] text-zinc-500">Password for both: corestack123</p>
        </div>
      </div>
    </div>
  );
}
