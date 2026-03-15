import { useState, useEffect, useCallback } from "react";
import type { SearchHistoryEntry } from "@/types/alerts";
import {
  getHistory,
  addToHistory,
  clearHistory,
  removeFromHistory,
} from "@/services/historyService";

/** Hook for search history operations */
export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const add = useCallback(
    (entry: Omit<SearchHistoryEntry, "id" | "searchedAt">) => {
      const newEntry = addToHistory(entry);
      setHistory(getHistory());
      return newEntry;
    },
    [],
  );

  const remove = useCallback((id: string) => {
    removeFromHistory(id);
    setHistory(getHistory());
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return { history, add, remove, clear };
}
