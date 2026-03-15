# Implementation Plan: Results List View

**Branch**: `feat/004-list-results` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-list-results/spec.md`

## Summary

Implement a scrollable list of property cards with sorting, pagination/infinite scroll, and a detailed property view with photo gallery. Includes responsive layout with map/list toggle on mobile and bidirectional synchronization with the map view.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Tailwind CSS 3.x
**Storage**: N/A (renders from search results in memory)
**Testing**: Vitest (unit), Playwright (E2E)
**Target Platform**: Web (responsive, mobile-first)
**Project Type**: Web application (Next.js)
**Performance Goals**: Card render < 1s, scroll 60fps, detail load < 1.5s
**Constraints**: Must virtualize for 1000+ results, restore scroll position on back navigation
**Scale/Scope**: Up to 1000 property cards, detail pages

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-Based | PASS | PropertyCard, PropertyDetail, SortBar, PhotoGallery are isolated |
| II. Mobile-First | PASS | Stack layout on mobile, side-by-side on desktop |
| III. Type Safety | PASS | All property data typed, sort options typed |
| IV. Test-Driven | PASS | Unit tests for sorting, E2E for browse flow |
| V. Performance | PASS | Virtualized list, lazy-loaded images, skeleton loading |
| VI. Simplicity | PASS | Standard HTML/CSS cards, native scroll behavior |

## Project Structure

### Source Code

```text
src/
├── app/
│   └── property/
│       └── [id]/
│           └── page.tsx              # Property detail page (dynamic route)
├── components/
│   ├── results/
│   │   ├── ResultsList.tsx           # Main list container with infinite scroll
│   │   ├── PropertyCard.tsx          # Individual property card
│   │   ├── PropertyCardSkeleton.tsx  # Loading skeleton for cards
│   │   ├── SortBar.tsx              # Sort dropdown + result count
│   │   ├── EmptyState.tsx           # No results message with suggestions
│   │   └── ViewToggle.tsx           # Mobile map/list toggle
│   ├── property/
│   │   ├── PropertyDetail.tsx       # Full property detail layout
│   │   ├── PhotoGallery.tsx         # Photo carousel + lightbox
│   │   ├── PropertyCharacteristics.tsx # Attributes table
│   │   ├── EnergyRating.tsx         # DPE/GES display
│   │   └── MiniMap.tsx              # Small map on detail page
│   └── layout/
│       └── SplitView.tsx            # Map + list side-by-side layout
├── hooks/
│   ├── useInfiniteScroll.ts         # Infinite scroll / load more hook
│   ├── useScrollRestore.ts          # Preserve scroll position on navigate back
│   └── useSortedResults.ts          # Sorting logic hook
├── types/
│   ├── property.ts                  # PropertyCard, PropertyDetail types
│   └── sort.ts                      # SortOption type
└── store/
    └── resultsStore.ts              # Zustand store for results state

tests/
├── unit/
│   ├── useSortedResults.test.ts
│   └── resultsStore.test.ts
└── e2e/
    ├── results-list.spec.ts
    └── property-detail.spec.ts
```

## Research Decisions

### Virtualization Strategy
- Use `@tanstack/react-virtual` for list virtualization when results > 50
- Only renders visible cards + buffer, maintains scroll performance at 60fps
- Falls back to regular list for small result sets

### Image Loading
- Next.js `<Image>` component for automatic optimization and lazy loading
- Blur placeholder during load
- WebP format with JPEG fallback

### Scroll Position Restoration
- Store scroll position in sessionStorage before navigation to detail
- Restore on back navigation using `useScrollRestore` hook
- Next.js `scroll: false` on back navigation links

### Photo Gallery
- Lightweight lightbox with CSS animations
- Touch swipe support for mobile
- Keyboard navigation (arrow keys, Escape)
- Preload adjacent images for fast navigation

## Data Model

### PropertyCard
```typescript
interface PropertyCard {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  surface: number;
  rooms: number;
  bedrooms: number;
  city: string;
  postcode: string;
  propertyType: PropertyType;
  source: string;
  listedAt: string;          // ISO date
  position: [number, number]; // [lat, lng]
}
```

### PropertyDetail
```typescript
interface PropertyDetail extends PropertyCard {
  description: string;
  photos: string[];
  floor: number | null;
  hasElevator: boolean;
  hasParking: boolean;
  hasBalcony: boolean;
  condition: PropertyCondition;
  dpeRating: string;         // A-G
  gesRating: string;         // A-G
  dpeValue: number | null;   // kWh/m²/year
  gesValue: number | null;   // kgCO2/m²/year
  sourceUrl: string;
}
```

### SortOption
```typescript
type SortOption = 'price_asc' | 'price_desc' | 'surface_asc' | 'surface_desc' | 'date_desc' | 'relevance';
```

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
