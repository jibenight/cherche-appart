# Tasks: Location & Search Radius

**Input**: Design documents from `/specs/001-location-search/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js 14 project with TypeScript strict mode, Tailwind CSS, pnpm
- [X] T002 [P] Configure ESLint, Prettier, and TypeScript strict settings
- [X] T003 [P] Configure Vitest for unit testing
- [X] T004 [P] Configure Playwright for E2E testing
- [X] T005 Create project directory structure per plan.md (components/, services/, hooks/, types/, store/)
- [X] T006 [P] Create `.gitignore` with Node.js, Next.js, and IDE entries

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create base types in `src/types/location.ts` (Location, SearchArea, GeoSuggestion)
- [X] T008 [P] Create Zod schemas in `src/schemas/location.schema.ts` for API response validation
- [X] T009 [P] Create `src/hooks/useDebounce.ts` debounce utility hook
- [X] T010 [P] Create `src/hooks/useLocalStorage.ts` typed localStorage hook
- [X] T011 Create `src/store/searchStore.ts` Zustand store for search state (location, radius)
- [X] T012 Create `src/services/storage.ts` localStorage persistence service

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - City Search with Autocomplete (Priority: P1) MVP

**Goal**: User can type a city name, see autocomplete suggestions, and select a location

**Independent Test**: Type a city name → see suggestions → select one → map centers on it

### Implementation for User Story 1

- [X] T013 [US1] Create `src/services/geocoding.ts` with API Adresse integration (search endpoint, type=municipality)
- [X] T014 [US1] Create `src/components/search/LocationInput.tsx` autocomplete input with debounced API calls
- [X] T015 [US1] Style LocationInput with Tailwind: dropdown suggestions, loading state, clear button
- [X] T016 [US1] Integrate LocationInput with searchStore (update location on selection)
- [X] T017 [US1] Create `src/components/map/MapContainer.tsx` with Leaflet initialization (dynamic import, ssr: false)
- [X] T018 [US1] Connect MapContainer to searchStore to center map on selected location
- [X] T019 [US1] Unit test for geocoding service (mock API responses)
- [X] T020 [US1] Unit test for searchStore (location selection, reset)

**Checkpoint**: User can search for a city and map centers on it

---

## Phase 4: User Story 2 - Search Radius Configuration (Priority: P1) MVP

**Goal**: User can set a search radius and see it visually on the map

**Independent Test**: Select city → adjust radius slider → circle updates on map

### Implementation for User Story 2

- [X] T021 [US2] Create `src/components/search/RadiusSlider.tsx` slider component (1-100km range)
- [X] T022 [US2] Style RadiusSlider with Tailwind: slider track, thumb, km value display
- [X] T023 [US2] Create `src/components/map/SearchCircle.tsx` Leaflet circle overlay for search radius
- [X] T024 [US2] Connect RadiusSlider to searchStore (update radius on change)
- [X] T025 [US2] Connect SearchCircle to searchStore (update circle when location or radius changes)
- [X] T026 [US2] Create `src/components/search/SearchBar.tsx` container combining LocationInput + RadiusSlider
- [X] T027 [US2] Implement localStorage persistence for last used location and radius
- [X] T028 [US2] Unit test for searchStore radius operations

**Checkpoint**: User can set location + radius, see circle on map, settings persist

---

## Phase 5: User Story 3 - Geolocation (Priority: P2)

**Goal**: User can use browser GPS position as search center

**Independent Test**: Click "Use my location" → map centers on GPS position

### Implementation for User Story 3

- [X] T029 [US3] Create `src/hooks/useGeolocation.ts` browser geolocation hook with error handling
- [X] T030 [US3] Create `src/components/map/GeolocationButton.tsx` button with loading/error states
- [X] T031 [US3] Integrate GeolocationButton with searchStore (set location from GPS coordinates)
- [X] T032 [US3] Handle edge cases: permission denied, timeout (5s), coordinates outside France
- [X] T033 [US3] Unit test for useGeolocation hook (mock navigator.geolocation)

**Checkpoint**: Geolocation works as alternative to manual city search

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T034 [P] Add loading skeletons for map and search components
- [X] T035 [P] Add error boundary for map component (fallback if tiles fail)
- [X] T036 Responsive layout testing: verify mobile (320px), tablet (768px), desktop (1280px)
- [X] T037 E2E test: full location search flow (type city → select → set radius → verify map)
- [X] T038 Accessibility: keyboard navigation for autocomplete, aria labels for slider and map

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational
- **US2 (Phase 4)**: Depends on Foundational (can parallel with US1 for non-map tasks)
- **US3 (Phase 5)**: Depends on US1 (needs MapContainer and searchStore)
- **Polish (Phase 6)**: Depends on all user stories complete

### Parallel Opportunities
- T002, T003, T004, T006 can all run in parallel (Phase 1)
- T008, T009, T010 can all run in parallel (Phase 2)
- US1 and US2 can partially overlap (different components)
