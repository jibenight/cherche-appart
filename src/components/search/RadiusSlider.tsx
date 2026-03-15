"use client";

import { useCallback } from "react";
import { useSearchStore } from "@/store/searchStore";

const MIN_RADIUS = 1;
const MAX_RADIUS = 100;
const STEP = 1;

export function RadiusSlider() {
  const { radiusKm, setRadiusKm, location } = useSearchStore();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRadiusKm(Number(e.target.value));
    },
    [setRadiusKm],
  );

  const isDisabled = !location;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <label
          htmlFor="radius-slider"
          className="text-sm font-medium text-slate-700"
        >
          Rayon de recherche
        </label>
        <span
          className={`rounded-lg px-2.5 py-1 text-sm font-semibold ${
            isDisabled
              ? "bg-slate-100 text-slate-400"
              : "bg-brand-50 text-brand-700"
          }`}
        >
          {radiusKm} km
        </span>
      </div>

      <div className="relative">
        <input
          id="radius-slider"
          type="range"
          min={MIN_RADIUS}
          max={MAX_RADIUS}
          step={STEP}
          value={radiusKm}
          onChange={handleChange}
          disabled={isDisabled}
          className="w-full"
          aria-label={`Rayon de recherche: ${radiusKm} kilomètres`}
          aria-valuemin={MIN_RADIUS}
          aria-valuemax={MAX_RADIUS}
          aria-valuenow={radiusKm}
          aria-valuetext={`${radiusKm} kilomètres`}
        />

        {/* Min/Max labels */}
        <div className="mt-1.5 flex justify-between text-xs text-slate-400">
          <span>{MIN_RADIUS} km</span>
          <span>{MAX_RADIUS} km</span>
        </div>
      </div>

      {isDisabled && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Sélectionnez une ville pour définir le rayon
        </p>
      )}
    </div>
  );
}
