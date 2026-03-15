import { create } from "zustand";
import type { MapViewport } from "@/types/map";

interface MapState {
  viewport: MapViewport | null;
  hoveredPropertyId: string | null;
  selectedPropertyId: string | null;
  searchAsIMove: boolean;
}

interface MapActions {
  setViewport: (viewport: MapViewport) => void;
  setHoveredPropertyId: (id: string | null) => void;
  setSelectedPropertyId: (id: string | null) => void;
  toggleSearchAsIMove: () => void;
  setSearchAsIMove: (value: boolean) => void;
}

export type MapStore = MapState & MapActions;

export const useMapStore = create<MapStore>((set) => ({
  viewport: null,
  hoveredPropertyId: null,
  selectedPropertyId: null,
  searchAsIMove: false,

  setViewport: (viewport) => set({ viewport }),
  setHoveredPropertyId: (hoveredPropertyId) => set({ hoveredPropertyId }),
  setSelectedPropertyId: (selectedPropertyId) => set({ selectedPropertyId }),
  toggleSearchAsIMove: () =>
    set((state) => ({ searchAsIMove: !state.searchAsIMove })),
  setSearchAsIMove: (searchAsIMove) => set({ searchAsIMove }),
}));
