"use client";

import { Circle } from "react-leaflet";
import { useSearchStore } from "@/store/searchStore";

/**
 * Displays a circle on the map representing the search radius.
 * Only renders when a location is selected.
 */
export function SearchCircle() {
  const location = useSearchStore((s) => s.location);
  const radiusKm = useSearchStore((s) => s.radiusKm);

  if (!location) return null;

  return (
    <Circle
      center={[location.lat, location.lng]}
      radius={radiusKm * 1000} // Convert km to meters
      pathOptions={{
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.1,
        weight: 2,
        dashArray: "6 4",
      }}
    />
  );
}
