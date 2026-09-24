import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Cookie,
  Database,
  EyeOff,
  HardDrive,
  KeyRound,
  Lock,
  Mail,
  Server,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy · CoreStack Academy",
  description:
    "Our commitment to student privacy: zero third-party trackers, cryptographic authentication, strictly private study notes, and full data portability.",
};

const SECTIONS = [
  { id: "overview", number: "01", title: "Overview & Commitment" },
  { id: "collection", number: "02", title: "Information We Collect" },
  { id: "usage", number: "03", title: "How We Use Your Data" },
  { id: "cookies", number: "04", title: "Authentication & Cookies" },
  { id: "security", number: "05", title: "Data Storage & Security" },
  { id: "rights", number: "06", title: "Your Rights & Portability" },
  { id: "contact", number: "07", title: "Updates & Contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-16">
      {/* Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/catalog" className="hover:text-zinc-300 transition flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Catalog
          </Link>
          <span>/</span>
          <span className="text-zinc-400">Legal & Governance</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <span className="chip">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-300" />
            <span>Strict Privacy Standard</span>
          </span>
          <span className="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
            Effective: September 2026
          </span>
          <span className="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
            v2.4 · Telemetry-Free
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
          CoreStack Privacy Policy
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-400 max-w-2xl">
          We designed CoreStack Academy on a straightforward principle: mastering computer science fundamentals requires
          unbroken focus, rigorous practice, and complete intellectual privacy. We do not monetize your data, run advertising networks,
          or deploy behavioural surveillance.
        </p>
      </div>

      {/* Core Privacy Guarantees Grid */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: EyeOff,
            title: "Zero Third-Party Trackers",
            desc: "No Google Analytics, Meta Pixels, ad beacons, or session recording spyware.",
          },
          {
            icon: KeyRound,
            title: "Cryptographic Sessions",
            desc: "HTTP-only, Secure JWT tokens immune to client-side JavaScript inspection.",
          },
          {
            icon: Lock,
            title: "Private Study Notes",
            desc: "Inline lesson annotations are strictly isolated to your authenticated account.",
          },
          {
            icon: HardDrive,
            title: "Full Portability",
            desc: "Export notes in open formats anytime, or trigger total account erasure with one click.",
          },
        ].map((item) => (
          <div key={item.title} className="panel p-4 flex flex-col justify-between">
            <div>
              <div className="grid h-8 w-8 place-items-center rounded border border-zinc-800 bg-zinc-900 text-zinc-300">
                <item.icon className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-zinc-100">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-zinc-400">{item.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Enforced by default</span>
            </div>
          </div>
        ))}
      </section>

      {/* Jump Navigation Bar */}
      <div className="panel p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 font-mono mb-2.5">
          Table of Contents
        </p>
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-xs text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <span className="font-mono text-[10px] text-zinc-500">{sec.number}</span>
              <span>{sec.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10">
        {/* Section 1 */}
        <section id="overview" className="panel p-6 sm:p-8 space-y-4 scroll-mt-20">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-semibold text-zinc-500">01</span>
            <h2 className="text-xl font-bold tracking-tight text-white">Overview & Commitment to Privacy</h2>
          </div>
          <p className="text-[15px] leading-7 text-zinc-300">
            CoreStack Academy operates as an engineering-focused educational platform providing comprehensive curriculums across
            operating systems, database internals, system design, data structures and algorithms, object-oriented architecture, and computer
            networking. We believe that your intellectual curiosity, study rhythm, reading speeds, and test trial errors belong solely
            to you.
          </p>
          <p className="text-[15px] leading-7 text-zinc-300">
            Unlike consumer software products that subsidize free services by building behavioural marketing profiles, CoreStack
            Academy exists solely to deliver rigorous technical training. We will never sell, lease, barter, or distribute your
            personal data or learning metrics to third-party advertisers, recruitment brokers, or artificial intelligence model training
            aggregators.
          </p>
          <div className="rounded-md border border-zinc-800 bg-zinc-950/70 p-4 font-mono text-xs text-zinc-400 space-y-1.5">
            <p className="font-semibold text-zinc-200">Our Core Privacy Charter:</p>
            <p>• Data minimization: We only store what is strictly required to power your learning experience.</p>
            <p>• Zero monetization: Your activity, notes, and quiz metrics are never commercialized.</p>
            <p>• No surveillance telemetry: We deliberately reject client-side behavioral trackers and session replay libraries.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="collection" className="panel p-6 sm:p-8 space-y-4 scroll-mt-20">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-semibold text-zinc-500">02</span>
            <h2 className="text-xl font-bold tracking-tight text-white">Information We Collect</h2>
          </div>
          <p className="text-[15px] leading-7 text-zinc-300">
            We limit data collection to the minimal technical surface needed to authenticate your account, remember your place in
            the curriculum, evaluate your quiz answers, and preserve your study notes.
          </p>

          <div className="mt-4 divide-y divide-zinc-800/80 border-y border-zinc-800/80">
            <div className="py-4 grid sm:grid-cols-[180px_1fr] gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-200">Account Credentials</span>
              <div className="text-xs leading-6 text-zinc-400 space-y-1">
                <p>
                  When registering, we collect your display name and email address. Your password is never recorded in plaintext; it is
                  immediately salted and hashed using standard adaptive cryptographic algorithms (bcrypt/scrypt) before touching our
                  database.
                </p>
              </div>
            </div>

            <div className="py-4 grid sm:grid-cols-[180px_1fr] gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-200">Curriculum Progress</span>
              <div className="text-xs leading-6 text-zinc-400 space-y-1">
                <p>
                  To sync your learning journey across devices, we record lesson completion timestamps, reading status, and completed
                  modules. This data powers your progress percentage bar and dashboard overview.
                </p>
              </div>
            </div>

            <div className="py-4 grid sm:grid-cols-[180px_1fr] gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-200">Quiz Submissions</span>
              <div className="text-xs leading-6 text-zinc-400 space-y-1">
                <p>
                  When you submit answers to module comprehension checks, our server grades your responses and persists the selected
                  option index, submission timestamp, correctness status, and attempt counts. This allows you to inspect past mistakes
                  and measure retention.
                </p>
              </div>
            </div>

            <div className="py-4 grid sm:grid-cols-[180px_1fr] gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-200">Private Study Notes</span>
              <div className="text-xs leading-6 text-zinc-400 space-y-1">
                <p>
                  Any inline markdown notes you type directly on lessons are stored with your unique account identifier. These notes are
                  strictly private to you. They are never published, shared with other students, or ingested into language models.
                </p>
              </div>
            </div>

            <div className="py-4 grid sm:grid-cols-[180px_1fr] gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-200">Bookmarks & Saved Items</span>
              <div className="text-xs leading-6 text-zinc-400 space-y-1">
                <p>
                  Lessons you flag for future interview revision are stored as bookmark relations against your user ID for instant retrieval
                  via your personal saved lessons view.
                </p>
              </div>
            </div>

            <div className="py-4 grid sm:grid-cols-[180px_1fr] gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-200">Ephemeral System Logs</span>
              <div className="text-xs leading-6 text-zinc-400 space-y-1">
                <p>
                  Standard HTTP server access logs (HTTP verb, endpoint URL, status code, response time, and truncated IP) are retained
                  for an automated 14-day rolling window for DDoS mitigation, rate limiting, and debugging operational faults.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="usage" className="panel p-6 sm:p-8 space-y-4 scroll-mt-20">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-semibold text-zinc-500">03</span>
            <h2 className="text-xl font-bold tracking-tight text-white">How We Use Your Data</h2>
          </div>
          <p className="text-[15px] leading-7 text-zinc-300">
            Every piece of data stored in CoreStack Academy is tied directly to a concrete, user-facing function:
          </p>

          <div className="grid gap-3 sm:grid-cols-2 mt-2">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                State Synchronization
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                Resuming your current lesson, preserving active code snippets, and persisting your completion checkmarks seamlessly
                whether you sign in on desktop or mobile.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Mastery Metrics & Streaks
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                Aggregating your daily study cadence to calculate study streaks, quiz accuracy benchmarks, and remaining curriculum
                hour estimates.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Curriculum Quality Assurance
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                Analyzing anonymized, aggregate quiz failure distributions to identify confusing explanations in operating system or
                database lessons that require author revisions.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Platform Security & Integrity
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                Preventing brute-force credential stuffing, securing API endpoints with rate limits, and defending infrastructure against
                automated denial-of-service vectors.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-zinc-800/80 bg-zinc-900/30 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Explicit Negative Guarantees</h4>
            <p className="mt-2 text-xs leading-6 text-zinc-400">
              We never participate in cross-context tracking. We do not sell your email address to coding bootcamps, HR agencies, or
              educational marketers. We do not construct automated psycho-demographic profiles.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="cookies" className="panel p-6 sm:p-8 space-y-4 scroll-mt-20">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-semibold text-zinc-500">04</span>
            <h2 className="text-xl font-bold tracking-tight text-white">Authentication & Cookies</h2>
          </div>
          <p className="text-[15px] leading-7 text-zinc-300">
            CoreStack Academy uses an intentional, zero-marketing cookie model. We do not deploy cookie consent banners because we
            do not operate non-essential advertising or analytics cookies that require regulatory opt-ins.
          </p>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-zinc-200">
              <Cookie className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-semibold">Strictly Essential Session Cookie</span>
            </div>
            <div className="grid gap-2 text-xs font-mono text-zinc-400">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-zinc-500">Cookie Name</span>
                <span className="text-zinc-200">auth_token</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-zinc-500">Storage Class</span>
                <span className="text-zinc-200">HttpOnly, Secure, SameSite=Lax</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-zinc-500">Payload</span>
                <span className="text-zinc-200">Signed HMAC JSON Web Token (JWT)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Purpose</span>
                <span className="text-zinc-200">Cryptographically authenticates API & page requests</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-[15px] leading-7 text-zinc-300">
            <p>
              Because the <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-xs text-zinc-200">auth_token</code> cookie is
              flagged with <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-xs text-zinc-200">HttpOnly</code>, it cannot be
              read, inspected, or extracted by any client-side JavaScript executing in the browser (such as through malicious third-party browser
              extensions or cross-site scripting vulnerabilities).
            </p>
            <p>
              When you click <strong className="text-zinc-100">Sign out</strong>, the authentication cookie is immediately cleared on the
              server with a zero-duration max-age directive, completely terminating your session state.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="security" className="panel p-6 sm:p-8 space-y-4 scroll-mt-20">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-semibold text-zinc-500">05</span>
            <h2 className="text-xl font-bold tracking-tight text-white">Data Storage & Security</h2>
          </div>
          <p className="text-[15px] leading-7 text-zinc-300">
            Our infrastructure is engineered in lockstep with the core system design principles taught in our curriculum:
          </p>

          <div className="grid gap-3 sm:grid-cols-2 mt-3">
            <div className="panel p-4">
              <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm">
                <Database className="h-4 w-4 text-zinc-400" />
                PostgreSQL Persistence
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-400">
                All relational entities (users, courses, modules, lessons, notes, and quiz answer records) reside in a managed PostgreSQL
                instance featuring strict schema constraints, foreign-key cascade protections, and parameterized query execution via Drizzle ORM.
              </p>
            </div>

            <div className="panel p-4">
              <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm">
                <Lock className="h-4 w-4 text-zinc-400" />
                Cryptographic Hashing
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-400">
                Passwords undergo modern adaptive key derivation with cryptographic salting (bcrypt/scrypt) configured with high computational
                work factors to ensure resistance against precomputed dictionary and rainbow table attacks.
              </p>
            </div>

            <div className="panel p-4">
              <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm">
                <Server className="h-4 w-4 text-zinc-400" />
                Transport Layer Security (TLS)
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-400">
                All data in flight is encrypted using TLS 1.3 / TLS 1.2 with perfect forward secrecy. HTTP Strict Transport Security (HSTS)
                headers mandate encrypted communication across all endpoints.
              </p>
            </div>

            <div className="panel p-4">
              <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm">
                <UserCheck className="h-4 w-4 text-zinc-400" />
                Tenant Isolation (IDOR Defense)
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-400">
                All note queries, bookmark mutations, and quiz state modifications are strictly scoped to the authenticated user ID extracted
                from the cryptographic JWT, barring cross-tenant data leaks.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="rights" className="panel p-6 sm:p-8 space-y-4 scroll-mt-20">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-semibold text-zinc-500">06</span>
            <h2 className="text-xl font-bold tracking-tight text-white">Your Rights & Data Portability</h2>
          </div>
          <p className="text-[15px] leading-7 text-zinc-300">
            We adhere to the highest international data protection standards (including GDPR and CCPA principles) regardless of where you reside.
            You maintain full agency over every byte associated with your account:
          </p>

          <div className="space-y-3 mt-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <h3 className="text-sm font-semibold text-zinc-100">1. Right to Access & Transparency</h3>
              <p className="mt-1 text-xs leading-6 text-zinc-400">
                You can review your complete activity history, including all completed lessons, quiz scores, and saved bookmarks directly
                from your <Link href="/dashboard" className="text-zinc-200 underline underline-offset-2 hover:text-white">Dashboard</Link> and{" "}
                <Link href="/notes" className="text-zinc-200 underline underline-offset-2 hover:text-white">My Notes</Link> workspace.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <h3 className="text-sm font-semibold text-zinc-100">2. Data Portability</h3>
              <p className="mt-1 text-xs leading-6 text-zinc-400">
                Your thoughts and notes belong to you. You are never locked into CoreStack Academy. You can copy, export, or request a complete
                JSON/Markdown dump of all personal study notes and lesson bookmarks by contacting our engineering team.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <h3 className="text-sm font-semibold text-zinc-100">3. Right to Erasure (&quot;Right to Be Forgotten&quot;)</h3>
              <p className="mt-1 text-xs leading-6 text-zinc-400">
                You have the absolute right to terminate your account. Upon receiving an account deletion request, our system executes a
                cascading purge (`ON DELETE CASCADE`) that completely wipes your user row, password hash, lesson progress, quiz attempts,
                and private notes from our production PostgreSQL databases. Backups rotate and purge within 30 days.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <h3 className="text-sm font-semibold text-zinc-100">4. Right to Rectification</h3>
              <p className="mt-1 text-xs leading-6 text-zinc-400">
                If your registered display name or email address is inaccurate, you may update your profile credentials at any time.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section id="contact" className="panel p-6 sm:p-8 space-y-4 scroll-mt-20">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-semibold text-zinc-500">07</span>
            <h2 className="text-xl font-bold tracking-tight text-white">Updates & Contact Information</h2>
          </div>
          <p className="text-[15px] leading-7 text-zinc-300">
            As we author new courses or introduce new interactive developer features, we may update this policy. When material changes
            occur, we will notify learners by placing a conspicuous announcement in the application header and sending an email notice
            prior to the changes taking effect.
          </p>

          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Mail className="h-4 w-4 text-zinc-400" />
              Contact Our Privacy & Security Team
            </h3>
            <p className="text-xs leading-6 text-zinc-400">
              For questions regarding our cryptographic protections, data export requests, or account deletion, reach out directly
              to our engineering and privacy officers:
            </p>
            <div className="grid gap-2 sm:grid-cols-2 font-mono text-xs">
              <div className="rounded border border-zinc-800/80 bg-zinc-900/60 p-3">
                <span className="text-zinc-500 block text-[10px] uppercase">Privacy & Data Requests</span>
                <span className="text-zinc-200 mt-1 block">privacy@corestack.dev</span>
              </div>
              <div className="rounded border border-zinc-800/80 bg-zinc-900/60 p-3">
                <span className="text-zinc-500 block text-[10px] uppercase">Security Disclosures</span>
                <span className="text-zinc-200 mt-1 block">security@corestack.dev</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800/80 text-xs text-zinc-500">
            <span>CoreStack Academy Platform · Data Governance & Trust Operations</span>
            <a
              href="#overview"
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition font-mono"
            >
              Back to top ↑
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
