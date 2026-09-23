/**
 * Standalone seed entry point: `npm run db:seed`.
 * The app also seeds itself lazily on first request (see src/lib/seed.ts).
 */
import "dotenv/config";

async function main() {
  const { ensureSeeded } = await import("@/lib/seed");
  await ensureSeeded();
  const { pool } = await import("@/db");
  await pool.end();
  console.log("[seed] catalog ready");
}

main().catch((error) => {
  console.error("[seed] failed", error);
  process.exit(1);
});
