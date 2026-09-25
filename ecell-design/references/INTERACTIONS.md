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

