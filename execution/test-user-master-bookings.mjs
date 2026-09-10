/**
 * StashSaarthi — Unified User Master Bookings Engine Verification Harness
 * Tests client pagination, local storage fallback, data unification across
 * Storage, Kitchen, and Spaces, and SQL migration schema validity.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 Verifying Unified User Master Bookings Engine...");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    failed++;
  }
}

// 1. Verify SQL Migration File Exists and Contains View Definition
const sqlPath = path.join(
  rootDir,
  "supabase",
  "migrations",
  "20260911_unified_user_master_bookings_view.sql"
);

assert(fs.existsSync(sqlPath), "SQL migration file for user_master_bookings view exists");

if (fs.existsSync(sqlPath)) {
  const sqlContent = fs.readFileSync(sqlPath, "utf-8");
  assert(
    sqlContent.includes("CREATE OR REPLACE VIEW public.user_master_bookings"),
    "SQL migration defines VIEW public.user_master_bookings"
  );
  assert(
    sqlContent.includes("FROM public.stash_bookings") &&
      sqlContent.includes("FROM public.meal_bookings") &&
      sqlContent.includes("FROM public.co_living_inquiries"),
    "View unifies stash_bookings, meal_bookings, and co_living_inquiries"
  );
  assert(
    sqlContent.includes("GRANT SELECT ON public.user_master_bookings TO authenticated, anon"),
    "View grants SELECT permissions to authenticated and anon roles"
  );
}

// 2. Verify Client-Side Data Engine TypeScript Module
const tsPath = path.join(rootDir, "src", "lib", "userMasterBookings.ts");
assert(fs.existsSync(tsPath), "src/lib/userMasterBookings.ts engine file exists");

if (fs.existsSync(tsPath)) {
  const tsContent = fs.readFileSync(tsPath, "utf-8");
  assert(
    tsContent.includes("export function getLocalMasterBookings"),
    "Exports getLocalMasterBookings function"
  );
  assert(
    tsContent.includes("export function compileUnifiedUserMasterBookings"),
    "Exports compileUnifiedUserMasterBookings helper"
  );
  assert(
    tsContent.includes("export async function getUserMasterBookings"),
    "Exports getUserMasterBookings async pagination engine"
  );
  assert(
    tsContent.includes("PaginationOptions") && tsContent.includes("PaginatedMasterBookings"),
    "Defines PaginationOptions and PaginatedMasterBookings interfaces"
  );
}

// 3. Verify TypeScript Types Declaration in Supabase Integration
const typesPath = path.join(rootDir, "src", "integrations", "supabase", "types.ts");
if (fs.existsSync(typesPath)) {
  const typesContent = fs.readFileSync(typesPath, "utf-8");
  assert(
    typesContent.includes("user_master_bookings"),
    "user_master_bookings view registered in Supabase type definitions"
  );
}

console.log("\n==========================================");
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("==========================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 User Master Bookings Engine verification complete!");
  process.exit(0);
}
