import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (user) {
    if (user.role === "admin") redirect("/admin");
    redirect("/dashboard");
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-14">{children}</div>
      <div className="relative hidden overflow-hidden border-l border-zinc-800 bg-zinc-900/30 lg:block">
        <div className="relative flex h-full flex-col justify-center gap-8 px-14">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-zinc-800 bg-zinc-900 font-bold text-zinc-100">CS</span>
            <span className="text-lg font-bold tracking-tight text-white">CoreStack Academy</span>
          </Link>
          <h2 className="max-w-md text-3xl font-bold leading-tight text-white">
            Six deep CS courses. One place to actually finish them.
          </h2>
          <ul className="space-y-3 text-sm text-zinc-300">
            {[
              "150+ authored lessons — OS, DBMS, system design, DSA, OOD, networks",
              "Quizzes that grade you and remember your answers",
              "Inline notes and bookmarks on every lesson",
              "Progress that follows your account, not your browser",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                {line}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500">Demo data seeds itself on first run — no setup script to remember.</p>
        </div>
      </div>
    </div>
  );
}
