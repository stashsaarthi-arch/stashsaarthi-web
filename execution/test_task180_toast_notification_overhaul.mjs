import { readFileSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

console.log("=================================================");
console.log("Task 180: Toast & System Notification Overhaul Test Suite");
console.log("=================================================");

let passedChecks = 0;
let totalChecks = 0;

function check(description, assertion) {
  totalChecks++;
  if (assertion) {
    console.log(`✅ [PASS] ${description}`);
    passedChecks++;
  } else {
    console.error(`❌ [FAIL] ${description}`);
  }
}

try {
  // 1. Verify design tokens in src/lib/designTokens.ts
  const tokensFile = readFileSync(join(process.cwd(), "src/lib/designTokens.ts"), "utf-8");
  check("designTokens.ts exports TOAST_NOTIFICATION_TOKENS", tokensFile.includes("TOAST_NOTIFICATION_TOKENS"));
  check("designTokens.ts exports getToastNotificationTokens helper", tokensFile.includes("getToastNotificationTokens"));

  // 2. Verify CSS styles in src/styles.css
  const stylesFile = readFileSync(join(process.cwd(), "src/styles.css"), "utf-8");
  check("styles.css includes .toast-glassmorphism-card rule", stylesFile.includes(".toast-glassmorphism-card"));
  check("styles.css includes .toast-countdown-progress-bar rule", stylesFile.includes(".toast-countdown-progress-bar"));
  check("styles.css includes .toast-action-undo-btn rule", stylesFile.includes(".toast-action-undo-btn"));
  check("styles.css includes .toast-action-view-btn rule", stylesFile.includes(".toast-action-view-btn"));

  // 3. Verify ToastNotification.tsx primitive component
  const componentFile = readFileSync(join(process.cwd(), "src/components/ui/ToastNotification.tsx"), "utf-8");
  check("ToastNotification.tsx exports ToastNotificationCard", componentFile.includes("ToastNotificationCard"));
  check("ToastNotificationCard renders countdown progress bar", componentFile.includes("progress"));
  check("ToastNotificationCard supports undo action button", componentFile.includes("undo"));
  check("ToastNotificationCard supports view action button", componentFile.includes("view"));

  // 4. Verify ToastContext.tsx
  const contextFile = readFileSync(join(process.cwd(), "src/context/ToastContext.tsx"), "utf-8");
  check("ToastContext.tsx exports toast.undo shortcut method", contextFile.includes("undo:"));
  check("ToastContext.tsx exports toast.view shortcut method", contextFile.includes("view:"));
  check("ToastContext.tsx uses ToastNotificationCard in ToastContainer", contextFile.includes("ToastNotificationCard"));

  // 5. Verify Primitive re-exports
  const primitivesFile = readFileSync(join(process.cwd(), "src/components/ui/primitives.ts"), "utf-8");
  check("primitives.ts re-exports ToastNotificationCard", primitivesFile.includes("ToastNotificationCard"));

  const indexFile = readFileSync(join(process.cwd(), "src/components/ui/index.ts"), "utf-8");
  check("index.ts re-exports ToastNotification", indexFile.includes("ToastNotification"));

  // 6. Verify clean npm run build
  console.log("\nBuilding project with `npm run build`...");
  const buildOutput = execSync("npm run build", { encoding: "utf-8", stdio: "pipe" });
  check("Production build compiled cleanly with zero errors", buildOutput.includes("built in") || buildOutput.includes("dist"));

  console.log("=================================================");
  console.log(`Results: ${passedChecks}/${totalChecks} checks passed.`);
  console.log("=================================================");

  if (passedChecks !== totalChecks) {
    process.exit(1);
  }
} catch (err) {
  console.error("Test execution failed:", err);
  process.exit(1);
}
