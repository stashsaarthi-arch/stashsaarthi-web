import fs from "fs";
import path from "path";

const CONTROL_FILE = path.join(process.cwd(), "ai_workforce", "DAEMON_CONTROL.md");
const TASK_BOARD = path.join(process.cwd(), "ai_workforce", "TASK_BOARD.md");
const REPORT_FILE = path.join(process.cwd(), "ai_workforce", "AGENT_REPORTS.md");

let cycle = 1;

function isSystemActive() {
  if (!fs.existsSync(CONTROL_FILE)) return true;
  const content = fs.readFileSync(CONTROL_FILE, "utf8");
  return content.includes("ACTIVE: true") && !content.includes("PAUSE_REQUESTED: true");
}

function logActivity(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [AUTONOMOUS-LOOP #CYCLE-${cycle}] ${message}`);
}

async function runAutonomousEngine() {
  console.log("\n=======================================================");
  console.log("🚀 AI WORKFORCE DAEMON RUNNING (Press Ctrl+C to STOP)");
  console.log("=======================================================\n");

  while (true) {
    if (!isSystemActive()) {
      console.log("\n🛑 Manual Stop Triggered via DAEMON_CONTROL.md. Shutting down.");
      break;
    }

    logActivity("CEO pinging agents: Inspecting codebase for bugs, UX friction, and copy...");

    // Auto-update report heartbeat so the AI session stays warm
    const logEntry = `\n- [${new Date().toLocaleTimeString()}] CYCLE #${cycle}: Full scan triggered across CTO, CMO, CPO, QA, CRO.`;
    fs.appendFileSync(REPORT_FILE, logEntry);

    cycle++;

    // Interval between scan iterations (default: 10 seconds)
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}

runAutonomousEngine();
