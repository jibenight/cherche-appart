# Feature Specification: Results List View

**Feature Branch**: `feat/004-list-results`
**Created**: 2026-03-15
**Status**: Draft
**Input**: User description: "Liste des résultats"

## User Scenarios & Testing

### User Story 1 - Property Cards List (Priority: P1)

A user wants to browse search results as a scrollable list of property cards. Each card shows a photo, price, key details (surface, rooms, location), and source. The list supports sorting and pagination.

**Why this priority**: The list view is the primary way users browse and compare multiple properties. It complements the map with structured, scannable information.

**Independent Test**: Can be tested by performing a search and verifying property cards display correct information in a scrollable list.

**Acceptance Scenarios**:

1. **Given** a search returns results, **When** the list view loads, **Then** property cards are displayed showing: main photo, price, surface (m²), rooms count, city/neighborhood, and source
2. **Given** results are loaded, **When** the user scrolls down, **Then** more results load progressively (infinite scroll or "Load more" button)
3. **Given** the user wants to sort, **When** they select "Price ascending", **Then** properties reorder from cheapest to most expensive
4. **Given** a property card, **When** the user clicks on it, **Then** they navigate to a detail page with full property information

---

### User Story 2 - Sorting & Result Count (Priority: P1)

A user wants to sort results by different criteria and always know how many properties match their search.

**Why this priority**: Sorting is essential for comparing properties. Result count sets expectations.

**Independent Test**: Can be tested by applying different sort orders and verifying the list reorders correctly.

**Acceptance Scenarios**:

1. **Given** results are displayed, **When** the user sees the header, **Then** a total result count is shown (e.g., "142 biens trouvés")
2. **Given** results are displayed, **When** the user selects "Price descending", **Then** the most expensive properties appear first
3. **Given** results are displayed, **When** the user selects "Surface descending", **Then** the largest properties appear first
4. **Given** results are displayed, **When** the user selects "Most recent", **Then** the most recently listed properties appear first

---

### User Story 3 - Property Detail View (Priority: P2)

A user wants to see the full details of a property including all photos, complete description, amenities, energy rating (DPE/GES), and contact information.

**Why this priority**: Important for decision-making but users first need to find properties through the list.

**Independent Test**: Can be tested by clicking a property card and verifying all details are displayed correctly.

**Acceptance Scenarios**:

1. **Given** the user clicks a property card, **When** the detail page loads, **Then** it shows: photo gallery, full description, all characteristics, DPE/GES ratings, location on mini-map, price, and source link
2. **Given** the detail page is open, **When** the user clicks through photos, **Then** a lightbox gallery navigates through all property photos
3. **Given** the detail page is open, **When** the user clicks "Back to results", **Then** they return to the list at their previous scroll position

---

### User Story 4 - Responsive Layout (Priority: P2)

A user wants to use the app on mobile where map and list cannot be shown side-by-side. They can toggle between map view and list view.

**Why this priority**: Essential for mobile usability but requires both map and list features to be complete.

**Independent Test**: Can be tested by resizing browser to mobile width and verifying the toggle works and both views display correctly.

**Acceptance Scenarios**:

1. **Given** the user is on a mobile device, **When** the page loads, **Then** they see either the map or the list (not both) with a toggle button
2. **Given** the user is viewing the list on mobile, **When** they tap "Map", **Then** the map view appears with the same results
3. **Given** the user is on desktop, **When** the viewport is wider than 768px, **Then** both map and list are shown side-by-side

---

### Edge Cases

- What happens when a property has no photos? -> Show a placeholder image with property type icon
- What happens when the list is empty after filtering? -> Show "No results" state with filter relaxation suggestions
- What happens when property data is incomplete? -> Show available fields, mark missing fields as "N/A"
- What happens on infinite scroll with 1000+ results? -> Virtualize the list, render only visible cards
- What happens when the user navigates back from detail? -> Restore scroll position and filter state

## Requirements

### Functional Requirements

- **FR-001**: System MUST display property results as cards with: photo, price, surface, rooms, location, source
- **FR-002**: System MUST support sorting by: price (asc/desc), surface (asc/desc), date listed (recent first), relevance
- **FR-003**: System MUST display total result count
- **FR-004**: System MUST support progressive loading (infinite scroll or pagination)
- **FR-005**: System MUST provide a property detail view with full information
- **FR-006**: System MUST show photo gallery with lightbox on detail view
- **FR-007**: System MUST display DPE/GES energy ratings on detail view
- **FR-008**: System MUST be responsive with map/list toggle on mobile (<768px)
- **FR-009**: System MUST preserve scroll position when navigating back from detail
- **FR-010**: System MUST show loading skeleton while data is being fetched
- **FR-011**: System MUST handle properties with missing data gracefully (placeholder photo, "N/A" fields)

### Key Entities

- **PropertyCard**: Summary view of a property with thumbnail, price, surface, rooms, location
- **PropertyDetail**: Full property information with photo gallery, description, characteristics, energy ratings
- **SortOption**: Enumeration of sort criteria (price_asc, price_desc, surface_asc, surface_desc, date_desc, relevance)
- **Pagination**: Current page, items per page, total count, has_more flag

## Success Criteria

### Measurable Outcomes

- **SC-001**: Property cards render within 1 second of search completion
- **SC-002**: Scrolling through the list maintains 60fps
- **SC-003**: Sort change reorders results within 300ms
- **SC-004**: Detail page loads within 1.5 seconds
- **SC-005**: Photo gallery navigation responds within 100ms
- **SC-006**: Mobile toggle between map and list takes under 300ms
