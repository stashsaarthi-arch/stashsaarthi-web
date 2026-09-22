---
name: StashSaarthi
description: India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform
colors:
  primary: "oklch(0.868 0.16 178)"
  primary-foreground: "oklch(0.145 0.011 232)"
  background: "oklch(0.145 0.011 232)"
  foreground: "oklch(0.97 0.008 220)"
  card: "oklch(0.198 0.013 223)"
  card-foreground: "oklch(0.97 0.008 220)"
  surface: "oklch(0.198 0.013 223 / 72%)"
  border: "oklch(1 0 0 / 10%)"
  input: "oklch(1 0 0 / 14%)"
  ring: "oklch(0.868 0.16 178)"
  cyan: "oklch(0.868 0.16 178)"
  emerald: "oklch(0.696 0.149 162)"
  amber: "oklch(0.769 0.165 70)"
  host-background: "oklch(0.16 0.014 60)"
  host-card: "oklch(0.21 0.017 62)"
  host-primary: "oklch(0.809 0.165 76)"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Plus Jakarta Sans, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Plus Jakarta Sans, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "calc(1rem - 4px)"
  md: "calc(1rem - 2px)"
  lg: "1rem"
  xl: "calc(1rem + 4px)"
  2xl: "calc(1rem + 8px)"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-hero:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.xl}"
    padding: "16px 32px"
  card-glass:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System

<!-- impeccable:design-schema 1 -->

## Overview

StashSaarthi employs a dual-persona, dark obsidian design system crafted for high trust, kinetic responsiveness, and dual-generation clarity. The platform operates on two distinct visual and semantic planes synchronized via `data-role`:

1. **Student Mode (Default):** Electric Mint and Cyan neon accents over Dark Obsidian base (`oklch(0.145 0.011 232)`), conveying speed, modern campus convenience, and transparent savings.
2. **Elderly Host Mode:** Warm Amber and Sunset Gold accents over warm obsidian (`oklch(0.16 0.014 60)`), communicating dignity, security, passive income stability, and home sanctity.

The typography is rendered using **Plus Jakarta Sans** and **Inter**, prioritizing readability, legibility, and high contrast against deep obsidian backdrops.

## Colors

The color palette is strictly governed in the OKLCH color space for uniform perceptual lightness across dark themes, light overlays, and persona switches.

### Primary Accents (Student Persona)

- **Primary / Electric Mint:** `oklch(0.868 0.16 178)` — Active interactive states, key CTAs, badges, and focus rings.
- **Neon Emerald:** `oklch(0.696 0.149 162)` — Secondary gradients, success telemetry, and live custody badges.
- **Cyan:** `oklch(0.868 0.16 178)` — Interactive links, hero sweep animations, and radar beacons.

### Warm Accents (Elderly Host Persona)

- **Warm Amber:** `oklch(0.809 0.165 76)` / `oklch(0.769 0.165 70)` — Host CTAs, payout calculators, and verified badges.
- **Sunset Gold:** `oklch(0.837 0.164 84)` — Hero text glow and earnings progress highlights.

### Neutrals & Surfaces

- **Dark Obsidian Background:** `oklch(0.145 0.011 232)` (`#0A0D0F` base).
- **Elevated Card Surface:** `oklch(0.198 0.013 223)` with glass variant `oklch(0.198 0.013 223 / 72%)`.
- **Foreground:** `oklch(0.97 0.008 220)` for high-contrast, crisp text rendering.
- **Muted Foreground:** `oklch(0.79 0.014 220)` for secondary descriptions, hints, and timestamp meta.
- **Borders & Dividers:** `oklch(1 0 0 / 10%)` hairline borders with `oklch(1 0 0 / 20%)` on hover.

## Typography

Primary typeface is **Plus Jakarta Sans** backed by **Inter** and native system-ui stacks.

- **Display (`clamp(2.5rem, 6vw, 4.5rem)` / 700 / leading-tight):** Hero headlines, dead-rent comparison anchors, and savings counters.
- **Headline (`clamp(1.75rem, 4vw, 2.5rem)` / 600 / leading-snug):** Section headers, modal titles, and card group headings.
- **Title (`1.125rem` to `1.25rem` / 600):** Card headers, inventory node titles, and drawer banners.
- **Body (`0.95rem` to `1rem` / 400 / leading-relaxed):** Product descriptions, step-by-step trust explainers, and legal clauses.
- **Label / Micro (`0.75rem` to `0.875rem` / 500 / uppercase or tracking-wide):** Barcode labels, live radar badges, pricing unit tokens, and status tags.

## Layout

- **Smooth Kinetic Scroll:** Global Lenis scroll engine locked to 60–120 FPS with `overflow-x: hidden` enforcement across root and body.
- **Container Standard:** Centered containers with fluid gutter padding (`px-4 sm:px-6 lg:px-8`), maxing out at `max-w-7xl`.
- **Responsive Grids:** 1-column layout on mobile (<640px), transitioning to 2-column or 3-column auto-fit layouts on desktop (`md:` / `lg:`).
- **Touch Targets:** Minimum 48px height on mobile (`max-sm:min-h-[48px]`) for touch manipulation safety and senior accessibility.

## Elevation & Depth

- **Glassmorphic Panes (`@utility glass`):** `backdrop-filter: blur(10px) saturate(120%)`, border `1px solid oklch(1 0 0 / 10%)`, and shadow `var(--shadow-glass)`.
- **Card Depth & Hover:** Lift transitions (`hover:-translate-y-1` or `hover:-translate-y-1.5`) paired with cyan glow highlights (`var(--glow-cyan)`).
- **Micro-Glows:** Key metric badges and live custody badges emit soft radial ambient luminescence (`0 0 40px -8px oklch(0.868 0.16 178 / 55%)`).

## Shapes

- **Corner Radii:** Standardized border-radius hierarchy:
  - Small pills & sub-badges: `--radius-sm` (12px).
  - Standard buttons & inputs: `--radius-md` (14px).
  - Cards & dialog surfaces: `--radius-lg` (16px) or `--radius-xl` (20px).
  - Drawers & modals: `--radius-2xl` (24px) or `--radius-3xl` (28px).

## Components

- **Buttons (`Button`):** Variants include `default`, `hero` (cyan gradient sweep with shimmer animation), `warm` (host amber gradient), `frost` (glassmorphic), and `ghost`. Supports audio micro-click haptic feedback via `playClick()`.
- **3D Tilt Container (`Tilt3D`):** Light GPU-accelerated container with subtle translateY hover lifts, disabling aggressive tracking on touch devices for fluid framerate.
- **Custody Pass & Status Badges (`BookingLiveStatusBadge`):** Monospaced laser-tamper barcode markers, real-time pulsing status rings (green/amber/blue), and high-contrast metadata fields.
- **Drawers & Modals:** Radix dialog overlays with frosted glass scrims, swipeable dismissal handles on mobile, and zero horizontal jitter.

## Do's and Don'ts

### Do's

- Always maintain full visual and copy alignment between Student (`data-role="student"`) and Host (`data-role="host"`) personas.
- Keep hairline borders translucent (`oklch(1 0 0 / 10%)`) over dark surfaces to maintain high-end glassmorphism.
- Ensure all interactive touch targets meet mobile accessibility minimums (`min-h-[48px]`).
- Preserve Lenis smooth-scroll compatibility with `overflow-x: hidden` on root containers.

### Don'ts

- Never use generic, uncalibrated hex colors (e.g. plain `#ff0000` or `#0000ff`). Always reference OKLCH variables or theme tokens.
- Never hardcode English strings without equivalent Hindi translation keys in the bilingual mapping matrix.
- Never add heavy WebGL or unthrottled mousemove listeners on touch viewports (<768px).
- Never allow horizontal overflow or micro-jitters on mobile devices.
