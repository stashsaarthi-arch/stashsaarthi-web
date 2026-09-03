#!/usr/bin/env node
/**
 * Ralph Loop Orchestrator for StashSaarthi
 * Compatible with VS Code Ralph Loop Extension, Antigravity, and Terminal execution.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const PRD_FILE = path.join(ROOT_DIR, "prd.json");
const PROMPT_FILE = path.join(ROOT_DIR, "prompt.md");
const PROGRESS_TXT = path.join(ROOT_DIR, "progress.txt");
const CONFIG_FILE = path.join(ROOT_DIR, "ralph.config.json");

function loadPRD() {
  if (!fs.existsSync(PRD_FILE)) {
    console.error(`❌ Error: ${PRD_FILE} not found.`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(PRD_FILE, "utf-8"));
}

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

function printBanner() {
  console.log("\n======================================================");
  console.log(" 🔄 STASHSAARTHI RALPH LOOP ORCHESTRATOR");
  console.log("    Zero-CapEx Intergenerational Living & Storage");
  console.log("======================================================\n");
}

function printStatus() {
  printBanner();
  const prd = loadPRD();
  const stories = prd.userStories || [];
  const completed = stories.filter((s) => s.passes || s.status === "completed");
  const pending = stories.filter((s) => !s.passes && s.status !== "completed");

  console.log(`📦 Project: ${prd.project || "StashSaarthi"} (v${prd.version || "1.0.0"})`);
  console.log(`🌿 Branch:  ${prd.branchName || "main"}`);
  console.log(
    `📊 Progress: ${completed.length} / ${stories.length} stories completed (${Math.round((completed.length / (stories.length || 1)) * 100)}%)\n`,
  );

  console.log("--- COMPLETED STORIES ---");
  completed.forEach((s) => {
    console.log(`  ✅ [${s.id}] ${s.title}`);
  });

  if (pending.length > 0) {
    console.log("\n--- PENDING QUEUE ---");
    pending.forEach((s, idx) => {
      console.log(`  ⏳ [${s.id}] ${s.title} (${s.priority || "normal"})`);
      if (idx === 0) {
        console.log(`     🎯 NEXT UP: ${s.description}`);
        if (s.acceptanceCriteria && s.acceptanceCriteria.length > 0) {
          console.log("     Acceptance Criteria:");
          s.acceptanceCriteria.forEach((ac) => console.log(`       - ${ac}`));
        }
      }
    });
  } else {
    console.log("\n🎉 ALL USER STORIES COMPLETED! <COMPLETE>\n");
  }
}

function verifyBuild() {
  console.log("\n🔍 Running build verification (`npm run build`)...");
  try {
    const output = execSync("npm run build", { cwd: ROOT_DIR, encoding: "utf-8", stdio: "pipe" });
    console.log("✅ Build verification passed with 0 errors.\n");
    return true;
  } catch (err) {
    console.error("❌ Build verification failed:");
    console.error(err.stdout || err.message);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes("--status") || args.includes("-s")) {
    printStatus();
    return;
  }

  if (args.includes("--verify") || args.includes("-v")) {
    printBanner();
    const passed = verifyBuild();
    process.exit(passed ? 0 : 1);
  }

  if (args.includes("--step")) {
    printBanner();
    const prd = loadPRD();
    const stories = prd.userStories || [];
    const nextStory = stories.find((s) => !s.passes && s.status !== "completed");

    if (!nextStory) {
      console.log("🎉 No pending tasks. All stories have passed. <COMPLETE>");
      return;
    }

    console.log(`🎯 Iteration Step: ${nextStory.id} - ${nextStory.title}`);
    console.log(`📝 Description: ${nextStory.description}`);
    console.log("✅ Acceptance Criteria:");
    (nextStory.acceptanceCriteria || []).forEach((ac) => console.log(`   - ${ac}`));

    const buildOk = verifyBuild();
    if (buildOk) {
      console.log(`✨ Ready for execution in agent cycle.`);
    }
    return;
  }

  // Default: Status & Health Check
  printStatus();
  verifyBuild();
}

main();
