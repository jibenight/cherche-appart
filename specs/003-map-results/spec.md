# Feature Specification: Map View with Results

**Feature Branch**: `feat/003-map-results`
**Created**: 2026-03-15
**Status**: Draft
**Input**: User description: "Carte listant les résultats"

## User Scenarios & Testing

### User Story 1 - Property Markers on Map (Priority: P1)

A user wants to see all matching properties displayed as markers on an interactive map. Each marker shows the property price. Clicking a marker reveals a summary popup with key details.

**Why this priority**: The map is the primary visual interface for spatial property search. It provides immediate geographic context that a list cannot.

**Independent Test**: Can be tested by performing a search and verifying markers appear at correct locations with prices, and clicking shows property summary.

**Acceptance Scenarios**:

1. **Given** a search returns 15 properties, **When** the map loads, **Then** 15 markers appear at their respective geographic positions with price labels
2. **Given** markers are displayed, **When** the user clicks a marker, **Then** a popup shows: photo thumbnail, price, surface, rooms count, and a "See details" link
3. **Given** the user zooms out on the map, **When** markers overlap, **Then** they cluster into a group showing the count of properties in that cluster
4. **Given** the user clicks a cluster, **When** the map zooms in, **Then** individual markers become visible

---

### User Story 2 - Map Navigation & Interaction (Priority: P1)

A user wants to pan, zoom, and interact with the map fluidly. The search area circle is always visible. The map re-fetches results when the user pans to a new area (optional "search as I move" mode).

**Why this priority**: Essential for usable map experience. Without smooth navigation, the map becomes unusable.

**Independent Test**: Can be tested by panning/zooming the map and verifying the interaction is fluid and responsive.

**Acceptance Scenarios**:

1. **Given** the map is loaded, **When** the user drags to pan, **Then** the map moves smoothly at 30fps minimum
2. **Given** the user has a search radius set, **When** they pan the map, **Then** the search area circle remains visible and correctly positioned
3. **Given** "Search as I move" is enabled, **When** the user pans to a new area, **Then** new results load for the visible area within 1 second
4. **Given** the user pinch-zooms on mobile, **When** zoom level changes, **Then** the map responds fluidly and clusters/uncluters markers appropriately

---

### User Story 3 - Map/List Synchronization (Priority: P2)

A user wants the map and list views to stay synchronized. Hovering over a list item highlights the corresponding marker on the map, and vice versa.

**Why this priority**: Enhances usability but requires both map and list to be implemented first.

**Independent Test**: Can be tested by hovering on list items and verifying map markers highlight, and vice versa.

**Acceptance Scenarios**:

1. **Given** both map and list are visible, **When** the user hovers over a property in the list, **Then** the corresponding map marker is highlighted (enlarged, different color)
2. **Given** both map and list are visible, **When** the user hovers over a map marker, **Then** the corresponding list item is highlighted with a subtle background change
3. **Given** the user clicks a map marker, **When** the list is visible, **Then** the list scrolls to show the corresponding property card

---

### Edge Cases

- What happens when there are 500+ markers? -> Cluster aggressively, load markers only for visible area
- What happens when a property has no coordinates? -> Exclude from map view, show in list with "Location not available" badge
- What happens on very slow connections? -> Show map skeleton with loading indicator, load markers progressively
- What happens when the map tile server is unavailable? -> Show fallback message with list-only mode option
- What happens when user denies location cookies? -> Map still works, just centers on default France view

## Requirements

### Functional Requirements

- **FR-001**: System MUST display an interactive map with OpenStreetMap tiles (or equivalent open-source)
- **FR-002**: System MUST render property markers with price labels at their geographic coordinates
- **FR-003**: System MUST cluster overlapping markers when zoomed out
- **FR-004**: System MUST show a popup on marker click with: thumbnail, price, surface, rooms, link to detail
- **FR-005**: System MUST display the search area circle on the map
- **FR-006**: System MUST support pan, zoom (scroll + pinch), and double-click zoom
- **FR-007**: System MUST maintain 30fps during map interactions
- **FR-008**: System MUST support a "search as I move" toggle for dynamic area search
- **FR-009**: System MUST synchronize map markers with list view (highlight on hover)
- **FR-010**: System MUST handle graceful degradation when map tiles fail to load

### Key Entities

- **MapMarker**: Represents a property on the map with position (lat/lng), price label, and property reference
- **MarkerCluster**: A group of nearby markers showing aggregate count
- **MapPopup**: Summary card displayed on marker click with property thumbnail and key details
- **MapViewport**: Current map bounds (north, south, east, west) and zoom level

## Success Criteria

### Measurable Outcomes

- **SC-001**: Map renders with markers within 2 seconds of search completion
- **SC-002**: Map maintains 30fps during pan/zoom interactions on mid-range devices
- **SC-003**: Marker popups open within 200ms of click
- **SC-004**: Clustering activates automatically when markers overlap at current zoom level
- **SC-005**: Map/list synchronization highlight responds within 100ms of hover
