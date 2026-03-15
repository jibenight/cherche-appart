# Implementation Plan: Favorites & Search Alerts

**Branch**: `feat/005-favorites-alerts` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-favorites-alerts/spec.md`

## Summary

Implement a favorites system with local storage persistence, a property comparison view for side-by-side analysis, search alerts with notification preferences, and a search history feature. This feature adds the "save and track" layer on top of the search functionality.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Zustand, Tailwind CSS
**Storage**: localStorage (favorites, history), future: backend API for alerts
**Testing**: Vitest (unit), Playwright (E2E)
**Target Platform**: Web (responsive, mobile-first)
**Project Type**: Web application (Next.js)
**Performance Goals**: Favorite toggle < 100ms, comparison render < 500ms
**Constraints**: No backend for MVP (localStorage only), alerts deferred to backend phase
**Scale/Scope**: Up to 100 favorites, 10 alerts, 10 search history entries

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-Based | PASS | FavoriteButton, ComparisonView, AlertForm are isolated |
| II. Mobile-First | PASS | Comparison scrolls horizontally on mobile |
| III. Type Safety | PASS | All entities typed, localStorage serialization validated |
| IV. Test-Driven | PASS | Unit tests for favorites logic, E2E for favorite flow |
| V. Performance | PASS | Lightweight localStorage operations |
| VI. Simplicity | PASS | localStorage-first, no backend dependency for MVP |

## Project Structure

### Source Code

```text
src/
├── app/
│   ├── favorites/
│   │   └── page.tsx                  # Favorites list page
│   ├── compare/
│   │   └── page.tsx                  # Comparison view page
│   ├── alerts/
│   │   └── page.tsx                  # Alerts management page
│   └── history/
│       └── page.tsx                  # Search history page
├── components/
│   ├── favorites/
│   │   ├── FavoriteButton.tsx        # Heart/star toggle on property cards
│   │   ├── FavoritesList.tsx         # Grid of favorited property cards
│   │   └── FavoritesCounter.tsx      # Badge in nav showing favorites count
│   ├── compare/
│   │   ├── ComparisonTable.tsx       # Side-by-side comparison grid
│   │   ├── ComparisonSelector.tsx    # Select properties to compare
│   │   └── ComparisonMetric.tsx      # Single row in comparison (with highlight)
│   ├── alerts/
│   │   ├── AlertForm.tsx             # Create/edit alert form
│   │   ├── AlertCard.tsx             # Alert summary with toggle
│   │   └── AlertsList.tsx            # List of saved alerts
│   └── history/
│       ├── HistoryEntry.tsx          # Single search history item
│       └── SearchHistory.tsx         # List of recent searches
├── services/
│   ├── favoritesService.ts          # CRUD operations on favorites (localStorage)
│   ├── alertsService.ts             # CRUD operations on alerts (localStorage for MVP)
│   └── historyService.ts            # Search history management
├── hooks/
│   ├── useFavorites.ts              # Hook for favorite operations
│   ├── useComparison.ts             # Hook for comparison selection
│   └── useSearchHistory.ts          # Hook for search history
├── types/
│   ├── favorites.ts                 # Favorite, PropertyComparison types
│   └── alerts.ts                    # SearchAlert, SearchHistory types
└── store/
    └── favoritesStore.ts            # Zustand store for favorites state

tests/
├── unit/
│   ├── favoritesService.test.ts
│   ├── alertsService.test.ts
│   └── historyService.test.ts
└── e2e/
    ├── favorites.spec.ts
    └── comparison.spec.ts
```

## Research Decisions

### LocalStorage-First for MVP
- No backend required for favorites, alerts config, and search history
- All data persists in localStorage with typed serialization
- Future migration: add API sync layer without changing component interfaces
- Storage limit: ~5MB, sufficient for 100 favorites + metadata

### Comparison View
- CSS Grid for side-by-side layout (2-4 columns)
- Horizontal scroll on mobile for comparison table
- Highlight best values per metric (lowest price/m², highest surface, etc.)

### Alerts Architecture (MVP)
- Alert configurations stored in localStorage
- No actual notification sending in MVP
- UI is fully functional (create, edit, toggle, delete)
- Backend notification service is a future enhancement

## Data Model

### Favorite
```typescript
interface Favorite {
  propertyId: string;
  savedAt: string;        // ISO date
  notes: string | null;   // optional user notes
  property: PropertyCard; // snapshot of property data at save time
}
```

### SearchAlert
```typescript
interface SearchAlert {
  id: string;
  name: string;
  filters: FilterSet;
  location: SearchArea;
  frequency: 'instant' | 'daily' | 'weekly';
  isActive: boolean;
  createdAt: string;
  lastTriggered: string | null;
}
```

### SearchHistory
```typescript
interface SearchHistoryEntry {
  id: string;
  location: Location;
  filters: FilterSet;
  resultCount: number;
  searchedAt: string;     // ISO date
}
```

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
