# Feature Specification: Property Search Filters

**Feature Branch**: `feat/002-property-filters`
**Created**: 2026-03-15
**Status**: Draft
**Input**: User description: "Filtre de recherche du bien immobilier (surface, nombre de pièces, etc.)"

## User Scenarios & Testing

### User Story 1 - Basic Property Filters (Priority: P1)

A user wants to filter properties by essential criteria: property type (apartment, house), price range, surface area, and number of rooms. They set these filters and see results update accordingly.

**Why this priority**: These are the most common filters used in every property search. Without them, users cannot narrow down results to relevant properties.

**Independent Test**: Can be tested by setting a filter combination (e.g., apartment, 200k-400k, 50m²+, 3 rooms) and verifying only matching properties appear in results.

**Acceptance Scenarios**:

1. **Given** the user is on the search page, **When** they select "Appartement" as property type, **Then** only apartments appear in the results
2. **Given** the user sets a price range of 150,000 to 300,000 euros, **When** results update, **Then** only properties within that range are displayed
3. **Given** the user sets minimum surface to 40m², **When** results update, **Then** no property below 40m² appears
4. **Given** the user selects 3+ rooms, **When** results update, **Then** only properties with 3 or more rooms are shown
5. **Given** multiple filters are active, **When** the user clicks "Reset filters", **Then** all filters return to default values and all results appear

---

### User Story 2 - Advanced Filters (Priority: P2)

A user wants to refine their search with additional criteria: number of bedrooms, floor level, parking/garage, elevator, balcony/terrace, and property condition (new/renovated/to renovate).

**Why this priority**: Important for users who know exactly what they want, but basic filters cover most initial searches.

**Independent Test**: Can be tested by applying advanced filters and verifying results match all selected criteria.

**Acceptance Scenarios**:

1. **Given** the user expands "Advanced filters", **When** they select "With elevator", **Then** only properties with elevator are shown
2. **Given** the user selects "Ground floor" and "With terrace", **When** results update, **Then** only ground-floor properties with terrace appear
3. **Given** the user selects property condition "Neuf", **When** results update, **Then** only new-build properties appear

---

### User Story 3 - Filter Persistence & Sharing (Priority: P3)

A user wants their filter settings to persist between sessions and be able to share a search via URL.

**Why this priority**: Quality of life improvement. Users don't lose their search configuration between visits.

**Independent Test**: Can be tested by setting filters, closing the browser, returning, and verifying filters are restored.

**Acceptance Scenarios**:

1. **Given** the user has set filters, **When** they close and reopen the browser, **Then** the previous filter configuration is restored
2. **Given** filters are active, **When** the user clicks "Share search", **Then** a URL with encoded filter parameters is copied to clipboard
3. **Given** a user opens a shared search URL, **When** the page loads, **Then** all filters from the URL are applied and matching results are shown

---

### Edge Cases

- What happens when no properties match the filter combination? -> Show "No results. Try expanding your search area or adjusting filters." with suggestion to relax the most restrictive filter
- What happens when the user sets min price > max price? -> Auto-swap values and show info message
- What happens when filter values contain special characters? -> Sanitize all inputs, accept only valid numeric/enum values
- What happens with extremely large surface values (>10,000m²)? -> Cap at reasonable maximum with message

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide filters for: property type, price range (min/max), surface area (min/max), number of rooms (min)
- **FR-002**: System MUST provide advanced filters for: bedrooms, floor level, parking, elevator, balcony/terrace, property condition
- **FR-003**: Filters MUST apply as AND conditions (all must match)
- **FR-004**: System MUST display a count of matching results when filters change
- **FR-005**: System MUST allow resetting all filters to defaults with one action
- **FR-006**: System MUST persist filter state in URL query parameters for shareability
- **FR-007**: System MUST persist last used filters in browser local storage
- **FR-008**: Price filter MUST support euro currency with thousand separators
- **FR-009**: Surface filter MUST use square meters (m²)
- **FR-010**: System MUST show active filter count as a badge indicator

### Key Entities

- **FilterSet**: Complete collection of all active search filters with their current values
- **PropertyType**: Enumeration of property types (Appartement, Maison, Terrain, Local commercial, Immeuble)
- **PropertyCondition**: Enumeration of conditions (Neuf, Bon état, À rénover, À rafraîchir)
- **PriceRange**: Min/max price in euros
- **SurfaceRange**: Min/max surface in m²

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can set basic filters in under 5 seconds
- **SC-002**: Results update within 500ms of filter change
- **SC-003**: Filter state is correctly encoded in shareable URLs
- **SC-004**: 90% of users can find properties matching their criteria within 3 filter adjustments
- **SC-005**: Advanced filters are accessible within 1 click from the main filter bar
