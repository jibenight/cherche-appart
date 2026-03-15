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
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor="radius-slider"
          className="text-sm font-medium text-gray-700"
        >
          Rayon de recherche
        </label>
        <span
          className={`text-sm font-semibold ${
            isDisabled ? "text-gray-400" : "text-blue-600"
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
          className={`w-full cursor-pointer appearance-none rounded-lg h-2 ${
            isDisabled
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-200 to-blue-500"
          } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-md`}
          aria-label={`Rayon de recherche: ${radiusKm} kilomètres`}
          aria-valuemin={MIN_RADIUS}
          aria-valuemax={MAX_RADIUS}
          aria-valuenow={radiusKm}
          aria-valuetext={`${radiusKm} kilomètres`}
        />

        {/* Min/Max labels */}
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>{MIN_RADIUS} km</span>
          <span>{MAX_RADIUS} km</span>
        </div>
      </div>

      {isDisabled && (
        <p className="mt-1 text-xs text-amber-600">
          Sélectionnez une ville pour définir le rayon de recherche
        </p>
      )}
    </div>
  );
}
