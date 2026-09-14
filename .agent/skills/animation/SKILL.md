---
name: animation
description: "Emil Kowalski-grade micro-interactions, spring physics, and fluid interactive animations"
---

# Animation Skill: Emil Kowalski Micro-Interactions & Physics

Use this skill when designing, refining, or auditing animations, micro-interactions, tactile UI state transitions, and spring physics.

## Core Philosophy

1. **Purpose-Driven Movement**: Every animation must communicate state, causality, or spatial continuity. Never add motion that delays task completion or distracts from core user intent.
2. **Spring Physics Over Easing Curves**:
   - Prefer damp-spring dynamics over linear or robotic cubic-beziers for interactive elements.
   - For interactive elements (cards, buttons, drawers, tooltips), calibrate mass, stiffness, and damping to feel grounded yet responsive.
   - Recommended Framer Motion spring presets:
     - **Brisk / Interactive**: `type: "spring", stiffness: 400, damping: 30`
     - **Gentle / Modal & Drawer**: `type: "spring", stiffness: 300, damping: 28`
     - **Bouncy / Delight & Badges**: `type: "spring", stiffness: 500, damping: 22`
3. **Interruptibility**: All gestures and transitions must be fully interruptible. If a user hovers off or reverses direction mid-transition, the animation should smoothly re-target without snapping.
4. **Reduced Motion & Accessibility**:
   - Always respect `prefers-reduced-motion`.
   - On touch viewports (<768px) and mobile devices, disable intensive 3D mouse tracking (`Card3D`, tilt calculations) to maintain 60–120 FPS native scrolling.
5. **Hardware Acceleration**:
   - Transform only compositor-friendly properties: `transform` (`translate3d`, `scale`, `rotate`) and `opacity`.
   - Avoid animating layout-triggering properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
   - Use `will-change: transform` sparingly on active animating surfaces.
