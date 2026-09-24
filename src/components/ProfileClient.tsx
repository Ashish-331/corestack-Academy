"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Bookmark,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  Flame,
  KeyRound,
  Loader2,
  NotebookPen,
  User as UserIcon,
} from "lucide-react";
import { Badge, buttonClass, inputClass, StatCard } from "@/components/ui";

export type ProfileData = {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    createdAt: string | Date;
  };
  stats: {
    completedLessons: number;
    streak: number;
    activeDays: number;
    bookmarksCount: number;
    notesCount: number;
  };
};

function formatMemberDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "Recently";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Recently";
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export default function ProfileClient({ initialData }: { initialData: ProfileData }) {
  const router = useRouter();
  const [user, setUser] = useState(initialData.user);
  const { stats } = initialData;

  // Name form state
  const [name, setName] = useState(user.name);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "CS";

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    setNameError(null);
    setNameSuccess(null);

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setNameError("Display name must be at least 2 characters.");
      return;
    }

    setNameLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update display name.");
      }

      setUser((prev) => ({ ...prev, name: data.user.name }));
      setName(data.user.name);
      setNameSuccess("Display name updated successfully.");
      router.refresh();
    } catch (err: unknown) {
      setNameError(err instanceof Error ? err.message : "Failed to update name.");
    } finally {
      setNameLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation password do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password updated successfully.");
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Account</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Profile & Settings</h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Manage your account credentials, security preferences, and review your learning track record.
        </p>
      </div>

      {/* 1. User Identity Card */}
      <div className="panel p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-zinc-800 bg-zinc-900 text-xl font-bold text-zinc-200">
            {initials}
          </div>
          <div className="min-w-0 space-y-1.5 flex flex-col items-center sm:items-start">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="truncate text-xl font-bold text-white">{user.name}</h2>
              <Badge tone={user.role === "admin" ? "amber" : "slate"}>
                {user.role === "admin" ? "Admin" : "Student"}
              </Badge>
            </div>
            <p className="truncate font-mono text-sm text-zinc-400">{user.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-400">
              <Calendar className="h-3.5 w-3.5 text-zinc-500" />
              <span>Member since {formatMemberDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Learning Overview */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Learning Overview</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Summary of study activity and saved resources across CoreStack Academy.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Completed lessons"
            value={stats.completedLessons}
            hint="finished lessons"
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
          <StatCard
            label="Current streak"
            value={stats.streak}
            hint={stats.streak === 1 ? "consecutive day" : `${stats.streak} consecutive days`}
            icon={<Flame className="h-4 w-4" />}
          />
          <StatCard
            label="Active study days"
            value={stats.activeDays}
            hint="days with lesson activity"
            icon={<CalendarCheck className="h-4 w-4" />}
          />
          <StatCard
            label="Saved bookmarks"
            value={stats.bookmarksCount}
            hint="lessons bookmarked"
            icon={<Bookmark className="h-4 w-4" />}
          />
          <StatCard
            label="Total notes"
            value={stats.notesCount}
            hint="study notes recorded"
            icon={<NotebookPen className="h-4 w-4" />}
          />
        </div>
      </section>

      {/* 3. Profile Settings Form */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Profile Settings</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Update your profile information and account credentials.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Display Name Form */}
          <div className="panel flex flex-col p-5">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-100">Personal Information</h3>
            </div>
            <p className="mt-1 text-xs text-zinc-500">Update how your name appears across CoreStack Academy.</p>

            <form onSubmit={handleUpdateName} className="mt-5 flex flex-1 flex-col space-y-4">
              <div>
                <label htmlFor="displayName" className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Full Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Your full name"
                  minLength={2}
                  maxLength={80}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className={`${inputClass} cursor-not-allowed opacity-50`}
                />
                <p className="mt-1 text-[11px] text-zinc-500">Email address is tied to your account identity.</p>
              </div>

              <div>
                <label htmlFor="role" className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Account Role
                </label>
                <input
                  id="role"
                  type="text"
                  value={user.role === "admin" ? "Author / Administrator" : "Student"}
                  disabled
                  className={`${inputClass} cursor-not-allowed opacity-50`}
                />
              </div>

              {nameError ? (
                <div className="flex items-center gap-2 rounded-md border border-rose-900/60 bg-rose-950/40 p-2.5 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{nameError}</span>
                </div>
              ) : null}

              {nameSuccess ? (
                <div className="flex items-center gap-2 rounded-md border border-emerald-900/60 bg-emerald-950/40 p-2.5 text-xs text-emerald-300">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{nameSuccess}</span>
                </div>
              ) : null}

              <div className="mt-auto pt-3">
                <button
                  type="submit"
                  disabled={nameLoading || name.trim() === user.name || name.trim().length < 2}
                  className={buttonClass("primary", "w-full sm:w-auto")}
                >
                  {nameLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save display name
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="panel flex flex-col p-5">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-100">Change Password</h3>
            </div>
            <p className="mt-1 text-xs text-zinc-500">Verify your current password and choose a secure new one.</p>

            <form onSubmit={handleChangePassword} className="mt-5 flex flex-1 flex-col space-y-4">
              <div>
                <label htmlFor="currentPassword" className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="mb-1.5 block text-xs font-medium text-zinc-300">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  maxLength={200}
                  required
                />
                <p className="mt-1 text-[11px] text-zinc-500">Must be at least 8 characters long.</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  minLength={8}
                  maxLength={200}
                  required
                />
              </div>

              {passwordError ? (
                <div className="flex items-center gap-2 rounded-md border border-rose-900/60 bg-rose-950/40 p-2.5 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              ) : null}

              {passwordSuccess ? (
                <div className="flex items-center gap-2 rounded-md border border-emerald-900/60 bg-emerald-950/40 p-2.5 text-xs text-emerald-300">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              ) : null}

              <div className="mt-auto pt-3">
                <button
                  type="submit"
                  disabled={passwordLoading || !currentPassword || newPassword.length < 8 || !confirmPassword}
                  className={buttonClass("primary", "w-full sm:w-auto")}
                >
                  {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Update password
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
