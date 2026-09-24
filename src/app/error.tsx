"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { buttonClass } from "@/components/ui";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="panel max-w-lg p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300">
          <TriangleAlert className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-white">Something broke on this screen</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          The error was caught by the app boundary, so the rest of CoreStack Academy is untouched. You can retry the render or head back to the
          dashboard.
        </p>
        {error.digest ? <p className="mt-3 font-mono text-[11px] text-zinc-600">digest: {error.digest}</p> : null}
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={reset} className={buttonClass("primary")}>
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          <Link href="/dashboard" className={buttonClass("secondary")}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
