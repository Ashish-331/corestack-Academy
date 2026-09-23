"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
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
      <div className="panel animate-fade-up p-7">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
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
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Name
              </label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Riya Sharma" required minLength={2} />
            </div>
          ) : null}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email
            </label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" required />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required minLength={isLogin ? 1 : 8} />
          </div>

          {error ? (
            <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={busy} className={buttonClass("primary", "w-full py-2.5")}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isLogin ? "Sign in" : "Create account"}
            {!busy ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          {isLogin ? (
            <>
              New here?{" "}
              <Link href="/register" className="font-semibold text-indigo-300 hover:text-indigo-200">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="panel mt-4 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Demo accounts
        </p>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={() => {
              setEmail("demo@corestack.dev");
              setPassword("corestack123");
              if (!isLogin) setName("Riya Sharma");
            }}
            className="focus-ring flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/10"
          >
            <span>
              <span className="font-semibold">Learner</span> · demo@corestack.dev
            </span>
            <span className="text-[11px] text-slate-400">33 lessons done</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail("author@corestack.dev");
              setPassword("corestack123");
              if (!isLogin) setName("Ashish Kumar");
            }}
            className="focus-ring flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-2.5 text-left text-sm text-amber-100 hover:bg-amber-400/10"
          >
            <span>
              <span className="font-semibold">Author / admin</span> · author@corestack.dev
            </span>
            <span className="text-[11px] text-amber-200/70">can edit catalog</span>
          </button>
          <p className="text-center text-[11px] text-slate-500">Password for both: corestack123</p>
        </div>
      </div>
    </div>
  );
}
