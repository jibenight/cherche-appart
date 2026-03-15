# Implementation Plan: Location & Search Radius

**Branch**: `feat/001-location-search` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-location-search/spec.md`

## Summary

Implement a location search system with city autocomplete powered by the French government's API Adresse (data.gouv.fr), a configurable search radius with visual circle overlay on a Leaflet map, and browser geolocation support. This is the foundational feature upon which all other features depend.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Leaflet 1.9+, react-leaflet 4+
**Storage**: Browser localStorage for persistence, API Adresse for geocoding
**Testing**: Vitest (unit), Playwright (E2E)
**Target Platform**: Web (responsive, mobile-first)
**Project Type**: Web application (Next.js)
**Performance Goals**: Autocomplete < 300ms, map circle update < 100ms
**Constraints**: Must use open/free APIs, France-only coverage
**Scale/Scope**: ~36,000 French communes, single user at a time

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-Based | PASS | Location input, radius slider, and map circle are isolated components |
| II. Mobile-First | PASS | Autocomplete and slider designed mobile-first |
| III. Type Safety | PASS | All API responses typed with Zod schemas |
| IV. Test-Driven | PASS | Unit tests for geocoding service, E2E for search flow |
| V. Performance | PASS | Debounced autocomplete, lightweight map circle |
| VI. Simplicity | PASS | Uses free government API, standard Leaflet |

## Project Structure

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── search/
│   │   ├── LocationInput.tsx        # Autocomplete input component
│   │   ├── RadiusSlider.tsx         # Radius configuration component
│   │   └── SearchBar.tsx            # Container for location + radius
│   └── map/
│       ├── MapContainer.tsx         # Main map wrapper
│       ├── SearchCircle.tsx         # Radius circle overlay
│       └── GeolocationButton.tsx    # "Use my location" button
├── services/
│   ├── geocoding.ts                 # API Adresse integration
│   └── storage.ts                   # LocalStorage persistence
├── hooks/
│   ├── useGeolocation.ts            # Browser geolocation hook
│   ├── useDebounce.ts               # Debounce utility hook
│   └── useLocalStorage.ts           # Typed localStorage hook
├── types/
│   └── location.ts                  # Location, SearchArea, GeoSuggestion types
├── schemas/
│   └── location.schema.ts           # Zod schemas for API response validation
└── store/
    └── searchStore.ts               # Zustand store for search state

tests/
├── unit/
│   ├── geocoding.test.ts
│   ├── useDebounce.test.ts
│   └── searchStore.test.ts
└── e2e/
    └── location-search.spec.ts
```

**Structure Decision**: Web application with Next.js App Router. All source code in `src/` with component-based organization. Tests mirror source structure.

## Research Decisions

### API Adresse (data.gouv.fr)
- Free, no API key required, no rate limits for reasonable usage
- Endpoint: `https://api-adresse.data.gouv.fr/search/?q={query}&type=municipality&limit=7`
- Returns GeoJSON with coordinates, city name, postal code, department
- Low latency (~100ms from France)

### Leaflet over Mapbox
- Open source, no API key or billing
- Lighter weight for this use case
- OpenStreetMap tiles (free, no limits)
- `react-leaflet` provides React bindings

### Zustand for State
- Minimal boilerplate compared to Redux
- TypeScript-native
- Works well with Next.js App Router
- Single store for search state shared between components

## Data Model

### Location
```typescript
interface Location {
  name: string;          // "Lyon"
  postcode: string;      // "69000"
  department: string;    // "Rhône"
  lat: number;           // 45.7640
  lng: number;           // 4.8357
}
```

### SearchArea
```typescript
interface SearchArea {
  center: Location;
  radiusKm: number;      // 1-100
}
```

### GeoSuggestion
```typescript
interface GeoSuggestion {
  label: string;         // "Lyon (69000), Rhône"
  name: string;
  postcode: string;
  department: string;
  coordinates: [number, number]; // [lng, lat] GeoJSON order
}
```

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
