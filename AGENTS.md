# Agent Instructions | StashSaarthi Autonomous System

> This file is mirrored across `agent.md`, `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md` to enforce identical operational standards across all AI agents and execution environments.

You operate within a deterministic 3-layer architecture for **StashSaarthi** (India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform). LLMs are probabilistic, whereas production-grade web infrastructure, real-time node management, and business logic must be deterministic and zero-error.

---

## The 3-Layer Architecture

### Layer 1: Directive (What to do — SOPs & Business Logic)

- Markdown SOPs stored in `directives/` defining startup workflows, lead routing, pricing logic, and UI design rules.
- Defines clear operational charters (e.g., student dead-rent savings formulas, senior host safety charters, WhatsApp notification triggers, and campus proximity routing).

### Layer 2: Orchestration (Decision Making & Routing — That's You)

- You are the intelligent bridge between founder intent and technical execution.
- Read directives, execute deterministic scripts/commands in order, manage errors gracefully, maintain strict brand guidelines, and update SOPs as new constraints emerge.
- You never guess API signatures or hardcode sensitive credentials — you read specs and call deterministic tools.

### Layer 3: Execution (Doing the Work — Code & Tools)

- Production-grade frontend code (`src/` in React + TypeScript + Tailwind CSS).
- Database & backend routines (Supabase client scripts, Edge Functions, automated WhatsApp/Email triggers via Resend/Twilio).
- Automation scripts in `execution/` (Python/Node.js for inventory scraping, node auditing, data sync, and financial modeling).
- Environment variables (`.env`, `.env.local`) strictly protected and git-ignored.

---

## StashSaarthi Core Business & Design Directives

### 1. Dual-Persona Global Sync

- **Student Persona Mode (Default):**
  - Theme: Dark Obsidian (`#0A0D0F`), Electric Mint (`#10B981`), Neon Emerald (`#00F5A0`), Cyan accents.
  - Messaging: Micro-storage at ₹300/bag/mo, zero-brokerage rooms, verified student community.
- **Elderly Host Persona Mode:**
  - Theme: Dark Obsidian (`#0A0D0F`), Warm Amber (`#F59E0B`), Sunset Gold (`#FBBF24`).
  - Messaging: ₹11,500+/month dignified passive income, zero intrusion, 100% control over house norms, ₹10k safety cover.
- **Language Switcher:** Global `en` / `hi` state synchronization across every single UI node from Navbar to Footer.

### 2. Verified Kanpur Unit Economics (Strict Formulas)

- **Saarthi Stash:** ₹300/bag/mo (Host gets ₹180, Platform Net Margin: ₹80 / 26.7%).
- **Saarthi Spaces:** Avg ₹5,500/mo (Zero Brokerage; 10% student fee + 5% host fee; Platform Net: ₹700/mo).
- **Saarthi Kitchen:** ₹90/meal or ₹2,400/mo (Host gets ₹55/meal; Platform Net: ₹16/meal).

### 3. Contact & Communication Routing

- **Primary Founder / Operator WhatsApp:** `+91 9369454350`
- **Investor Portal Access:** Client-side lock modal with secure key lookup; dynamic 1-page PDF Executive Brief generation on success.
- **Prototype Flag:** Toggleable global flag `SHOW_PROTOTYPE_TAGS` in `src/lib/constants.ts` for instant 1-click removal of all demo indicators across inventory cards.

---

## Operating Principles & Self-Annealing Loop

### 0. Mandatory Resume Checkpoint (progress.md)

- **Every session MUST begin by reading `progress.md`** at the project root.
- Resume work from the last checkpoint — zero context loss across sessions.
- **Every session MUST end by updating `progress.md`** with completed work, new blockers, and updated next steps.
- This file is the single source of truth for cross-session continuity.

### 1. Zero-Mediation Execution & Tool Reuse

- Check existing UI components (`src/components/`) and automation scripts (`execution/`) before writing new code.
- Always run `npm run build` after structural changes to ensure zero TypeScript errors or missing imports.

### 2. Self-Annealing Protocol

When an error occurs (e.g., Supabase timeout, CSS horizontal overflow, broken asset import):

1. Analyze the exact error stack trace.
2. Fix the source code and verify mobile/desktop responsiveness.
3. Test with `npm run preview` or test suite.
4. Update the corresponding file in `directives/` so future agents avoid the same pitfall.
5. Never ask confirmation for deterministic bugs — fix them immediately.

### 3. Performance & Mobile Guard

- Ensure all 3D transforms (`Card3D`), Lenis smooth scrolling, and WebGL canvases maintain locked 60–120 FPS.
- Disable heavy 3D mouse tracking on touch viewports (<768px) to preserve native scrolling performance.
- Root element must always enforce `overflow-x: hidden` to prevent horizontal micro-jitters.

---

## File Organization & Directory Structure

```text
stashsaarthi/
├── directives/               # System SOPs, Business Logic, and Feature Charters
│   ├── pricing_engine.md     # Unit economics and savings math
│   ├── safety_protocol.md    # 4-tier host verification and legal waiver specs
│   └── theme_guidelines.md   # Design tokens (Mint vs. Amber) and language mappings
├── execution/                # Deterministic scripts (data migration, test runners)
├── src/
│   ├── components/           # Reusable UI widgets (Card3D, Modals, Sliders, Badges)
│   ├── context/              # Global Persona & Language Contexts
│   ├── lib/                  # Supabase clients, constants, math formulas
│   └── pages/                # Primary Landing Pages and Views
├── .tmp/                     # Ephemeral outputs, build caches (never commit)
├── .env.local                # Local environment variables & secrets (git-ignored)
└── agent.md                  # This master autonomous instruction file
```
