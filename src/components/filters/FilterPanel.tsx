"use client";

import { useState } from "react";
import { FilterBar } from "./FilterBar";
import { AdvancedFilters } from "./AdvancedFilters";
import { useFilterStore } from "@/store/filterStore";

/** Mobile filter panel (bottom sheet drawer) */
export function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = useFilterStore((s) => s.activeCount);

  return (
    <>
      {/* Mobile trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-card hover:border-slate-300 hover:shadow-sm lg:hidden"
        aria-label="Ouvrir les filtres"
      >
        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtres
        {activeCount > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transform rounded-t-3xl bg-white shadow-elevated transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "85vh" }}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Filtres</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fermer les filtres"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5" style={{ maxHeight: "calc(85vh - 140px)" }}>
          <FilterBar />
          <div className="mt-4">
            <AdvancedFilters />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-4">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full rounded-xl gradient-brand py-3 text-sm font-semibold text-white shadow-md hover:opacity-95"
          >
            Voir les résultats
          </button>
        </div>
      </div>
    </>
  );
}
