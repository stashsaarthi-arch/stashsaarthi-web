# AUTONOMOUS AGENT WORKFORCE PROTOCOL

## Core Philosophy
This workforce operates on an infinite closed-loop audit & execution cycle. 
Agents do not stop after one execution; they continuously observe the codebase, identify bottlenecks, propose patches, apply improvements, and sync with the CEO.

## The 4-Phase Endless Execution Loop:
1. **AUDIT (Inspect):** Every manager analyzes the live code/files corresponding to their domain.
2. **SYNC (Report):** Managers append findings into `AGENT_REPORTS.md` and ping `CEO_ORCHESTRATOR`.
3. **DISPATCH (Command):** `CEO_ORCHESTRATOR` updates `TASK_BOARD.md`, assigns priorities (P0, P1, P2), and delegates action items.
4. **EXECUTE & DEPLOY (Action):** Agents apply changes directly to the codebase, verify stability, and mark tasks as `[DONE]`.

## Inter-Agent Communication Rules
- No direct file clobbering: Agents only edit code in their operational scope or request cross-functional approval via `TASK_BOARD.md`.
- Always check `TASK_BOARD.md` before starting any execution run.
