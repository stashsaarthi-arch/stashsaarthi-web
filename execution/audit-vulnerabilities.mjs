/**
 * StashSaarthi Autonomous Security Audit Engine
 *
 * Purpose: Automated dependency vulnerability scanning & health audit.
 * Execution: node execution/audit-vulnerabilities.mjs [--strict] [--with-build]
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const tmpDir = path.join(rootDir, ".tmp");

const isStrict = process.argv.includes("--strict");
const runBuild = process.argv.includes("--with-build");

console.log("\x1b[36m%s\x1b[0m", "[Security Audit] Starting dependency vulnerability analysis...");

let auditData = null;
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const cleanEnv = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => !k.startsWith("npm_")),
);

try {
  const rawOutput = execSync(`${npmCmd} audit --json`, {
    cwd: rootDir,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    env: cleanEnv,
  });
  auditData = JSON.parse(rawOutput);
} catch (err) {
  // npm audit exits with non-zero code if vulnerabilities are found
  if (err.stdout) {
    try {
      auditData = JSON.parse(err.stdout);
    } catch {
      console.error("\x1b[31m%s\x1b[0m", "[Security Audit] Failed to parse npm audit JSON output.");
    }
  }
}

if (!auditData) {
  console.error("\x1b[31m%s\x1b[0m", "[Security Audit] Unable to execute or parse npm audit.");
  process.exit(1);
}

const vulns = auditData.metadata?.vulnerabilities || {
  info: 0,
  low: 0,
  moderate: 0,
  high: 0,
  critical: 0,
  total: 0,
};

const deps = auditData.metadata?.dependencies || {
  prod: 0,
  dev: 0,
  optional: 0,
  peer: 0,
  total: 0,
};

const timestamp = new Date().toISOString();
const isClean = vulns.critical === 0 && vulns.high === 0;

console.log("\x1b[32m%s\x1b[0m", `[Security Audit] Scan completed at ${timestamp}`);
console.log(`- Total Dependencies Scanned: ${deps.total} (${deps.prod} prod, ${deps.dev} dev)`);
console.log(
  `- Vulnerabilities Found: Total=${vulns.total} [Critical=${vulns.critical}, High=${vulns.high}, Moderate=${vulns.moderate}, Low=${vulns.low}]`,
);

// Create .tmp folder if missing
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Generate Markdown Report
const reportLines = [
  "# 🛡️ StashSaarthi Dependency Vulnerability Audit Report",
  "",
  `**Generated At:** \`${timestamp}\`  `,
  `**Audit Result:** ${isClean ? "✅ **PASSED** (0 Critical/High Vulnerabilities)" : "⚠️ **WARNING** (Vulnerabilities Detected)"}`,
  "",
  "## 📊 Summary Metrics",
  "",
  "| Metric | Count |",
  "| --- | --- |",
  `| Total Dependencies Scanned | \`${deps.total}\` |`,
  `| Production Dependencies | \`${deps.prod}\` |`,
  `| Dev Dependencies | \`${deps.dev}\` |`,
  `| Critical Vulnerabilities | \`${vulns.critical}\` |`,
  `| High Vulnerabilities | \`${vulns.high}\` |`,
  `| Moderate Vulnerabilities | \`${vulns.moderate}\` |`,
  `| Low Vulnerabilities | \`${vulns.low}\` |`,
  `| **Total Vulnerabilities** | **\`${vulns.total}\`** |`,
  "",
  "## 🔍 Vulnerability Detail Checklist",
];

if (vulns.total === 0) {
  reportLines.push(
    "",
    "✨ **Zero vulnerabilities detected across all project packages.** Clean security bill of health.",
  );
} else {
  reportLines.push(
    "",
    "| Package | Severity | Title | Affected Range | Link |",
    "| --- | --- | --- | --- | --- |",
  );
  if (auditData.vulnerabilities) {
    for (const [pkgName, vuln] of Object.entries(auditData.vulnerabilities)) {
      const severity = vuln.severity || "unknown";
      const title = vuln.via?.[0]?.title || "Advisory";
      const range = vuln.range || "N/A";
      const url = vuln.via?.[0]?.url || "#";
      reportLines.push(
        `| \`${pkgName}\` | \`${severity}\` | ${title} | \`${range}\` | [Link](${url}) |`,
      );
    }
  }
}

// Check build status if requested
if (runBuild) {
  console.log("\x1b[36m%s\x1b[0m", "[Security Audit] Running build verification...");
  try {
    execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
    reportLines.push(
      "",
      "## 🏗️ Build Verification",
      "",
      "✅ **Build Succeeded** clean compilation across client, SSR, and server bundles.",
    );
  } catch {
    reportLines.push(
      "",
      "## 🏗️ Build Verification",
      "",
      "❌ **Build Failed** compilation failed during audit check.",
    );
    if (isStrict) {
      process.exit(1);
    }
  }
}

const reportPath = path.join(tmpDir, "audit-report.md");
fs.writeFileSync(reportPath, reportLines.join("\n"), "utf8");
console.log("\x1b[32m%s\x1b[0m", `[Security Audit] Saved audit report to: ${reportPath}`);

if (isStrict && !isClean) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "[Security Audit] Strict mode enabled and Critical/High vulnerabilities exist. Failing build.",
  );
  process.exit(1);
}

process.exit(0);
