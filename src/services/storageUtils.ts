/**
 * Utility for handling localStorage quota exceeded errors.
 * When quota is exceeded, tries to free space by removing oldest entries.
 */

const STORAGE_KEYS_PRIORITY = [
  "cherche-appart-history", // least important - remove first
  "cherche-appart-alerts",
  "cherche-appart-filters",
  "cherche-appart:favorites", // most important - remove last
] as const;

/** Check if localStorage is available */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, "1");
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/** Get approximate localStorage usage in bytes */
export function getStorageUsage(): number {
  if (typeof window === "undefined") return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      total += key.length + (localStorage.getItem(key)?.length ?? 0);
    }
  }
  return total * 2; // UTF-16 = 2 bytes per char
}

/**
 * Safe localStorage write that handles QuotaExceededError.
 * If quota is exceeded, removes entries from least-important storage keys first.
 */
export function safeSetItem(key: string, value: string): boolean {
  if (!isStorageAvailable()) return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (
      e instanceof DOMException &&
      (e.name === "QuotaExceededError" || e.code === 22)
    ) {
      // Try to free space by trimming data from least-important keys
      for (const storageKey of STORAGE_KEYS_PRIORITY) {
        if (storageKey === key) continue; // Don't delete what we're trying to write

        try {
          const existing = localStorage.getItem(storageKey);
          if (existing) {
            const parsed = JSON.parse(existing);
            if (Array.isArray(parsed) && parsed.length > 1) {
              // Remove oldest half of entries
              const trimmed = parsed.slice(0, Math.ceil(parsed.length / 2));
              localStorage.setItem(storageKey, JSON.stringify(trimmed));
            } else {
              localStorage.removeItem(storageKey);
            }
          }

          // Retry the write
          localStorage.setItem(key, value);
          return true;
        } catch {
          continue;
        }
      }

      console.warn("localStorage quota exceeded and could not be freed.");
      return false;
    }
    return false;
  }
}
