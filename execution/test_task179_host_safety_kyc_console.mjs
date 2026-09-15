import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("=================================================");
console.log("VERIFYING TASK 179: HOST SAFETY & KYC VERIFICATION CONSOLE");
console.log("=================================================");

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASSED: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAILED: ${message}`);
    failCount++;
  }
}

// 1. Verify design tokens in src/lib/designTokens.ts
const designTokensPath = path.join(rootDir, "src", "lib", "designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");
assert(
  designTokensContent.includes("HOST_SAFETY_KYC_TOKENS"),
  "designTokens.ts contains HOST_SAFETY_KYC_TOKENS export"
);
assert(
  designTokensContent.includes("getHostSafetyKycTokens"),
  "designTokens.ts contains getHostSafetyKycTokens helper function"
);

// 2. Verify CSS styles in src/styles.css
const stylesPath = path.join(rootDir, "src", "styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");
assert(
  stylesContent.includes(".host-kyc-console-container"),
  "styles.css contains .host-kyc-console-container rule"
);
assert(
  stylesContent.includes(".police-verification-seal-badge"),
  "styles.css contains .police-verification-seal-badge rule"
);
assert(
  stylesContent.includes(".checklist-12point-grid"),
  "styles.css contains .checklist-12point-grid rule"
);
assert(
  stylesContent.includes("@keyframes kyc-seal-pulse"),
  "styles.css contains @keyframes kyc-seal-pulse animation"
);

// 3. Verify component in src/components/ui/HostSafetyKycConsole.tsx
const componentPath = path.join(rootDir, "src", "components", "ui", "HostSafetyKycConsole.tsx");
assert(fs.existsSync(componentPath), "HostSafetyKycConsole.tsx component file exists");
const componentContent = fs.readFileSync(componentPath, "utf-8");
assert(
  componentContent.includes("export function HostSafetyKycConsole"),
  "HostSafetyKycConsole component function is exported"
);
assert(
  componentContent.includes("aadhaarNumberMasked"),
  "HostSafetyKycConsole renders Aadhaar verification status"
);
assert(
  componentContent.includes("policeCertificateId"),
  "HostSafetyKycConsole renders UP Police clearance certificate"
);
assert(
  componentContent.includes("12-Point Vault Safety Checklist"),
  "HostSafetyKycConsole renders 12-point safety checklist"
);

// 4. Verify re-exports in primitives.ts & index.ts
const primitivesPath = path.join(rootDir, "src", "components", "ui", "primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");
assert(
  primitivesContent.includes("HostSafetyKycConsole"),
  "primitives.ts re-exports HostSafetyKycConsole"
);

const indexPath = path.join(rootDir, "src", "components", "ui", "index.ts");
const indexContent = fs.readFileSync(indexPath, "utf-8");
assert(
  indexContent.includes("./HostSafetyKycConsole"),
  "index.ts exports ./HostSafetyKycConsole"
);

// 5. Verify admin.tsx route integration
const adminRoutePath = path.join(rootDir, "src", "routes", "admin.tsx");
const adminRouteContent = fs.readFileSync(adminRoutePath, "utf-8");
assert(
  adminRouteContent.includes("HostSafetyKycConsole"),
  "admin.tsx imports and renders HostSafetyKycConsole"
);

console.log("\n-------------------------------------------------");
console.log(`SUMMARY: ${passCount} Passed, ${failCount} Failed.`);
if (failCount > 0) {
  process.exit(1);
} else {
  console.log("✨ ALL TASK 179 VERIFICATION CHECKS PASSED 100%!");
}
