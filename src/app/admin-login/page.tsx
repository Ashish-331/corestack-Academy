import type { Metadata } from "next";
import Link from "next/link";
import AdminLoginForm from "@/components/AdminLoginForm";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin & Author Sign In",
  description: "Administrative access portal for CoreStack Academy curriculum authors.",
};

export default async function AdminLoginPage() {
  await ensureSeeded();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-black text-white">
            CS
          </span>
          <span className="text-lg font-bold tracking-tight text-white">CoreStack Academy</span>
        </Link>
      </div>
      <AdminLoginForm />
    </main>
  );
}
