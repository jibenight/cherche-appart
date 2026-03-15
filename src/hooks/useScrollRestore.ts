import { useEffect, useRef } from "react";

const STORAGE_PREFIX = "scroll-pos-";

/** Preserve and restore scroll position for a given key */
export function useScrollRestore(key: string) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Save scroll position before navigating away
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Restore saved position
    const saved = sessionStorage.getItem(STORAGE_PREFIX + key);
    if (saved) {
      container.scrollTop = Number(saved);
    }

    return () => {
      // Save position on cleanup (navigation away)
      if (container) {
        sessionStorage.setItem(
          STORAGE_PREFIX + key,
          String(container.scrollTop),
        );
      }
    };
  }, [key]);

  return containerRef;
}
