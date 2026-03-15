import { create } from "zustand";
import type { Location } from "@/types/location";
import { loadSearchState, saveSearchState } from "@/services/storage";

/** Default search radius in km */
const DEFAULT_RADIUS_KM = 10;

interface SearchState {
  /** Currently selected location (city) */
  location: Location | null;
  /** Search radius in km (1-100) */
  radiusKm: number;
  /** Whether the search store has been hydrated from localStorage */
  isHydrated: boolean;
}

interface SearchActions {
  /** Set the search location */
  setLocation: (location: Location | null) => void;
  /** Set the search radius (clamped to 1-100) */
  setRadiusKm: (radiusKm: number) => void;
  /** Reset location and radius to defaults */
  reset: () => void;
  /** Hydrate the store from localStorage */
  hydrate: () => void;
}

export type SearchStore = SearchState & SearchActions;

export const useSearchStore = create<SearchStore>((set, get) => ({
  // State
  location: null,
  radiusKm: DEFAULT_RADIUS_KM,
  isHydrated: false,

  // Actions
  setLocation: (location) => {
    set({ location });
    saveSearchState({ location, radiusKm: get().radiusKm });
  },

  setRadiusKm: (radiusKm) => {
    const clamped = Math.max(1, Math.min(100, radiusKm));
    set({ radiusKm: clamped });
    saveSearchState({ location: get().location, radiusKm: clamped });
  },

  reset: () => {
    set({ location: null, radiusKm: DEFAULT_RADIUS_KM });
    saveSearchState({ location: null, radiusKm: DEFAULT_RADIUS_KM });
  },

  hydrate: () => {
    const saved = loadSearchState();
    if (saved) {
      set({
        location: saved.location,
        radiusKm: saved.radiusKm,
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },
}));
