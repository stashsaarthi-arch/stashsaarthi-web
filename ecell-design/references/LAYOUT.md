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

