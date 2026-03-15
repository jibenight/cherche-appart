import type { SearchHistoryEntry } from "@/types/alerts";

const STORAGE_KEY = "cherche-appart-history";
const MAX_ENTRIES = 10;

function loadHistory(): SearchHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SearchHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: SearchHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full
  }
}

export function getHistory(): SearchHistoryEntry[] {
  return loadHistory();
}

export function addToHistory(
  entry: Omit<SearchHistoryEntry, "id" | "searchedAt">,
): SearchHistoryEntry {
  const entries = loadHistory();

  // Deduplicate: remove entries with same location and similar filters
  const deduped = entries.filter(
    (e) =>
      e.location.name !== entry.location.name ||
      e.radiusKm !== entry.radiusKm,
  );

  const newEntry: SearchHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    searchedAt: new Date().toISOString(),
  };

  const updated = [newEntry, ...deduped].slice(0, MAX_ENTRIES);
  saveHistory(updated);
  return newEntry;
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function removeFromHistory(id: string): void {
  const entries = loadHistory();
  saveHistory(entries.filter((e) => e.id !== id));
}
