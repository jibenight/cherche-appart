import { create } from "zustand";
import type { PropertyCard, SortOption } from "@/types/property";

interface ResultsState {
  properties: PropertyCard[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: SortOption;
  isLoading: boolean;
  hasMore: boolean;
}

interface ResultsActions {
  setProperties: (properties: PropertyCard[], total: number) => void;
  appendProperties: (properties: PropertyCard[]) => void;
  setSortBy: (sort: SortOption) => void;
  setLoading: (isLoading: boolean) => void;
  nextPage: () => void;
  resetResults: () => void;
}

export type ResultsStore = ResultsState & ResultsActions;

function sortProperties(
  properties: PropertyCard[],
  sortBy: SortOption,
): PropertyCard[] {
  const sorted = [...properties];
  switch (sortBy) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "surface_asc":
      return sorted.sort((a, b) => a.surface - b.surface);
    case "surface_desc":
      return sorted.sort((a, b) => b.surface - a.surface);
    case "price_per_m2_asc":
      return sorted.sort((a, b) => a.pricePerM2 - b.pricePerM2);
    case "price_per_m2_desc":
      return sorted.sort((a, b) => b.pricePerM2 - a.pricePerM2);
    case "date_desc":
      return sorted.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      );
    case "date_asc":
      return sorted.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() -
          new Date(b.publishedAt).getTime(),
      );
    default:
      return sorted;
  }
}

const DEFAULT_PAGE_SIZE = 20;

export const useResultsStore = create<ResultsStore>((set, get) => ({
  properties: [],
  total: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: "date_desc",
  isLoading: false,
  hasMore: false,

  setProperties: (properties, total) => {
    const sorted = sortProperties(properties, get().sortBy);
    set({
      properties: sorted,
      total,
      page: 1,
      hasMore: properties.length < total,
    });
  },

  appendProperties: (newProperties) => {
    const current = get().properties;
    const all = [...current, ...newProperties];
    const sorted = sortProperties(all, get().sortBy);
    set({
      properties: sorted,
      hasMore: sorted.length < get().total,
    });
  },

  setSortBy: (sortBy) => {
    const sorted = sortProperties(get().properties, sortBy);
    set({ sortBy, properties: sorted });
  },

  setLoading: (isLoading) => set({ isLoading }),

  nextPage: () => set((state) => ({ page: state.page + 1 })),

  resetResults: () =>
    set({
      properties: [],
      total: 0,
      page: 1,
      hasMore: false,
      isLoading: false,
    }),
}));
