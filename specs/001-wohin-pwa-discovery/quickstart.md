# Quickstart: wohin-pwa-discovery (Sun-Drenched Social)

This guide helps you set up the development environment for the wohin PWA with the "Sun-Drenched Social" design system.

## Prerequisites
- **Bun**: Install via `curl -fsSL https://bun.sh/install | bash`
- **Sanity CLI**: `npm install -g sanity`
- **PostgreSQL**: Running instance (local or remote)

## Environment Setup
1. Clone the repository.
2. `cd app && bun install`
3. `cd ../cms && bun install`
4. Create `app/.env` from `.env.example` and fill in:
   - `DATABASE_URL`
   - `SANITY_PROJECT_ID`
   - `SANITY_DATASET`
   - `BETTER_AUTH_SECRET`

## Design System Setup
1. **Fonts**: Ensure `Plus Jakarta Sans` and `Be Vietnam Pro` are available (via `@fontsource` packages or Google Fonts).
2. **Tailwind Config**: Verify that `tailwind.config.ts` includes the custom color palette and typography settings from the "Sun-Drenched Social" strategy.
3. **No-Line Policy**: Check `global.css` for the "Strict No-Border" variables and tonal layering system.

## Running Locally

### 1. CMS (Sanity)
```bash
cd cms
bun dev
```
Accessible at `http://localhost:3333`.

### 2. App (SvelteKit)
```bash
cd app
bun dev
```
Accessible at `http://localhost:5173`.

## Database Migrations
```bash
cd app
bun x drizzle-kit generate
bun x drizzle-kit push
```
