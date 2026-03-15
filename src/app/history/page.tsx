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
    <main className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Historique</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Retrouvez vos recherches précédentes
          </p>
        </div>
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
