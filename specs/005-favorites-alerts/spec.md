# Feature Specification: Favorites & Search Alerts

**Feature Branch**: `feat/005-favorites-alerts`
**Created**: 2026-03-15
**Status**: Draft
**Input**: User description: "Autres features pertinentes pour la recherche immobilière"

## User Scenarios & Testing

### User Story 1 - Save Favorite Properties (Priority: P1)

A user wants to save interesting properties to a favorites list so they can compare them later. They can add/remove favorites from both the list view and the detail view.

**Why this priority**: Favoriting is the most requested feature after search itself. Users need to track interesting properties across sessions.

**Independent Test**: Can be tested by clicking the favorite icon on a property, navigating to the favorites page, and verifying the property appears there.

**Acceptance Scenarios**:

1. **Given** the user sees a property card, **When** they click the heart/star icon, **Then** the property is added to favorites and the icon fills in
2. **Given** a property is favorited, **When** the user clicks the icon again, **Then** the property is removed from favorites
3. **Given** the user has saved favorites, **When** they navigate to the "Favorites" page, **Then** they see all saved properties as cards with the same information as search results
4. **Given** the user has favorites, **When** they close and reopen the browser, **Then** favorites persist (stored in local storage)

---

### User Story 2 - Compare Properties (Priority: P2)

A user wants to compare 2-4 favorited properties side by side on key criteria (price, surface, rooms, price per m², location, DPE).

**Why this priority**: Comparison is the natural next step after saving favorites. It helps users make informed decisions.

**Independent Test**: Can be tested by selecting 2+ favorites and opening the comparison view.

**Acceptance Scenarios**:

1. **Given** the user has 3 favorites, **When** they select 2 and click "Compare", **Then** a side-by-side comparison table appears with key metrics
2. **Given** the comparison view is open, **When** the user looks at the table, **Then** they see: price, price/m², surface, rooms, bedrooms, floor, DPE rating, and location for each property
3. **Given** the comparison view, **When** a metric is clearly better for one property (e.g., lower price/m²), **Then** that cell is subtly highlighted in green

---

### User Story 3 - Search Alerts (Priority: P3)

A user wants to save their current search criteria and receive notifications (email or browser push) when new matching properties appear.

**Why this priority**: Valuable long-term feature but requires notification infrastructure. Users can manually re-run searches initially.

**Independent Test**: Can be tested by saving a search alert and verifying it appears in the alerts management page.

**Acceptance Scenarios**:

1. **Given** the user has set search filters, **When** they click "Create alert", **Then** they can name the alert and set notification frequency (instant, daily, weekly)
2. **Given** the user has saved alerts, **When** they go to "My alerts", **Then** they see all saved alerts with their criteria summary and on/off toggle
3. **Given** an alert is active, **When** new properties match the criteria, **Then** the user receives a notification with the count of new properties and a link to view them
4. **Given** the user wants to modify an alert, **When** they click "Edit" on an alert, **Then** the search page loads with that alert's filters pre-applied

---

### User Story 4 - Search History (Priority: P3)

A user wants to see their recent searches so they can quickly re-run a previous search without re-entering all filters.

**Why this priority**: Nice quality-of-life feature. Lower priority because filter persistence and URL sharing partially cover this need.

**Independent Test**: Can be tested by performing several searches, navigating to search history, and clicking a past search to restore it.

**Acceptance Scenarios**:

1. **Given** the user has performed searches, **When** they click "Recent searches", **Then** they see their last 10 searches with location, filters summary, and date
2. **Given** the user clicks a past search, **When** the search loads, **Then** all filters and location are restored and results update

---

### Edge Cases

- What happens when local storage is full? -> Gracefully handle by removing oldest favorites first, warn user
- What happens when a favorited property is no longer available? -> Show with "No longer available" badge, don't remove automatically
- What happens when comparing properties with missing data? -> Show "N/A" for missing fields in comparison
- What happens when the user tries to create more than 10 alerts? -> Show limit message with suggestion to modify existing alerts

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow users to favorite/unfavorite properties from card and detail views
- **FR-002**: System MUST persist favorites in browser local storage
- **FR-003**: System MUST provide a dedicated favorites page listing all saved properties
- **FR-004**: System MUST support side-by-side comparison of 2-4 favorited properties
- **FR-005**: Comparison MUST include: price, price/m², surface, rooms, bedrooms, DPE, location
- **FR-006**: System MUST allow saving search criteria as named alerts
- **FR-007**: Alerts MUST support notification frequency: instant, daily, weekly
- **FR-008**: System MUST provide an alerts management page with enable/disable toggle
- **FR-009**: System MUST store last 10 searches in search history
- **FR-010**: System MUST allow re-running a search from history with one click
- **FR-011**: Favorites count MUST be visible in the navigation bar

### Key Entities

- **Favorite**: Reference to a saved property with timestamp and user notes (optional)
- **SearchAlert**: Saved search criteria with name, notification frequency, active status, creation date
- **SearchHistory**: Record of a past search with location, filters, result count, and timestamp
- **PropertyComparison**: Temporary selection of 2-4 properties for side-by-side comparison

## Success Criteria

### Measurable Outcomes

- **SC-001**: Adding/removing a favorite takes under 100ms with instant visual feedback
- **SC-002**: Favorites page loads within 1 second with up to 100 saved properties
- **SC-003**: Comparison view renders within 500ms for up to 4 properties
- **SC-004**: Search history loads within 200ms
- **SC-005**: Alert creation completes within 2 seconds
- **SC-006**: Favorites persist correctly across browser sessions (100% reliability)
