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
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 lg:hidden"
        aria-label="Ouvrir les filtres"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtres
        {activeCount > 0 && (
          <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transform rounded-t-2xl bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "85vh" }}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 pb-3">
          <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fermer les filtres"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(85vh - 120px)" }}>
          <FilterBar />
          <div className="mt-4">
            <AdvancedFilters />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Voir les résultats
          </button>
        </div>
      </div>
    </>
  );
}
