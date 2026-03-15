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
    <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-md sm:p-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Rechercher un bien immobilier
      </h2>
      <LocationInput />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <RadiusSlider />
        </div>
        <GeolocationButton />
      </div>
    </div>
  );
}
