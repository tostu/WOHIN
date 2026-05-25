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
- Theme system completed (useAppTheme)
- UX Polish: Skeletons, Pull-to-refresh, Offline Banner, Error Boundary
- Map: NativeMap component with React Native Maps, Web fallback list
- Onboarding Flow with AsyncStorage flag
- Deep linking configured (intentFilters & associatedDomains)
- Backend search updated to handle vibe/keyword scalability

---

## Phase 3: Dark Mode & Theming (COMPLETED)

### Task 3.1: Extract Hardcoded Colors into Theme Constants (DONE)
### Task 3.2: Apply Theme to All Screens and Components (DONE)

---

## Phase 4: UX Polish (COMPLETED)

### Task 4.1: Add Pull-to-Refresh on Home and Discover (DONE)
### Task 4.2: Add VibeCheck Animations (DONE)
### Task 4.3: Add Skeleton Loading States (DONE)
### Task 4.4: Add Error Boundary and Offline State (DONE)
### Task 4.5: Activity Filter on Home Screen (DONE)

---

## Phase 5: Backend Gaps & Data Quality (COMPLETED)

### Task 5.1: Add `hours` Field to CMS Location Schema (DONE)
### Task 5.2: Populate Coordinates in Seed Data (DONE)
### Task 5.3: Add Text Search to Backend (DONE)
### Task 5.4: Compute Real Ratings from Vibe Feedback (DONE)

---

## Phase 6: UX & Engagement (COMPLETED)

### Task 6.1: Deep Linking Configuration (DONE)
### Task 6.2: Onboarding/Welcome Flow (DONE)

---

## Future Polish & Architecture Needed

1. **Backend = Cloudflare Worker** (Hono + D1 + Sanity).
2. **Offline Data Caching**: The app currently doesn't cache API queries for offline use. Implementing TanStack Query is recommended.
3. **Favorites Push**: D1 table needs `drizzle-kit push` for favorites to persist.
4. **Error Reporting**: Consider integrating Sentry/Crashlytics.
