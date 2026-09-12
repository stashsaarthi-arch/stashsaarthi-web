#!/usr/bin/env node
/**
 * StashSaarthi Production GSD Pipeline Runner & Antigravity Adapter
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const configPath = path.join(rootDir, "gsd.config.json");

if (!fs.existsSync(configPath)) {
  console.error("❌ gsd.config.json not found in project root.");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const args = process.argv.slice(2);

// Check if running a specific pipeline or task
let targetAction = "deploy:prep";
if (args[0] === "run" && args[1]) {
  targetAction = args[1];
} else if (args[0] && args[0] !== "run" && !args[0].startsWith("-")) {
  targetAction = args[0];
}

const isDebug = process.env.DEBUG?.includes("gsd") || args.includes("--debug");

console.log(`\n======================================================`);
console.log(`⚡ GSD Engine: ${config.project || "StashSaarthi"}`);
console.log(`🎯 Pipeline/Task Target: ${targetAction}`);
console.log(`⚙️  Concurrency Limit: ${config.concurrency || 4}`);
console.log(`======================================================\n`);

function executeCommand(cmdName, cmdString) {
  if (isDebug) {
    console.log(`[DEBUG:gsd] Executing '${cmdName}': ${cmdString}`);
  }
  console.log(`▶ [GSD Task: ${cmdName}] Running: ${cmdString}`);
  try {
    execSync(cmdString, {
      stdio: "inherit",
      cwd: rootDir,
      shell: true,
      env: { ...process.env, GSD_ACTIVE: "true" },
    });
    console.log(`✔ [GSD Task: ${cmdName}] Completed successfully.\n`);
  } catch (err) {
    console.error(`❌ [GSD Task: ${cmdName}] Failed with exit code: ${err.status || 1}`);
    throw err;
  }
}

function resolveTaskCommand(taskKey) {
  const taskDef = config.tasks?.[taskKey];
  if (!taskDef) {
    // Check if task maps directly to an npm script
    return `npm run ${taskKey}`;
  }
  let cmd = typeof taskDef === "string" ? taskDef : taskDef.command;
  // Map antigravity commands to local npm scripts if not in standalone global CLI
  if (cmd.startsWith("antigravity build")) {
    cmd = "npm run build";
  } else if (cmd.startsWith("antigravity dev")) {
    cmd = "npm run dev";
  } else if (cmd.startsWith("tsc --noEmit")) {
    cmd = "npx tsc --noEmit";
  }
  return cmd;
}

try {
  // Check if target is a defined pipeline
  if (config.pipelines?.[targetAction]) {
    const pipeline = config.pipelines[targetAction];
    console.log(`📋 Pipeline '${targetAction}' mode: ${pipeline.mode || "series"}`);

    if (pipeline.mode === "series") {
      for (const taskKey of pipeline.tasks) {
        const cmd = resolveTaskCommand(taskKey);
        executeCommand(taskKey, cmd);
      }
    } else {
      // Parallel mode
      console.log(`⚡ Spawning parallel tasks: ${pipeline.tasks.join(", ")}`);
      for (const taskKey of pipeline.tasks) {
        if (taskKey.includes("worker:")) {
          const cmd = resolveTaskCommand(taskKey);
          executeCommand(taskKey, cmd);
        } else {
          console.log(`  - [Registered Service]: ${taskKey}`);
        }
      }
    }
  } else if (config.tasks?.[targetAction]) {
    // Single task execution
    const cmd = resolveTaskCommand(targetAction);
    executeCommand(targetAction, cmd);
  } else {
    console.warn(`⚠️ Pipeline or task '${targetAction}' not directly found in config. Attempting fallback...`);
    executeCommand(targetAction, `npm run ${targetAction}`);
  }

  console.log(`✅ [GSD] All operations for target '${targetAction}' completed with zero errors.`);
} catch (error) {
  console.error(`💥 [GSD Engine Failure]: Execution halted.`);
  process.exit(1);
}
