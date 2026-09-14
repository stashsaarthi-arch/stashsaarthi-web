---
name: impeccable
description: "Pixel-precision, state handling, layout typography, and zero-defect UI resilience"
---

# Impeccable Skill: Pixel-Precision, State Handling & Layout Rigor

Use this skill when implementing UI components, inspecting responsive breakpoints, handling asynchronous edge cases, and validating layout stability.

## Core Rules

1. **Pixel-Precision & Spacing Scale**:
   - Strictly adhere to an 8-point spacing cadence (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
   - Eliminate unintended fractional pixel rounding and alignment drift across flex/grid layouts.
   - Enforce touch target minimums: `44x44px` on mobile/student interfaces, `52px+` height on senior host accessibility targets.
2. **Exhaustive State Matrix**:
   - Every interactive component must explicitly handle and cleanly render all standard states:
     - **Default / Resting**
     - **Hover / Focus-visible** (keyboard accessible ring indicators)
     - **Active / Pressed**
     - **Loading / Skeleton shimmer** (zero layout shift / CLS = 0)
     - **Empty State** (empathetic illustrated SVGs, clear copy, contextual actions)
     - **Error / Offline State** (actionable resolution message, retry triggers)
     - **Disabled State** (`opacity-50 pointer-events-none cursor-not-allowed`)
3. **Zero Horizontal Overflow**:
   - Root html and viewport containers must enforce `overflow-x: hidden` to completely eliminate micro-jitters or unwanted horizontal scrollbars on mobile viewports.
4. **Resilient Typography & Internationalization**:
   - No hardcoded text strings in JSX; ensure full bilingual parity across English and Devanagari Hindi.
   - Ensure dynamic text scaling does not truncate or wrap awkwardly; use `clamp()` or container queries where appropriate.
5. **Deterministic Production Validation**:
   - Always run `npm run build` to guarantee clean TypeScript compilation, zero unused import errors, and successful SSR/client bundle generation.
