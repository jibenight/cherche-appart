"use client";

import { useEffect, useCallback } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSearchStore } from "@/store/searchStore";
import { reverseGeocode } from "@/services/geocoding";

/**
 * Button that requests the user's GPS position and sets it as the search location.
 * Handles loading, error, and success states with appropriate feedback.
 */
export function GeolocationButton() {
  const { status, lat, lng, error, requestLocation, cancel } = useGeolocation();
  const setLocation = useSearchStore((s) => s.setLocation);

  // When geolocation succeeds, reverse geocode to get city name
  useEffect(() => {
    if (status === "success" && lat !== null && lng !== null) {
      reverseGeocode(lat, lng).then((suggestion) => {
        if (suggestion) {
          setLocation({
            name: suggestion.name,
            postcode: suggestion.postcode,
            department: suggestion.department,
            lat: suggestion.coordinates[1],
            lng: suggestion.coordinates[0],
          });
        } else {
          // Fallback: use raw coordinates with generic name
          setLocation({
            name: "Ma position",
            postcode: "",
            department: "",
            lat,
            lng,
          });
        }
      });
    }
  }, [status, lat, lng, setLocation]);

  const handleClick = useCallback(() => {
    if (status === "loading") {
      cancel();
    } else {
      requestLocation();
    }
  }, [status, cancel, requestLocation]);

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          status === "loading"
            ? "bg-gray-100 text-gray-600"
            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        }`}
        aria-label={
          status === "loading"
            ? "Annuler la géolocalisation"
            : "Utiliser ma position actuelle"
        }
      >
        {status === "loading" ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-blue-500" />
            <span>Localisation en cours...</span>
            <span className="text-xs text-gray-400">(cliquez pour annuler)</span>
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Utiliser ma position</span>
          </>
        )}
      </button>

      {/* Error message */}
      {status === "error" && error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
