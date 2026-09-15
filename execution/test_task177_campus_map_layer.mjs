import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("====================================================");
console.log("🧪 TASK 177: INTERACTIVE CAMPUS MAP LAYER VERIFICATION");
console.log("====================================================");

let testsPassed = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(` ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(` ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Verify Design Tokens in src/lib/designTokens.ts
const designTokensPath = path.join(projectRoot, "src", "lib", "designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert(
  designTokensContent.includes("CAMPUS_MAP_LAYER_TOKENS") &&
    designTokensContent.includes("getCampusMapLayerTokens"),
  "CAMPUS_MAP_LAYER_TOKENS & getCampusMapLayerTokens defined in designTokens.ts"
);

assert(
  designTokensContent.includes("campusPresets") &&
    designTokensContent.includes("Kakadeo Coaching Hub") &&
    designTokensContent.includes("CSJMU Zone"),
  "Campus preset hubs (Kakadeo, Kalyanpur) defined in CAMPUS_MAP_LAYER_TOKENS"
);

assert(
  designTokensContent.includes("walkingRoutes") &&
    designTokensContent.includes("safetyScore"),
  "Safe walking route overlays with distance & safety scores defined in CAMPUS_MAP_LAYER_TOKENS"
);

// 2. Verify CSS Utilities in src/styles.css
const stylesPath = path.join(projectRoot, "src", "styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

assert(
  stylesContent.includes(".campus-map-container") &&
    stylesContent.includes(".campus-map-canvas-stage") &&
    stylesContent.includes(".map-node-marker"),
  "Campus map glassmorphism container and canvas stage CSS utilities defined in styles.css"
);

assert(
  stylesContent.includes("map-pin-pulse-ring") &&
    stylesContent.includes("map-walking-route-line"),
  "Animated SVG walking route line and pulsing pin ring animations defined in styles.css"
);

// 3. Verify Primitive Component implementation in src/components/ui/InteractiveCampusMap.tsx
const mapCompPath = path.join(projectRoot, "src", "components", "ui", "InteractiveCampusMap.tsx");
assert(fs.existsSync(mapCompPath), "InteractiveCampusMap.tsx component file exists");

const mapCompContent = fs.readFileSync(mapCompPath, "utf-8");
assert(
  mapCompContent.includes("export const InteractiveCampusMap") &&
    mapCompContent.includes("usePersona") &&
    mapCompContent.includes("getCampusMapLayerTokens"),
  "InteractiveCampusMap primitive component uses persona context and design tokens"
);

assert(
  mapCompContent.includes("handleZoomIn") &&
    mapCompContent.includes("handleRouteClick") &&
    mapCompContent.includes("handleNodeClick"),
  "Interactive map includes zoom controls, node pin clicks, and route polyline selection"
);

assert(
  mapCompContent.includes("selectedNode") &&
    mapCompContent.includes("selectedRoute") &&
    mapCompContent.includes("Google Maps"),
  "Node inspection drawer modal rendering with host details, rating, and Google Maps direction link"
);

// 4. Verify Re-exports in primitives.ts and index.ts
const primitivesPath = path.join(projectRoot, "src", "components", "ui", "primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");
assert(
  primitivesContent.includes("InteractiveCampusMap") &&
    primitivesContent.includes("CampusMapNode") &&
    primitivesContent.includes("WalkingRouteSpec"),
  "InteractiveCampusMap primitives re-exported in primitives.ts"
);

const indexPath = path.join(projectRoot, "src", "components", "ui", "index.ts");
const indexContent = fs.readFileSync(indexPath, "utf-8");
assert(
  indexContent.includes("InteractiveCampusMap"),
  "InteractiveCampusMap exported in src/components/ui/index.ts"
);

// 5. Verify Integration in src/routes/admin.tsx
const adminRoutePath = path.join(projectRoot, "src", "routes", "admin.tsx");
const adminRouteContent = fs.readFileSync(adminRoutePath, "utf-8");
assert(
  adminRouteContent.includes("<InteractiveCampusMap />") &&
    adminRouteContent.includes("InteractiveCampusMap"),
  "InteractiveCampusMap component integrated into Admin console route"
);

console.log("----------------------------------------------------");
console.log(`SUMMARY: ${testsPassed} / ${totalTests} verification checks passed.`);
console.log("====================================================");

if (testsPassed === totalTests) {
  console.log("🎉 TASK 177 VERIFICATION PASSED 100%");
  process.exit(0);
} else {
  console.error("💥 TASK 177 VERIFICATION FAILED");
  process.exit(1);
}
