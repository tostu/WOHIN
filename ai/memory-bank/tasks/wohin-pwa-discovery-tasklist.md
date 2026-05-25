# WOHIN PWA Discovery - Development Tasks

## Specification Summary
**Original Requirements**: 
- "Build a Progressive Web App (PWA) called wohin that provides an enhanced mobile experience with a native app feel and helps users discover locations based on specific activities and intentions (e.g., study, relax, party)."
- "The main view features a search interface for selecting an activity, displaying matching locations with key details like photos, ratings, and distance."
- "Users must create or log into an account to submit simple vibe feedback (e.g., thumbs up/down) for a location's specific activity."
- "Include a form for users to submit new locations, which are held in a pending state until a manual admin moderation interface approves them."
- "Include a global "Report a Problem" feature for data corrections."
- "Ensure the design is responsive and accessible (WCAG AA)."

**Technical Stack**: Expo, React Native, Expo Router, NativeWind (Tailwind CSS), MapLibre GL JS, Better-Auth. *(Note: Initial plan specified SvelteKit, but current codebase reflects an Expo React Native approach for a true native app feel.)*
**Target Timeline**: Iteration Phase 1 (Discovery & Vibe features)

## Development Tasks

### [x] Task 1: Basic App Structure & Navigation
**Description**: Create root layout, navigation tabs, and error boundary.
**Acceptance Criteria**: 
- Root layout provides routing logic.
- Offline banner is present.
- Tabs for Home, Discover, Map, and Profile (Me) exist.

**Files to Create/Edit**:
- `app/_layout.tsx`
- `app/(tabs)/_layout.tsx`
- `components/offline-banner.tsx`
- `components/error-boundary.tsx`

**Reference**: FR-003

### [x] Task 2: Location Discovery & Search (P1)
**Description**: Implement main views for browsing and searching locations by activity.
**Acceptance Criteria**:
- Search interface allows selecting activities/intentions.
- Locations match selected activities.
- Cards display photos, ratings, distance.

**Files to Create/Edit**:
- `app/(tabs)/index.tsx`
- `app/(tabs)/discover.tsx`
- `components/discovery/location-card.tsx`

**Reference**: FR-001, FR-002, User Story 1

### [x] Task 3: Location Profile (P1)
**Description**: Full view for a single location showing details.
**Acceptance Criteria**:
- Profile displays name, address, hours, and description.

**Files to Create/Edit**:
- `app/location/[slug].tsx`

**Reference**: FR-002, User Story 1

### [x] Task 4: The Vibe Check (P2)
**Description**: Interactive feedback system for logged-in users.
**Acceptance Criteria**:
- Authenticated users can drop playful "Vibe Checks".
- Includes micro-interactions/animations for delight.

**Files to Create/Edit**:
- `components/feedback/vibe-check.tsx`
- `app/login.tsx`

**Reference**: FR-004, FR-008, User Story 2

### [x] Task 5: Submit New Location (P3)
**Description**: User form to submit spots for moderation.
**Acceptance Criteria**:
- Form collects required fields and queues it for admin review.

**Files to Create/Edit**:
- `app/submit.tsx`

**Reference**: FR-005, User Story 3

### [ ] Task 6: Report a Problem (P3)
**Description**: Global feature allowing users to report data corrections.
**Acceptance Criteria**:
- Form accessible from location profiles.
- Submits report payload to the backend for admin review.

**Files to Create/Edit**:
- `app/report.tsx` (or a modal component in `location/[slug].tsx`)
- Backend endpoint integration for reports.

**Reference**: FR-006, User Story 3

### [ ] Task 7: Admin Moderation Interface (P3)
**Description**: Manual admin moderation view for pending locations and reports.
**Acceptance Criteria**:
- Admins can view pending submissions.
- Admins can approve or reject locations and reports.

**Files to Create/Edit**:
- Likely part of a separate admin dashboard or `app/(admin)/` routes.

**Reference**: FR-005, User Story 3

## Quality Requirements
- [x] All components use consistent "Sun-Drenched" theme styles (no-border rule, tonal layers).
- [ ] Ensure mobile accessibility complies with WCAG AA (Lighthouse Accessibility >= 90 equivalent for RN).
- [ ] Include E2E or Playwright screenshot testing setup.
- [ ] Handle missing location images with playful empty states.
