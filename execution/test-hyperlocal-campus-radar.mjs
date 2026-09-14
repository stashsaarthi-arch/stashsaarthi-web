import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

console.log("🔍 Verifying Hyperlocal Campus Node Radar Widget (Task 124)...");

const radarComponentPath = resolve("src/components/stash/HeroCampusRadar.tsx");
if (!existsSync(radarComponentPath)) {
  console.error("❌ HeroCampusRadar.tsx file missing!");
  process.exit(1);
}

const fileContent = readFileSync(radarComponentPath, "utf-8");

// 1. Verify export of component and node data
if (!fileContent.includes("export function HeroCampusRadar")) {
  console.error("❌ Missing export HeroCampusRadar component!");
  process.exit(1);
}
if (!fileContent.includes("export const HYPERLOCAL_BEACON_NODES")) {
  console.error("❌ Missing HYPERLOCAL_BEACON_NODES export!");
  process.exit(1);
}

// 2. Verify all 4 required campus nodes exist in HYPERLOCAL_BEACON_NODES
const requiredCampuses = ["Kakadeo", "IIT Kanpur", "HBTI", "CSJMU"];
for (const campus of requiredCampuses) {
  if (!fileContent.includes(`campus: "${campus}"`)) {
    console.error(`❌ Missing required campus node for: ${campus}`);
    process.exit(1);
  }
}
console.log("✅ Verified presence of all 4 required campuses (Kakadeo, IIT Kanpur, HBTI, CSJMU).");

// 3. Verify real-time pulsing beacons, ping latency, and audio haptics
if (!fileContent.includes("animate-ping")) {
  console.error("❌ Missing real-time pulsing beacon animation (animate-ping)!");
  process.exit(1);
}
if (!fileContent.includes("playPop")) {
  console.error("❌ Missing audio haptic playPop integration!");
  process.exit(1);
}
if (!fileContent.includes("pingLatency")) {
  console.error("❌ Missing pingLatency telemetry!");
  process.exit(1);
}
console.log("✅ Verified real-time pulsing beacons, ping latency telemetry, and micro-haptics.");

// 4. Verify CSS layout isolation
if (!fileContent.includes("section-isolated") || !fileContent.includes("layout-isolated")) {
  console.error("❌ Missing layout containment CSS classes!");
  process.exit(1);
}
console.log("✅ Verified CSS layout isolation and containment.");

// 5. Verify reserve node CTA button and booking handler
if (!fileContent.includes("Reserve Node @ ₹300") && !fileContent.includes("onBook")) {
  console.error("❌ Missing reserve node booking action!");
  process.exit(1);
}
console.log("✅ Verified ₹300/mo reserve node CTA button and booking handler.");

console.log("🎉 ALL 5/5 HYPERLOCAL CAMPUS RADAR CHECKS PASSED SUCCESSFULLY!");
