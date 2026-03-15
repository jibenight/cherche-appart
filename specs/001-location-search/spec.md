# Feature Specification: Location & Search Radius

**Feature Branch**: `feat/001-location-search`
**Created**: 2026-03-15
**Status**: Draft
**Input**: User description: "Choix de la localisation (ville) et rayon de recherche du bien à partir de la localisation en km"

## User Scenarios & Testing

### User Story 1 - City Search with Autocomplete (Priority: P1)

A user wants to select a city as their search center. They start typing a city name and see autocomplete suggestions with city names, postal codes, and departments. They select one and the map centers on that location.

**Why this priority**: This is the foundational interaction for the entire app. Without location selection, no search can be performed.

**Independent Test**: Can be fully tested by typing a city name, selecting from suggestions, and verifying the map centers on the correct coordinates.

**Acceptance Scenarios**:

1. **Given** the user is on the search page, **When** they type "Par" in the location input, **Then** they see suggestions including "Paris (75000)", "Paris 1er (75001)", "Paray-le-Monial (71600)" within 300ms
2. **Given** suggestions are displayed, **When** the user selects "Lyon (69000)", **Then** the map centers on Lyon's coordinates (45.7640, 4.8357) and the input displays "Lyon (69000)"
3. **Given** the user has selected a city, **When** they clear the input, **Then** the search is reset and no location filter is active

---

### User Story 2 - Search Radius Configuration (Priority: P1)

A user wants to define a search radius around their selected city. They use a slider or input to set the radius in kilometers. A visual circle on the map reflects the search area.

**Why this priority**: The radius is essential to define the search perimeter. Without it, results would be either too broad (entire country) or too narrow (exact city only).

**Independent Test**: Can be tested by selecting a city, adjusting the radius slider, and verifying the circle on the map updates accordingly.

**Acceptance Scenarios**:

1. **Given** the user has selected "Bordeaux" as location, **When** they set the radius to 15km, **Then** a circle of 15km radius appears on the map centered on Bordeaux
2. **Given** a radius of 10km is set, **When** the user drags the slider to 30km, **Then** the circle expands smoothly and search results update to include properties within 30km
3. **Given** no city is selected, **When** the user tries to set a radius, **Then** a tooltip prompts them to select a city first

---

### User Story 3 - Geolocation (Priority: P2)

A user wants to use their current GPS position as the search center instead of typing a city name.

**Why this priority**: Convenient shortcut but not essential. Users can always type their city manually.

**Independent Test**: Can be tested by clicking the geolocation button and verifying the map centers on the browser's reported position.

**Acceptance Scenarios**:

1. **Given** the user is on the search page, **When** they click "Use my location", **Then** the browser requests geolocation permission and, if granted, centers the map on their position
2. **Given** the user denies geolocation permission, **When** the geolocation request fails, **Then** a message says "Unable to access your location. Please type a city name." and the manual input remains focused
3. **Given** the user is on a slow connection, **When** geolocation takes more than 5 seconds, **Then** a loading indicator is shown with a cancel option

---

### Edge Cases

- What happens when the user types a city name that does not exist in France? -> Show "No results found" message
- What happens when the user types a postal code instead of a city name? -> Autocomplete should also match postal codes
- What happens when geolocation returns coordinates outside France? -> Show message "This app currently covers France only"
- What happens when the radius exceeds 100km? -> Cap at 100km with a message explaining the limit
- What happens on very slow connections? -> Debounce autocomplete requests (300ms) and show loading state

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a text input with autocomplete for French cities and postal codes
- **FR-002**: System MUST display autocomplete suggestions within 300ms of user input (debounced)
- **FR-003**: System MUST allow users to set a search radius between 1km and 100km
- **FR-004**: System MUST display a visual circle on the map representing the search radius
- **FR-005**: System MUST update search results when location or radius changes
- **FR-006**: System MUST support browser geolocation as an alternative to manual city input
- **FR-007**: System MUST persist the last used location and radius in browser storage
- **FR-008**: Autocomplete data source MUST cover all French communes (API Adresse data.gouv.fr or equivalent)

### Key Entities

- **Location**: Represents a geographic point with name, postal code, department, latitude, longitude
- **SearchArea**: Combines a Location center point with a radius in kilometers, defines the geographic boundary for property search
- **GeoSuggestion**: An autocomplete result containing city name, postal code, department, and coordinates

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can find and select any French city in under 3 seconds (type + select)
- **SC-002**: Autocomplete suggestions appear within 300ms of typing pause
- **SC-003**: Radius change visually updates the map circle within 100ms
- **SC-004**: 95% of users successfully set their search location on first attempt
- **SC-005**: Geolocation resolves within 5 seconds on standard connections
