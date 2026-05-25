# WOHIN Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-12

**Note**: All development must strictly adhere to the **WOHIN Constitution** (v1.1.0).

## Core Principles (Summary)

- **I. Vibe-First**: Focus on WHAT, maintain structural integrity.
- **II. Lifecycle**: Follow START → BUILD → SHIP.
- **III. Independence**: Break features into P1/P2/P3 user stories.
- **IV. Verification**: Mandatory automated tests (write and fail first).
- **V. Modularity**: Prefer plugins and extensions.
- **VI. Decoupled Architecture**: Abstraction and DI for external services.

## Active Technologies
- SvelteKit 2 (TypeScript 5.x) + Tailwind CSS (Custom Theme), Bits UI (Radix Svelte), MapLibre GL JS, Sanity Clien (001-wohin-pwa-discovery)
- Sanity CMS (Content), PostgreSQL (Drizzle ORM for Feedback), Service Worker (PWA) (001-wohin-pwa-discovery)

- SvelteKit 2 (TypeScript 5.x) + Tailwind CSS, Bits UI (Radix Svelte), MapLibre GL JS, Sanity Client/Image URL, Better-Auth (from app/), Drizzle ORM (from app/) (001-wohin-pwa-discovery)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

SvelteKit 2 (TypeScript 5.x): Follow standard conventions

## Recent Changes
- 001-wohin-pwa-discovery: Added SvelteKit 2 (TypeScript 5.x) + Tailwind CSS (Custom Theme), Bits UI (Radix Svelte), MapLibre GL JS, Sanity Clien

- 001-wohin-pwa-discovery: Added SvelteKit 2 (TypeScript 5.x) + Tailwind CSS, Bits UI (Radix Svelte), MapLibre GL JS, Sanity Client/Image URL, Better-Auth (from app/), Drizzle ORM (from app/)

<!-- MANUAL ADDITIONS START -->
- Replaced Expo app with Flutter app in `wohin-app` using Riverpod, flutter_map, and Dio.
<!-- MANUAL ADDITIONS END -->
