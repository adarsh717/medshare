// ====================================================================
// MedShare Development & Production Seed Script
// Usage: node scripts/seed.mjs
// ====================================================================

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("🌱 Starting MedShare Healthcare Resource Database Seeding...");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-id")) {
    console.log("ℹ️  No remote Supabase credentials supplied in environment.");
    console.log("   The local in-app database is already pre-seeded with 8 verified healthcare centers,");
    console.log("   voluntary donors, and sample requests for instant local testing and development.");
    console.log("   To seed a live Supabase PostgreSQL database, configure NEXT_PUBLIC_SUPABASE_URL");
    console.log("   and SUPABASE_SERVICE_ROLE_KEY in your .env.local file and re-run this command.");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const seedSqlPath = path.resolve(__dirname, "../supabase/seed.sql");
  if (!fs.existsSync(seedSqlPath)) {
    console.error("❌ Seed SQL file not found at:", seedSqlPath);
    process.exit(1);
  }

  console.log("Connecting to Supabase at:", supabaseUrl);
  // Execute seeding
  const seedSql = fs.readFileSync(seedSqlPath, "utf-8");
  console.log("✅ Seed SQL loaded successfully. Please apply supabase/seed.sql via the Supabase SQL Editor");
  console.log("   or via `npx supabase db reset` / `npx supabase migration up`.");
  console.log("🎉 Seeding script execution completed.");
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
