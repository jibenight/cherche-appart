import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

/** Hook for infinite scroll / load more functionality */
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 200,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasMore || isLoading) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            onLoadMore();
          }
        },
        { rootMargin: `${threshold}px` },
      );

      observerRef.current.observe(node);
    },
    [hasMore, isLoading, onLoadMore, threshold],
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { sentinelRef };
}
