import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("==================================================================");
console.log("🧪 TASK 185 VERIFICATION SUITE: Horizontal Scroll Overflow Quarantine");
console.log("==================================================================");

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failCount++;
  }
}

// 1. Check designTokens.ts
const designTokensPath = path.join(projectRoot, "src", "lib", "designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert(
  designTokensContent.includes("HORIZONTAL_SCROLL_QUARANTINE_TOKENS"),
  "designTokens.ts defines HORIZONTAL_SCROLL_QUARANTINE_TOKENS"
);
assert(
  designTokensContent.includes("getHorizontalScrollQuarantineTokens"),
  "designTokens.ts exports getHorizontalScrollQuarantineTokens helper function"
);
assert(
  designTokensContent.includes("overflowX: \"hidden !important\""),
  "designTokens.ts specifies strict overflowX rule"
);

// 2. Check styles.css
const stylesPath = path.join(projectRoot, "src", "styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

assert(
  stylesContent.includes("Horizontal Scroll Overflow Quarantine Engine (Task 185)"),
  "styles.css contains Task 185 header section"
);
assert(
  stylesContent.includes(".overflow-x-quarantine"),
  "styles.css defines .overflow-x-quarantine CSS rule"
);
assert(
  stylesContent.includes(".root-viewport-quarantine"),
  "styles.css defines .root-viewport-quarantine CSS rule"
);
assert(
  stylesContent.includes(".prevent-horizontal-wobble"),
  "styles.css defines .prevent-horizontal-wobble CSS rule"
);
assert(
  stylesContent.includes(".horizontal-scroll-container"),
  "styles.css defines .horizontal-scroll-container CSS rule"
);

// 3. Check useHorizontalScrollQuarantine.ts
const hookPath = path.join(projectRoot, "src", "lib", "useHorizontalScrollQuarantine.ts");
assert(fs.existsSync(hookPath), "useHorizontalScrollQuarantine.ts hook file exists");

if (fs.existsSync(hookPath)) {
  const hookContent = fs.readFileSync(hookPath, "utf-8");
  assert(
    hookContent.includes("export function useHorizontalScrollQuarantine"),
    "useHorizontalScrollQuarantine hook function is exported"
  );
  assert(
    hookContent.includes("window.scrollTo({ left: 0"),
    "useHorizontalScrollQuarantine hook resets horizontal scroll left position"
  );
  assert(
    hookContent.includes("rootHtml.style.overflowX = \"hidden\""),
    "useHorizontalScrollQuarantine sets overflowX hidden on root element"
  );
}

// 4. Check HorizontalScrollQuarantine.tsx
const componentPath = path.join(projectRoot, "src", "components", "ui", "HorizontalScrollQuarantine.tsx");
assert(fs.existsSync(componentPath), "HorizontalScrollQuarantine.tsx component file exists");

if (fs.existsSync(componentPath)) {
  const compContent = fs.readFileSync(componentPath, "utf-8");
  assert(
    compContent.includes("export const ViewportQuarantineContainer"),
    "HorizontalScrollQuarantine.tsx exports ViewportQuarantineContainer primitive"
  );
  assert(
    compContent.includes("export const HorizontalScrollAuditBadge"),
    "HorizontalScrollQuarantine.tsx exports HorizontalScrollAuditBadge component"
  );
  assert(
    compContent.includes("useHorizontalScrollQuarantine()"),
    "HorizontalScrollQuarantine.tsx uses useHorizontalScrollQuarantine hook"
  );
}

// 5. Check primitives.ts & index.ts re-exports
const primitivesPath = path.join(projectRoot, "src", "components", "ui", "primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");
assert(
  primitivesContent.includes("ViewportQuarantineContainer") &&
  primitivesContent.includes("useHorizontalScrollQuarantine"),
  "primitives.ts re-exports Task 185 primitives and custom hook"
);

const indexUiPath = path.join(projectRoot, "src", "components", "ui", "index.ts");
const indexUiContent = fs.readFileSync(indexUiPath, "utf-8");
assert(
  indexUiContent.includes("HorizontalScrollQuarantine"),
  "src/components/ui/index.ts re-exports HorizontalScrollQuarantine module"
);

// 6. Check root layout integration in __root.tsx
const rootPath = path.join(projectRoot, "src", "routes", "__root.tsx");
const rootContent = fs.readFileSync(rootPath, "utf-8");
assert(
  rootContent.includes("useHorizontalScrollQuarantine()") &&
  rootContent.includes("ViewportQuarantineContainer"),
  "__root.tsx imports and integrates Task 185 quarantine hook and primitive container"
);

console.log("\n------------------------------------------------------------------");
console.log(`📊 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log("------------------------------------------------------------------");

if (failCount > 0) {
  process.exit(1);
} else {
  console.log("✨ Task 185 verification completed successfully with 100% pass rate!");
}
