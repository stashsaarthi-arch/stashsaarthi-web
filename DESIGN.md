# 🎨 StashSaarthi Living UI Design System & Token Documentation (`DESIGN.md`)

> **Platform:** StashSaarthi — Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform  
> **Architecture:** Dual-Persona Global Sync (Student Electric Mint vs. Senior Host Warm Amber)  
> **Color Model:** OKLCH (Perceptually Uniform Color Space with High-Contrast Surface Layers)  
> **Status:** Living Document — Auto-synchronized with `src/lib/designTokens.ts`, `src/lib/colorHarmony.ts`, `src/styles.css`, and `src/components/ui/`

---

## 1. Dual-Persona Global Design Architecture

StashSaarthi operates a dual-persona design system that dynamically adapts UI tokens based on the active user role (`[data-role="student"]` or `[data-role="host"]`).

| Persona Parameter | Student Persona (Default) | Senior Host Persona |
| :--- | :--- | :--- |
| **Target Demographic** | College Students, NEET/JEE Aspirants | Senior Citizens, Homeowners (55+ yrs) |
| **Primary Accent** | **Electric Mint** (`oklch(0.72 0.19 160)`) | **Warm Amber** (`oklch(0.769 0.165 70)`) |
| **Secondary Accent** | **Neon Emerald** (`oklch(0.696 0.149 162)`) | **Sunset Gold** (`oklch(0.837 0.175 82)`) |
| **Highlight Accent** | **Cyber Cyan** (`oklch(0.868 0.16 178)`) | **Warm Gold Glow** (`oklch(0.85 0.18 84)`) |
| **Obsidian Dark Base** | **Dark Obsidian** (`oklch(0.12 0.012 230)`) | **Warm Obsidian** (`oklch(0.13 0.015 65)`) |
| **Primary Brand Value** | Micro-storage @ ₹300/mo, zero-brokerage | ₹11,500+/mo passive income, zero intrusion |

---

## 2. OKLCH Color Tokens & Surface Layer Hierarchy

### 2.1 Student Persona Tokens (`STUDENT_TOKENS`)

```typescript
export const STUDENT_TOKENS = {
  mint: { l: 0.72, c: 0.19, h: 160, raw: "oklch(0.72 0.19 160)" },
  emerald: { l: 0.696, c: 0.149, h: 162, raw: "oklch(0.696 0.149 162)" },
  cyan: { l: 0.868, c: 0.16, h: 178, raw: "oklch(0.868 0.16 178)" },
  obsidian: { l: 0.12, c: 0.012, h: 230, raw: "oklch(0.12 0.012 230)" },
  surface1: { l: 0.16, c: 0.012, h: 230, raw: "oklch(0.16 0.012 230)" },
  surface2: { l: 0.198, c: 0.013, h: 223, raw: "oklch(0.198 0.013 223)" },
  surfaceElevated: { l: 0.24, c: 0.016, h: 223, raw: "oklch(0.24 0.016 223)" },
} as const;
```

### 2.2 Senior Host Persona Tokens (`HOST_TOKENS`)

```typescript
export const HOST_TOKENS = {
  amber: { l: 0.769, c: 0.165, h: 70, raw: "oklch(0.769 0.165 70)" },
  gold: { l: 0.837, c: 0.175, h: 82, raw: "oklch(0.837 0.175 82)" },
  obsidian: { l: 0.13, c: 0.015, h: 65, raw: "oklch(0.13 0.015 65)" },
  surface1: { l: 0.17, c: 0.015, h: 65, raw: "oklch(0.17 0.015 65)" },
  surface2: { l: 0.21, c: 0.017, h: 62, raw: "oklch(0.21 0.017 62)" },
  surfaceElevated: { l: 0.25, c: 0.019, h: 62, raw: "oklch(0.25 0.019 62)" },
} as const;
```

### 2.3 Harmonized Status & Feedback Tokens (`STATUS_TOKENS`)

| Status Type | Raw Color OKLCH | Background Tint (12%) | Border Translucent (30%) | High Contrast Text | Glow Shadow |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Success** | `oklch(0.72 0.19 160)` | `oklch(0.72 0.19 160 / 12%)` | `oklch(0.72 0.19 160 / 30%)` | `oklch(0.85 0.16 160)` | `0 0 16px -2px oklch(0.72 0.19 160 / 35%)` |
| **Warning** | `oklch(0.78 0.17 75)` | `oklch(0.78 0.17 75 / 12%)` | `oklch(0.78 0.17 75 / 30%)` | `oklch(0.88 0.15 75)` | `0 0 16px -2px oklch(0.78 0.17 75 / 35%)` |
| **Error** | `oklch(0.65 0.22 25)` | `oklch(0.65 0.22 25 / 12%)` | `oklch(0.65 0.22 25 / 30%)` | `oklch(0.82 0.18 25)` | `0 0 16px -2px oklch(0.65 0.22 25 / 35%)` |
| **Info** | `oklch(0.82 0.16 195)` | `oklch(0.82 0.16 195 / 12%)` | `oklch(0.82 0.16 195 / 30%)` | `oklch(0.90 0.14 195)` | `0 0 16px -2px oklch(0.82 0.16 195 / 35%)` |

---

## 3. Typography Scale & Devanagari Settings

### 3.1 Primary Font Families
- **Primary Body & Display:** `Plus Jakarta Sans`, `Inter`, system-ui, sans-serif
- **Devanagari Hindi:** `Rozha One`, `Mukta`, `Noto Sans Devanagari`, sans-serif

### 3.2 Typography Tokens & Hierarchy
```css
--font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```
- **Heading 1 (`h1`):** `clamp(2.25rem, 5vw, 3.75rem)`, `font-weight: 800`, `letter-spacing: -0.025em`, `line-height: 1.1`
- **Heading 2 (`h2`):** `clamp(1.75rem, 3.5vw, 2.5rem)`, `font-weight: 700`, `letter-spacing: -0.02em`, `line-height: 1.2`
- **Heading 3 (`h3`):** `1.5rem`, `font-weight: 600`, `letter-spacing: -0.015em`
- **Body Regular:** `1rem` (16px), `line-height: 1.6`
- **Caption / Muted:** `0.875rem` (14px), `color: oklch(0.7 0.01 230)`

---

## 4. Elevation, Depth & Glassmorphism System

### 4.1 4-Tier Shadow System (`SHADOW_TOKENS`)

| Tier | Token | Box-Shadow Specification |
| :--- | :--- | :--- |
| **Subtle** | `--shadow-subtle` | `0 2px 8px -2px oklch(0 0 0 / 35%)` |
| **Card** | `--shadow-card` | `0 12px 32px -8px oklch(0 0 0 / 60%), inset 0 1px 0 oklch(1 0 0 / 8%)` |
| **Floating** | `--shadow-floating` | `0 24px 48px -12px oklch(0 0 0 / 75%), inset 0 1px 0 oklch(1 0 0 / 12%)` |
| **Glow** | `--shadow-glow` | Dynamic persona glow (`var(--persona-glow)`): `0 0 32px -4px oklch(0.72 0.19 160 / 40%)` |

### 4.2 Glassmorphism Utilities

```css
.glass {
  background: oklch(0.14 0.012 230 / 65%);
  backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid oklch(1 0 0 / 12%);
  transform: translate3d(0, 0, 0); /* Hardware Acceleration */
}

.glass-panel {
  background: var(--surface-panel);
  backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid oklch(1 0 0 / 15%);
}

.glass-card {
  background: var(--surface-card);
  backdrop-filter: blur(14px) saturate(135%);
  border: 1px solid oklch(1 0 0 / 11%);
}
```

### 4.3 Ambient Depth Textures (`DEPTH_TEXTURE_TOKENS`)
- **`.bg-noise`:** SVG fractal noise texture (`opacity: 0.035`) eliminating flat OLED background banding.
- **`.radial-mesh`:** Multi-spotlight radial mesh mapped to active persona accent hues.

---

## 5. Border Radius & Ring Scales

### 5.1 Radius Scale (`GLOBAL_RADIUS_SCALE`)
- `xs`: `calc(var(--radius) - 6px)` (10px)
- `sm`: `calc(var(--radius) - 4px)` (12px)
- `md`: `calc(var(--radius) - 2px)` (14px)
- `lg`: `var(--radius)` (16px)
- `xl`: `calc(var(--radius) + 4px)` (20px)
- `2xl`: `calc(var(--radius) + 8px)` (24px)
- `3xl`: `calc(var(--radius) + 12px)` (28px)
- `4xl`: `calc(var(--radius) + 16px)` (32px)
- `full`: `9999px`

### 5.2 Semantic Component Mapping (`SEMANTIC_RADIUS_TOKENS`)
- **Badge:** `sm` (12px)
- **Button / Input:** `md` (14px)
- **Card:** `xl` (20px)
- **Panel:** `2xl` (24px)
- **Modal:** `3xl` (28px)
- **Pill:** `full` (9999px)

---

## 6. Spacing Scale & Container Gutters

### 6.1 Global Spacing Scale (`GLOBAL_SPACING_SCALE`)
- `xs`: `0.25rem` (4px)
- `sm`: `0.5rem` (8px)
- `md`: `1rem` (16px)
- `lg`: `1.5rem` (24px)
- `xl`: `2rem` (32px)
- `2xl`: `3rem` (48px)
- `3xl`: `4rem` (64px)

### 6.2 Container Layout Gutters
- **Mobile (<640px):** `px-4` (16px horizontal gutter padding)
- **Tablet (640px - 1024px):** `px-6` (24px horizontal gutter padding)
- **Desktop (>1024px):** `px-8` (32px horizontal gutter padding)
- **Max Width Containers:** `max-w-7xl` (1280px), `max-w-6xl` (1152px)

---

## 7. Standardized Gradient Systems (`GRADIENT_TOKENS`)

- **`gradient-mint-emerald`:** `linear-gradient(135deg, oklch(0.72 0.19 160), oklch(0.696 0.149 162))`
- **`gradient-amber-gold`:** `linear-gradient(135deg, oklch(0.769 0.165 70), oklch(0.837 0.175 82))`
- **`gradient-cyan-emerald`:** `linear-gradient(135deg, oklch(0.868 0.16 178), oklch(0.696 0.149 162))`
- **`gradient-obsidian-mesh`:** `radial-gradient(ellipse at 50% 0%, oklch(0.24 0.016 223 / 50%) 0%, oklch(0.12 0.012 230 / 95%) 100%)`
- **`text-gradient-persona`:** Dynamic text clip gradient reflecting active persona tokens.

---

## 8. Core Component Primitives (`src/components/ui/`)

1. **`Button` (`src/components/ui/button.tsx`):** Supports `default`, `outline`, `ghost`, `glass`, `persona`, `personaOutline`, `destructive` variants; loading spinner; Web Audio haptic click triggers.
2. **`IconButton` (`src/components/ui/IconButton.tsx`):** Accessible icon-only button primitive enforcing mandatory `aria-label` attribute.
3. **`PillBadge` (`src/components/ui/PillBadge.tsx`):** Compact metadata badge with live `pulseDot` animation option.
4. **`Chip` (`src/components/ui/Chip.tsx`):** Interactive toggle/filter chip with selection states (`isSelected`) and dismissible remove actions (`onRemove`).
5. **`StatusIndicator` (`src/components/ui/StatusIndicator.tsx`):** Universal status indicator supporting `badge`, `card`, `dot`, and `banner` modes for `success`, `warning`, `error`, and `info` states.

---

## 9. Micro-Interaction & Audio-Visual Haptics Engine

- **Web Audio Haptics:** `playClick()` (800Hz sine burst), `playPop()` (1200Hz frequency modulation), `playSuccess()` (harmonic major triad).
- **Smooth Scroll Physics:** Lenis smooth scrolling with locked 60–120 FPS performance.
- **3D Card Transforms (`Card3D`):** Cursor-following pitch/yaw tilt with specular glare highlights; automatically disabled on touch devices (`<768px`).
- **Live Status Pulsing:** CSS keyframe pulse animation (`animate-pulse`) for real-time node capacity, online status, and security seals.
