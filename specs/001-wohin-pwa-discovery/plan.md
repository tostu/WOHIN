# Implementation Plan: wohin-pwa-discovery (Sun-Drenched Social Edition)

**Branch**: `001-wohin-pwa-discovery` | **Date**: 2026-04-12 | **Spec**: [/specs/001-wohin-pwa-discovery/spec.md](/specs/001-wohin-pwa-discovery/spec.md)
**Input**: Feature specification + "The Radiant Curator" Design System Strategy

## Summary

Build "wohin", a SvelteKit-powered PWA that functions as a "Radiant Curator" for location discovery. The application follows a "Sun-Drenched Social" design system, rejecting traditional grid/border models for a fluid, tonal layering system. Key features include activity-based discovery (study, relax, party), interactive MapLibre integration, and a delightfully animated "Vibe Check" feedback system. The aesthetic is defined by warm, sun-filled tones, editorial typography (Plus Jakarta Sans & Be Vietnam Pro), organic, asymmetrical layouts, and playful microcopy that injects personality into every interaction.

## Technical Context

**Language/Version**: SvelteKit 2 (TypeScript 5.x)
**Primary Dependencies**: Tailwind CSS (Custom Theme), Bits UI (Radix Svelte), MapLibre GL JS, Sanity Client
**Typography**: Plus Jakarta Sans (Display/Headlines), Be Vietnam Pro (Body/Titles)
**Color Palette**: Background `#fefcf4` (Cream), Accents in Peach, Golden Yellow, and Matcha Green.
**Storage**: Sanity CMS (Content), PostgreSQL (Drizzle ORM for Feedback), Service Worker (PWA)
**Testing**: Vitest, Playwright (E2E + PWA validation)
**Target Platform**: Modern Browsers (PWA), iOS/Android
**Performance Goals**: SSG for public pages, < 2s TTI, Lighthouse Accessibility >= 90
**Constraints**: **Strict No-Border Rule** (use tonal shifts), WCAG 2.1 AA compliant, Responsive/Fluid layout.

## Constitution Check

- [x] **I. Vibe-First**: Focuses on "The Radiant Curator" intent while maintaining structural integrity.
- [x] **II. Lifecycle**: Covers START, BUILD, and SHIP phases.
- [x] **III. Independence**: Stories prioritized as P1 (Discovery), P2 (Feedback), P3 (Submissions).
- [x] **IV. Verification**: Automated tests planned for all core flows.
- [x] **V. Modularity**: Uses Svelte components and decoupled Sanity architecture.
- [x] **VI. Decoupled Architecture**: External services abstracted behind interfaces.

## Project Structure

### Documentation (this feature)

```text
specs/001-wohin-pwa-discovery/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (generated later)
```

### Source Code (repository root)

```text
app/
├── src/
│   ├── lib/
│   │   ├── components/  # Bits UI primitives + Custom "Sun-Drenched" components
│   │   ├── styles/      # global.css (Custom Properties), tailwind.config.ts
│   │   └── server/      # Sanity/DB services
│   └── routes/
│       ├── (app)/       # PWA Discovery flows
│       └── (admin)/     # Moderation interface
├── static/              # Manifest, PWA icons
└── tests/
```

**Structure Decision**: Hybrid app structure with centralized styling to enforce the "No-Line" rule and tonal layering system.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
