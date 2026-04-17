# WOHIN App — Implementation Plan

## Current State (Post Phase 1 & 2)

### Completed
- [x] Phase 1: Foundation Fixes (all 6 tasks)
- [x] Phase 2: Core Feature Completion (all 5 tasks)

### What's Built
- 4-tab layout: Home, Discover, Map, Profile
- Home: search bar, activity pills, trending scroll, "Just Landed" cards
- Discover: 8 vibe tiles w/ bottom sheet filtered results
- Map: card-based location browser w/ "Open in Maps" nav buttons
- Location Detail: hero image, activity selector, portable text description, VibeCheck, vibe history
- Submit: auth-guarded form, reachable from Profile
- Login: email/password via better-auth
- Profile: real stats (vibes/spots), "Submit a Spot" button, sign out
- Favorites: backend D1 table + toggle API + useFavorites hook + heart button
- Share: RN Share API on LocationCard + detail screen header
- Search: backend text search (?q=) + search bar on Home
- expo-image everywhere (caching, transitions)
- Portable text renderer for Sanity blockContent
- Real feedback counts in LocationCard (no more hardcoded emojis)
- CMS themeColor schema fixed (matcha/peach/sunny)
- Template boilerplate removed

---

## Phase 3: Dark Mode & Theming

### Task 3.1: Extract Hardcoded Colors into Theme Constants
**Complexity**: M
**Description**: Every screen uses hardcoded colors directly in StyleSheets. Extract into theme system so dark mode works.
**Files to modify**:
- `constants/theme.ts` — expand with full color palette:
  - `background`: light `#fefcf4` / dark `#1a1918`
  - `surface`: light `#fff` / dark `#2c2b29`
  - `ink`: light `#2c2b29` / dark `#fefcf4`
  - `muted`: light `#8b8a87` / dark `#a8a7a4`
  - `border`: light `#2c2b2910` / dark `#fefcf415`
  - `accent.peach`: `#ffb7b2`
  - `accent.matcha`: `#a8e6cf`
  - `accent.sunny`: `#ffd97d`
  - `shadow`: light `#2c2b29` / dark `#000`
  - `overlay`: light `rgba(44,43,41,0.5)` / dark `rgba(0,0,0,0.7)`
**Files to create**:
- `hooks/use-app-theme.ts` — hook returning full color palette based on current colorScheme
**Dependencies**: None

### Task 3.2: Apply Theme to All Screens and Components
**Complexity**: L
**Description**: Replace every hardcoded hex value with themed color from useAppTheme hook.
**Files to modify** (all of these):
- `app/(tabs)/index.tsx` — background, text colors, card colors, search bar
- `app/(tabs)/discover.tsx` — background, modal overlay, text
- `app/(tabs)/map.tsx` — background, card colors, text
- `app/(tabs)/me.tsx` — background, avatar, stat boxes, buttons
- `app/login.tsx` — background, inputs, buttons
- `app/location/[slug].tsx` — background, content area, cards
- `app/submit.tsx` — background, form card, inputs
- `components/discovery/location-card.tsx` — card bg, text, shadows
- `components/feedback/vibe-check.tsx` — text, button backgrounds
- `components/portable-text.tsx` — text colors
- `app/(tabs)/_layout.tsx` — tab bar styling
**Dependencies**: Task 3.1

---

## Phase 4: UX Polish

### Task 4.1: Add Pull-to-Refresh on Home and Discover
**Complexity**: S
**Description**: Neither Home nor Discover supports pull-to-refresh.
**Files to modify**:
- `app/(tabs)/index.tsx` — wrap ScrollView with RefreshControl, re-fetch on pull
- `app/(tabs)/discover.tsx` — wrap ScrollView with RefreshControl, re-fetch featured
**Dependencies**: None

### Task 4.2: Add VibeCheck Animations
**Complexity**: S
**Description**: VibeCheck imports reanimated (useAnimatedStyle, withSpring, withSequence, withTiming, useSharedValue) but uses none. Implement tap animations.
**Files to modify**:
- `components/feedback/vibe-check.tsx`:
  - Wrap each vibe button in Animated.View
  - Scale bounce on press (withSpring to 1.2 then back to 1)
  - Success pulse effect when vibe is sent
  - Remove unused imports if any remain
**Dependencies**: None

### Task 4.3: Add Skeleton Loading States
**Complexity**: M
**Description**: Replace bare ActivityIndicator spinners with skeleton placeholders.
**Files to create**:
- `components/ui/skeleton.tsx` — reusable skeleton with shimmer animation (Animated opacity loop)
- `components/discovery/location-card-skeleton.tsx` — skeleton matching LocationCard layout (image box, text lines, action buttons)
**Files to modify**:
- `app/(tabs)/index.tsx` — show 3 card skeletons while loading
- `app/(tabs)/discover.tsx` — show grid skeletons while loading
- `app/(tabs)/map.tsx` — show list skeletons while loading
- `app/location/[slug].tsx` — show hero + content skeleton while loading
**Dependencies**: None

### Task 4.4: Add Error Boundary and Offline State
**Complexity**: M
**Description**: No error boundaries exist. Network failures show nothing or crash.
**Files to create**:
- `components/error-boundary.tsx` — React error boundary with retry button, styled consistently
- `components/offline-banner.tsx` — detect connectivity via expo-network (already installed), show banner
**Files to modify**:
- `app/_layout.tsx` — wrap app in ErrorBoundary, add OfflineBanner above Stack
**Dependencies**: None

### Task 4.5: Activity Filter on Home Screen
**Complexity**: M
**Description**: Activity pills on Home are tappable but do nothing. Should filter locations.
**Files to modify**:
- `app/(tabs)/index.tsx`:
  - Add `selectedActivity` state (null = all)
  - Add "All" pill at start
  - On pill tap: if activity selected, call `/api/v1/discovery/search?activityId=X`
  - On "All" tap: reset to featured results
  - Highlight selected pill with activity's themeColor
**Dependencies**: None

---

## Phase 5: Backend Gaps & Data Quality

### Task 5.1: Add `hours` Field to CMS Location Schema
**Complexity**: S
**Description**: Backend getLocationBySlug previously queried `hours` (now removed). Add field to CMS for future use, or skip entirely.
**Decision**: Add simple text field for MVP.
**Files to modify**:
- `wohin-cms/schemaTypes/location.ts` — add `hours` field (type: string, description: "e.g. Mon-Fri 9-18, Sat 10-16")
**Dependencies**: None

### Task 5.2: Populate Coordinates in Seed Data
**Complexity**: S
**Description**: Map feature needs coordinates. Seed data has none.
**Files to modify**:
- `wohin-cms/seed.ts` — add Berlin-area geopoints to each location:
  - Café Morgenrot: 52.5390, 13.4200
  - Klunkerkranich: 52.4810, 13.4340
  - Tempelhofer Feld: 52.4730, 13.4020
  - Mauerpark: 52.5440, 13.4030
  - Holzmarkt: 52.5120, 13.4280
  - Prinzessinnengärten: 52.5020, 13.4110
  - Sisyphos: 52.4930, 13.4690
**Dependencies**: None

### Task 5.3: Add Text Search to Backend (DONE in Phase 2)
**Status**: Completed — search endpoint now accepts `?q=` param

### Task 5.4: Compute Real Ratings from Vibe Feedback
**Complexity**: M
**Description**: Backend previously hardcoded ratings (4.5/4.8), now removed. Compute from vibe_feedback in D1.
**Approach**: Score = (sparkle*5 + fire*4 + chill*3 + nope*1) / total_vibes, normalized to 5.0 scale
**Files to modify**:
- `wohin-backend/src/services/feedback.ts` — add `getVibeSummaryForLocations(d1, locationIds[])` returning { locationId, rating, counts }
- `wohin-backend/src/services/discovery.ts` — after fetching from Sanity, enrich with D1 vibe data
- `wohin-backend/src/index.ts` — pass DB to discovery service calls
**Dependencies**: None

---

## Phase 6: Content & Engagement

### Task 6.1: Blog/Posts Screen
**Complexity**: L
**Description**: CMS has post, author, category schemas but app has zero blog features. Add posts feed.
**Files to create (backend)**:
- `wohin-backend/src/services/posts.ts` — Sanity GROQ queries:
  - `getPosts(limit)` — list with title, slug, excerpt, author, mainImage, publishedAt
  - `getPostBySlug(slug)` — full post with body (blockContent)
**Files to modify (backend)**:
- `wohin-backend/src/index.ts` — add `/api/v1/posts` and `/api/v1/posts/:slug` routes
**Files to create (app)**:
- `wohin-app/components/posts/post-card.tsx` — card with image, title, excerpt, author, date
- `wohin-app/app/post/[slug].tsx` — full post detail using PortableText component
**Files to modify (app)**:
- `wohin-app/app/(tabs)/index.tsx` — add "From the Blog" section after "Just Landed", or
- `wohin-app/app/_layout.tsx` — add post/[slug] to stack
**Dependencies**: Task 1.3 (portable text renderer — already done)

### Task 6.2: Deep Linking Configuration
**Complexity**: M
**Description**: App defines `scheme: "wohinapp"` but no linking config exists.
**Routes to support**:
- `wohinapp://location/{slug}` → `/location/[slug]`
- `wohinapp://post/{slug}` → `/post/[slug]`
- `wohinapp://discover` → `/(tabs)/discover`
**Files to modify**:
- `wohin-app/app.json` — add `intentFilters` (Android) and `associatedDomains` (iOS) for universal links
- `wohin-app/app/_layout.tsx` — expo-router handles file-based deep links automatically, but verify scheme works
**Dependencies**: None

### Task 6.3: Onboarding/Welcome Flow
**Complexity**: M
**Description**: New users land on Home with no context. Add 2-3 screen onboarding.
**Screens**:
1. "Welcome to WOHIN" — app concept (find spots by vibe)
2. "Drop Vibes" — explain the vibe check system
3. "Your City" — Berlin for now, future: city picker
**Files to create**:
- `wohin-app/app/onboarding.tsx` — horizontal pager with 3 slides, "Get Started" button
- `wohin-app/hooks/use-first-launch.ts` — AsyncStorage check for `@wohin/onboarded` flag
**Files to modify**:
- `wohin-app/app/_layout.tsx` — if first launch, redirect to /onboarding before showing tabs
**Dependencies**: None

---

## Architecture Notes

1. **Backend = Cloudflare Worker** (Hono + D1 + Sanity). Content in Sanity CMS. User data in D1 SQLite.
2. **`constants/config.ts` hardcodes LAN IP** (`http://192.168.178.45:8787`). Needs env-aware solution before deploy (Expo Constants / EAS env vars).
3. **No state management lib**. All local useState + useEffect. Consider Zustand or TanStack Query if complexity grows.
4. **Discover vibe filtering is client-side** — fetches 40 locations, filters by keyword. Won't scale. Move to backend query eventually.
5. **Map requires dev client** for interactive map (react-native-maps). Current approach = card list + native maps links. Upgrade path: `expo-dev-client` + `react-native-maps`.
6. **Favorites table** needs `drizzle-kit push` to create in D1 before favorites work in production.
7. **CMS has unused schemas**: post, author, category — built in Phase 6 or remove to reduce confusion.
