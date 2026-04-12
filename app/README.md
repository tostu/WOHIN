# wohin — the radiant curator ✨

"wohin" is a sun-drenched, fluid PWA for discovering the best vibes in town. No borders, just tonal shifts, juicy gradients, and playful micro-interactions.

## 🛠️ Tech Stack

- **Framework**: [SvelteKit 2](https://svelte.dev/) (Svelte 5 Runes)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Tonal Layering
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) with [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Better Auth](https://www.better-auth.com/) (Drizzle Adapter)
- **CMS**: [Sanity.io](https://www.sanity.io/) (Content Delivery)
- **Typography**: [Fontsource](https://fontsource.org/) (Plus Jakarta Sans Variable, Be Vietnam Pro)
- **Maps**: [MapLibre GL JS](https://maplibre.org/)

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/)
- [Sanity CLI](https://www.sanity.io/docs/cli)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

### Setup
1. **Clone & Install**: `cd app && bun install`
2. **Local Environment**: Create `app/.env` (see `app/.env.example`)
3. **Database**: `bun db:generate && bun db:push`
4. **Development**: `bun dev` (Discovery mode)
5. **Wrangler Proxy**: To use D1 and Better Auth locally, use `wrangler pages dev` or `bun preview`.

## 🎨 Design Philosophy (The Radiant Curator)

- **Strict No-Border Rule**: We use background tonal shifts to separate surfaces.
- **Tonal Layering**: `surface`, `surface-container-low`, `surface-container-high`.
- **Whimsy & Delight**: Animated empty states and "Vibe Check" feedback loops.
- **Massive Typography**: High contrast between display-lg (Jakarta Sans) and body-md (Vietnam Pro).

## 📱 PWA Features
- **Offline Mode**: Service Worker caches static assets for "Nap Mode".
- **Installable**: Full manifest configuration for iOS/Android.
