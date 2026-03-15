# Tasks: Map View with Results

**Input**: Design documents from `/specs/003-map-results/`
**Prerequisites**: plan.md (required), spec.md (required), 001-location-search MapContainer exists

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Map-specific infrastructure and types

- [X] T001 Create map types in `src/types/map.ts` (MapMarker, MarkerCluster, MapPopup, MapViewport)
- [X] T002 Create `src/store/mapStore.ts` Zustand store for map state (viewport, hoveredMarkerId, searchAsIMove)
- [X] T003 Install `leaflet.markercluster` and its React wrapper, add TypeScript declarations
- [X] T004 [P] Create `src/hooks/useMapViewport.ts` to track current map bounds

**Checkpoint**: Map infrastructure ready

---

## Phase 2: User Story 1 - Property Markers on Map (Priority: P1) MVP

**Goal**: Properties appear as markers with price labels, clicking shows popup

**Independent Test**: Search for properties → markers appear at correct locations → click shows summary

### Implementation for User Story 1

- [X] T005 [US1] Create `src/components/map/PropertyMarker.tsx` custom DivIcon marker with price label badge
- [X] T006 [US1] Create `src/components/map/MarkerPopup.tsx` popup card (thumbnail, price, surface, rooms, "See details" link)
- [X] T007 [US1] Create `src/components/map/PropertyMarkers.tsx` layer rendering all markers from search results
- [X] T008 [US1] Integrate markercluster plugin into PropertyMarkers for automatic clustering
- [X] T009 [US1] Style price label badges with Tailwind: pill shape, white bg, shadow, responsive font size
- [X] T010 [US1] Connect PropertyMarkers to search results store (render markers from results data)
- [X] T011 [US1] Unit test for marker data transformation (property → MapMarker)

**Checkpoint**: Markers with prices appear on map, clicking shows popup

---

## Phase 3: User Story 2 - Map Navigation & Interaction (Priority: P1) MVP

**Goal**: Smooth pan/zoom, search circle always visible, optional "search as I move"

**Independent Test**: Pan/zoom smoothly → circle stays positioned → toggle "search as I move"

### Implementation for User Story 2

- [X] T012 [US2] Enhance MapContainer with pan/zoom event handlers updating mapStore viewport
- [X] T013 [US2] Ensure SearchCircle (from 001) remains correctly positioned during pan/zoom
- [X] T014 [US2] Create `src/components/map/SearchAsIMove.tsx` toggle checkbox/switch
- [X] T015 [US2] Implement "search as I move" logic: detect viewport change → trigger new search for visible bounds
- [X] T016 [US2] Create `src/components/map/MapControls.tsx` zoom buttons + fullscreen toggle
- [X] T017 [US2] Optimize map rendering: use canvas renderer for >100 markers
- [X] T018 [US2] Touch support: verify pinch-zoom and touch-drag work on mobile

**Checkpoint**: Map is fully interactive with search-as-I-move

---

## Phase 4: User Story 3 - Map/List Synchronization (Priority: P2)

**Goal**: Hovering list items highlights markers, and vice versa

**Independent Test**: Hover list item → marker highlights on map. Hover marker → list item highlights.

### Implementation for User Story 3

- [X] T019 [US3] Create `src/hooks/useMapSync.ts` bidirectional sync hook (hoveredPropertyId shared between map and list)
- [X] T020 [US3] Add hover handlers to PropertyMarker: on mouseenter → set hoveredPropertyId in mapStore
- [X] T021 [US3] Add highlight style to PropertyMarker when it matches hoveredPropertyId (enlarge, border change)
- [X] T022 [US3] Connect list view PropertyCard to mapStore: highlight on match, scroll into view on marker click
- [X] T023 [US3] Unit test for useMapSync hook

**Checkpoint**: Map and list are synchronized on hover/click

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T024 [P] Add map loading skeleton while tiles load
- [X] T025 [P] Handle map tile server failure: show fallback message with list-only option
- [X] T026 Responsive testing: map on mobile (full width), tablet, desktop (split with list)
- [X] T027 E2E test: search → markers appear → click popup → verify info → cluster/uncluster on zoom
- [X] T028 Performance test: verify 30fps with 200+ markers during pan

---

## Dependencies & Execution Order

### Phase Dependencies
- **Foundational (Phase 1)**: Depends on 001-location-search MapContainer
- **US1 (Phase 2)**: Depends on Foundational
- **US2 (Phase 3)**: Depends on US1 (needs markers on map)
- **US3 (Phase 4)**: Depends on US1 + 004-list-results US1 (needs both map markers and list)
- **Polish (Phase 5)**: Depends on all user stories

### Parallel Opportunities
- T001, T002, T004 can run in parallel (Phase 1)
- T005, T006 can run in parallel (different components)
- US3 can start in parallel with US2 if list view exists
