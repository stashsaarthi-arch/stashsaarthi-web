import fs from "fs";
import path from "path";

console.log("🔍 Verifying Task 147: Campus Directory Search Bar & Live Filter Overhaul...");

const projectRoot = process.cwd();

// 1. Verify designTokens.ts has FILTER_SEARCH_BAR_TOKENS
const designTokensPath = path.join(projectRoot, "src", "lib", "designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");
if (!designTokensContent.includes("FILTER_SEARCH_BAR_TOKENS") || !designTokensContent.includes("getFilterSearchBarTokens")) {
  console.error("❌ FILTER_SEARCH_BAR_TOKENS missing from designTokens.ts");
  process.exit(1);
}
console.log("✅ FILTER_SEARCH_BAR_TOKENS verified in designTokens.ts");

// 2. Verify styles.css has filter-search-bar-stage and utilities
const stylesPath = path.join(projectRoot, "src", "styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");
if (!stylesContent.includes("filter-search-bar-stage") || !stylesContent.includes("auto-suggest-chip-pill")) {
  console.error("❌ CSS utilities missing from styles.css");
  process.exit(1);
}
console.log("✅ CSS utilities verified in styles.css");

// 3. Verify FilterSearchBar2.tsx primitive component
const primitivePath = path.join(projectRoot, "src", "components", "ui", "FilterSearchBar2.tsx");
if (!fs.existsSync(primitivePath)) {
  console.error("❌ FilterSearchBar2.tsx does not exist");
  process.exit(1);
}
const primitiveContent = fs.readFileSync(primitivePath, "utf-8");
if (!primitiveContent.includes("export function FilterSearchBar2")) {
  console.error("❌ FilterSearchBar2 component export missing");
  process.exit(1);
}
console.log("✅ FilterSearchBar2.tsx component verified");

// 4. Verify primitives.ts re-export
const reExportPath = path.join(projectRoot, "src", "components", "ui", "primitives.ts");
const reExportContent = fs.readFileSync(reExportPath, "utf-8");
if (!reExportContent.includes("FilterSearchBar2")) {
  console.error("❌ FilterSearchBar2 re-export missing from primitives.ts");
  process.exit(1);
}
console.log("✅ FilterSearchBar2 re-exported in primitives.ts");

// 5. Verify CampusNodeChecker.tsx integration
const checkerPath = path.join(projectRoot, "src", "components", "stash", "CampusNodeChecker.tsx");
const checkerContent = fs.readFileSync(checkerPath, "utf-8");
if (!checkerContent.includes("<FilterSearchBar2") || !checkerContent.includes("parseDistanceKm")) {
  console.error("❌ CampusNodeChecker.tsx integration missing");
  process.exit(1);
}
console.log("✅ CampusNodeChecker.tsx integration verified");

console.log("🎉 ALL FILTER & SEARCH BAR OVERHAUL CHECKS PASSED 100%");
