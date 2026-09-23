"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="panel max-w-lg p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-200">
          <TriangleAlert className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-white">Something broke on this screen</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          The error was caught by the app boundary, so the rest of CoreStack is untouched. You can retry the render or head back to the
          dashboard.
        </p>
        {error.digest ? <p className="mt-3 font-mono text-[11px] text-slate-600">digest: {error.digest}</p> : null}
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400">
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          <Link href="/dashboard" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
