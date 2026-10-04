---
name: speckit
description: GitHub Spec Kit (Spec-Driven Development) fusion with Ponytail YAGNI architecture. Registers /speckit.* commands for SDD workflows.
---

# Spec Kit + Ponytail Fusion

This skill integrates GitHub Spec Kit with StashSaarthi's Ponytail architecture rules. It enforces Spec-Driven Development (SDD).

## Commands

### `/speckit.constitution`
Reads `.specify/memory/constitution.md` to refresh the agent's memory on the 5 Unbreakable Articles (Stack Purity, Ponytail YAGNI, Security, 60FPS Budget, Zero-Regression). Run this before starting any major refactor to ensure alignment.

### `/speckit.specify`
Creates a new feature specification in `specs/` based on the user's prompt. It should copy the `.specify/templates/spec-template.md` (or generate a standard spec format) covering the problem, solution, schema changes, and UI/UX.

### `/speckit.plan`
Breaks down an existing `spec.md` into a structured, chronological `plan.md`. Every step in the plan must pass the Ponytail 6-step ladder (Reuse existing -> Native API -> Direct Supabase -> 1-liner).

### `/speckit.tasks`
Converts the `.specify/templates/tasks-template.md` into a trackable checklist in the feature directory.

### `/speckit.implement`
Executes the steps in the plan. Applies the Zero-Regression Gate (Article V) ensuring `npx tsc --noEmit` and `npm run build` pass before claiming a task is done.

## Execution Rules
Always adhere to the rules laid out in `.specify/memory/constitution.md`. 
No mock engines. 
Private buckets for KYC. 
Zero dead code.
