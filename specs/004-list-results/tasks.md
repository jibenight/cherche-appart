# Tasks: Results List View

**Input**: Design documents from `/specs/004-list-results/`
**Prerequisites**: plan.md (required), spec.md (required), property types from 002

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: List-specific infrastructure and types

- [X] T001 Create property types in `src/types/property.ts` (PropertyCard, PropertyDetail)
- [X] T002 [P] Create sort types in `src/types/sort.ts` (SortOption)
- [X] T003 Create `src/store/resultsStore.ts` Zustand store for results state (items, sortOrder, pagination)
- [X] T004 [P] Create `src/hooks/useSortedResults.ts` sorting logic hook
- [X] T005 [P] Install `@tanstack/react-virtual` for list virtualization

**Checkpoint**: List infrastructure ready

---

## Phase 2: User Story 1 - Property Cards List (Priority: P1) MVP

**Goal**: Browse search results as scrollable cards with key property info

**Independent Test**: Perform search → cards display with photo, price, surface, rooms → scroll loads more

### Implementation for User Story 1

- [X] T006 [P] [US1] Create `src/components/results/PropertyCard.tsx` card with thumbnail, price, surface, rooms, city, source
- [X] T007 [P] [US1] Create `src/components/results/PropertyCardSkeleton.tsx` loading skeleton
- [X] T008 [US1] Create `src/components/results/ResultsList.tsx` scrollable list container with virtualization
- [X] T009 [US1] Create `src/hooks/useInfiniteScroll.ts` infinite scroll / "Load more" hook
- [X] T010 [US1] Connect ResultsList to resultsStore (render cards from search results)
- [X] T011 [US1] Create `src/components/results/EmptyState.tsx` no-results message with filter relaxation suggestions
- [X] T012 [US1] Lazy load images in PropertyCard using Next.js Image component
- [X] T013 [US1] Unit test for resultsStore (pagination, data loading)

**Checkpoint**: Property cards list works with infinite scroll

---

## Phase 3: User Story 2 - Sorting & Result Count (Priority: P1) MVP

**Goal**: Sort results by price, surface, date, relevance and see total count

**Independent Test**: Select sort option → list reorders → result count displayed

### Implementation for User Story 2

- [X] T014 [US2] Create `src/components/results/SortBar.tsx` with sort dropdown and result count display
- [X] T015 [US2] Implement sort logic in useSortedResults: price_asc, price_desc, surface_asc, surface_desc, date_desc, relevance
- [X] T016 [US2] Connect SortBar to resultsStore (update sortOrder, trigger re-sort)
- [X] T017 [US2] Style result count: "142 biens trouvés" with filter context
- [X] T018 [US2] Unit test for sorting (verify order for each sort option)

**Checkpoint**: Sorting and result count work

---

## Phase 4: User Story 3 - Property Detail View (Priority: P2)

**Goal**: Full property detail page with photos, description, DPE, characteristics

**Independent Test**: Click property card → detail page loads with all info → back restores scroll

### Implementation for User Story 3

- [X] T019 [US3] Create `src/app/property/[id]/page.tsx` dynamic route for property detail
- [X] T020 [US3] Create `src/components/property/PropertyDetail.tsx` full detail layout
- [X] T021 [US3] Create `src/components/property/PhotoGallery.tsx` carousel with lightbox and swipe
- [X] T022 [US3] Create `src/components/property/PropertyCharacteristics.tsx` attributes table
- [X] T023 [US3] Create `src/components/property/EnergyRating.tsx` DPE/GES colored scale display
- [X] T024 [US3] Create `src/components/property/MiniMap.tsx` small Leaflet map showing property location
- [X] T025 [US3] Create `src/hooks/useScrollRestore.ts` preserve scroll position on back navigation
- [X] T026 [US3] Connect detail page to data source (fetch property by ID)
- [X] T027 [US3] Handle missing data gracefully: placeholder photo, "N/A" for missing fields

**Checkpoint**: Property detail page with photo gallery works

---

## Phase 5: User Story 4 - Responsive Layout (Priority: P2)

**Goal**: Mobile toggle between map and list, desktop side-by-side layout

**Independent Test**: Resize to mobile → toggle works. Desktop → both views visible.

### Implementation for User Story 4

- [X] T028 [US4] Create `src/components/layout/SplitView.tsx` side-by-side layout for desktop (>768px)
- [X] T029 [US4] Create `src/components/results/ViewToggle.tsx` map/list toggle button for mobile
- [X] T030 [US4] Implement responsive breakpoint logic: single view on mobile, split on desktop
- [X] T031 [US4] Ensure both views share the same results data and filter state
- [X] T032 [US4] E2E test: verify toggle on mobile viewport, verify split on desktop viewport

**Checkpoint**: Responsive layout works across all breakpoints

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T033 [P] Image optimization: WebP format, blur placeholders
- [X] T034 [P] Accessibility: card keyboard navigation, lightbox keyboard controls, aria labels
- [X] T035 E2E test: search → browse list → click card → detail → back → scroll restored
- [X] T036 Performance: verify 60fps scrolling with 100+ cards (virtualization)

---

## Dependencies & Execution Order

### Phase Dependencies
- **Foundational (Phase 1)**: Depends on 002-property-filters types
- **US1 (Phase 2)**: Depends on Foundational
- **US2 (Phase 3)**: Depends on US1 (needs list to sort)
- **US3 (Phase 4)**: Depends on US1 (needs card to click from)
- **US4 (Phase 5)**: Depends on US1 + 003-map-results (needs both views)
- **Polish (Phase 6)**: Depends on all user stories

### Parallel Opportunities
- T001, T002, T005 can run in parallel (Phase 1)
- T006, T007 can run in parallel (different components)
- US2 and US3 can run in parallel after US1 (independent features)
