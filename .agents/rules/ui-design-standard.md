---
trigger: model_decision
description: "Mandatory UI/UX design standard enforcing Impeccable Craftsmanship (Paul Bakaus) and Web Interface Guidelines (Rauno Freiberg), coupled with mandatory visual reference discovery via Dribbble and Dark Design."
---

# UI/UX & Design Standard: Impeccable Craft & Reference Scout

Whenever designing, modifying, or styling any frontend component, page, or modal:

## 1. Mandatory Reference Scout
- **Never design in a vacuum:** Before generating UI, search for real-world curated inspiration on:
  - **Dribbble** (`dribbble.com`): Layout balance, spacing, interactive sheets.
  - **Dark Design** (`dark.design`): High-contrast, authentic dark mode, subtle 1px border highlights, zero purple haze.
  - **Shoogle** (`shoogle.dev`): Battle-tested shadcn/ui components and accessible primitives.
  - **Web Interface Guidelines** (`interfaces.rauno.me`): Micro-interaction polish.

## 2. Impeccable Anti-Slop Discipline
- **Banned:** Radial purple/indigo background blobs, card-inside-card syndrome, screaming uppercase eyebrow badges, gradient text accents, raw emojis as icons, and vanity metric duplication.
- **Micro-details (Rauno's Guidelines):**
  - Always apply `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`.
  - Apply `user-select: none` on interactive buttons, badges, and icons.
  - Apply tactile press-down feedback (`:active { transform: scale(0.98); }`).
  - Isolate hover states with `@media (hover: hover)` to prevent sticky hover on touch devices.
  - Ensure form inputs have minimum `16px` font-size on mobile to prevent iOS auto-zoom.
  - Use `font-variant-numeric: tabular-nums` for timers, stats, and prices.
