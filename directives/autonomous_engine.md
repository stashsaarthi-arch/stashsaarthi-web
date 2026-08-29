# Autonomous Self-Replenishing Protocol

## The Infinite Loop Rule:
1. **Queue Audit:** Check `tasks.md`. If tasks exist, execute the next one.
2. **Self-Ideation (When queue is empty or low):**
   - Run a deep code analysis on `src/` against `directives/self_discovery_engine.md`.
   - Formulate 3 to 5 high-impact, production-grade improvement proposals.
   - Automatically append them to `tasks.md` with clear acceptance criteria.
3. **Execution & Build:**
   - Implement the idea cleanly without breaking existing logic.
   - Verify with `npm run build`. If build fails, fix immediately.
4. **Log & Repeat:**
   - Mark task done in `tasks.md`, log the impact in `progress.md`, and immediately start the next cycle.
   