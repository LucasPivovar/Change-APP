---
trigger: model_decision
description: "Mandatory UI/UX design standard enforcing project briefing alignment (sales vs branding vs SaaS, tone and audience), Impeccable Craftsmanship (Paul Bakaus), Web Interface Guidelines (Rauno Freiberg), and visual reference discovery via Dribbble and Dark Design."
---

# UI/UX & Design Standard: Briefing Alignment, Impeccable Craft & Reference Scout

Whenever starting, designing, modifying, or styling any frontend component, page, or modal:

## 1. Mandatory Project Discovery & Base Alignment (Briefing Inicial)
**Never start designing blindly without knowing the project foundation.**
Unless the user has already explicitly defined the project type and visual tone, ALWAYS clarify the base foundation (using the interactive `ask_question` modal or clear options):

1. **Tipo & Objetivo do Projeto:**
   - **Landing Page de Vendas / Conversão Direta:** Foco em tração comercial, proposta de valor rápida, CTAs de alto contraste, prova social, urgência controlada.
   - **Branding & Institucional:** Foco em autoridade de marca, sofisticação, tipografia expressiva com peso editorial, narrativa visual imersiva.
   - **Aplicação / SaaS / Dashboard:** Foco em densidade de informação limpa, produtividade do usuário, clareza de dados, tabelas com números tabulares e velocidade de tarefa.
   - **App Mobile / Experiência Interativa:** Foco em usabilidade com polegar, sheets/gavetas inferiores, feedback tátil instantâneo.

2. **Personalidade & Tom Visual:**
   - **Profissional & Corporativo:** Sóbrio, confiável, paleta contida (azul marinho, ardósia, neutros quentes), tipografia sólida.
   - **Moderno & Minimalista:** Espaçamento generoso, contrastes limpos, elegância discreta, bordas de 1px ultrafinas.
   - **Descontraído, Jovem & Vibrante:** Cores quentes ou vibrantes, formas acolhedoras, micro-animações lúdicas, ilustrações ou mascotes expressivos.
   - **Dark Mode Tech / Cyber:** Superfícies pretas puras (`#09090b`), bordas sutis translúcidas, toques de neon contidos, zero névoa roxa.

---

## 2. Mandatory Reference Scout
- **Never design in a vacuum:** After defining the base tone, search for real-world curated inspiration on:
  - **Dribbble** (`dribbble.com`): Layout balance, spacing, interactive sheets.
  - **Dark Design** (`dark.design`): High-contrast, authentic dark mode, subtle 1px border highlights, zero purple haze.
  - **Shoogle** (`shoogle.dev`): Battle-tested shadcn/ui components and accessible primitives.
  - **Web Interface Guidelines** (`interfaces.rauno.me`): Micro-interaction polish.

---

## 3. Impeccable Anti-Slop Discipline
- **Banned:** Radial purple/indigo background blobs, card-inside-card syndrome, screaming uppercase eyebrow badges, gradient text accents, raw emojis as icons, and vanity metric duplication.
- **Micro-details (Rauno's Guidelines):**
  - Always apply `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`.
  - Apply `user-select: none` on interactive buttons, badges, and icons.
  - Apply tactile press-down feedback (`:active { transform: scale(0.98); }`).
  - Isolate hover states with `@media (hover: hover)` to prevent sticky hover on touch devices.
  - Ensure form inputs have minimum `16px` font-size on mobile to prevent iOS auto-zoom.
  - Use `font-variant-numeric: tabular-nums` for timers, stats, and prices.
