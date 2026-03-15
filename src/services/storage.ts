import type { Location } from "@/types/location";

const SEARCH_STATE_KEY = "cherche-appart:search-state";

interface PersistedSearchState {
  location: Location | null;
  radiusKm: number;
}

/**
 * Save search state to localStorage.
 * Silently fails on quota errors or SSR.
 */
export function saveSearchState(state: PersistedSearchState): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SEARCH_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save search state:", error);
  }
}

/**
 * Load search state from localStorage.
 * Returns null if no saved state or on SSR.
 */
export function loadSearchState(): PersistedSearchState | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(SEARCH_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedSearchState;

    // Basic validation
    if (
      parsed &&
      typeof parsed.radiusKm === "number" &&
      parsed.radiusKm >= 1 &&
      parsed.radiusKm <= 100
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Clear saved search state from localStorage.
 */
export function clearSearchState(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(SEARCH_STATE_KEY);
  } catch {
    // Silently fail
  }
}
