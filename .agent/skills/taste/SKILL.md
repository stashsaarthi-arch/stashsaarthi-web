---
name: taste
description: "Aesthetic benchmarks, anti-slop guidelines, color harmony, and visual rigor"
---

# Taste Skill: Aesthetic Benchmarks & Anti-Slop Guidelines

Use this skill when auditing UI aesthetics, crafting visual hierarchy, balancing color harmonies, evaluating typography, or guarding against generic AI-generated "slop".

## Core Principles

1. **Anti-Slop Guardrails**:
   - Reject generic purple/indigo AI gradients, floating cards without structural purpose, meaningless glowing borders, and uncalibrated blur overlays.
   - Every container, border, and glow must have visual intent rooted in the brand's identity.
   - In StashSaarthi, honor the dual-persona palettes:
     - **Student Mode**: Obsidian `#0A0D0F`, Electric Mint `#10B981`, Neon Emerald `#00F5A0`, Cyan accents.
     - **Host Mode**: Obsidian `#0A0D0F`, Warm Amber `#F59E0B`, Sunset Gold `#FBBF24`, terracotta warmth.
2. **Curated Color Harmonies (60-30-10 Rule)**:
   - **60% Dominant Base**: Deep Obsidian dark canvas ensuring high readability and battery-efficient contrast.
   - **30% Secondary Structure**: Subtle card borders, frosted surface layers, navigation chrome, and dividers.
   - **10% Intentional Accents**: High-contrast focal points reserved exclusively for primary CTAs, active status badges, and critical data callouts.
3. **Typography Rigor & Typesetting**:
   - Clean typographical scale (Heading, Subheading, Body, Micro-label).
   - Generous line-height (`1.5`–`1.75`) for dense information; tight tracking for prominent display headings (`-0.02em`).
   - Honor native script aesthetics: Devanagari Hindi text requires generous line height (`1.75`) and clearance for matras (diacritics) to avoid glyph clipping.
4. **Visual Hierarchy & Depth**:
   - Layer depth with discrete elevations: Canvas base → Layered Glass cards → Floating popovers/modals.
   - Avoid flat monochromatic slabs; use subtle multi-stop border gradients and directional top spotlighting to imply physical light.
