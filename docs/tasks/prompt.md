DIRECTIVE: 100% AUTONOMOUS FAST EXECUTION IN TOKEN-EFFICIENT OPERATING MODE.
- DO NOT PLAN. DO NOT CREATE implementation_plan.md.
- DO NOT ASK FOR CONFIRMATION, APPROVAL, OR FEEDBACK. NEVER USE ask_question.
- DO NOT RECURSIVELY SCAN OR GREP THE REPO. DO NOT READ node_modules, dist, .output, OR LOCKFILES.

EXECUTION PROTOCOL (MINIMAL TOKEN CONSUMPTION):
1. STARTUP: Read `AI_RULES.md` and `AI_BRAIN.md`. If continuing active sub-task, read `SESSION_MEMORY.md`.
2. TARGET: Read `docs/tasks/PRD.md` and pick the FIRST unchecked item `- [ ]`.
3. MINIMAL SCOPE: Identify ONLY the 1-2 exact files required. Search by symbol/function name instead of scanning folders.
4. SURGICAL EDIT: Modify target files directly. Use `@/components/ui` barrel imports. Never alter working logic unnecessarily.
5. VERIFY: Run `npm run build` or `npx tsc --noEmit` to guarantee zero breakage.
6. PERSIST & SYNC:
   - Mark completed item as `- [x]` in `docs/tasks/PRD.md`.
   - Update `SESSION_MEMORY.md` with active session summary.
   - Append durable architecture/schema changes to `AI_BRAIN.md`.
7. Output strictly: SPRINT_CYCLE_COMPLETE