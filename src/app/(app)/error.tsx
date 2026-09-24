"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { buttonClass } from "@/components/ui";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl pt-10">
      <div className="panel p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300">
          <TriangleAlert className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-lg font-bold text-white">That view could not load</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{error.message || "An unexpected error occurred while rendering this page."}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={reset} className={buttonClass("primary")}>
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
          <Link href="/dashboard" className={buttonClass("secondary")}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
