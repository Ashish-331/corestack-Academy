import type { ReactNode } from "react";
import Link from "next/link";

/* ────────────────────────────── primitives ───────────────────────────── */

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return <Tag className={`panel p-5 ${className}`}>{children}</Tag>;
}

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "indigo" | "emerald" | "amber" | "rose" }) {
  const tones: Record<string, string> = {
    slate: "border-zinc-800 bg-zinc-900 text-zinc-300",
    indigo: "border-zinc-800 bg-zinc-900 text-zinc-300",
    emerald: "border-emerald-900/60 bg-emerald-950/40 text-emerald-300",
    amber: "border-amber-900/60 bg-amber-950/40 text-amber-300",
    rose: "border-rose-900/60 bg-rose-950/40 text-rose-300",
  };
  return <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium tracking-wide ${tones[tone]}`}>{children}</span>;
}

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition focus-ring disabled:cursor-not-allowed disabled:opacity-60";

export const buttonTones = {
  primary: "bg-zinc-100 text-zinc-950 hover:bg-white active:bg-zinc-200 font-semibold shadow-sm",
  secondary: "border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white",
  ghost: "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
  danger: "border border-rose-950/80 bg-rose-950/30 text-rose-400 hover:bg-rose-900/40 hover:border-rose-800",
} as const;

export function buttonClass(tone: keyof typeof buttonTones = "primary", className = "") {
  return `${buttonBase} ${buttonTones[tone]} px-4 py-2 ${className}`;
}

export const inputClass =
  "w-full rounded-md border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus-ring focus:border-zinc-600";

export function ProgressBar({ value, total, className = "" }: { value: number; total: number; className?: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  const isComplete = pct === 100;
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-zinc-800 ${className}`}>
      <div
        className={`h-full rounded-full transition-[width] duration-300 ${isComplete ? "bg-emerald-400/80" : "bg-zinc-200"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 px-6 py-14 text-center">
      {icon ? <div className="mb-4 grid h-10 w-10 place-items-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400">{icon}</div> : null}
      <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-zinc-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="panel panel-hover p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-zinc-100 tabular-nums">{value}</p>
          {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
        </div>
        {icon ? <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400">{icon}</div> : null}
      </div>
    </div>
  );
}

export function CourseGlyph({ icon, size = "md" }: { icon: string; accent?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base" }[size];
  return (
    <div className={`grid ${sizes} shrink-0 place-items-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300`}>
      <Icon name={icon} className={size === "lg" ? "h-6 w-6 text-zinc-200" : size === "sm" ? "h-4 w-4 text-zinc-400" : "h-5 w-5 text-zinc-300"} />
    </div>
  );
}

/* ───────────────────────────── icons ─────────────────────────────────── */

import {
  AlarmClock, ArrowLeftRight, ArrowRight, Binary, BookOpen, Boxes, Bookmark, BookmarkCheck,
  Check, CheckCircle2, ChevronDown, ChevronRight, Circle, Clock, Cpu, Database, Flame, Globe,
  LayoutDashboard, Library, Loader2, NotebookPen, Pencil, Plus, Search, Server, ShieldCheck,
  Target, Trash2, TrendingUp, Users, X,
} from "lucide-react";

const ICONS = {
  cpu: Cpu,
  database: Database,
  layers: Server,
  globe: Globe,
  network: Globe,
  binary: Binary,
  boxes: Boxes,
  "book-open": BookOpen,
  library: Library,
  dashboard: LayoutDashboard,
  bookmark: Bookmark,
  note: NotebookPen,
  flame: Flame,
  clock: AlarmClock,
  target: Target,
  shield: ShieldCheck,
  users: Users,
  trend: TrendingUp,
  server: Server,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const Cmp = ICONS[(name as IconName) in ICONS ? (name as IconName) : "book-open"];
  return <Cmp className={className} aria-hidden />;
}

export {
  AlarmClock, ArrowLeftRight, ArrowRight, Binary, BookOpen, Bookmark, BookmarkCheck, Check,
  CheckCircle2, ChevronDown, ChevronRight, Circle, Clock, Cpu, Database, Flame, Globe, LayoutDashboard,
  Library, Loader2, NotebookPen, Pencil, Plus, Search, Server, ShieldCheck, Target, Trash2,
  TrendingUp, Users, X,
};

/* ───────────────────────────── helpers ──────────────────────────────── */

export function LinkButton({
  href,
  children,
  tone = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: keyof typeof buttonTones;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClass(tone, className)}>
      {children}
    </Link>
  );
}

export function minutesLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function relativeTime(date: string | Date | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
