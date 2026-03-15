# Tasks: Property Search Filters

**Input**: Design documents from `/specs/002-property-filters/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), 001-location-search completed

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Core filter infrastructure

- [ ] T001 Create filter types in `src/types/filters.ts` (FilterSet, PropertyType, PropertyCondition, PriceRange, SurfaceRange)
- [ ] T002 [P] Create Zod schemas in `src/schemas/filters.schema.ts` for filter validation
- [ ] T003 Create `src/store/filterStore.ts` Zustand store for filter state
- [ ] T004 Create `src/services/filterService.ts` with filter application logic (AND conditions) and URL serialization
- [ ] T005 [P] Install and configure `nuqs` for URL state management with Next.js App Router
- [ ] T006 Create `src/hooks/useFilters.ts` combining URL state + localStorage persistence

**Checkpoint**: Filter infrastructure ready

---

## Phase 2: User Story 1 - Basic Property Filters (Priority: P1) MVP

**Goal**: User can filter by property type, price range, surface, and rooms

**Independent Test**: Set filter combination → only matching properties appear

### Implementation for User Story 1

- [ ] T007 [P] [US1] Create `src/components/filters/PropertyTypeFilter.tsx` chip/button selector (Appartement, Maison, etc.)
- [ ] T008 [P] [US1] Create `src/components/filters/PriceRangeFilter.tsx` min/max inputs with euro formatting
- [ ] T009 [P] [US1] Create `src/components/filters/SurfaceRangeFilter.tsx` min/max inputs with m² unit
- [ ] T010 [P] [US1] Create `src/components/filters/RoomsFilter.tsx` number selector (1, 2, 3, 4, 5+)
- [ ] T011 [US1] Create `src/components/filters/ResetFiltersButton.tsx` reset all to defaults
- [ ] T012 [US1] Create `src/components/filters/ActiveFilterBadge.tsx` showing count of active filters
- [ ] T013 [US1] Create `src/components/filters/FilterBar.tsx` desktop horizontal bar combining all basic filters
- [ ] T014 [US1] Connect FilterBar to filterStore (bidirectional sync)
- [ ] T015 [US1] Create `src/hooks/useFilteredResults.ts` hook applying filters to property results
- [ ] T016 [US1] Unit test for filterService (AND conditions, edge cases like min > max)
- [ ] T017 [US1] Unit test for filterStore (set, reset, active count)

**Checkpoint**: Basic filters work, results update on filter change

---

## Phase 3: User Story 2 - Advanced Filters (Priority: P2)

**Goal**: User can refine search with bedrooms, floor, parking, elevator, balcony, condition

**Independent Test**: Expand advanced filters → apply → results narrow down

### Implementation for User Story 2

- [ ] T018 [US2] Create `src/components/filters/AdvancedFilters.tsx` expandable section with all advanced filter controls
- [ ] T019 [P] [US2] Add advanced filter fields: bedrooms input, floor range, parking/elevator/balcony toggles, condition selector
- [ ] T020 [US2] Integrate advanced filters with filterStore and URL params
- [ ] T021 [US2] Create `src/components/filters/FilterPanel.tsx` mobile bottom sheet/drawer for all filters
- [ ] T022 [US2] Unit test for advanced filter combinations

**Checkpoint**: Advanced filters work on desktop and mobile

---

## Phase 4: User Story 3 - Filter Persistence & Sharing (Priority: P3)

**Goal**: Filters persist between sessions, search is shareable via URL

**Independent Test**: Set filters → close browser → reopen → filters restored. Copy URL → open in new tab → same filters applied

### Implementation for User Story 3

- [ ] T023 [US3] Implement localStorage persistence for filters in filterService
- [ ] T024 [US3] Implement URL query param encoding/decoding for all filters via nuqs
- [ ] T025 [US3] Add "Share search" button that copies current URL with filter params to clipboard
- [ ] T026 [US3] Handle filter restoration priority: URL params > localStorage > defaults
- [ ] T027 [US3] Unit test for URL serialization/deserialization roundtrip

**Checkpoint**: Filters persist and are shareable

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T028 [P] Responsive testing: filter bar on mobile (320px), tablet (768px), desktop (1280px)
- [ ] T029 [P] Accessibility: aria labels for all inputs, keyboard navigation for chips
- [ ] T030 E2E test: set filters → verify results → share URL → open shared URL → verify filters match
- [ ] T031 Price input formatting: thousand separators, euro symbol display

---

## Dependencies & Execution Order

### Phase Dependencies
- **Foundational (Phase 1)**: Depends on 001-location-search setup being complete
- **US1 (Phase 2)**: Depends on Foundational
- **US2 (Phase 3)**: Depends on US1 (extends filter components)
- **US3 (Phase 4)**: Depends on US1 (needs filters to persist)
- **Polish (Phase 5)**: Depends on all user stories

### Parallel Opportunities
- T001, T002, T005 can run in parallel (Phase 1)
- T007, T008, T009, T010 can all run in parallel (different components)
- T019 advanced filter fields can be built in parallel
