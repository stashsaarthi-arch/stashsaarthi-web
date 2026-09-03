#!/usr/bin/env node
/**
 * Synchronize state between prd.json, progress.txt, and tasks.md
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const PRD_FILE = path.join(ROOT_DIR, "prd.json");
const PROGRESS_TXT = path.join(ROOT_DIR, "progress.txt");

if (!fs.existsSync(PRD_FILE)) {
  console.error(`❌ prd.json not found.`);
  process.exit(1);
}

const prd = JSON.parse(fs.readFileSync(PRD_FILE, "utf-8"));
const stories = prd.userStories || [];

console.log(`🔄 Synchronizing Ralph Loop state...`);
console.log(`Found ${stories.length} stories in prd.json.`);

// Ensure progress.txt reflects latest completed stories
let logContent =
  "# StashSaarthi Ralph Loop Progress Tracker\n# Format: [TIMESTAMP] [STORY_ID] [STATUS] Summary\n\n";
stories.forEach((story) => {
  const timestamp = new Date().toISOString();
  const status = story.passes || story.status === "completed" ? "COMPLETED" : "PENDING";
  logContent += `[${timestamp}] [${story.id}] [${status}] ${story.title}\n`;
});

fs.writeFileSync(PROGRESS_TXT, logContent, "utf-8");
console.log(`✅ progress.txt updated.`);
console.log(`✅ Ralph Loop state synchronized successfully.`);
