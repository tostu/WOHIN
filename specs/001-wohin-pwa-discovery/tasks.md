# Tasks: wohin-pwa-discovery (Sun-Drenched Social Edition)

**Input**: Design documents from `/specs/001-wohin-pwa-discovery/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Note**: All tasks must align with the **WOHIN Constitution** (Principles I-VI).

**Verification**: Automated tests (Contract/Integration) are MANDATORY (Principle IV) and must be written FIRST.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing (Principle III).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure (Principle II: START)

- [x] T001 Verify project structure in `app/` and `cms/` directories
- [x] T002 Configure Tailwind theme in `app/tailwind.config.ts` (Plus Jakarta Sans, Be Vietnam Pro, colors)
- [x] T003 [P] Setup tonal layering CSS variables in `app/src/app.css` (No-Border Rule)
- [x] T004 [P] Initialize Sanity project and dataset in `cms/`
- [x] T005 Initialize Drizzle with PostgreSQL connection in `app/src/lib/server/db/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Setup Better Auth configuration in `app/src/lib/server/auth.ts`
- [x] T007 [P] Implement Sanity client service in `app/src/lib/server/sanity.ts`
- [x] T008 Create base layout with glass navigation and tonal backgrounds in `app/src/routes/+layout.svelte`
- [x] T009 [P] Implement whimsical empty states and error components in `app/src/lib/components/shared/`
- [x] T010 Setup Drizzle schema for `VibeFeedback` in `app/src/lib/server/db/schema.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin (Principle III)

---

## Phase 3: User Story 1 - Location Discovery (Priority: P1) 🎯 MVP

**Goal**: Enable users to find locations by activity (study, relax, party) via search and map.

**Independent Test**: User selects "Study", sees list of relevant locations sorted by distance, and can view a profile.

### Tests for User Story 1 (MANDATORY) ⚠️

- [x] T011 [P] [US1] Contract test for Discovery Search API in `app/tests/contract/discovery.test.ts`
- [x] T012 [P] [US1] Integration test for Discovery flow in `app/tests/e2e/discovery.test.ts`

### Implementation for User Story 1 (Principle I: BUILD)

- [x] T013 [P] [US1] Create Sanity schemas for `Location` and `Activity` in `cms/schemaTypes/`
- [x] T014 [US1] Implement Discovery service in `app/src/lib/server/services/discovery.ts`
- [x] T015 [US1] Create API endpoint `GET /api/v1/discovery/search` in `app/src/routes/api/v1/discovery/search/+server.ts`
- [x] T016 [US1] Create API endpoint `GET /api/v1/discovery/location/[slug]` in `app/src/routes/api/v1/discovery/location/[slug]/+server.ts`
- [x] T017 [P] [US1] Implement ActivitySearch component in `app/src/lib/components/discovery/ActivitySearch.svelte`
- [x] T018 [P] [US1] Implement LocationList component in `app/src/lib/components/discovery/LocationList.svelte`
- [x] T019 [US1] Implement MapView component with MapLibre in `app/src/lib/components/discovery/MapView.svelte`
- [x] T020 [US1] Create Location Profile page in `app/src/routes/(app)/location/[slug]/+page.svelte`

**Checkpoint**: User Story 1 functional and verified independently (Principle II: SHIP)

---

## Phase 4: User Story 2 - The Vibe Check (Priority: P2)

**Goal**: Allow registered users to leave playful visual feedback (vibe checks) for locations.

**Independent Test**: Logged-in user submits a "sparkle" vibe on a profile and sees a visual celebration.

### Tests for User Story 2 (MANDATORY) ⚠️

- [x] T021 [P] [US2] Contract test for Vibe Feedback API in `app/tests/contract/feedback.test.ts`
- [x] T022 [P] [US2] Integration test for Vibe Check flow in `app/tests/e2e/feedback.test.ts`

### Implementation for User Story 2 (Principle I: BUILD)

- [x] T023 [US2] Implement Feedback service in `app/src/lib/server/services/feedback.ts`
- [x] T024 [US2] Create API endpoint `POST /api/v1/feedback/vibe` in `app/src/routes/api/v1/feedback/vibe/+server.ts`
- [x] T025 [P] [US2] Create API endpoint `GET /api/v1/feedback/me` in `app/src/routes/api/v1/feedback/me/+server.ts`
- [x] T026 [US2] Implement VibeCheck component with Lottie/CSS animations in `app/src/lib/components/feedback/VibeCheck.svelte`
- [x] T027 [US2] Integrate VibeCheck into Location Profile page in `app/src/routes/(app)/location/[slug]/+page.svelte`

**Checkpoint**: User Story 2 functional and verified independently (Principle II: SHIP)

---

## Phase 5: User Story 3 - Community Contributions (Priority: P3)

**Goal**: Allow users to submit new locations and report data issues for moderation.

**Independent Test**: User submits a location form and receives a "pending moderation" confirmation.

### Tests for User Story 3 (MANDATORY) ⚠️

- [x] T028 [P] [US3] Contract test for Submissions API in `app/tests/contract/submissions.test.ts`
- [x] T029 [P] [US3] Integration test for Community Contributions in `app/tests/e2e/submissions.test.ts`

### Implementation for User Story 3 (Principle I: BUILD)

- [x] T030 [US3] Implement Submissions service in `app/src/lib/server/services/submissions.ts`
- [x] T031 [US3] Create API endpoint `POST /api/v1/submissions/location` in `app/src/routes/api/v1/submissions/location/+server.ts`
- [x] T032 [US3] Create API endpoint `POST /api/v1/submissions/report` in `app/src/routes/api/v1/submissions/report/+server.ts`
- [x] T033 [P] [US3] Implement LocationForm component in `app/src/lib/components/submissions/LocationForm.svelte`
- [x] T034 [P] [US3] Implement ReportForm component in `app/src/lib/components/submissions/ReportForm.svelte`
- [x] T035 [US3] Create Submissions page in `app/src/routes/(app)/submit/+page.svelte`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final PWA features, accessibility, and performance optimizations.

- [x] T036 [P] Configure PWA manifest and splash screen in `app/static/manifest.json`
- [x] T037 [P] Implement Service Worker for offline "Nap Mode" in `app/src/service-worker.ts`
- [x] T038 Run accessibility audit (WCAG 2.1 AA) and apply fixes globally
- [x] T039 Optimize performance and SSG config in `app/svelte.config.js`
- [x] T040 [P] Finalize project documentation in `app/README.md` and `app/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (P1) is the primary focus for MVP.
  - US2 and US3 can proceed in parallel once US1 core is stable.

### Parallel Opportunities

- T003, T004 can run alongside T002.
- T007, T009 can run alongside T006.
- Tests (T011, T012) and Schemas (T013) can start simultaneously.
- UI Components (T017, T018) can be built while API (T015, T016) is in progress.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2 (Setup & Foundation).
2. Complete Phase 3 (Location Discovery).
3. **STOP and VALIDATE**: Verify search, list, and profile work with MapLibre.

### Incremental Delivery

1. Foundation ready.
2. Add US1 → MVP Discovery live.
3. Add US2 → Community engagement (Vibe Checks) live.
4. Add US3 → Community growth (Submissions) live.
5. Polish features (PWA, A11y).
