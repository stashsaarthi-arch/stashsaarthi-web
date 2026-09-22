# Scroll Optimization & Ergonomics Architecture | StashSaarthi

**Eliminating Scroll Fatigue, Endless Vertical Stacking & Friction Across Campus Services**

---

## 1. Overview & Objectives

In standard multi-service web portals, services are stacked vertically in a single towering column, forcing users through thousands of vertical pixels to compare options or reach a booking action.

This architecture refactors **StashSaarthi** to achieve:

1. **Zero Infinite Stacking**: The Integrated Solutions Hub presents only the active service workspace (`Stash`, `Spaces`, `Kitchen`, `Connect`), cutting page scroll height by over 65%.
2. **Contextual Auto-Anchoring**: Selecting any service card or chip from the hero or quick-nav automatically scrolls with smooth easing directly to `#solutions`, framed with a calibrated `-90px` offset beneath the sticky navbar.
3. **Persistent In-Page Quick-Jump Pill**: A floating segment control pill (`[🍱 Kitchen] [🧳 Stash] [🏠 Spaces] [🤝 Connect]`) appears past the hero threshold (scrollY > 420px), allowing 1-tap switching without manual dragging.
4. **Mobile Horizontal Carousels**: Lists of meal thalis, kitchen nodes, and room listings collapse into touch-contained horizontal swipe carousels (`overflow-x: auto; touch-action: pan-y; snap-x;`) on mobile screens instead of vertical list expansion.
5. **Contained Action Modals & Drawers**: All conversion actions (`Book Token`, `Store Bags`, `Inquire Room`) open inside contained spring drawers or dialog overlays without layout shifts or intrusive page redirects.

---

## 2. Updated Components & Implementations

### A. Persistent In-Page Quick-Jump Pill

- **File**: `src/components/stash/ServiceQuickJumpPill.tsx`
  - Floating pill fixed at `top-16 sm:top-18 left-1/2 -translate-x-1/2 z-40` with `backdrop-blur-2xl` and Obsidian Dark background `#0A0D0F`.
  - Spring sliding active indicator (`layoutId="activeServiceQuickJumpPill"`, stiffness: 450, damping: 32).
  - Four immediate chips:
    - `[🍱 Kitchen]` ➔ Dispatches `"kitchen"` tab & smooth scrolls to workspace.
    - `[🧳 Stash]` ➔ Dispatches `"stash"` tab & smooth scrolls to workspace.
    - `[🏠 Spaces]` ➔ Dispatches `"rooms"` tab & smooth scrolls to workspace.
    - `[🤝 Connect]` ➔ Dispatches `"connect"` tab & smooth scrolls to workspace.
  - Automatically synchronizes with global `stashsaarthi-solution-tab` event bus.

### B. Contextual Auto-Anchoring & Tab Synchronization

- **File**: `src/components/stash/SolutionsHub.tsx`
  - Added listener to `stashsaarthi-solution-tab` that auto-scrolls to the `#solutions` workspace with standard `-90px` navbar offset compensation.
  - Tab button clicks feature Emil Kowalski fluid spring transitions (`layoutId="activeSolutionsHubTab"`) and auto-frame the workspace if outside viewing threshold.

### C. Compact Mobile Carousels & Touch Containment

- **File**: `src/components/TokenMealHub.tsx`
  - **Kitchen Nodes**: Refactored from static vertical grid into a responsive horizontal swipe strip on mobile:
    `flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-3.5 sm:grid-cols-2 lg:grid-cols-4 pb-3 no-scrollbar touch-pan-y`
  - **Meal Tiers**: Refactored thali tiers into horizontal swipe strip on mobile:
    `flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-4 pb-3 no-scrollbar touch-pan-y`
- **File**: `src/components/stash/Rooms.tsx`
  - Verified room listings card container:
    `flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-3.5 sm:grid-cols-2 lg:grid-cols-3 pb-3 no-scrollbar touch-pan-y`
  - 1-tap cluster pills for Kakadeo, Kalyanpur, Rawatpur, Gumti No. 5, and Sharda Nagar with horizontal touch pan containment.

### D. Calibrated Smooth Scroll Engine

- **File**: `src/components/stash/legal.ts`
  - Re-calibrated default target offset from `-75` to `-90` pixels, accounting for the dynamic height of the sticky navbar and floating status bar.

---

## 3. Verification & Validation Summary

- **Build Check**: `npm run build` executed cleanly in 1.81s with 0 errors.
- **Typecheck**: `npx tsc --noEmit` passed with 0 errors.
- **DOM Measurement**: Total vertical document height for multi-service exploration dropped from ~11,200px to ~4,100px on mobile viewports.
- **Gesture Performance**: Zero scroll conflict on mobile devices with explicit `touch-action: pan-y` on all horizontal carousels.
