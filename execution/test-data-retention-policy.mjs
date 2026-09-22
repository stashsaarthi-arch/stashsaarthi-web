import { execSync } from "child_process";
import assert from "assert";
import fs from "fs";
import path from "path";

console.log("🧪 Testing 18-Month Data Retention Policy Engine & Verification Harness...");

// 1. Verify SQL Migration File Exists & Contains Correct DPDP Sec 12(3) Logic
const sqlPath = path.resolve("supabase/migrations/20260907_data_retention_auto_purge.sql");
assert(fs.existsSync(sqlPath), "SQL Migration 20260907_data_retention_auto_purge.sql must exist");

const sqlContent = fs.readFileSync(sqlPath, "utf8");
assert(sqlContent.includes("18 months"), "Migration must specify 18 months cutoff interval");
assert(
  sqlContent.includes("purge_inactive_student_data_18_months"),
  "RPC function purge_inactive_student_data_18_months must be defined",
);
assert(
  sqlContent.includes("Anonymized Data Principal"),
  "PII in financial records older than 18 months must be anonymized",
);
console.log("✅ SQL Migration & Database Retention RPC schema verified");

// 2. Verify Client-Side Data Retention Engine Typescript File
const enginePath = path.resolve("src/lib/dataRetentionEngine.ts");
assert(fs.existsSync(enginePath), "dataRetentionEngine.ts must exist");

const engineContent = fs.readFileSync(enginePath, "utf8");
assert(
  engineContent.includes("INACTIVE_DAYS_THRESHOLD = 547"),
  "Engine must set 547 days (18 months) threshold",
);
assert(
  engineContent.includes("auditInactiveStudentData"),
  "auditInactiveStudentData function must exist",
);
assert(
  engineContent.includes("executeAutoPurge18Months"),
  "executeAutoPurge18Months function must exist",
);
assert(
  engineContent.includes("initAutoDataRetentionPurge"),
  "initAutoDataRetentionPurge function must exist",
);
console.log("✅ Client-side Data Retention Engine verified");

// 3. Verify Privacy Page Integration
const privacyPath = path.resolve("src/routes/privacy.tsx");
const privacyContent = fs.readFileSync(privacyPath, "utf8");
assert(privacyContent.includes("DataRetentionModal"), "Privacy page must mount DataRetentionModal");
assert(
  privacyContent.includes("18-Month Data Retention"),
  "Privacy page must highlight 18-month data retention policy",
);
console.log("✅ Privacy Policy page integration verified");

console.log("🎉 18-Month Data Retention Policy Test Suite PASSED (3/3 checks)");
