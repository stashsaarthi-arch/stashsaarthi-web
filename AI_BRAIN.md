# AI BRAIN — PRIMARY MEMORY

> This is the first file the AI must read before doing any task.
> Do NOT scan the full project unless this file explicitly says more context is needed.

## 1. Project Identity

Project Name: StashSaarthi
Project Type: WEB APP / FULL STACK (React 19, TanStack Start, Nitro, Supabase)
Primary Goal: Kanpur's intergenerational living and campus micro-storage ecosystem (₹300/mo storage, ₹90 tiffins, 0% brokerage).

## 2. Current Tech Stack

Frontend:
- React 19 + TypeScript + Vite + TanStack Router / TanStack Start
- Tailwind CSS + Radix UI + Lucide Icons + Framer Motion / Motion

Backend & Database:
- Nitro server runtime
- Supabase (PostgreSQL, Auth, Storage, Realtime)

## 4. Important Architecture Decisions

- Barrel Exports: Centralized UI primitive exports via `src/components/ui/index.ts` and stash components via `src/components/stash/index.ts`.
- Single-consumer Colocation: Micro-components used exclusively by one parent (e.g. `LegalDialog` in `FooterSection`, `SafetyAuditModal` in `Rooms`) are colocated within the parent file to reduce file bloat.
- Mobile First: Responsive snap navigation with `pb-36` safe bottom padding for the floating navigation HUD.
- Audio Guard: Audio playback strictly gated behind user interactions (zero autoplay on mount/timer).

## 11. Recent Changes

- 2026-09-15 — Root directory cleanup: deleted 11 obsolete docs, quarantined ad-hoc scripts to `execution/`, updated `.gitignore` for SQLite/storage cache.
- 2026-09-15 — Implemented barrel exports for `src/components/ui` (71 primitives) and `src/components/stash` (97 components).
- 2026-09-15 — Colocated single-consumer micro-components: `LegalDialog` into `FooterSection.tsx`, `SafetyAuditModal` into `Rooms.tsx`.
- 2026-09-15 — Refactored and consolidated import blocks across `index.tsx`, `Hero.tsx`, `Navbar.tsx`, `FooterSection.tsx`, `Rooms.tsx`, `Connect.tsx`, `Calculator.tsx`, `TokenMealHub.tsx`.
- 2026-09-16 — Implemented Task 187 Mobile Keyboard Collision Prevention engine (`useMobileKeyboardCollision`, `MobileKeyboardCollisionContainer`, `MOBILE_KEYBOARD_COLLISION_TOKENS`). All TypeScript checks (`npx tsc --noEmit`) passed with 0 errors.

## 13. Current Task Context

Current task:
Task 187: Mobile Keyboard Collision Prevention completed (`- [x]`).

Relevant files:
- src/lib/designTokens.ts
- src/styles.css
- src/lib/useMobileKeyboardCollision.ts
- src/components/ui/MobileKeyboardCollision.tsx
- src/components/ui/primitives.ts
- src/components/ui/index.ts
- src/routes/__root.tsx

## 14. Last Session Summary

Completed Task 187: Mobile Keyboard Collision Prevention:
- Created `MOBILE_KEYBOARD_COLLISION_TOKENS` and helper function in `src/lib/designTokens.ts`.
- Added CSS utilities for input focus scroll margin (100px top / 120px bottom headroom) in `src/styles.css`.
- Created custom hook `useMobileKeyboardCollision()` in `src/lib/useMobileKeyboardCollision.ts` to monitor viewport resize and input focus events.
- Created `MobileKeyboardCollisionContainer` primitive and `KeyboardCollisionAuditBadge` component in `src/components/ui/MobileKeyboardCollision.tsx`.
- Re-exported in `src/components/ui/primitives.ts` and `src/components/ui/index.ts`.
- Integrated `useMobileKeyboardCollision()` into `RootComponent` in `src/routes/__root.tsx`.
- Verification test suite `node execution/test_task187_mobile_keyboard_collision.mjs` passed 100% (7/7 checks).
- `npx tsc --noEmit` passed with 0 errors.

---

# MEMORY POLICY

1. Read this file first.
2. Do not recursively inspect the whole repository by default.
3. Open only files directly relevant to the requested task.
4. If exact implementation details are missing, inspect the smallest relevant file(s).
5. After completing meaningful work, update:
   - Current Task Context
   - Recent Changes
   - Last Session Summary
   - Important File Map, if needed
6. Remove stale information.
7. Keep this file concise. Target: under ~4,000 tokens.
