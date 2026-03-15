# Implementation Plan: Map View with Results

**Branch**: `feat/003-map-results` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-map-results/spec.md`

## Summary

Implement an interactive Leaflet map displaying property results as clustered markers with price labels. Includes marker popups with property summaries, search area circle visualization, "search as I move" mode, and bidirectional synchronization with the list view (hover highlighting).

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+, Leaflet 1.9+, react-leaflet 4+, leaflet.markercluster
**Storage**: N/A (renders from search results in memory)
**Testing**: Vitest (unit), Playwright (E2E)
**Target Platform**: Web (responsive, mobile-first, touch support)
**Project Type**: Web application (Next.js)
**Performance Goals**: 30fps pan/zoom, markers render < 2s, popup < 200ms
**Constraints**: Must handle 500+ markers via clustering, touch-friendly on mobile
**Scale/Scope**: Up to 500 markers per search, 1 map instance

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-Based | PASS | Map, markers, clusters, popups are isolated components |
| II. Mobile-First | PASS | Touch events, pinch zoom, mobile-adapted popups |
| III. Type Safety | PASS | Typed marker data, typed map events |
| IV. Test-Driven | PASS | Unit tests for clustering logic, E2E for map interactions |
| V. Performance | PASS | Clustering prevents marker overload, canvas renderer for performance |
| VI. Simplicity | PASS | Leaflet + one plugin (markercluster), no custom map engine |

## Project Structure

### Source Code

```text
src/
├── components/
│   └── map/
│       ├── MapContainer.tsx          # Main map with Leaflet initialization
│       ├── PropertyMarkers.tsx       # Renders all property markers with clustering
│       ├── PropertyMarker.tsx        # Single marker with price label
│       ├── MarkerPopup.tsx           # Popup card on marker click
│       ├── SearchCircle.tsx          # Search radius circle overlay
│       ├── SearchAsIMove.tsx         # Toggle for dynamic area search
│       └── MapControls.tsx           # Zoom buttons, fullscreen, locate
├── hooks/
│   ├── useMapSync.ts                # Map/list hover synchronization
│   └── useMapViewport.ts            # Track map bounds for "search as I move"
├── types/
│   └── map.ts                       # MapMarker, MarkerCluster, MapPopup, MapViewport types
└── store/
    └── mapStore.ts                  # Zustand store for map state (viewport, hover, etc.)

tests/
├── unit/
│   ├── useMapSync.test.ts
│   └── mapStore.test.ts
└── e2e/
    └── map-results.spec.ts
```

## Research Decisions

### Leaflet + react-leaflet
- Free, open-source, no API key
- `react-leaflet` v4 provides React 18 compatible components
- Dynamic import required in Next.js (Leaflet needs `window`)
- Use `next/dynamic` with `ssr: false` for map components

### leaflet.markercluster
- Standard clustering solution for Leaflet
- Configurable cluster radius and animation
- Handles 500+ markers efficiently
- Spiderfies overlapping markers at max zoom

### Custom Price Label Markers
- Use Leaflet `DivIcon` for custom HTML markers showing price
- CSS-styled price badges on markers (e.g., "250k" pill)
- Lighter than image-based markers

### Canvas Renderer
- Use Leaflet's canvas renderer over SVG for >100 markers
- Better performance for pan/zoom with many elements

## Data Model

### MapMarker
```typescript
interface MapMarker {
  id: string;
  position: [number, number];  // [lat, lng]
  price: number;
  priceLabel: string;          // "250k", "1.2M"
  propertyId: string;
}
```

### MapPopup
```typescript
interface MapPopup {
  propertyId: string;
  thumbnail: string;
  price: number;
  surface: number;
  rooms: number;
  city: string;
}
```

### MapViewport
```typescript
interface MapViewport {
  center: [number, number];
  zoom: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}
```

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
