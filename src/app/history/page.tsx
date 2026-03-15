"use client";

import { useRouter } from "next/navigation";
import { SearchHistoryComponent } from "@/components/history/SearchHistory";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchStore } from "@/store/searchStore";
import { useFilterStore } from "@/store/filterStore";
import { Navigation } from "@/components/layout/Navigation";
import type { SearchHistoryEntry } from "@/types/alerts";

export default function HistoryPage() {
  const router = useRouter();
  const { history, remove, clear } = useSearchHistory();
  const setLocation = useSearchStore((s) => s.setLocation);
  const setRadiusKm = useSearchStore((s) => s.setRadiusKm);
  const setFilters = useFilterStore((s) => s.setFilters);

  const handleRerun = (entry: SearchHistoryEntry) => {
    setLocation(entry.location);
    setRadiusKm(entry.radiusKm);
    setFilters(entry.filters);
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-6 text-xl font-bold text-gray-900">Historique</h1>
        <SearchHistoryComponent
          entries={history}
          onRerun={handleRerun}
          onRemove={remove}
          onClear={clear}
        />
      </div>
    </main>
  );
}
