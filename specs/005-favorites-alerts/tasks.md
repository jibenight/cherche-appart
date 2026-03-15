# Tasks: Favorites & Search Alerts

**Input**: Design documents from `/specs/005-favorites-alerts/`
**Prerequisites**: plan.md (required), spec.md (required), 004-list-results PropertyCard exists

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Favorites and alerts infrastructure

- [X] T001 Create favorite types in `src/types/favorites.ts` (Favorite, PropertyComparison)
- [X] T002 [P] Create alert types in `src/types/alerts.ts` (SearchAlert, SearchHistoryEntry)
- [X] T003 Create `src/store/favoritesStore.ts` Zustand store for favorites state
- [X] T004 Create `src/services/favoritesService.ts` CRUD operations on favorites (localStorage)
- [X] T005 [P] Create `src/services/historyService.ts` search history management (localStorage)
- [X] T006 [P] Create `src/services/alertsService.ts` CRUD operations on alerts (localStorage for MVP)

**Checkpoint**: Favorites infrastructure ready

---

## Phase 2: User Story 1 - Save Favorite Properties (Priority: P1) MVP

**Goal**: User can favorite/unfavorite properties and view favorites page

**Independent Test**: Click heart icon → property saved → navigate to favorites page → property appears

### Implementation for User Story 1

- [X] T007 [US1] Create `src/components/favorites/FavoriteButton.tsx` heart/star toggle component
- [X] T008 [US1] Integrate FavoriteButton into PropertyCard and PropertyDetail components
- [X] T009 [US1] Create `src/hooks/useFavorites.ts` hook for favorite CRUD operations
- [X] T010 [US1] Create `src/app/favorites/page.tsx` favorites page route
- [X] T011 [US1] Create `src/components/favorites/FavoritesList.tsx` grid of favorited property cards
- [X] T012 [US1] Create `src/components/favorites/FavoritesCounter.tsx` badge in nav showing count
- [X] T013 [US1] Implement localStorage persistence in favoritesService (save, load, remove)
- [X] T014 [US1] Handle edge case: favorited property no longer available (show "unavailable" badge)
- [X] T015 [US1] Unit test for favoritesService (add, remove, persist, load)

**Checkpoint**: Favorites work with persistence across sessions

---

## Phase 3: User Story 2 - Compare Properties (Priority: P2)

**Goal**: Side-by-side comparison of 2-4 favorited properties on key criteria

**Independent Test**: Select 2+ favorites → click "Compare" → comparison table appears

### Implementation for User Story 2

- [X] T016 [US2] Create `src/hooks/useComparison.ts` hook for comparison selection (2-4 properties)
- [X] T017 [US2] Create `src/components/compare/ComparisonSelector.tsx` checkboxes on favorite cards
- [X] T018 [US2] Create `src/app/compare/page.tsx` comparison view route
- [X] T019 [US2] Create `src/components/compare/ComparisonTable.tsx` side-by-side grid layout
- [X] T020 [US2] Create `src/components/compare/ComparisonMetric.tsx` single row with best-value highlighting
- [X] T021 [US2] Implement metric comparison: price, price/m², surface, rooms, bedrooms, DPE
- [X] T022 [US2] Style: horizontal scroll on mobile, fixed first column with metric names
- [X] T023 [US2] Unit test for comparison logic (best value detection, missing data handling)

**Checkpoint**: Property comparison works

---

## Phase 4: User Story 3 - Search Alerts (Priority: P3)

**Goal**: Save search criteria as named alerts with notification frequency

**Independent Test**: Set filters → click "Create alert" → alert appears in alerts page

### Implementation for User Story 3

- [X] T024 [US3] Create `src/components/alerts/AlertForm.tsx` form: name, frequency selector (instant/daily/weekly)
- [X] T025 [US3] Create `src/app/alerts/page.tsx` alerts management page route
- [X] T026 [US3] Create `src/components/alerts/AlertCard.tsx` alert summary with on/off toggle and edit/delete
- [X] T027 [US3] Create `src/components/alerts/AlertsList.tsx` list of saved alerts
- [X] T028 [US3] Implement alert CRUD in alertsService (create, update, toggle, delete, limit to 10)
- [X] T029 [US3] Add "Create alert" button on search page (captures current location + filters)
- [X] T030 [US3] Unit test for alertsService (CRUD, limit enforcement)

**Checkpoint**: Alert management UI works (notifications deferred to backend phase)

---

## Phase 5: User Story 4 - Search History (Priority: P3)

**Goal**: View and re-run recent searches

**Independent Test**: Perform searches → click "Recent searches" → see history → click to restore

### Implementation for User Story 4

- [X] T031 [US4] Create `src/hooks/useSearchHistory.ts` hook for history operations
- [X] T032 [US4] Create `src/app/history/page.tsx` search history page route
- [X] T033 [US4] Create `src/components/history/HistoryEntry.tsx` search summary card with location, filters, date
- [X] T034 [US4] Create `src/components/history/SearchHistory.tsx` list of recent searches (max 10)
- [X] T035 [US4] Implement auto-save to history on each search (deduplicate similar searches)
- [X] T036 [US4] Implement "re-run search" click: restore location, filters, trigger search
- [X] T037 [US4] Unit test for historyService (save, limit, dedup, restore)

**Checkpoint**: Search history works

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T038 [P] Add navigation menu with links to: Search, Favorites, Compare, Alerts, History
- [X] T039 [P] Accessibility: aria labels for favorite button, comparison table
- [X] T040 E2E test: favorite → compare → create alert → check history
- [X] T041 Handle localStorage quota exceeded: warn user, remove oldest entries

---

## Dependencies & Execution Order

### Phase Dependencies
- **Foundational (Phase 1)**: Depends on 004-list-results types
- **US1 (Phase 2)**: Depends on Foundational + PropertyCard from 004
- **US2 (Phase 3)**: Depends on US1 (needs favorites to compare)
- **US3 (Phase 4)**: Depends on US1 + 002-property-filters (needs filters to save as alert)
- **US4 (Phase 5)**: Depends on 001 + 002 (needs search state to record)
- **Polish (Phase 6)**: Depends on all user stories

### Parallel Opportunities
- T001, T002, T005, T006 can run in parallel (Phase 1)
- US3 and US4 can run in parallel (independent features)
