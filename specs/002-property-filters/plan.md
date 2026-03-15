# Implementation Plan: Property Search Filters

**Branch**: `feat/002-property-filters` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-property-filters/spec.md`

## Summary

Implement a comprehensive filter system for property search with basic filters (type, price, surface, rooms) and advanced filters (bedrooms, floor, parking, elevator, balcony, condition). Filters synchronize with URL parameters for shareability and persist in localStorage between sessions. All filters apply as AND conditions and update results in real-time.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Zustand, nuqs (URL state)
**Storage**: URL query params + localStorage
**Testing**: Vitest (unit), Playwright (E2E)
**Target Platform**: Web (responsive, mobile-first)
**Project Type**: Web application (Next.js)
**Performance Goals**: Filter change → results update < 500ms
**Constraints**: Filters must be serializable to URL params
**Scale/Scope**: ~15 filter parameters, results up to 1000 items

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-Based | PASS | Each filter group is an isolated component |
| II. Mobile-First | PASS | Collapsible filter panel, bottom sheet on mobile |
| III. Type Safety | PASS | FilterSet fully typed, Zod validation on URL params |
| IV. Test-Driven | PASS | Unit tests for filter logic, E2E for filter flow |
| V. Performance | PASS | Debounced filter application, memoized filtering |
| VI. Simplicity | PASS | Standard form inputs, no custom UI library |

## Project Structure

### Source Code

```text
src/
├── components/
│   ├── filters/
│   │   ├── FilterBar.tsx             # Main filter container (desktop horizontal bar)
│   │   ├── FilterPanel.tsx           # Mobile filter panel (bottom sheet / drawer)
│   │   ├── PropertyTypeFilter.tsx    # Property type selector (buttons/chips)
│   │   ├── PriceRangeFilter.tsx      # Min/max price inputs with formatting
│   │   ├── SurfaceRangeFilter.tsx    # Min/max surface inputs
│   │   ├── RoomsFilter.tsx           # Room count selector (1, 2, 3, 4, 5+)
│   │   ├── AdvancedFilters.tsx       # Expandable advanced filter section
│   │   ├── ActiveFilterBadge.tsx     # Shows count of active filters
│   │   └── ResetFiltersButton.tsx    # Reset all filters
├── services/
│   └── filterService.ts             # Filter application logic, URL serialization
├── hooks/
│   ├── useFilters.ts                # Hook combining URL state + localStorage
│   └── useFilteredResults.ts        # Hook applying filters to results
├── types/
│   └── filters.ts                   # FilterSet, PropertyType, PropertyCondition types
├── schemas/
│   └── filters.schema.ts            # Zod schemas for filter validation
└── store/
    └── filterStore.ts               # Zustand store for filter state (extends searchStore)

tests/
├── unit/
│   ├── filterService.test.ts
│   ├── useFilters.test.ts
│   └── filterStore.test.ts
└── e2e/
    └── property-filters.spec.ts
```

## Research Decisions

### URL State Management with nuqs
- `nuqs` (Next.js URL Query State) provides type-safe URL parameter management
- Automatic serialization/deserialization of filter values
- Works with Next.js App Router and server components
- Enables shareable search URLs

### Filter Architecture
- Filters stored in Zustand store (source of truth for UI)
- Synced bidirectionally with URL params via `nuqs`
- Persisted to localStorage on change for session persistence
- Priority: URL params > localStorage > defaults

### Price Formatting
- Use `Intl.NumberFormat('fr-FR')` for euro formatting
- Input accepts raw numbers, displays formatted
- Supports thousand separators on display

## Data Model

### FilterSet
```typescript
interface FilterSet {
  propertyType: PropertyType[];    // multi-select
  priceMin: number | null;
  priceMax: number | null;
  surfaceMin: number | null;
  surfaceMax: number | null;
  roomsMin: number | null;
  bedroomsMin: number | null;
  floorMin: number | null;
  floorMax: number | null;
  hasParking: boolean | null;
  hasElevator: boolean | null;
  hasBalcony: boolean | null;
  condition: PropertyCondition[];  // multi-select
}
```

### PropertyType (enum)
```typescript
type PropertyType = 'apartment' | 'house' | 'land' | 'commercial' | 'building';
```

### PropertyCondition (enum)
```typescript
type PropertyCondition = 'new' | 'good' | 'to_renovate' | 'to_refresh';
```

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
