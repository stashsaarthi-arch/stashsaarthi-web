---
name: ecell-design
description: Design system skill for ecell. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX. Includes ultra-mode visual journey: read references/ANIMATIONS.md, references/LAYOUT.md, references/COMPONENTS.md, and references/INTERACTIONS.md for full motion and layout details.
---

# ecell Design System

You are building UI for **ecell**. Dark-themed, warm palette, sans-serif typography (GTA6-Heading), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![ecell Homepage](screenshots/homepage.png)

### Scroll Journey (Cinematic Visual States)

> These screenshots capture the website at different scroll depths. The design changes dramatically as you scroll — each frame shows a different cinematic state. Replicate these exact visual transitions.

#### 0% — Hero / Above the fold

![Scroll 0%](screens/scroll/scroll-000.png)

#### 17% — Mid-page at 17% scroll

![Scroll 17%](screens/scroll/scroll-017.png)

#### 33% — Mid-page at 33% scroll

![Scroll 33%](screens/scroll/scroll-033.png)

#### 50% — Mid-page at 50% scroll

![Scroll 50%](screens/scroll/scroll-050.png)

#### 67% — Mid-page at 67% scroll

![Scroll 67%](screens/scroll/scroll-067.png)

#### 83% — Mid-page at 83% scroll

![Scroll 83%](screens/scroll/scroll-083.png)

#### 100% — Footer / End of page

![Scroll 100%](screens/scroll/scroll-100.png)

> Read `references/DESIGN.md` for full token details. Read `references/ANIMATIONS.md` for motion specs. Read `references/LAYOUT.md` for layout structure. Read `references/COMPONENTS.md` for component patterns.

## Ultra Reference Files

This package includes extended documentation. **Read these files before implementing:**

| File | Contents |
|------|----------|
| `references/DESIGN.md` | Full design system tokens, colors, typography, spacing |
| `references/VISUAL_GUIDE.md` | **START HERE** — Master visual guide with all screenshots embedded |
| `references/ANIMATIONS.md` | CSS keyframes, scroll triggers, motion library stack, video specs |
| `references/LAYOUT.md` | Flex/grid containers, page structure, spacing relationships |
| `references/COMPONENTS.md` | DOM component patterns, HTML structure, class fingerprints |
| `references/INTERACTIONS.md` | Hover/focus states with before/after style diffs |
| `screens/scroll/` | 7 scroll journey screenshots showing cinematic states |

### Animation Stack Detected

- **Web Animations API (149 active)** — animation

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Type pairing** — GTA6-Heading for body/UI text, bootstrap-icons for headings/display. Never introduce a third typeface.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **warm palette** — the color temperature runs warm, matching the sans-serif typography.
- **Restrained accent** — `#ffd740` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#1f1f1f` | Page/app background |
| Surface | `--surface` | `#000000` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#ffffff` | Headings, body text |
| Text Muted | `--text-muted` | `#757575` | Captions, placeholders |
| Accent | `--accent` | `#ffd740` | CTAs, links, focus rings |
| Border | `--border` | `#424242` | Dividers, card borders |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Success | `#198754` | Confirmations, positive trends |
| Warning | `#bd9f67` | Caution states, pending items |
| Danger | `#f44336` | Errors, destructive actions |

### Extended Palette

- **mat-option-selected-state-label-text-color:** `#673ab7`
- `#d1d5db`
- **bs-primary:** `#0068ff`
- `#ff7a1a`
- `#243137`
- **bs-warning:** `#ffc300` — Warning banners, caution states
- **primary-blue:** `#ffe100`
- **mdc-chip-elevated-container-color:** `#e0e0e0`

### CSS Variable Tokens

```css
--primary-blue: #FFE100;
--webgl-page-background: #0a0a0a;
--mdc-elevated-card-container-shape: 4px;
--mdc-outlined-card-container-shape: 4px;
--mdc-outlined-card-outline-width: 1px;
--mdc-elevated-card-container-color: white;
--mdc-outlined-card-container-color: white;
--mdc-outlined-card-outline-color: rgba(0,0,0,.12);
--mat-card-subtitle-text-color: rgba(0,0,0,.54);
--mat-card-title-text-font: Roboto,sans-serif;
--mat-card-title-text-line-height: 32px;
--mat-card-title-text-size: 20px;
--mat-card-title-text-tracking: .0125em;
--mat-card-title-text-weight: 500;
--mat-card-subtitle-text-font: Roboto,sans-serif;
--mat-card-subtitle-text-line-height: 22px;
--mat-card-subtitle-text-size: 14px;
--mat-card-subtitle-text-tracking: .0071428571em;
--mat-card-subtitle-text-weight: 500;
--mat-select-panel-background-color: white;
```

## Typography

### Font Stack

- **GTA6-Heading** — Heading 1, Heading 2, Heading 3
- **bootstrap-icons** — Body, Caption

### Font Sources

```css
@font-face {
  font-family: "bootstrap-icons";
  src: url("fonts/bootstrap-icons-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Heading";
  src: url("fonts/GTA6-Heading-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Bold";
  src: url("fonts/GTA6-Bold-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Medium";
  src: url("fonts/GTA6-Medium-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Thin";
  src: url("fonts/GTA6-Thin-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "primeicons";
  src: url("fonts/primeicons-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Satoshi";
  src: url("fonts/Satoshi-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Satoshi";
  src: url("fonts/Satoshi-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Bebas Neue";
  src: url("fonts/BebasNeue-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | GTA6-Heading | 90px | 700 |
| Heading 2 | GTA6-Heading | 5rem | 700 |
| Heading 3 | GTA6-Heading | 4.5rem | 700 |
| Body | bootstrap-icons | 16px | 400 |
| Caption | bootstrap-icons | 1.25rem | 400 |

### Typography Rules

- Body/UI: **GTA6-Heading**, Headings: **bootstrap-icons** — these are the only display fonts
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 4px

Every dimension (margin, padding, gap, width, height) must be a multiple of **4px**.

### Spacing Scale

`2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 4-8px | Tight: related items (icon + label, avatar + name) |
| 12-16px | Medium: between groups within a section |
| 24-32px | Wide: between distinct sections |
| 48px+ | Vast: major page section breaks |

### Border Radius

Scale: `.25rem, .25em, .375rem, 1rem, 2em, 2px, 3px, 4px, 5%, 5px, 6px, 8px, 10px, 10px 0px 0px 10px, 12px, 15px, 16px, 18px, 20px, 25px, 30px, 100%, inherit`
Default: `8px`

### Container

Max-width: `1399.98px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| xs | 480px |
| sm | 500px |
| sm | 575.98px |
| sm | 576px |
| md | 676px |
| md | 767px |
| md | 767.98px |
| md | 768px |
| lg | 786px |
| lg | 900px |
| lg | 991.98px |
| lg | 992px |
| lg | 1000px |
| xl | 1060px |
| xl | 1100px |
| xl | 1199.98px |
| xl | 1200px |
| 2xl | 1399.98px |
| 2xl | 1400px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #000000;
  border: 1px solid #424242;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px #0003;
}
```

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

### Button

```css
/* Primary */
.btn-primary {
  background: #ffd740;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #424242;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 16px;
}
```

```html
<button class="btn-primary">Get Started</button>
<button class="btn-ghost">Learn More</button>
```

### Input

```css
.input {
  background: #1f1f1f;
  border: 1px solid #424242;
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
}
.input:focus { border-color: #ffd740; outline: none; }
```

```html
<input class="input" type="text" placeholder="Search..." />
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #000000;
  color: #757575;
}
```

```html
<span class="badge">New</span>
<span class="badge">Beta</span>
```

### Modal / Dialog

```css
.modal-backdrop { background: rgba(0, 0, 0, 0.6); }
.modal {
  background: #000000;
  border: 1px solid #424242;
  border-radius: inherit;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 4px 15px #ff7a1a33;
}
```

```html
<div class="modal-backdrop">
  <div class="modal">
    <h2>Dialog Title</h2>
    <p>Dialog content.</p>
    <button class="btn-primary">Confirm</button>
    <button class="btn-ghost">Cancel</button>
  </div>
</div>
```

### Table

```css
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 12px;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #424242;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #424242;
}
```

```html
<table class="table">
  <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>Item One</td><td>Active</td><td>Jan 1</td></tr>
    <tr><td>Item Two</td><td>Pending</td><td>Jan 2</td></tr>
  </tbody>
</table>
```

### Navigation

```css
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #424242;
}
.nav-link {
  color: #757575;
  padding: 8px 12px;
  border-radius: 8px;
  transition: color 150ms;
}
.nav-link:hover { color: #ffffff; }
.nav-link.active { color: #ffd740; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `fa-beat`
- `fa-bounce`
- `fa-fade`
- `fa-beat-fade`
- `fa-flip`

### Motion Tokens

- **Duration scale:** `0s`, `0ms`, `.1s`, `.15s`, `.2s`, `.25s`, `.3s`, `.35s`, `.4s`, `.45s`, `.5s`, `.55s`, `.6s`, `.65s`, `.7s`, `.75s`, `.8s`, `.85s`, `.9s`, `.95s`, `1ms`, `1s`, `1.05s`, `1.1s`, `1.15s`, `1.2s`, `1.25s`, `1.3s`, `1.35s`, `1.4s`, `1.45s`, `1.5s`, `1.55s`, `1.6s`, `1.65s`, `1.7s`, `1.75s`, `1.8s`, `1.85s`, `1.9s`, `1.95s`, `2s`, `2.05s`, `2.1s`, `2.15s`, `2.2s`, `2.25s`, `2.3s`, `2.35s`, `2.4s`, `2.45s`, `2.5s`, `2.55s`, `2.6s`, `2.65s`, `2.7s`, `2.75s`, `2.8s`, `2.85s`, `2.9s`, `2.95s`, `3s`, `50ms`, `100ms`, `120ms`, `150ms`, `200ms`, `300ms`, `350ms`, `400ms`, `500ms`, `600ms`, `1000ms`
- **Easing functions:** `cubic-bezier(0,0,.2,1)`, `ease`, `cubic-bezier(.25,.25,.75,.75)`, `ease-in`, `ease-out`, `ease-in-out`, `cubic-bezier(.6,-.28,.735,.045)`, `cubic-bezier(.175,.885,.32,1.275)`, `cubic-bezier(.68,-.55,.265,1.55)`, `cubic-bezier(.47,0,.745,.715)`, `cubic-bezier(.39,.575,.565,1)`, `cubic-bezier(.445,.05,.55,.95)`, `cubic-bezier(.55,.085,.68,.53)`, `cubic-bezier(.25,.46,.45,.94)`, `cubic-bezier(.455,.03,.515,.955)`, `linear`, `cubic-bezier(.25,.8,.25,1)`
- **Animated properties:** `filter`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (0s) for micro-interactions, long (1000ms) for page transitions
- **Easing:** Use `cubic-bezier(0,0,.2,1)` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `0 0 0 1px #fff,0 0 0 .25rem rgba(13,110,253,.25)`
- Raised (cards, buttons): `0 4px 8px #0003`
- Raised (cards, buttons): `0 0 0 3px #b586ef`
- Raised (cards, buttons): `0 0#0003,0 0#00000024,0 0#0000001f`
- Raised (cards, buttons): `0 2px 1px -1px #0003,0 1px 1px #00000024,0 1px 3px #0000001f`
- Raised (cards, buttons): `0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 999, 1000, 1020, 1030, 1040, 199999999`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only GTA6-Heading and bootstrap-icons are allowed
- **No arbitrary border-radius** — use the scale: .25rem, .25em, .375rem, 1rem, 2em, 2px, 3px, 4px, 5px, 6px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — GTA6-Heading, bootstrap-icons only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `favicon/white.png`
- **Site URL:** `https://www.ecell.in/esummit/`
- **Brand color:** `#ffd740`
- **Brand typeface:** GTA6-Heading

## Quick Reference

```
Background:     #1f1f1f
Surface:        #000000
Text:           #ffffff / #757575
Accent:         #ffd740
Border:         #424242
Font:           GTA6-Heading
Spacing:        4px grid
Radius:         8px
Components:     0 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for ecell
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "ecell" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# ecell DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 2 · Components: 0
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![ecell Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a warm tone. Depth is expressed through layered shadows and subtle surface color variation. Typography pairs **bootstrap-icons** for display/headings with **GTA6-Heading** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The accent color **#ffd740** anchors interactive elements (buttons, links, focus rings). Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| mdc-chip-disabled-label-text-color | `#1f1f1f` | background | Page background, darkest surface |
| mat-ripple-color | `#000000` | surface | Card and panel backgrounds |
| mdc-plain-tooltip-supporting-text-color | `#ffffff` | text-primary | Headings and body text |
| mat-sort-arrow-color | `#757575` | text-muted | Captions, placeholders, secondary info |
| mdc-switch-disabled-selected-handle-color | `#424242` | border | Dividers, card borders, outlines |
| mat-option-selected-state-label-text-color | `#ffd740` | accent | CTAs, links, focus rings, active states |
| mat-option-selected-state-label-text-color | `#f44336` | danger | Error states, destructive actions |
| bs-success | `#198754` | success | Success states, positive indicators |
| warning | `#bd9f67` | warning | Warning states, caution indicators |
| bs-primary | `#0068ff` | info | Informational highlights |
| mat-option-selected-state-label-text-color | `#673ab7` | unknown | Palette color |
| unknown | `#d1d5db` | unknown | Palette color |
| unknown | `#ff7a1a` | unknown | Palette color |
| unknown | `#243137` | unknown | Palette color |
| bs-warning | `#ffc300` | unknown | Palette color |
| primary-blue | `#ffe100` | unknown | Palette color |
| mdc-chip-elevated-container-color | `#e0e0e0` | unknown | Palette color |
| webgl-page-background | `#0a0a0a` | unknown | Palette color |
| bs-danger | `#dc3545` | unknown | Palette color |
| bs-dark-border-subtle | `#b0b0b0` | unknown | Palette color |

### CSS Variable Tokens

```css
--primary-blue: #FFE100;
--webgl-page-background: #0a0a0a;
--mdc-elevated-card-container-shape: 4px;
--mdc-outlined-card-container-shape: 4px;
--mdc-outlined-card-outline-width: 1px;
--mdc-elevated-card-container-color: white;
--mdc-outlined-card-container-color: white;
--mdc-outlined-card-outline-color: rgba(0,0,0,.12);
--mat-card-subtitle-text-color: rgba(0,0,0,.54);
--mat-card-title-text-font: Roboto,sans-serif;
--mat-card-title-text-line-height: 32px;
--mat-card-title-text-size: 20px;
--mat-card-title-text-tracking: .0125em;
--mat-card-title-text-weight: 500;
--mat-card-subtitle-text-font: Roboto,sans-serif;
--mat-card-subtitle-text-line-height: 22px;
--mat-card-subtitle-text-size: 14px;
--mat-card-subtitle-text-tracking: .0071428571em;
--mat-card-subtitle-text-weight: 500;
--mat-select-panel-background-color: white;
```


---

## 3. Typography Rules

**Font Stack:**
- **GTA6-Heading** — Heading 1, Heading 2, Heading 3
- **bootstrap-icons** — Body, Caption

**Font Sources:**

```css
@font-face {
  font-family: "bootstrap-icons";
  src: url("fonts/bootstrap-icons-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Heading";
  src: url("fonts/GTA6-Heading-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Bold";
  src: url("fonts/GTA6-Bold-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Medium";
  src: url("fonts/GTA6-Medium-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Thin";
  src: url("fonts/GTA6-Thin-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "primeicons";
  src: url("fonts/primeicons-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Satoshi";
  src: url("fonts/Satoshi-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Satoshi";
  src: url("fonts/Satoshi-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Bebas Neue";
  src: url("fonts/BebasNeue-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | GTA6-Heading | 90px | 700 |
| Heading 2 | GTA6-Heading | 5rem | 700 |
| Heading 3 | GTA6-Heading | 4.5rem | 700 |
| Body | bootstrap-icons | 16px | 400 |
| Caption | bootstrap-icons | 1.25rem | 400 |

**Typographic Rules:**
- Limit to 2 font families max per screen
- Use **GTA6-Heading** for body/UI text, **bootstrap-icons** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

No components detected. Scan `src/components/` or `components/` to populate this section.

---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24
- **Border radius:** .25rem, .25em, .375rem, 1rem, 2em, 2px, 3px, 4px, 5%, 5px, 6px, 8px, 10px, 10px 0px 0px 10px, 12px, 15px, 16px, 18px, 20px, 25px, 30px, 100%, inherit
- **Max content width:** 1399.98px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `0 0 0 1px #fff,0 0 0 .25rem rgba(13,110,253,.25)`

### Raised — cards, buttons, interactive elements

- `0 4px 8px #0003`
- `0 0 0 3px #b586ef`
- `0 0#0003,0 0#00000024,0 0#0000001f`

### Floating — dropdowns, popovers, modals

- `0 4px 15px #ff7a1a33`
- `0 7px 13px -3px #000000bf`
- `0 10px 10px 1px #000000bf`

### Overlay — full-screen overlays, top-level dialogs

- `0 10px 30px #ff7a1a26`
- `0 8px 25px #ff7a1a66`
- `0 7px 8px -4px #0003,0 12px 17px 2px #00000024,0 5px 22px 4px #0000001f`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 999, 1000, 1020, 1030, 1040, 199999999`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes fa-beat`
- `@keyframes fa-bounce`
- `@keyframes fa-fade`
- `@keyframes fa-beat-fade`
- `@keyframes fa-flip`
- `@keyframes fa-shake`
- `@keyframes fa-spin`
- `@keyframes fadeOut`

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#ffd740` for interactive elements (buttons, links, focus rings)
- Use `#1f1f1f` as the primary page background
- Pair **GTA6-Heading** (body) with **bootstrap-icons** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: .25rem, .25em, .375rem, 1rem, 2em

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond GTA6-Heading and bootstrap-icons
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| xs | 480px | css |
| sm | 500px | css |
| sm | 575.98px | css |
| sm | 576px | css |
| md | 676px | css |
| md | 767px | css |
| md | 767.98px | css |
| md | 768px | css |
| lg | 786px | css |
| lg | 900px | css |
| lg | 991.98px | css |
| lg | 992px | css |
| lg | 1000px | css |
| xl | 1060px | css |
| xl | 1100px | css |
| xl | 1199.98px | css |
| xl | 1200px | css |
| 2xl | 1399.98px | css |
| 2xl | 1400px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #000000
Border: 1px solid #424242
Radius: 8px
Padding: 16px
Font: GTA6-Heading
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #ffd740, text white
Ghost: bg transparent, border #424242
Padding: 8px 16px
Radius: 8px
Hover: opacity 0.9 or lighter shade
Focus: ring with #ffd740
```

### Build a Page Layout

```
Background: #1f1f1f
Max-width: 1399.98px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #000000
Label: #757575 (muted, 12px, uppercase)
Value: #ffffff (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #1f1f1f
Input border: 1px solid #424242
Focus: border-color #ffd740
Label: #757575 12px
Spacing: 16px between fields
Radius: 8px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: GTA6-Heading, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Visual Guide — Screenshots (VISUAL_GUIDE.md)

# ecell — Visual Guide

> Master visual reference. Study every screenshot carefully before implementing any UI.
> Match colors, layout, typography, spacing, and motion states exactly.

**Motion Stack:** **Web Animations API (149 active)**

**WebGL/3D:** Detected (4 canvas elements) — replicate with Three.js or CSS 3D transforms

## Scroll Journey

The page has cinematic scroll animations. Each screenshot below shows the exact visual state at that scroll depth.
**Replicate these transitions precisely** — the design changes dramatically as you scroll.

### Hero — Above the fold

*Scroll position: 0px of 900px total*

![Hero — Above the fold](../screens/scroll/scroll-000.png)

### 17% scroll depth

*Scroll position: 0px of 900px total*

![17% scroll depth](../screens/scroll/scroll-017.png)

### 33% scroll depth

*Scroll position: 0px of 900px total*

![33% scroll depth](../screens/scroll/scroll-033.png)

### 50% scroll depth

*Scroll position: 0px of 900px total*

![50% scroll depth](../screens/scroll/scroll-050.png)

### 67% scroll depth

*Scroll position: 0px of 900px total*

![67% scroll depth](../screens/scroll/scroll-067.png)

### 83% scroll depth

*Scroll position: 0px of 900px total*

![83% scroll depth](../screens/scroll/scroll-083.png)

### Footer — End of page

*Scroll position: 0px of 900px total*

![Footer — End of page](../screens/scroll/scroll-100.png)

## Full Page Screenshots

### E-Summit 2026 | E-Cell IIT Bombay

*URL: `https://www.ecell.in/esummit/`*

![E-Summit 2026 | E-Cell IIT Bombay](../screens/pages/esummit.png)

### E-Cell - Creating Job Creators

*URL: `https://www.ecell.in/`*

![E-Cell - Creating Job Creators](../screens/pages/home.png)

### Events | E-Summit 2026 | E-Cell IIT Bombay

*URL: `https://www.ecell.in/esummit/events`*

![Events | E-Summit 2026 | E-Cell IIT Bombay](../screens/pages/esummit-events.png)

### Accommodation | E-Summit 2026 | E-Cell IIT Bombay

*URL: `https://www.ecell.in/esummit/acco`*

![Accommodation | E-Summit 2026 | E-Cell IIT Bombay](../screens/pages/esummit-acco.png)

### Sponsors | E-Summit 2026 | E-Cell IIT Bombay

*URL: `https://www.ecell.in/esummit/sponsors`*

![Sponsors | E-Summit 2026 | E-Cell IIT Bombay](../screens/pages/esummit-sponsors.png)

## Section Screenshots

Clipped sections showing individual components in context.

### Section 2 — `header`

*1440×900px*

![Section 2](../screens/sections/esummit-section-2.png)

### Section 3 — `[class*="hero"]`

*1440×900px*

![Section 3](../screens/sections/home-section-3.png)

### Section 1 — `section`

*1400×1200px*

![Section 1](../screens/sections/esummit-events-section-1.png)

### Section 1 — `section`

*1440×1200px*

![Section 1](../screens/sections/esummit-acco-section-1.png)

### Section 5 — `[class*="hero"]`

*1365×940px*

![Section 5](../screens/sections/esummit-acco-section-5.png)

## Animations & Motion (ANIMATIONS.md)

# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library | Type | Notes |
|---------|------|-------|
| **Web Animations API (149 active)** | animation |  |
| Canvas (4 elements) | WebGL/3D | WebGL context detected — likely Three.js or custom shader |

## Scroll Journey

The page is **900px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero
Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section
Scroll position: 0px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section
Scroll position: 0px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page
Scroll position: 0px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content
Scroll position: 0px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer
Scroll position: 0px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer
Scroll position: 0px

![Scroll 100%](../screens/scroll/scroll-100.png)

## Scroll Animation Patterns

| Pattern | Library | Element Count | Duration | Delay | Easing |
|---------|---------|---------------|----------|-------|--------|
| sunrise | AOS | 1 | 2000 | 0 | — |
| fade-up | AOS | 2 | 1200 | 300 | — |

### AOS Implementation

```html
<!-- Add to <head> -->
<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">

<!-- Add before </body> -->
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>AOS.init({ once: true, offset: 80 });</script>
```

```html
<div data-aos="sunrise" data-aos-duration="2000" data-aos-delay="0">...</div>
```

```html
<div data-aos="fade-up" data-aos-duration="1200" data-aos-delay="300">...</div>
```

## CSS Keyframes (93 extracted)

### `@keyframes swal2-animate-error-icon`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-error.swal2-icon-show`, `div:where(.swal2-icon).swal2-warning.swal2-icon-show`, `div:where(.swal2-icon).swal2-info.swal2-icon-show`, `div:where(.swal2-icon).swal2-question.swal2-icon-show`

```css
@keyframes swal2-animate-error-icon {
  0% {
    transform: rotateX(100deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-animate-error-icon`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-error.swal2-icon-show`, `div:where(.swal2-icon).swal2-warning.swal2-icon-show`, `div:where(.swal2-icon).swal2-info.swal2-icon-show`, `div:where(.swal2-icon).swal2-question.swal2-icon-show`

```css
@keyframes swal2-animate-error-icon {
  0% {
    transform: rotateX(100deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes fa-spin`

Duration: `var(--fa-animation-duration,2s)` · Easing: `var(--fa-animation-timing,linear)` · Delay: `0s` · Iteration: `var(--fa-animation-iteration-count,infinite)` · Fill: `none`

Used by: `.fa-spin`, `.fa-pulse, .fa-spin-pulse`, `.pi-spin`

```css
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes fa-spin`

Duration: `var(--fa-animation-duration,2s)` · Easing: `var(--fa-animation-timing,linear)` · Delay: `0s` · Iteration: `var(--fa-animation-iteration-count,infinite)` · Fill: `none`

Used by: `.fa-spin`, `.fa-pulse, .fa-spin-pulse`, `.pi-spin`

```css
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes fa-spin`

Duration: `var(--fa-animation-duration,2s)` · Easing: `var(--fa-animation-timing,linear)` · Delay: `0s` · Iteration: `var(--fa-animation-iteration-count,infinite)` · Fill: `none`

Used by: `.fa-spin`, `.fa-pulse, .fa-spin-pulse`, `.pi-spin`

```css
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes fa-spin`

Duration: `var(--fa-animation-duration,2s)` · Easing: `var(--fa-animation-timing,linear)` · Delay: `0s` · Iteration: `var(--fa-animation-iteration-count,infinite)` · Fill: `none`

Used by: `.fa-spin`, `.fa-pulse, .fa-spin-pulse`, `.pi-spin`

```css
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes fa-spin`

Duration: `var(--fa-animation-duration,2s)` · Easing: `var(--fa-animation-timing,linear)` · Delay: `0s` · Iteration: `var(--fa-animation-iteration-count,infinite)` · Fill: `none`

Used by: `.fa-spin`, `.fa-pulse, .fa-spin-pulse`, `.pi-spin`

```css
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_shutterTravel`

Duration: `6s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.shutter-pulse-0[_ngcontent-ng-c556426719]`, `.shutter-pulse-1[_ngcontent-ng-c556426719]`, `.shutter-pulse-2[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_shutterTravel {
  0%, 100% {
    opacity: 0.3;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.8);
  }
}
```

> Opacity fade · Filter effect (blur/brightness)

### `@keyframes swal2-animate-i-mark`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content`, `div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content`

```css
@keyframes swal2-animate-i-mark {
  0% {
    transform: rotateZ(45deg);
    opacity: 0;
  }
  25% {
    transform: rotateZ(-25deg);
    opacity: 0.4;
  }
  50% {
    transform: rotateZ(15deg);
    opacity: 0.8;
  }
  75% {
    transform: rotateZ(-5deg);
    opacity: 1;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-animate-i-mark`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content`, `div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content`

```css
@keyframes swal2-animate-i-mark {
  0% {
    transform: rotateZ(45deg);
    opacity: 0;
  }
  25% {
    transform: rotateZ(-25deg);
    opacity: 0.4;
  }
  50% {
    transform: rotateZ(15deg);
    opacity: 0.8;
  }
  75% {
    transform: rotateZ(-5deg);
    opacity: 1;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c556426719_heavyRotation`

Duration: `38s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.dominant-orbit[_ngcontent-ng-c556426719]`, `.secondary-orbit[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_heavyRotation {
  0% {
    transform: rotate(35deg);
  }
  50% {
    transform: rotate(55deg);
  }
  100% {
    transform: rotate(35deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_orbitDash`

Duration: `20s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.orbit-primary[_ngcontent-ng-c556426719]`, `.orbit-secondary[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_orbitDash {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -1000;
  }
}
```

> SVG stroke animation

### `@keyframes _ngcontent-ng-c556426719_energyPacket`

Duration: `2s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.energy-flow[_ngcontent-ng-c556426719]`, `.energy-flow-2[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_energyPacket {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -400;
  }
}
```

> SVG stroke animation

### `@keyframes _ngcontent-ng-c2631132637_carousel-scroll-left`

Duration: `75s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.page-view[_ngcontent-ng-c2631132637] .sponsors-track.left-track[_ngcontent-ng-c`, `.page-view[_ngcontent-ng-c2631132637] .investors-track.left-track[_ngcontent-ng-`

```css
@keyframes _ngcontent-ng-c2631132637_carousel-scroll-left {
  0% {
    transform: translate(0px);
  }
  100% {
    transform: translate(-50%);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c2631132637_carousel-scroll-right`

Duration: `75s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.page-view[_ngcontent-ng-c2631132637] .sponsors-track.right-track[_ngcontent-ng-`, `.page-view[_ngcontent-ng-c2631132637] .investors-track.right-track[_ngcontent-ng`

```css
@keyframes _ngcontent-ng-c2631132637_carousel-scroll-right {
  0% {
    transform: translate(-50%);
  }
  100% {
    transform: translate(0px);
  }
}
```

> Transform/motion animation

### `@keyframes progress-bar-stripes`

Duration: `1s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.progress-bar-animated`

```css
@keyframes progress-bar-stripes {
  0% {
    background-position-x: 1rem;
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes placeholder-glow`

Duration: `2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.placeholder-glow .placeholder`

```css
@keyframes placeholder-glow {
  50% {
    opacity: 0.2;
  }
}
```

> Opacity fade

### `@keyframes placeholder-wave`

Duration: `2s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.placeholder-wave`

```css
@keyframes placeholder-wave {
  100% {
    -webkit-mask-position-x: -200%;
    -webkit-mask-position-y: 0%;
  }
}
```

### `@keyframes fa-beat`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,ease-in-out)` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-beat`

```css
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale,1.25));
  }
}
```

> Transform/motion animation

### `@keyframes fa-beat`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,ease-in-out)` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-beat`

```css
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale,1.25));
  }
}
```

> Transform/motion animation

### `@keyframes fa-bounce`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,cubic-bezier(.28,.84,.42,1))` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-bounce`

```css
@keyframes fa-bounce {
  0% {
    transform: scale(1) translateY(0px);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x,1.1),var(--fa-bounce-start-scale-y,.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x,.9),var(--fa-bounce-jump-scale-y,1.1)) translateY(var(--fa-bounce-height,-.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x,1.05),var(--fa-bounce-land-scale-y,.95)) translateY(0);
  }
  57% {
    transform: scale(1) translateY(var(--fa-bounce-rebound,-.125em));
  }
  64% {
    transform: scale(1) translateY(0px);
  }
  100% {
    transform: scale(1) translateY(0px);
  }
}
```

> Transform/motion animation

### `@keyframes fa-bounce`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,cubic-bezier(.28,.84,.42,1))` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-bounce`

```css
@keyframes fa-bounce {
  0% {
    transform: scale(1) translateY(0px);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x,1.1),var(--fa-bounce-start-scale-y,.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x,.9),var(--fa-bounce-jump-scale-y,1.1)) translateY(var(--fa-bounce-height,-.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x,1.05),var(--fa-bounce-land-scale-y,.95)) translateY(0);
  }
  57% {
    transform: scale(1) translateY(var(--fa-bounce-rebound,-.125em));
  }
  64% {
    transform: scale(1) translateY(0px);
  }
  100% {
    transform: scale(1) translateY(0px);
  }
}
```

> Transform/motion animation

### `@keyframes fa-fade`

Easing: `var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-fade`

```css
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity,.4);
  }
}
```

> Opacity fade

### `@keyframes fa-fade`

Easing: `var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-fade`

```css
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity,.4);
  }
}
```

> Opacity fade

### `@keyframes fa-beat-fade`

Easing: `var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-beat-fade`

```css
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity,.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale,1.125));
  }
}
```

> Fade + motion enter animation

### `@keyframes fa-beat-fade`

Easing: `var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-beat-fade`

```css
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity,.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale,1.125));
  }
}
```

> Fade + motion enter animation

### `@keyframes fa-flip`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,ease-in-out)` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-flip`

```css
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),var(--fa-flip-angle,-180deg));
  }
}
```

> Transform/motion animation

### `@keyframes fa-flip`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,ease-in-out)` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-flip`

```css
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),var(--fa-flip-angle,-180deg));
  }
}
```

> Transform/motion animation

### `@keyframes fa-shake`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,linear)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-shake`

```css
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes fa-shake`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,linear)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-shake`

```css
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-show`

Duration: `0.3s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-show`

```css
@keyframes swal2-show {
  0% {
    transform: translate3d(0px, -50px, 0px) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: translate3d(0px, 0px, 0px) scale(1);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-hide`

Duration: `0.15s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.swal2-hide`

```css
@keyframes swal2-hide {
  0% {
    transform: translate3d(0px, 0px, 0px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate3d(0px, -50px, 0px) scale(0.9);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-animate-success-line-tip`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip`

```css
@keyframes swal2-animate-success-line-tip {
  0% {
    top: 1.1875em;
    left: 0.0625em;
    width: 0px;
  }
  54% {
    top: 1.0625em;
    left: 0.125em;
    width: 0px;
  }
  70% {
    top: 2.1875em;
    left: -0.375em;
    width: 3.125em;
  }
  84% {
    top: 3em;
    left: 1.3125em;
    width: 1.0625em;
  }
  100% {
    top: 2.8125em;
    left: 0.8125em;
    width: 1.5625em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-animate-success-line-long`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long`

```css
@keyframes swal2-animate-success-line-long {
  0% {
    top: 3.375em;
    right: 2.875em;
    width: 0px;
  }
  65% {
    top: 3.375em;
    right: 2.875em;
    width: 0px;
  }
  84% {
    top: 2.1875em;
    right: 0px;
    width: 3.4375em;
  }
  100% {
    top: 2.375em;
    right: 0.5em;
    width: 2.9375em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-rotate-success-circular-line`

Duration: `4.25s` · Easing: `ease-in` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-lin`

```css
@keyframes swal2-rotate-success-circular-line {
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-animate-error-x-mark`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark`

```css
@keyframes swal2-animate-error-x-mark {
  0% {
    margin-top: 1.625em;
    transform: scale(0.4);
    opacity: 0;
  }
  50% {
    margin-top: 1.625em;
    transform: scale(0.4);
    opacity: 0;
  }
  80% {
    margin-top: -0.375em;
    transform: scale(1.15);
  }
  100% {
    margin-top: 0px;
    transform: scale(1);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-rotate-loading`

Duration: `1.5s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `div:where(.swal2-container) div:where(.swal2-loader)`

```css
@keyframes swal2-rotate-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-animate-question-mark`

Duration: `0.8s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content`

```css
@keyframes swal2-animate-question-mark {
  0% {
    transform: rotateY(-360deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-toast-show`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast.swal2-show`

```css
@keyframes swal2-toast-show {
  0% {
    transform: translateY(-0.625em) rotateZ(2deg);
  }
  33% {
    transform: translateY(0px) rotateZ(-2deg);
  }
  66% {
    transform: translateY(0.3125em) rotateZ(2deg);
  }
  100% {
    transform: translateY(0px) rotateZ(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-toast-hide`

Duration: `0.1s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.swal2-toast.swal2-hide`

```css
@keyframes swal2-toast-hide {
  100% {
    transform: rotateZ(1deg);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-toast-animate-success-line-tip`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip`

```css
@keyframes swal2-toast-animate-success-line-tip {
  0% {
    top: 0.5625em;
    left: 0.0625em;
    width: 0px;
  }
  54% {
    top: 0.125em;
    left: 0.125em;
    width: 0px;
  }
  70% {
    top: 0.625em;
    left: -0.25em;
    width: 1.625em;
  }
  84% {
    top: 1.0625em;
    left: 0.75em;
    width: 0.5em;
  }
  100% {
    top: 1.125em;
    left: 0.1875em;
    width: 0.75em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-toast-animate-success-line-long`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long`

```css
@keyframes swal2-toast-animate-success-line-long {
  0% {
    top: 1.625em;
    right: 1.375em;
    width: 0px;
  }
  65% {
    top: 1.25em;
    right: 0.9375em;
    width: 0px;
  }
  84% {
    top: 0.9375em;
    right: 0px;
    width: 1.125em;
  }
  100% {
    top: 0.9375em;
    right: 0.1875em;
    width: 1.375em;
  }
}
```

> Dimension expand/collapse

### `@keyframes fadeOut`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `#first_page_loading.fade-out`

```css
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
```

> Opacity fade

### `@keyframes cdk-text-field-autofill-start`

Duration: `0s` · Easing: `ease` · Delay: `1ms` · Iteration: `1` · Fill: `none`

Used by: `.cdk-text-field-autofill-monitored:-webkit-autofill`

```css
@keyframes cdk-text-field-autofill-start {
}
```

### `@keyframes cdk-text-field-autofill-end`

Duration: `0s` · Easing: `ease` · Delay: `1ms` · Iteration: `1` · Fill: `none`

Used by: `.cdk-text-field-autofill-monitored:not(:-webkit-autofill)`

```css
@keyframes cdk-text-field-autofill-end {
}
```

### `@keyframes swal2-show`

Duration: `0.3s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-show`

```css
@keyframes swal2-show {
  0% {
    transform: scale(0.7);
  }
  45% {
    transform: scale(1.05);
  }
  80% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-hide`

Duration: `0.15s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.swal2-hide`

```css
@keyframes swal2-hide {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.5);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-animate-success-line-tip`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip`

```css
@keyframes swal2-animate-success-line-tip {
  0% {
    top: 1.1875em;
    left: 0.0625em;
    width: 0px;
  }
  54% {
    top: 1.0625em;
    left: 0.125em;
    width: 0px;
  }
  70% {
    top: 2.1875em;
    left: -0.375em;
    width: 3.125em;
  }
  84% {
    top: 3em;
    left: 1.3125em;
    width: 1.0625em;
  }
  100% {
    top: 2.8125em;
    left: 0.8125em;
    width: 1.5625em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-animate-success-line-long`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long`

```css
@keyframes swal2-animate-success-line-long {
  0% {
    top: 3.375em;
    right: 2.875em;
    width: 0px;
  }
  65% {
    top: 3.375em;
    right: 2.875em;
    width: 0px;
  }
  84% {
    top: 2.1875em;
    right: 0px;
    width: 3.4375em;
  }
  100% {
    top: 2.375em;
    right: 0.5em;
    width: 2.9375em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-rotate-success-circular-line`

Duration: `4.25s` · Easing: `ease-in` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-lin`

```css
@keyframes swal2-rotate-success-circular-line {
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-animate-error-x-mark`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark`

```css
@keyframes swal2-animate-error-x-mark {
  0% {
    margin-top: 1.625em;
    transform: scale(0.4);
    opacity: 0;
  }
  50% {
    margin-top: 1.625em;
    transform: scale(0.4);
    opacity: 0;
  }
  80% {
    margin-top: -0.375em;
    transform: scale(1.15);
  }
  100% {
    margin-top: 0px;
    transform: scale(1);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-rotate-loading`

Duration: `1.5s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `div:where(.swal2-container) div:where(.swal2-loader)`

```css
@keyframes swal2-rotate-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-animate-question-mark`

Duration: `0.8s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content`

```css
@keyframes swal2-animate-question-mark {
  0% {
    transform: rotateY(-360deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-toast-show`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast.swal2-show`

```css
@keyframes swal2-toast-show {
  0% {
    transform: translateY(-0.625em) rotateZ(2deg);
  }
  33% {
    transform: translateY(0px) rotateZ(-2deg);
  }
  66% {
    transform: translateY(0.3125em) rotateZ(2deg);
  }
  100% {
    transform: translateY(0px) rotateZ(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-toast-hide`

Duration: `0.1s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.swal2-toast.swal2-hide`

```css
@keyframes swal2-toast-hide {
  100% {
    transform: rotateZ(1deg);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-toast-animate-success-line-tip`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip`

```css
@keyframes swal2-toast-animate-success-line-tip {
  0% {
    top: 0.5625em;
    left: 0.0625em;
    width: 0px;
  }
  54% {
    top: 0.125em;
    left: 0.125em;
    width: 0px;
  }
  70% {
    top: 0.625em;
    left: -0.25em;
    width: 1.625em;
  }
  84% {
    top: 1.0625em;
    left: 0.75em;
    width: 0.5em;
  }
  100% {
    top: 1.125em;
    left: 0.1875em;
    width: 0.75em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-toast-animate-success-line-long`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long`

```css
@keyframes swal2-toast-animate-success-line-long {
  0% {
    top: 1.625em;
    right: 1.375em;
    width: 0px;
  }
  65% {
    top: 1.25em;
    right: 0.9375em;
    width: 0px;
  }
  84% {
    top: 0.9375em;
    right: 0px;
    width: 1.125em;
  }
  100% {
    top: 0.9375em;
    right: 0.1875em;
    width: 1.375em;
  }
}
```

> Dimension expand/collapse

### `@keyframes _ngcontent-ng-c1538231108_traceOutline`

Duration: `3s` · Easing: `cubic-bezier(0.4, 0, 0.2, 1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.loader-logo-container[_ngcontent-ng-c1538231108] .logo-outline[_ngcontent-ng-c1`

```css
@keyframes _ngcontent-ng-c1538231108_traceOutline {
  0% {
    stroke-dashoffset: 3000;
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
  60% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  80% {
    stroke-dashoffset: 0;
    opacity: 0.8;
  }
  100% {
    stroke-dashoffset: -3000;
    opacity: 0.3;
  }
}
```

> Opacity fade · SVG stroke animation

### `@keyframes _ngcontent-ng-c1538231108_fillLeftToRight`

Duration: `3s` · Easing: `cubic-bezier(0.4, 0, 0.2, 1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.loader-logo-container[_ngcontent-ng-c1538231108] .logo-filled[_ngcontent-ng-c15`

```css
@keyframes _ngcontent-ng-c1538231108_fillLeftToRight {
  0% {
    clip-path: inset(0px 100% 0px 0px);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  50% {
    clip-path: inset(0px 0% 0px 0px);
    opacity: 1;
  }
  75% {
    clip-path: inset(0px 0% 0px 0px);
    opacity: 1;
  }
  95% {
    clip-path: inset(0px 0px 0px 100%);
    opacity: 0;
  }
  100% {
    clip-path: inset(0px 100% 0px 0px);
    opacity: 0;
  }
}
```

> Opacity fade · Clip-path reveal

### `@keyframes _ngcontent-ng-c556426719_bgDrift0`

Duration: `180s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.bg-drift-0[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_bgDrift0 {
  0% {
    transform: rotate(0deg);
    transform-origin: 500px 500px;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: 500px 500px;
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_bgDrift1`

Duration: `220s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.bg-drift-1[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_bgDrift1 {
  0% {
    transform: rotate(0deg);
    transform-origin: 500px 500px;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: 500px 500px;
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_bgDrift2`

Duration: `150s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.bg-drift-2[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_bgDrift2 {
  0% {
    transform: rotate(0deg);
    transform-origin: 500px 500px;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: 500px 500px;
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_bgDrift3`

Duration: `280s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.bg-drift-3[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_bgDrift3 {
  0% {
    transform: rotate(0deg);
    transform-origin: 500px 500px;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: 500px 500px;
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_innerRingSpin`

Duration: `25s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.inner-ring[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_innerRingSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_nucleusJitter`

Duration: `14s` · Easing: `cubic-bezier(0.42, 0, 0.58, 1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.nucleus-assembly[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_nucleusJitter {
  0%, 100% {
    transform: translate(0px);
  }
  25% {
    transform: translate(35px, -30px);
  }
  50% {
    transform: translate(-20px, 25px);
  }
  75% {
    transform: translate(25px, 15px);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_gyroSweep1`

Duration: `12s` · Easing: `cubic-bezier(0.45, 0.05, 0.55, 0.95)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.gyro-sweep-1[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_gyroSweep1 {
  0% {
    transform: rotate(0deg) scaleY(1);
  }
  25% {
    transform: rotate(90deg) scaleY(0.7);
  }
  50% {
    transform: rotate(180deg) scaleY(1.2);
  }
  75% {
    transform: rotate(270deg) scaleY(0.8);
  }
  100% {
    transform: rotate(360deg) scaleY(1);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_gyroSweep2`

Duration: `8s` · Easing: `cubic-bezier(0.45, 0.05, 0.55, 0.95)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.gyro-sweep-2[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_gyroSweep2 {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_satOrbit`

Duration: `200s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.sat-rotate[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_satOrbit {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_satPulse`

Duration: `4s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.sat-pulse[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_satPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c2631132637_fadeOut`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `#first_page_loading.fade-out[_ngcontent-ng-c2631132637]`

```css
@keyframes _ngcontent-ng-c2631132637_fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
```

> Opacity fade

### `@keyframes _ngcontent-ng-c2631132637_rotate-3d-carousel-1`

Duration: `60s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.wheel-1[_ngcontent-ng-c2631132637]`

```css
@keyframes _ngcontent-ng-c2631132637_rotate-3d-carousel-1 {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(-360deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c2631132637_rotate-3d-carousel-2`

Duration: `60s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.wheel-2[_ngcontent-ng-c2631132637]`

```css
@keyframes _ngcontent-ng-c2631132637_rotate-3d-carousel-2 {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c255798220_cinematicReveal`

Duration: `1.8s` · Easing: `cubic-bezier(0.16, 1, 0.3, 1)` · Delay: `0.8s` · Iteration: `1` · Fill: `both`

Used by: `.header[_ngcontent-ng-c255798220] .hero-content[_ngcontent-ng-c255798220] .logo[`

```css
@keyframes _ngcontent-ng-c255798220_cinematicReveal {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c255798220_slideUp`

Duration: `1s` · Easing: `cubic-bezier(0.16, 1, 0.3, 1)` · Delay: `1.2s` · Iteration: `1` · Fill: `both`

Used by: `.header[_ngcontent-ng-c255798220] .hero-content[_ngcontent-ng-c255798220] .hero-`

```css
@keyframes _ngcontent-ng-c255798220_slideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c1274894921_contentFade`

Duration: `0.5s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.stats-split-section[_ngcontent-ng-c1274894921] .right-half-content[_ngcontent-n`

```css
@keyframes _ngcontent-ng-c1274894921_contentFade {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c3300627814_scroll-up`

Duration: `35s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.track-up[_ngcontent-ng-c3300627814]`

```css
@keyframes _ngcontent-ng-c3300627814_scroll-up {
  0% {
    transform: translateZ(0px);
  }
  100% {
    transform: translate3d(0px, -50%, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c3559033405_glowFloat`

Duration: `5s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.flare-glow[_ngcontent-ng-c3559033405]`

```css
@keyframes _ngcontent-ng-c3559033405_glowFloat {
  0% {
    transform: translate(-3%, 5px) scale(0.95);
  }
  50% {
    transform: translate(3%, -8px) scale(1.05);
  }
  100% {
    transform: translate(-2%, -2px) scale(1);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c3559033405_floatFlame1`

Duration: `7s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.flame-1[_ngcontent-ng-c3559033405]`

```css
@keyframes _ngcontent-ng-c3559033405_floatFlame1 {
  0% {
    transform: translate(0px) scale(0.9);
    opacity: 0;
  }
  20% {
    opacity: 0.9;
  }
  50% {
    transform: translate(20px, -5px) scale(1.1);
    opacity: 0.7;
  }
  80% {
    opacity: 0.3;
  }
  100% {
    transform: translate(35px, -10px) scale(0.9);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c3559033405_floatFlame2`

Duration: `9s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.flame-2[_ngcontent-ng-c3559033405]`

```css
@keyframes _ngcontent-ng-c3559033405_floatFlame2 {
  0% {
    transform: translate(0px) scale(0.85);
    opacity: 0;
  }
  30% {
    opacity: 0.8;
  }
  60% {
    transform: translate(-30px, -8px) scale(1.15);
    opacity: 0.6;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    transform: translate(-45px, -12px) scale(0.8);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c3559033405_floatFlame3`

Duration: `5s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.flame-3[_ngcontent-ng-c3559033405]`

```css
@keyframes _ngcontent-ng-c3559033405_floatFlame3 {
  0% {
    transform: translate(0px) scale(0.8);
    opacity: 0;
  }
  25% {
    opacity: 0.95;
  }
  50% {
    transform: translate(-10px, -10px) scale(1.2);
    opacity: 0.8;
  }
  75% {
    opacity: 0.4;
  }
  100% {
    transform: translate(5px, -15px) scale(0.8);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes spinner-border`

```css
@keyframes spinner-border {
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes spinner-grow`

```css
@keyframes spinner-grow {
  0% {
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: none;
  }
}
```

> Fade + motion enter animation

### `@keyframes p-icon-spin`

```css
@keyframes p-icon-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes p-icon-spin`

```css
@keyframes p-icon-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes p-icon-spin`

```css
@keyframes p-icon-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes ripple`

```css
@keyframes ripple {
  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}
```

> Fade + motion enter animation

### `@keyframes mdc-linear-progress-buffering`

```css
@keyframes mdc-linear-progress-buffering {
}
```

### `@keyframes _ngcontent-ng-c1601828135_parallaxMove`

```css
@keyframes _ngcontent-ng-c1601828135_parallaxMove {
  0%, 100% {
    transform: scale(1) translateY(0px);
  }
  50% {
    transform: scale(1.05) translateY(-10px);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c1601828135_shimmer`

```css
@keyframes _ngcontent-ng-c1601828135_shimmer {
  0% {
    opacity: 0.85;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes _ngcontent-ng-c2631132637_border-anim-short`

```css
@keyframes _ngcontent-ng-c2631132637_border-anim-short {
  0% {
    --bg-rot-angle: 0deg;
  }
  10% {
    --bg-rot-angle: 30deg;
  }
  40% {
    --bg-rot-angle: 150deg;
  }
  60% {
    --bg-rot-angle: 210deg;
  }
  90% {
    --bg-rot-angle: 330deg;
  }
  100% {
    --bg-rot-angle: 360deg;
  }
}
```

### `@keyframes charDropIn`

```css
@keyframes charDropIn {
  0% {
    opacity: 0;
    transform: translateY(35px);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes rzp-rot`

```css
@keyframes rzp-rot {
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes rzp-rot`

```css
@keyframes rzp-rot {
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

## Motion Tokens (CSS Variables)

### Animation Tokens

```css
--swal2-show-animation: swal2-show 0.3s;
--swal2-hide-animation: swal2-hide 0.15s forwards;
--swal2-toast-show-animation: swal2-toast-show 0.5s;
--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;
```

### Other Tokens

```css
--swal2-backdrop-transition: background-color 0.15s;
--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;
--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;
--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;
```

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
transition: background-position 0.15s ease-in-out;
transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
transition: opacity 0.15s linear;
transition: height 0.35s;
transition: width 0.35s;
transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
transition: var(--bs-navbar-toggler-transition);
transition: var(--bs-accordion-transition);
transition: var(--bs-accordion-btn-icon-transition);
```

## How to Recreate This Motion Design

### Step 1 — Install Dependencies

```bash
```

### Step 2 — Scroll-Reveal Pattern

Elements that animate into view follow this pattern:

```css
/* Initial hidden state */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **WebGL/3D layer detected** — product visualizations use Three.js or custom WebGL. Use `<canvas>` with Three.js for 3D product renders
- **Canvas elements (4)** — animated via requestAnimationFrame loop. Use canvas for particle effects, gradient animations, and WebGL scenes
- **Duration scale:** `0.15s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`0px`) → `screens/scroll/scroll-017.png`
- **33%** (`0px`) → `screens/scroll/scroll-033.png`
- **50%** (`0px`) → `screens/scroll/scroll-050.png`
- **67%** (`0px`) → `screens/scroll/scroll-067.png`
- **83%** (`0px`) → `screens/scroll/scroll-083.png`
- **100%** (`0px`) → `screens/scroll/scroll-100.png`

## Layout & Grid (LAYOUT.md)

# Layout Reference

> Auto-extracted from live DOM. Use this to understand how the site is structured spatially.

## Spacing System

**Base grid:** 4px

**Scale:** `2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30` px

| Spacing | Semantic Use |
|---------|-------------|
| 4px | Tight — within a component |
| 8px | Medium — between sibling items |
| 16px | Wide — between sections |
| 32px | Vast — major section breaks |

## Flex Layouts

| Element | Direction | Justify | Align | Gap | Children |
|---------|-----------|---------|-------|-----|----------|
| `nav.fullscreen-navbar` | row | space-between | center | — | 3 |
| `header.header` | column | center | center | — | 4 |
| `div.sponsors-3d-container` | row | center | center | — | 2 |
| `div.investors-container` | column | — | — | 32px | 2 |
| `section.events-section` | column | — | — | — | 2 |
| `div.reactor-container` | row | center | center | — | 1 |
| `div.animated-header-container.card-heading` | row | center | center | — | 1 |
| `div.curtain-container` | row | — | — | — | 2 |
| `div.hero-content` | column | center | center | — | 2 |
| `div.perspective-card.perspective-1` | column | — | center | — | 2 |
| `div.perspective-card.perspective-2` | column | — | center | — | 2 |
| `div.card-container` | row | center | stretch | 20px | 14 |
| `div.hero-cta.standard` | row | center | — | 24px | 2 |
| `div.card.active` | column | end | — | — | 3 |
| `div.card.next-1` | column | end | — | — | 3 |

## Grid Layouts

| Element | Template Columns | Gap | Children |
|---------|-----------------|-----|----------|
| `div.footer-grid` | `336.578px 240.422px 276.484px 288.516px` | 48px | 4 |

## Structural Containers

### `<nav>` (`nav.fullscreen-navbar`)

```
display:          flex
flex-direction:   row
justify-content:  space-between
align-items:      center
padding:          13px 52px
max-width:        1440px
children:         3
```

### `<footer>` (`footer.footer`)

```
display:          block
children:         3
```

### `<header>` (`header.header`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
max-width:        1440px
children:         4
```

### `<section>` (`section.events-section`)

```
display:          flex
flex-direction:   column
justify-content:  —
align-items:      —
padding:          0px 16px 30px
max-width:        1400px
children:         2
```

### `<nav>` (`nav.nav-links`)

```
display:          flex
flex-direction:   column
justify-content:  —
align-items:      —
gap:              4px
children:         11
```

## Layout Rules

- **Container max-width:** `1440px` — always center with `margin: auto`
- Primary layout system: **Flexbox**
- Secondary layout system: **CSS Grid** (used for card grids and multi-column layouts)
- Every spacing value must be a multiple of **4px**
- Never use arbitrary margin/padding values outside the spacing scale

## Component Patterns (COMPONENTS.md)

# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component | Category | Instances | Key Classes |
|-----------|----------|-----------|-------------|
| **Img Box** | unknown | 42× | `.img-box`, `.ng-star-inserted` |
| **Char Drop Item** | card | 31× | `.char-drop-item` |
| **Ng Star Inserted** | unknown | 14× | `.ng-star-inserted` |
| **Card** | card | 14× | `.card` |
| **Card Banner** | card | 14× | `.card-banner` |
| **Solar Flare Container** | unknown | 14× | `.solar-flare-container` |
| **Flare Glow** | unknown | 14× | `.flare-glow` |
| **Flame 1** | unknown | 14× | `.flame-1`, `.flare-flame` |
| **Flame 2** | unknown | 14× | `.flame-2`, `.flare-flame` |
| **Flame 3** | unknown | 14× | `.flame-3`, `.flare-flame` |
| **Banner Img Wrapper** | unknown | 13× | `.banner-img-wrapper`, `.ng-star-inserted` |
| **Bg Drift 0** | unknown | 5× | `.bg-drift-0` |
| **Bg Drift 1** | unknown | 5× | `.bg-drift-1` |
| **Bg Drift 2** | unknown | 4× | `.bg-drift-2` |
| **Bg Drift 3** | unknown | 4× | `.bg-drift-3` |
| **Heading** | unknown | 4× | `.heading` |
| **Bg Drift 0** | unknown | 3× | `.bg-drift-0` |
| **Bg Drift 1** | unknown | 3× | `.bg-drift-1` |
| **Bg Drift 2** | unknown | 3× | `.bg-drift-2` |
| **Bg Drift 3** | unknown | 3× | `.bg-drift-3` |

## Cards

### Char Drop Item

**Instances found:** 31

**CSS classes:** `.char-drop-item`

**HTML structure:**

```html
<span data-char-idx="0" class="char-drop-item" style="display: inline-block; opacity: 0; background: linear-gradient(rgb(255, 122, 26) 45.48%, rgb(255, 255, 255) 81.9%) text; -webkit-text-fill-color: transparent; color: transparent;">E</span>
```

**Base styles (from design tokens):**

```css
.char-drop-item {
  background: #000000;
  border: 1px solid #424242;
  border-radius: 8px;
  padding: 8px;
}```

### Card

**Instances found:** 14

**CSS classes:** `.card`

**HTML structure:**

```html
<div _ngcontent-ng-c3559033405="" class="card"><div _ngcontent-ng-c3559033405="" class="card-banner"><div _ngcontent-ng-c3559033405="" class="solar-flare-container"><div _ngcontent-ng-c3559033405="" class="flare-glow"></div><div _ngcontent-ng-c3559033405="" class="flare-flame flame-1" style="animation-delay: -4.83606s; animation-duration: 7.76754s;"></div><div _ngcontent-ng-c3559033405="" class="flare-flame flame-2" style="animation-delay: -2.34796s; animation-duration: 10.0441s;"></div><div _ngcontent-ng-c3559033405="" class="flare-flame flame-3" style="animation-delay: -1.09575s; animation-d
```

**Base styles (from design tokens):**

```css
.card {
  background: #000000;
  border: 1px solid #424242;
  border-radius: 8px;
  padding: 8px;
}```

### Card Banner

**Instances found:** 14

**CSS classes:** `.card-banner`

**HTML structure:**

```html
<div _ngcontent-ng-c3559033405="" class="card-banner"><div _ngcontent-ng-c3559033405="" class="solar-flare-container"><div _ngcontent-ng-c3559033405="" class="flare-glow"></div><div _ngcontent-ng-c3559033405="" class="flare-flame flame-1" style="animation-delay: -4.83606s; animation-duration: 7.76754s;"></div><div _ngcontent-ng-c3559033405="" class="flare-flame flame-2" style="animation-delay: -2.34796s; animation-duration: 10.0441s;"></div><div _ngcontent-ng-c3559033405="" class="flare-flame flame-3" style="animation-delay: -1.09575s; animation-duration: 5.86767s;"></div></div><div _ngcontent
```

**Base styles (from design tokens):**

```css
.card-banner {
  background: #000000;
  border: 1px solid #424242;
  border-radius: 8px;
  padding: 8px;
}```

## Other Components

### Img Box

**Instances found:** 42

**CSS classes:** `.img-box` `.ng-star-inserted`

**HTML structure:**

```html
<div _ngcontent-ng-c3300627814="" class="img-box ng-star-inserted" style="background-image: url(&quot;https://2k21.s3.amazonaws.com/images/eurekawinner2.jpg&quot;);"></div>
```

**Base styles (from design tokens):**

```css
.img-box {
  background: #000000;
  padding: 4px;
}```

### Ng Star Inserted

**Instances found:** 14

**CSS classes:** `.ng-star-inserted`

**HTML structure:**

```html
<app-event-card _ngcontent-ng-c2631132637="" appscrollstack="" _nghost-ng-c3559033405="" class="ng-star-inserted" style="will-change: transform, opacity, filter; transform-origin: 50% 100%; transform: perspective(1500px) translateY(150px) scale(0.95) rotateX(0deg); opacity: 0; filter: none;"><div _ngcontent-ng-c3559033405="" class="card"><div _ngcontent-ng-c3559033405="" class="card-banner"><div _ngcontent-ng-c3559033405="" class="solar-flare-container"><div _ngcontent-ng-c3559033405="" class="flare-glow"></div><div _ngcontent-ng-c3559033405="" class="flare-flame flame-1" style="animation-dela
```

**Base styles (from design tokens):**

```css
.ng-star-inserted {
  background: #000000;
  padding: 4px;
}```

### Solar Flare Container

**Instances found:** 14

**CSS classes:** `.solar-flare-container`

**HTML structure:**

```html
<div _ngcontent-ng-c3559033405="" class="solar-flare-container"><div _ngcontent-ng-c3559033405="" class="flare-glow"></div><div _ngcontent-ng-c3559033405="" class="flare-flame flame-1" style="animation-delay: -4.83606s; animation-duration: 7.76754s;"></div><div _ngcontent-ng-c3559033405="" class="flare-flame flame-2" style="animation-delay: -2.34796s; animation-duration: 10.0441s;"></div><div _ngcontent-ng-c3559033405="" class="flare-flame flame-3" style="animation-delay: -1.09575s; animation-duration: 5.86767s;"></div></div>
```

**Base styles (from design tokens):**

```css
.solar-flare-container {
  background: #000000;
  padding: 4px;
}```

### Flare Glow

**Instances found:** 14

**CSS classes:** `.flare-glow`

**HTML structure:**

```html
<div _ngcontent-ng-c3559033405="" class="flare-glow"></div>
```

**Base styles (from design tokens):**

```css
.flare-glow {
  background: #000000;
  padding: 4px;
}```

### Flame 1

**Instances found:** 14

**CSS classes:** `.flame-1` `.flare-flame`

**HTML structure:**

```html
<div _ngcontent-ng-c3559033405="" class="flare-flame flame-1" style="animation-delay: -4.83606s; animation-duration: 7.76754s;"></div>
```

**Base styles (from design tokens):**

```css
.flame-1 {
  background: #000000;
  padding: 4px;
}```

### Flame 2

**Instances found:** 14

**CSS classes:** `.flame-2` `.flare-flame`

**HTML structure:**

```html
<div _ngcontent-ng-c3559033405="" class="flare-flame flame-2" style="animation-delay: -2.34796s; animation-duration: 10.0441s;"></div>
```

**Base styles (from design tokens):**

```css
.flame-2 {
  background: #000000;
  padding: 4px;
}```

### Flame 3

**Instances found:** 14

**CSS classes:** `.flame-3` `.flare-flame`

**HTML structure:**

```html
<div _ngcontent-ng-c3559033405="" class="flare-flame flame-3" style="animation-delay: -1.09575s; animation-duration: 5.86767s;"></div>
```

**Base styles (from design tokens):**

```css
.flame-3 {
  background: #000000;
  padding: 4px;
}```

### Banner Img Wrapper

**Instances found:** 13

**CSS classes:** `.banner-img-wrapper` `.ng-star-inserted`

**HTML structure:**

```html
<div _ngcontent-ng-c3559033405="" class="banner-img-wrapper ng-star-inserted" style="mix-blend-mode: normal; background: transparent;"><img _ngcontent-ng-c3559033405="" class="banner-img-source" style="filter: none;" src="https://2k21.s3.amazonaws.com/esummit26/events/big_images/TTMM_Logo-removebg-preview.png" alt="The Ten Minute Million"></div>
```

**Base styles (from design tokens):**

```css
.banner-img-wrapper {
  background: #000000;
  padding: 4px;
}```

### Bg Drift 0

**Instances found:** 5

**CSS classes:** `.bg-drift-0`

**HTML structure:**

```html
<ellipse _ngcontent-ng-c556426719="" cx="500" cy="500" fill="none" rx="292.98195666396157" ry="113.0709340077639" stroke="#993300" stroke-width="0.8" stroke-dasharray="232.7830714511572 389.1520229274122" opacity="0.18457471770834627" transform="rotate(247.73934383934102 500 500)" class="bg-drift-0"></ellipse>
```

**Base styles (from design tokens):**

```css
.bg-drift-0 {
  background: #000000;
  padding: 4px;
}```

### Bg Drift 1

**Instances found:** 5

**CSS classes:** `.bg-drift-1`

**HTML structure:**

```html
<ellipse _ngcontent-ng-c556426719="" cx="500" cy="500" fill="none" rx="299.3662459726747" ry="129.14603673610983" stroke="#1A0000" stroke-width="0.8" stroke-dasharray="104.4268769702165 170.48562789636853" opacity="0.19211099033459517" transform="rotate(3.5107547052301236 500 500)" class="bg-drift-1"></ellipse>
```

**Base styles (from design tokens):**

```css
.bg-drift-1 {
  background: #000000;
  padding: 4px;
}```

### Bg Drift 2

**Instances found:** 4

**CSS classes:** `.bg-drift-2`

**HTML structure:**

```html
<ellipse _ngcontent-ng-c556426719="" cx="500" cy="500" fill="none" rx="277.1093984512377" ry="112.84314019569862" stroke="#993300" stroke-width="0.8" stroke-dasharray="181.28059221962351 243.03427157392105" opacity="0.14949843825574705" transform="rotate(210.8377286909632 500 500)" class="bg-drift-2"></ellipse>
```

**Base styles (from design tokens):**

```css
.bg-drift-2 {
  background: #000000;
  padding: 4px;
}```

### Bg Drift 3

**Instances found:** 4

**CSS classes:** `.bg-drift-3`

**HTML structure:**

```html
<ellipse _ngcontent-ng-c556426719="" cx="500" cy="500" fill="none" rx="294.4149677384673" ry="134.24244158905967" stroke="#1A0000" stroke-width="0.8" stroke-dasharray="119.05267494534287 129.07010631041427" opacity="0.1064460462997923" transform="rotate(2.1775436364996503 500 500)" class="bg-drift-3"></ellipse>
```

**Base styles (from design tokens):**

```css
.bg-drift-3 {
  background: #000000;
  padding: 4px;
}```

### Heading

**Instances found:** 4

**CSS classes:** `.heading`

**HTML structure:**

```html
<div _ngcontent-ng-c2631132637="" appworddrop="" class="heading" style="margin-bottom: 2rem; position: relative; z-index: 20; background-image: none; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: unset; background-color: initial; -webkit-text-fill-color: unset;"><span data-char-idx="0" class="char-drop-item" style="display: inline-block; opacity: 0; background: linear-gradient(rgb(255, 122, 26) 45.48%, rgb(255, 255, 255) 81.9%) text; -webkit-text-fill-color: transparent; color: tr
```

**Base styles (from design tokens):**

```css
.heading {
  background: #000000;
  padding: 4px;
}```

### Bg Drift 0

**Instances found:** 3

**CSS classes:** `.bg-drift-0`

**HTML structure:**

```html
<path _ngcontent-ng-c556426719="" fill="none" d="M 321.76490054232215 570.2125181346157 A 191.56604182759548 191.56604182759548 0 1 1 567.7494583937472 679.1858232920395" stroke="#993300" stroke-width="1.774187793076488" opacity="0.12840459894471787" class="bg-drift-0"></path>
```

**Base styles (from design tokens):**

```css
.bg-drift-0 {
  background: #000000;
  padding: 4px;
}```

### Bg Drift 1

**Instances found:** 3

**CSS classes:** `.bg-drift-1`

**HTML structure:**

```html
<path _ngcontent-ng-c556426719="" fill="none" d="M 892.6341624589488 386.46187904272995 A 408.72055299476676 408.72055299476676 0 1 1 98.1580825124334 425.3303020612535" stroke="#1A0000" stroke-width="1.7992127198607746" opacity="0.17229571801112986" class="bg-drift-1"></path>
```

**Base styles (from design tokens):**

```css
.bg-drift-1 {
  background: #000000;
  padding: 4px;
}```

### Bg Drift 2

**Instances found:** 3

**CSS classes:** `.bg-drift-2`

**HTML structure:**

```html
<path _ngcontent-ng-c556426719="" fill="none" d="M 538.2007267079667 256.1126886741972 A 246.86092470608997 246.86092470608997 0 1 1 369.7593863043996 709.7086042367819" stroke="#1A0000" stroke-width="1.5447088827395354" opacity="0.09634959023829678" class="bg-drift-2"></path>
```

**Base styles (from design tokens):**

```css
.bg-drift-2 {
  background: #000000;
  padding: 4px;
}```

### Bg Drift 3

**Instances found:** 3

**CSS classes:** `.bg-drift-3`

**HTML structure:**

```html
<path _ngcontent-ng-c556426719="" fill="none" d="M 654.5726826649902 395.86613656460787 A 186.3775086758933 186.3775086758933 0 1 1 443.5130778187518 322.38861702378904" stroke="#993300" stroke-width="1.816244897965408" opacity="0.09625482015108049" class="bg-drift-3"></path>
```

**Base styles (from design tokens):**

```css
.bg-drift-3 {
  background: #000000;
  padding: 4px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#424242` for all dividers within components
- Use `#ffd740` for all interactive/active states

## Interactions & States (INTERACTIONS.md)

# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured |
|----------------|-------|----------------|
| Button | 3 | default, hover, focus |
| Link | 3 | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: all;
transition: 0.3s;
transition: color 0.35s, border-color 0.35s, box-shadow 0.35s, transform 0.25s;
transition: color 0.3s;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `button`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**On focus:**

```css
/* outline: rgb(0, 0, 0) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(0, 0, 0) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

### Button 2 — `PASSES`

**States:**

- Default: `../screens/states/button-2-default.png`
- Hover: `../screens/states/button-2-hover.png`
- Focus: `../screens/states/button-2-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */ background-color: rgb(31, 31, 31);
```

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(255, 255, 255) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `0.3s`

### Button 3 — `REGISTER`

**States:**

- Default: `../screens/states/button-3-default.png`
- Hover: `../screens/states/button-3-hover.png`
- Focus: `../screens/states/button-3-focus.png`

**On hover:**

```css
/* color: rgb(255, 122, 26) → */ color: rgb(255, 255, 255);
/* box-shadow: rgba(0, 0, 0, 0.5) 0px 4px 20px 0px → */ box-shadow: rgba(255, 122, 26, 0.65) 0px 0px 25px 0px, rgba(255, 122, 26, 0.3) 0px 8px 30px 0px;
/* transform: none → */ transform: matrix(1, 0, 0, 1, 0, -2);
/* outline: rgb(255, 122, 26) none 3px → */ outline: rgb(255, 255, 255) none 3px;
/* outline-color: rgb(255, 122, 26) → */ outline-color: rgb(255, 255, 255);
```

**On focus:**

```css
/* outline: rgb(255, 122, 26) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(255, 122, 26) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `color 0.35s, border-color 0.35s, box-shadow 0.35s, transform 0.25s`

## Link Interactions

### Link 1 — `a`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**On hover:**

```css
/* color: rgb(13, 110, 253) → */ color: rgb(10, 88, 202);
/* border-color: rgb(13, 110, 253) → */ border-color: rgb(10, 88, 202);
/* outline: rgb(13, 110, 253) none 3px → */ outline: rgb(10, 88, 202) none 3px;
/* outline-color: rgb(13, 110, 253) → */ outline-color: rgb(10, 88, 202);
```

**On focus:**

```css
/* outline: rgb(13, 110, 253) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(13, 110, 253) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

### Link 2 — `a`

**States:**

- Default: `../screens/states/link-2-default.png`
- Focus: `../screens/states/link-2-focus.png`

**Transition:** `color 0.3s`

_No visible style changes detected for this element._

### Link 3 — `a`

**States:**

- Default: `../screens/states/link-3-default.png`
- Focus: `../screens/states/link-3-focus.png`

**Transition:** `color 0.3s`

_No visible style changes detected for this element._

## Interaction Rules

- Accent color `#ffd740` is used for focus rings, active states, and hover highlights
- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.3s`, `0.35s`, `0.25s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled

## Design Tokens — JSON Files

### tokens/colors.json
```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "core": {
    "background": {
      "value": "#1f1f1f",
      "role": "background",
      "name": "mdc-chip-disabled-label-text-color"
    },
    "text-primary": {
      "value": "#ffffff",
      "role": "text-primary",
      "name": "mdc-plain-tooltip-supporting-text-color"
    },
    "surface": {
      "value": "#000000",
      "role": "surface",
      "name": "mat-ripple-color"
    },
    "accent": {
      "value": "#ffd740",
      "role": "accent",
      "name": "mat-option-selected-state-label-text-color"
    },
    "text-muted": {
      "value": "#757575",
      "role": "text-muted",
      "name": "mat-sort-arrow-color"
    },
    "border": {
      "value": "#424242",
      "role": "border",
      "name": "mdc-switch-disabled-selected-handle-color"
    }
  },
  "status": {
    "warning": {
      "value": "#bd9f67",
      "role": "warning"
    },
    "danger": {
      "value": "#f44336",
      "role": "danger",
      "name": "mat-option-selected-state-label-text-color"
    },
    "success": {
      "value": "#198754",
      "role": "success",
      "name": "bs-success"
    }
  },
  "extended": {
    "mat-option-selected-state-label-text-color": {
      "value": "#673ab7",
      "role": "unknown",
      "name": "mat-option-selected-state-label-text-color"
    },
    "color-d1d5db": {
      "value": "#d1d5db",
      "role": "unknown"
    },
    "bs-primary": {
      "value": "#0068ff",
      "role": "info",
      "name": "bs-primary"
    },
    "color-ff7a1a": {
      "value": "#ff7a1a",
      "role": "unknown"
    },
    "color-243137": {
      "value": "#243137",
      "role": "unknown"
    },
    "bs-warning": {
      "value": "#ffc300",
      "role": "unknown",
      "name": "bs-warning"
    },
    "primary-blue": {
      "value": "#ffe100",
      "role": "unknown",
      "name": "primary-blue"
    },
    "mdc-chip-elevated-container-color": {
      "value": "#e0e0e0",
      "role": "unknown",
      "name": "mdc-chip-elevated-container-color"
    },
    "webgl-page-background": {
      "value": "#0a0a0a",
      "role": "unknown",
      "name": "webgl-page-background"
    },
    "bs-danger": {
      "value": "#dc3545",
      "role": "unknown",
      "name": "bs-danger"
    },
    "bs-dark-border-subtle": {
      "value": "#b0b0b0",
      "role": "unknown",
      "name": "bs-dark-border-subtle"
    }
  },
  "meta": {
    "theme": "dark",
    "extracted": "2026-09-25"
  }
}
```

### tokens/spacing.json
```json
{
  "base": {
    "value": "4px",
    "description": "Grid unit — all spacing must be multiples of this"
  },
  "unit": "px",
  "scale": {
    "xs": {
      "value": "2px",
      "px": 2
    },
    "sm": {
      "value": "4px",
      "px": 4
    },
    "md": {
      "value": "6px",
      "px": 6
    },
    "lg": {
      "value": "8px",
      "px": 8
    },
    "xl": {
      "value": "10px",
      "px": 10
    },
    "2xl": {
      "value": "12px",
      "px": 12
    },
    "3xl": {
      "value": "14px",
      "px": 14
    },
    "4xl": {
      "value": "16px",
      "px": 16
    },
    "5xl": {
      "value": "18px",
      "px": 18
    },
    "6xl": {
      "value": "20px",
      "px": 20
    }
  },
  "multipliers": {
    "1x": {
      "value": "4px",
      "raw": 4
    },
    "2x": {
      "value": "8px",
      "raw": 8
    },
    "3x": {
      "value": "12px",
      "raw": 12
    },
    "4x": {
      "value": "16px",
      "raw": 16
    },
    "5x": {
      "value": "20px",
      "raw": 20
    },
    "6x": {
      "value": "24px",
      "raw": 24
    },
    "7x": {
      "value": "28px",
      "raw": 28
    },
    "8x": {
      "value": "32px",
      "raw": 32
    },
    "9x": {
      "value": "36px",
      "raw": 36
    },
    "10x": {
      "value": "40px",
      "raw": 40
    },
    "11x": {
      "value": "44px",
      "raw": 44
    },
    "12x": {
      "value": "48px",
      "raw": 48
    },
    "13x": {
      "value": "52px",
      "raw": 52
    },
    "14x": {
      "value": "56px",
      "raw": 56
    },
    "15x": {
      "value": "60px",
      "raw": 60
    },
    "16x": {
      "value": "64px",
      "raw": 64
    }
  },
  "meta": {
    "totalValues": 15,
    "min": 2,
    "max": 30
  }
}
```

### tokens/typography.json
```json
{
  "families": [
    "GTA6-Heading",
    "bootstrap-icons"
  ],
  "scale": {
    "heading-1": {
      "fontFamily": "GTA6-Heading",
      "fontSize": "90px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-2": {
      "fontFamily": "GTA6-Heading",
      "fontSize": "5rem",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-3": {
      "fontFamily": "GTA6-Heading",
      "fontSize": "4.5rem",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "body": {
      "fontFamily": "bootstrap-icons",
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "caption": {
      "fontFamily": "bootstrap-icons",
      "fontSize": "1.25rem",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    }
  },
  "fontFaces": [
    {
      "family": "bootstrap-icons",
      "src": "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2?dd67030699838ea613ee6dbda90effa6",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "bootstrap-icons",
      "src": "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff?dd67030699838ea613ee6dbda90effa6",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "GTA6-Heading",
      "src": "https://www.ecell.in/esummit/media/gta6_heading-PRD7Q4YL.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "GTA6-Bold",
      "src": "https://www.ecell.in/esummit/media/gta6_bold-M7GZMDT7.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "GTA6-Medium",
      "src": "https://www.ecell.in/esummit/media/gta6_med-DET7NBQJ.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "GTA6-Thin",
      "src": "https://www.ecell.in/esummit/media/gta6_thin-CROX2FPE.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "primeicons",
      "src": "https://www.ecell.in/esummit/media/primeicons-RSSEDYLY.eot",
      "format": "embedded-opentype",
      "weight": "400"
    },
    {
      "family": "primeicons",
      "src": "https://www.ecell.in/esummit/media/primeicons-RSSEDYLY.eot?#iefix",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "primeicons",
      "src": "https://www.ecell.in/esummit/media/primeicons-4GST5W3O.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "primeicons",
      "src": "https://www.ecell.in/esummit/media/primeicons-P53SE5CV.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "primeicons",
      "src": "https://www.ecell.in/esummit/media/primeicons-GEFHGEHP.ttf",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "primeicons",
      "src": "https://www.ecell.in/esummit/media/primeicons-DHQU4SEP.svg?#primeicons",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/D7WD5OXZFWQ5T76HSPWAC7MNKAJXE2YG/LUGNSPO5YC34ABNB2O6K7AFDSOJZT56V/WNDVG7O66ENLOD43GS7FBUCC4KMT5OM2.woff2",
      "format": "woff2",
      "weight": "300"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/D7WD5OXZFWQ5T76HSPWAC7MNKAJXE2YG/LUGNSPO5YC34ABNB2O6K7AFDSOJZT56V/WNDVG7O66ENLOD43GS7FBUCC4KMT5OM2.woff",
      "format": "woff",
      "weight": "300"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/D7WD5OXZFWQ5T76HSPWAC7MNKAJXE2YG/LUGNSPO5YC34ABNB2O6K7AFDSOJZT56V/WNDVG7O66ENLOD43GS7FBUCC4KMT5OM2.ttf",
      "format": "truetype",
      "weight": "300"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/TTX2Z3BF3P6Y5BQT3IV2VNOK6FL22KUT/7QYRJOI3JIMYHGY6CH7SOIFRQLZOLNJ6/KFIAZD4RUMEZIYV6FQ3T3GP5PDBDB6JY.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/TTX2Z3BF3P6Y5BQT3IV2VNOK6FL22KUT/7QYRJOI3JIMYHGY6CH7SOIFRQLZOLNJ6/KFIAZD4RUMEZIYV6FQ3T3GP5PDBDB6JY.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/TTX2Z3BF3P6Y5BQT3IV2VNOK6FL22KUT/7QYRJOI3JIMYHGY6CH7SOIFRQLZOLNJ6/KFIAZD4RUMEZIYV6FQ3T3GP5PDBDB6JY.ttf",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/P2LQKHE6KA6ZP4AAGN72KDWMHH6ZH3TA/ZC32TK2P7FPS5GFTL46EU6KQJA24ZYDB/7AHDUZ4A7LFLVFUIFSARGIWCRQJHISQP.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/P2LQKHE6KA6ZP4AAGN72KDWMHH6ZH3TA/ZC32TK2P7FPS5GFTL46EU6KQJA24ZYDB/7AHDUZ4A7LFLVFUIFSARGIWCRQJHISQP.woff",
      "format": "woff",
      "weight": "500"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/P2LQKHE6KA6ZP4AAGN72KDWMHH6ZH3TA/ZC32TK2P7FPS5GFTL46EU6KQJA24ZYDB/7AHDUZ4A7LFLVFUIFSARGIWCRQJHISQP.ttf",
      "format": "truetype",
      "weight": "500"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/LAFFD4SDUCDVQEXFPDC7C53EQ4ZELWQI/PXCT3G6LO6ICM5I3NTYENYPWJAECAWDD/GHM6WVH6MILNYOOCXHXB5GTSGNTMGXZR.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/LAFFD4SDUCDVQEXFPDC7C53EQ4ZELWQI/PXCT3G6LO6ICM5I3NTYENYPWJAECAWDD/GHM6WVH6MILNYOOCXHXB5GTSGNTMGXZR.woff",
      "format": "woff",
      "weight": "700"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/LAFFD4SDUCDVQEXFPDC7C53EQ4ZELWQI/PXCT3G6LO6ICM5I3NTYENYPWJAECAWDD/GHM6WVH6MILNYOOCXHXB5GTSGNTMGXZR.ttf",
      "format": "truetype",
      "weight": "700"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/NHPGVFYUXYXE33DZ75OIT4JFGHITX5PE/PSUTMASCDJTVPERDYJZPN23BVUFUCQIF/J64QX5IPOHK56I2KYUNBQ5M2XWZEYKYX.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/NHPGVFYUXYXE33DZ75OIT4JFGHITX5PE/PSUTMASCDJTVPERDYJZPN23BVUFUCQIF/J64QX5IPOHK56I2KYUNBQ5M2XWZEYKYX.woff",
      "format": "woff",
      "weight": "900"
    },
    {
      "family": "Satoshi",
      "src": "https://cdn.fontshare.com/wf/NHPGVFYUXYXE33DZ75OIT4JFGHITX5PE/PSUTMASCDJTVPERDYJZPN23BVUFUCQIF/J64QX5IPOHK56I2KYUNBQ5M2XWZEYKYX.ttf",
      "format": "truetype",
      "weight": "900"
    },
    {
      "family": "Bebas Neue",
      "src": "https://fonts.gstatic.com/s/bebasneue/v16/JTUSjIg69CK48gW7PXoo9Wdhyzbi.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Bebas Neue",
      "src": "https://fonts.gstatic.com/s/bebasneue/v16/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2",
      "format": "woff2",
      "weight": "400"
    }
  ],
  "rules": {
    "maxSizesPerScreen": 4,
    "headingWeightRange": "600-700",
    "bodyWeight": 400,
    "lineHeightBody": 1.5,
    "lineHeightHeading": 1.2
  }
}
```

## Bundled Fonts (fonts/)

The following font files are bundled in the `fonts/` directory:

- `fonts/BebasNeue-Regular.ttf`
- `fonts/bootstrap-icons-Regular.woff`
- `fonts/bootstrap-icons-Regular.woff2`
- `fonts/GTA6-Bold-Regular.woff`
- `fonts/GTA6-Heading-Regular.woff`
- `fonts/GTA6-Medium-Regular.woff`
- `fonts/GTA6-Thin-Regular.woff`
- `fonts/NewRocker-Regular.ttf`
- `fonts/Piazzolla-Black.ttf`
- `fonts/Piazzolla-Bold.ttf`
- `fonts/Piazzolla-ExtraBold.ttf`
- `fonts/Piazzolla-ExtraLight.ttf`
- `fonts/Piazzolla-Light.ttf`
- `fonts/Piazzolla-Medium.ttf`
- `fonts/Piazzolla-Regular.ttf`
- `fonts/Piazzolla-SemiBold.ttf`
- `fonts/Piazzolla-Thin.ttf`
- `fonts/primeicons-Regular.ttf`
- `fonts/primeicons-Regular.woff`
- `fonts/primeicons-Regular.woff2`
- `fonts/Satoshi-300.ttf`
- `fonts/Satoshi-300.woff`
- `fonts/Satoshi-300.woff2`
- `fonts/Satoshi-500.ttf`
- `fonts/Satoshi-500.woff`
- `fonts/Satoshi-500.woff2`
- `fonts/Satoshi-700.ttf`
- `fonts/Satoshi-700.woff`
- `fonts/Satoshi-700.woff2`
- `fonts/Satoshi-900.ttf`
- `fonts/Satoshi-900.woff`
- `fonts/Satoshi-900.woff2`
- `fonts/Satoshi-Regular.ttf`
- `fonts/Satoshi-Regular.woff`
- `fonts/Satoshi-Regular.woff2`

Use these local font files in `@font-face` declarations instead of fetching from Google Fonts.

## Screenshots Inventory (screens/)

> Study all screenshots carefully before implementing any UI. Match every visual detail exactly.

### Scroll Journey (screens/scroll/)

*Cinematic scroll states — page visual at each scroll depth*

![scroll-000.png](screens/scroll/scroll-000.png)

![scroll-017.png](screens/scroll/scroll-017.png)

![scroll-033.png](screens/scroll/scroll-033.png)

![scroll-050.png](screens/scroll/scroll-050.png)

![scroll-067.png](screens/scroll/scroll-067.png)

![scroll-083.png](screens/scroll/scroll-083.png)

![scroll-100.png](screens/scroll/scroll-100.png)

### Full Page Screenshots (screens/pages/)

*Full-page screenshots of each crawled URL*

![esummit-acco.png](screens/pages/esummit-acco.png)

![esummit-events.png](screens/pages/esummit-events.png)

![esummit-sponsors.png](screens/pages/esummit-sponsors.png)

![esummit.png](screens/pages/esummit.png)

![home.png](screens/pages/home.png)

### Section Clips (screens/sections/)

*Clipped individual sections and components*

![esummit-acco-section-1.png](screens/sections/esummit-acco-section-1.png)

![esummit-acco-section-5.png](screens/sections/esummit-acco-section-5.png)

![esummit-events-section-1.png](screens/sections/esummit-events-section-1.png)

![esummit-section-2.png](screens/sections/esummit-section-2.png)

![home-section-3.png](screens/sections/home-section-3.png)

### Interaction States (screens/states/)

*Hover, focus, and active state captures*

![button-1-default.png](screens/states/button-1-default.png)

![button-1-focus.png](screens/states/button-1-focus.png)

![button-1-hover.png](screens/states/button-1-hover.png)

![button-2-default.png](screens/states/button-2-default.png)

![button-2-focus.png](screens/states/button-2-focus.png)

![button-2-hover.png](screens/states/button-2-hover.png)

![button-3-default.png](screens/states/button-3-default.png)

![button-3-focus.png](screens/states/button-3-focus.png)

![button-3-hover.png](screens/states/button-3-hover.png)

![link-1-default.png](screens/states/link-1-default.png)

![link-1-focus.png](screens/states/link-1-focus.png)

![link-1-hover.png](screens/states/link-1-hover.png)

### Screenshot Index (screens/INDEX.md)

# Screenshot Index

## Scroll Journey

> Shows the cinematic state at each point of the page

| Scroll | Y Position | File |
|--------|-----------|------|
| 0% | 0px | `screens/scroll/scroll-000.png` |
| 17% | 0px | `screens/scroll/scroll-017.png` |
| 33% | 0px | `screens/scroll/scroll-033.png` |
| 50% | 0px | `screens/scroll/scroll-050.png` |
| 67% | 0px | `screens/scroll/scroll-067.png` |
| 83% | 0px | `screens/scroll/scroll-083.png` |
| 100% | 0px | `screens/scroll/scroll-100.png` |

## Pages

| Page | URL | File |
|------|-----|------|
| E-Summit 2026 | E-Cell IIT Bombay | `https://www.ecell.in/esummit/` | `screens/pages/esummit.png` |
| E-Cell - Creating Job Creators | `https://www.ecell.in/` | `screens/pages/home.png` |
| Events | E-Summit 2026 | E-Cell IIT Bombay | `https://www.ecell.in/esummit/events` | `screens/pages/esummit-events.png` |
| Accommodation | E-Summit 2026 | E-Cell IIT Bombay | `https://www.ecell.in/esummit/acco` | `screens/pages/esummit-acco.png` |
| Sponsors | E-Summit 2026 | E-Cell IIT Bombay | `https://www.ecell.in/esummit/sponsors` | `screens/pages/esummit-sponsors.png` |

## Sections

| Page | Section | File |
|------|---------|------|
| esummit | #2 (header) | `screens/sections/esummit-section-2.png` |
| home | #3 ([class*="hero"]) | `screens/sections/home-section-3.png` |
| esummit-events | #1 (section) | `screens/sections/esummit-events-section-1.png` |
| esummit-acco | #1 (section) | `screens/sections/esummit-acco-section-1.png` |
| esummit-acco | #5 ([class*="hero"]) | `screens/sections/esummit-acco-section-5.png` |

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

