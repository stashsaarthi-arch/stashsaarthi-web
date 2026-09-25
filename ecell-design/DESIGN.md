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
  src: url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2?dd67030699838ea613ee6dbda90effa6");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Heading";
  src: url("https://www.ecell.in/esummit/media/gta6_heading-PRD7Q4YL.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Bold";
  src: url("https://www.ecell.in/esummit/media/gta6_bold-M7GZMDT7.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Medium";
  src: url("https://www.ecell.in/esummit/media/gta6_med-DET7NBQJ.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "GTA6-Thin";
  src: url("https://www.ecell.in/esummit/media/gta6_thin-CROX2FPE.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "primeicons";
  src: url("https://www.ecell.in/esummit/media/primeicons-4GST5W3O.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Satoshi";
  src: url("https://cdn.fontshare.com/wf/TTX2Z3BF3P6Y5BQT3IV2VNOK6FL22KUT/7QYRJOI3JIMYHGY6CH7SOIFRQLZOLNJ6/KFIAZD4RUMEZIYV6FQ3T3GP5PDBDB6JY.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Satoshi";
  src: url("https://cdn.fontshare.com/wf/LAFFD4SDUCDVQEXFPDC7C53EQ4ZELWQI/PXCT3G6LO6ICM5I3NTYENYPWJAECAWDD/GHM6WVH6MILNYOOCXHXB5GTSGNTMGXZR.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Bebas Neue";
  src: url("https://fonts.gstatic.com/s/bebasneue/v16/JTUSjIg69CK48gW7PXoo9Wdhyzbi.woff2") format("woff2");
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
