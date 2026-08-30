# Theme Guidelines — Design Tokens & Language Mappings

> **Last Updated:** 2026-08-29
> **Owner:** Layer 1 Directive — UI/UX Design System
> **Scope:** All color tokens, typography, persona switching, and language state management.

---

## 1. Dual-Persona Theme System

The entire UI switches between two visual modes based on `data-role` attribute on `<html>`.

### Student Persona (Default)

| Token         | Hex            | Usage                              |
| ------------- | -------------- | ---------------------------------- |
| Dark Obsidian | `#0A0D0F`      | Background base                    |
| Electric Mint | `#10B981`      | Primary CTA, badges, active states |
| Neon Emerald  | `#00F5A0`      | Gradient accent, hero glow         |
| Cyan          | (oklch mapped) | Links, hover states, ring focus    |

**CSS Variable Overrides:** None needed — these are the `:root` defaults.

**Messaging Tone:**

- "Micro-storage at ₹300/bag/mo"
- "Zero-brokerage rooms"
- "Verified student community"
- Urgency-driven: "Stop burning money", "The 20-Day Vacation Scam"

### Elderly Host Persona

| Token         | Hex       | Usage                              |
| ------------- | --------- | ---------------------------------- |
| Dark Obsidian | `#0A0D0F` | Background base (shared)           |
| Warm Amber    | `#F59E0B` | Primary CTA, badges, active states |
| Sunset Gold   | `#FBBF24` | Gradient accent, hero glow         |

**CSS Variable Overrides:** Applied via `[data-role="host"]` selector in `src/styles.css`.

**Messaging Tone:**

- "₹11,500+/month dignified passive income"
- "Zero intrusion, 100% control over house norms"
- "₹10k safety cover"
- Respectful, dignity-first language

---

## 2. Design Tokens (CSS Custom Properties)

All tokens are defined in [`src/styles.css`](../src/styles.css) using **oklch** color space.

### Core Tokens

```css
/* Shared */
--background      /* Dark Obsidian base */
--foreground       /* Near-white text */
--card             /* Elevated surface */
--surface          /* Glass effect background */

/* Student mode (default :root) */
--primary          /* Electric Mint */
--ring             /* Focus ring = primary */
--cyan             /* Accent color */
--emerald          /* Secondary accent */
--gradient-cyan    /* Mint → Emerald gradient */
--gradient-hero    /* Full spectrum hero gradient */
--glow-cyan        /* Box-shadow glow */

/* Host mode ([data-role="host"]) */
--primary          /* Warm Amber (overridden) */
--gradient-cyan    /* Remapped to gradient-amber */
--gradient-hero    /* Amber spectrum hero gradient */
```

### Utility Classes

| Class            | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `.glass`         | Frosted glass card effect with backdrop blur |
| `.glass-hover`   | Adds glow + border transition on hover       |
| `.text-gradient` | Animated gradient text sweep                 |
| `.grid-noise`    | Subtle grid background pattern               |
| `.btn-shimmer`   | CTA button shimmer on hover                  |

---

## 3. Typography

| Role               | Font                      | Weights       |
| ------------------ | ------------------------- | ------------- |
| Display / Headings | Plus Jakarta Sans         | 600, 700, 800 |
| Body / UI          | Plus Jakarta Sans / Inter | 400, 500, 600 |

Loaded via Google Fonts in [`__root.tsx`](../src/routes/__root.tsx):

```
Plus Jakarta Sans: 400, 500, 600, 700, 800
Inter: 400, 500, 600
```

---

## 4. Language Switcher — en/hi Global Sync

### Architecture

- **Context:** [`src/context/LanguageContext.tsx`](../src/context/LanguageContext.tsx)
- **State key:** `ss-language` in `localStorage`
- **Supported languages:** `en` (English), `hi` (Hindi)
- **Sync scope:** Every UI node from Navbar to Footer

### Translation Structure

```typescript
type Language = "en" | "hi";

translations = {
  en: { nav, hero, crisis, ecosystem, calculator, hostSimulator, footer },
  hi: { nav, hero, crisis, ecosystem, calculator, hostSimulator, footer },
};
```

### Usage Pattern

```tsx
import { useLanguage } from "@/context/LanguageContext";

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  return <h1>{t.hero.student.title}</h1>;
}
```

### Rules

1. **Every user-visible string** must come from the translations object
2. **No hardcoded English** in component JSX (except technical labels like "WhatsApp")
3. Language toggle must persist across page refreshes via `localStorage`
4. Language and persona are **independent** — changing role does not reset language

---

## 5. Persona Switcher

### Architecture

- **State key:** `ss-role` in `localStorage`
- **DOM sync:** `document.documentElement.dataset.role = "student" | "host"`
- **Default:** `student`

### Rules

1. Persona switch must be **instant** — no page reload
2. CSS variables cascade automatically via `[data-role="host"]` selector
3. Content sections conditionally render based on role (e.g., Calculator vs HostSimulator)
4. Persona state must persist across refreshes

---

## 6. Performance Requirements

| Requirement                    | Target                         |
| ------------------------------ | ------------------------------ |
| 3D transforms (Card3D, Tilt3D) | 60–120 FPS locked              |
| Lenis smooth scrolling         | No jank on scroll              |
| Touch viewports (<768px)       | Disable 3D mouse tracking      |
| `overflow-x`                   | Always `hidden` on html + body |
| WebGL / OGL canvases           | Maintain 60 FPS minimum        |

---

## Revision Log

| Date       | Change                                                | Author |
| ---------- | ----------------------------------------------------- | ------ |
| 2026-08-29 | Initial directive created from AGENTS.md design specs | System |
