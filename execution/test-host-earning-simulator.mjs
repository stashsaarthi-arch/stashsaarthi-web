import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";

console.log("🧪 Starting Task 117 Host Earning Simulator Verification Test...");

const hostSimulatorPath = path.resolve("src/components/stash/HostSimulator.tsx");
assert.strictEqual(fs.existsSync(hostSimulatorPath), true, "HostSimulator.tsx should exist");

const content = fs.readFileSync(hostSimulatorPath, "utf8");

// Assertions for Task 117
assert.ok(
  content.includes("KAKADEO HOST EARNING SLIDER"),
  "HostSimulator should include KAKADEO HOST EARNING SLIDER badge",
);
assert.ok(content.includes("roomDimension"), "HostSimulator should have roomDimension state");
assert.ok(content.includes("roomLocality"), "HostSimulator should have roomLocality state");
assert.ok(
  content.includes("localityBonus"),
  "HostSimulator should calculate locality demand bonus",
);
assert.ok(
  content.includes("roomMonthlyPayout"),
  "HostSimulator should compute room monthly payout dynamically",
);
assert.ok(
  content.includes("roomDimension}×{roomDimension}") || content.includes("empty room"),
  "HostSimulator should render room dimension headline",
);
assert.ok(
  content.includes('type="range"'),
  "HostSimulator should render range slider for room dimension",
);
assert.ok(
  content.includes("Kakadeo (PW/Allen)"),
  "HostSimulator should render Kakadeo coaching hub location option",
);

console.log("✅ Task 117 assertions passed successfully!");
