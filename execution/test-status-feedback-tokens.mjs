import fs from "fs";
import path from "path";

console.log("🔍 Running Status & Feedback Tokens Verification Suite...");

let passes = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passes++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
  }
}

// 1. Verify src/lib/designTokens.ts
const designTokensPath = path.join(process.cwd(), "src/lib/designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert(designTokensContent.includes("STATUS_TOKENS"), "src/lib/designTokens.ts exports STATUS_TOKENS");
assert(designTokensContent.includes("getStatusTokenSpec"), "src/lib/designTokens.ts exports getStatusTokenSpec helper");
assert(designTokensContent.includes("success:") && designTokensContent.includes("warning:") && designTokensContent.includes("error:") && designTokensContent.includes("info:"), "STATUS_TOKENS contains success, warning, error, and info specifications");

// 2. Verify src/styles.css
const stylesPath = path.join(process.cwd(), "src/styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

assert(stylesContent.includes("--status-success:"), "src/styles.css defines --status-success");
assert(stylesContent.includes("--status-warning:"), "src/styles.css defines --status-warning");
assert(stylesContent.includes("--status-error:"), "src/styles.css defines --status-error");
assert(stylesContent.includes("--status-info:"), "src/styles.css defines --status-info");

assert(stylesContent.includes("--color-status-success:"), "src/styles.css registers --color-status-success in @theme inline");
assert(stylesContent.includes("status-badge-success"), "src/styles.css defines status-badge-success utility");
assert(stylesContent.includes("status-card-warning"), "src/styles.css defines status-card-warning utility");

// 3. Verify StatusIndicator component & primitive re-export
const statusIndicatorPath = path.join(process.cwd(), "src/components/ui/StatusIndicator.tsx");
assert(fs.existsSync(statusIndicatorPath), "src/components/ui/StatusIndicator.tsx component primitive exists");

const primitivesPath = path.join(process.cwd(), "src/components/ui/primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");
assert(primitivesContent.includes("StatusIndicator"), "src/components/ui/primitives.ts re-exports StatusIndicator");

console.log(`\n📊 Status & Feedback Tokens Test Summary: ${passes}/${total} passed.`);

if (passes !== total) {
  process.exit(1);
}
