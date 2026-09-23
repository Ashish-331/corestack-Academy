"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl pt-10">
      <div className="panel p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-200">
          <TriangleAlert className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-lg font-bold text-white">That view could not load</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{error.message || "An unexpected error occurred while rendering this page."}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
          <Link href="/dashboard" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
