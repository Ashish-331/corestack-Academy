import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="panel max-w-md p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-white">We could not find that page</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          The lesson or course may have been renamed. The catalog always has the current list.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/catalog" className={buttonClass("primary")}>
            Browse catalog
          </Link>
          <Link href="/" className={buttonClass("secondary")}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
