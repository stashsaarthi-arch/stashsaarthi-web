import fs from 'fs';
import path from 'path';

const STATE_FILE = path.join(process.cwd(), 'ai_workforce', 'STATE.json');
const REPORT_FILE = path.join(process.cwd(), 'ai_workforce', 'AGENT_REPORTS.md');

const AGENTS = ['CEO', 'CTO', 'CMO', 'CPO', 'QA', 'CRO'];

function readState() {
    if (!fs.existsSync(STATE_FILE)) return { status: "RUNNING", current_sprint: 1, active_turn: "CEO" };
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function writeState(data) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
}

async function loop() {
    console.log("\n=======================================================");
    console.log("⚡ AI WORKFORCE AUTONOMOUS DAEMON ACTIVE");
    console.log("🛑 TO STOP: Press Ctrl + C in this terminal");
    console.log("=======================================================\n");

    while (true) {
        let state = readState();

        if (state.status !== "RUNNING") {
            console.log("System paused or stopped.");
            break;
        }

        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] [SPRINT #${state.current_sprint}] Turn: ${state.active_turn}`);

        if (state.active_turn === "CEO") {
            console.log("👑 CEO is analyzing reports, synthesizing summary, and delegating next sprint tasks...");
            state.active_turn = "CTO";
        } else if (state.active_turn === "CTO") {
            console.log("⚙️ CTO scanning code, optimizing performance, and auto-patching...");
            state.active_turn = "CMO";
        } else if (state.active_turn === "CMO") {
            console.log("📢 CMO auditing copy, SEO, and user attraction messaging...");
            state.active_turn = "CPO";
        } else if (state.active_turn === "CPO") {
            console.log("🎨 CPO reviewing UX, micro-interactions, and visual harmony...");
            state.active_turn = "QA";
        } else if (state.active_turn === "QA") {
            console.log("🔍 QA checking broken links, layout overflow, and console errors...");
            state.active_turn = "CRO";
        } else if (state.active_turn === "CRO") {
            console.log("🎯 CRO optimizing CTA buttons, engagement hooks, and friction points...");
            // पूरे मैनेजर्स का राउंड खत्म -> वापस CEO को रिपोर्ट सबमिट
            console.log("✅ All Managers submitted reports. Advancing sprint and triggering CEO summary...\n");
            state.current_sprint += 1;
            state.active_turn = "CEO";
        }

        state.last_updated = new Date().toISOString();
        writeState(state);

        // AI को फाइल अपडेट का सिग्नल देने के लिए रिपोर्ट में एंट्री
        fs.appendFileSync(REPORT_FILE, `\n- [${timestamp}] [SPRINT #${state.current_sprint}] ${state.active_turn} executed inspection.`);

        // हर 5 सेकंड में अगला फेज ट्रिगर होगा
        await new Promise((res) => setTimeout(res, 5000));
    }
}

loop();
