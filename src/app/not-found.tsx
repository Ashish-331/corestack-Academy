import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="panel max-w-md p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-200">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-white">We could not find that page</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          The lesson or course may have been renamed. The catalog always has the current list.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/catalog" className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400">
            Browse catalog
          </Link>
          <Link href="/" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
