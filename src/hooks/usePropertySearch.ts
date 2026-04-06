'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { useFilterStore } from '@/store/filterStore';
import { useResultsStore } from '@/store/resultsStore';
import { searchProperties } from '@/services/propertyApi';

export function usePropertySearch() {
  const location = useSearchStore((s) => s.location);
  const radiusKm = useSearchStore((s) => s.radiusKm);
  const filters = useFilterStore((s) => s.filters);
  const sortBy = useResultsStore((s) => s.sortBy);
  const page = useResultsStore((s) => s.page);
  const setProperties = useResultsStore((s) => s.setProperties);
  const appendProperties = useResultsStore((s) => s.appendProperties);
  const setLoading = useResultsStore((s) => s.setLoading);
  const resetResults = useResultsStore((s) => s.resetResults);

  const abortRef = useRef<AbortController | null>(null);
  const prevLocationRef = useRef(location);
  const isFirstPage = page === 1;

  const doSearch = useCallback(async () => {
    if (!location) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);

    try {
      const result = await searchProperties({
        lat: location.lat,
        lng: location.lng,
        radiusKm,
        filters,
        sortBy,
        page,
      });

      if (isFirstPage) {
        setProperties(result.properties, result.total);
      } else {
        appendProperties(result.properties);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('[usePropertySearch] Search failed:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [location, radiusKm, filters, sortBy, page, isFirstPage, setProperties, appendProperties, setLoading]);

  // Trigger search on location/filters/sort changes (reset to page 1)
  useEffect(() => {
    if (!location) return;
    // Reset results when search criteria change to avoid stale data
    if (prevLocationRef.current !== location) {
      resetResults();
      prevLocationRef.current = location;
    }
    doSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, radiusKm, filters, sortBy]);

  // Trigger on page changes (for pagination)
  useEffect(() => {
    if (!location || isFirstPage) return;
    doSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return { refetch: doSearch };
}
