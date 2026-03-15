"use client";

import { LocationInput } from "./LocationInput";
import { RadiusSlider } from "./RadiusSlider";
import { GeolocationButton } from "@/components/map/GeolocationButton";

/**
 * Main search bar combining location input, geolocation button, and radius slider.
 * Used as the primary search interface at the top of the page.
 */
export function SearchBar() {
  return (
    <div className="w-full rounded-2xl border border-slate-200/60 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
          <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-slate-800">
          Rechercher un bien immobilier
        </h2>
      </div>
      <LocationInput />
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <RadiusSlider />
        </div>
        <GeolocationButton />
      </div>
    </div>
  );
}
