# Cherche-Appart Constitution

## Core Principles

### I. Component-Based Architecture
Every feature is built as an isolated, reusable component with clear boundaries. Components communicate through well-defined props and events. Shared state is managed through a centralized store. No component should depend on the internal implementation of another.

### II. Mobile-First & Responsive
All UI is designed mobile-first and must be fully usable on screens from 320px to 2560px. Touch interactions are first-class citizens. Map interactions must work on both touch and mouse devices. Performance budgets are stricter on mobile (LCP < 2s on 3G).

### III. Type Safety (NON-NEGOTIABLE)
TypeScript strict mode is mandatory across the entire codebase. No `any` types except at external API boundaries with proper validation. All API responses must be validated at runtime against typed schemas. Shared types live in a single source of truth.

### IV. Test-Driven Quality
Unit tests for all business logic and utility functions. Integration tests for API interactions and data flows. E2E tests for critical user journeys (search, filter, view results). Tests must pass before any merge to main branch.

### V. Performance & Accessibility
Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1. Map rendering must maintain 30fps minimum during pan/zoom. Lazy loading for images and non-critical components. WCAG 2.1 AA compliance is mandatory. All interactive elements must be keyboard navigable.

### VI. Simplicity & YAGNI
Start with the simplest solution that works. No premature abstractions or over-engineering. Add complexity only when justified by measurable need. Prefer standard platform APIs over third-party libraries when equivalent.

## Technical Constraints

- **Language**: TypeScript 5.x (strict mode)
- **Runtime**: Node.js 20+ LTS
- **Frontend Framework**: React 18+ with Next.js 14+ (App Router)
- **Styling**: Tailwind CSS 3.x
- **Map Library**: Leaflet or Mapbox GL JS (open-source preferred)
- **State Management**: React Context + useReducer for simple state, Zustand for complex state
- **API Communication**: REST with typed fetch wrappers, Zod for schema validation
- **Testing**: Vitest (unit), Playwright (E2E)
- **Package Manager**: pnpm
- **Deployment Target**: Vercel or similar serverless platform

## Development Workflow

- Feature branches from `main`, named `feat/###-feature-name`
- Conventional commits (feat:, fix:, chore:, docs:, test:)
- PR reviews required before merge
- CI must pass: lint, typecheck, unit tests, build
- No direct pushes to `main`

## Governance

This constitution governs all development decisions for Cherche-Appart. All PRs must verify compliance with these principles. Violations require explicit justification and team approval. Amendments follow semantic versioning.

**Version**: 1.0.0 | **Ratified**: 2026-03-15 | **Last Amended**: 2026-03-15
