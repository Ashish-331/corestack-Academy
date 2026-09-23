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
    slate: "border-white/10 bg-white/5 text-slate-300",
    indigo: "border-indigo-400/30 bg-indigo-400/10 text-indigo-200",
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    rose: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${tones[tone]}`}>{children}</span>;
}

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-ring disabled:cursor-not-allowed disabled:opacity-60";

export const buttonTones = {
  primary: "bg-indigo-500 text-white hover:bg-indigo-400",
  secondary: "border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10",
  ghost: "text-slate-300 hover:bg-white/10 hover:text-white",
  danger: "border border-rose-400/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
} as const;

export function buttonClass(tone: keyof typeof buttonTones = "primary", className = "") {
  return `${buttonBase} ${buttonTones[tone]} px-4 py-2 ${className}`;
}

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition focus-ring focus:border-indigo-400/60";

export function ProgressBar({ value, total, className = "" }: { value: number; total: number; className?: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400 transition-[width] duration-500"
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
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
      {icon ? <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-slate-300">{icon}</div> : null}
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-400">{description}</p>
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
  tone = "indigo",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "indigo" | "emerald" | "amber" | "violet";
}) {
  const rings: Record<string, string> = {
    indigo: "from-indigo-500/20 text-indigo-200",
    emerald: "from-emerald-500/20 text-emerald-200",
    amber: "from-amber-500/20 text-amber-200",
    violet: "from-violet-500/20 text-violet-200",
  };
  return (
    <div className="panel panel-hover relative overflow-hidden p-4">
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${rings[tone].split(" ")[0]} to-transparent opacity-60`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-white tabular-nums">{value}</p>
          {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
        </div>
        {icon ? <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 ${rings[tone].split(" ")[1]}`}>{icon}</div> : null}
      </div>
    </div>
  );
}

export function CourseGlyph({ icon, accent, size = "md" }: { icon: string; accent: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-8 w-8 text-sm", md: "h-11 w-11 text-base", lg: "h-14 w-14 text-xl" }[size];
  return (
    <div className={`grid ${sizes} shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${accent} shadow-lg shadow-black/30`}>
      <Icon name={icon} className="h-5 w-5 text-white" />
    </div>
  );
}

/* ───────────────────────────── icons ─────────────────────────────────── */

import {
  AlarmClock, ArrowLeftRight, ArrowRight, Binary, BookOpen, Boxes, Bookmark, BookmarkCheck, Brain,
  Check, CheckCircle2, ChevronDown, ChevronRight, Circle, Clock, Cpu, Database, Flame, Globe,
  LayoutDashboard, Library, Loader2, NotebookPen, Pencil, Plus, Search, Server, ShieldCheck,
  Sparkles, Target, Trash2, TrendingUp, Users, X,
} from "lucide-react";

const ICONS = {
  cpu: Cpu,
  database: Database,
  layers: Server,
  globe: Globe,
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
  sparkles: Sparkles,
  shield: ShieldCheck,
  users: Users,
  trend: TrendingUp,
  brain: Brain,
  server: Server,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const Cmp = ICONS[(name as IconName) in ICONS ? (name as IconName) : "book-open"];
  return <Cmp className={className} aria-hidden />;
}

export {
  AlarmClock, ArrowLeftRight, ArrowRight, Binary, BookOpen, Bookmark, BookmarkCheck, Brain, Check,
  CheckCircle2, ChevronDown, ChevronRight, Circle, Clock, Cpu, Database, Flame, Globe, LayoutDashboard,
  Library, Loader2, NotebookPen, Pencil, Plus, Search, Server, ShieldCheck, Sparkles, Target, Trash2,
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
