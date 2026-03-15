"use client";

import { useEffect } from "react";
import { useFilterStore } from "@/store/filterStore";
import {
  saveFilters,
  loadFilters,
  searchParamsToFilters,
} from "@/services/filterService";
import { DEFAULT_FILTERS } from "@/types/filters";

/**
 * Hook combining URL state + localStorage persistence for filters.
 * Priority: URL params > localStorage > defaults
 */
export function useFilters() {
  const filters = useFilterStore((s) => s.filters);
  const setFilters = useFilterStore((s) => s.setFilters);
  const resetFilters = useFilterStore((s) => s.resetFilters);
  const activeCount = useFilterStore((s) => s.activeCount);

  // Hydrate on mount: URL params > localStorage > defaults
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilters = searchParamsToFilters(urlParams);
    const hasUrlFilters = Object.keys(urlFilters).length > 0;

    if (hasUrlFilters) {
      setFilters({ ...DEFAULT_FILTERS, ...urlFilters });
      return;
    }

    // Fall back to localStorage
    const stored = loadFilters();
    if (stored) {
      setFilters(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage on filter change
  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  return {
    filters,
    setFilters,
    resetFilters,
    activeCount,
  };
}
