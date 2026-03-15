"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { PropertyCard } from "@/types/property";

interface PropertyMarkersProps {
  properties: PropertyCard[];
  highlightedId: string | null;
  onMarkerHover: (id: string | null) => void;
  onMarkerClick: (id: string) => void;
}

/** Create a custom icon for property markers */
function createMarkerIcon(isHighlighted: boolean): L.DivIcon {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: ${isHighlighted ? "#2563eb" : "#3b82f6"};
      color: white;
      border: 2px solid white;
      border-radius: 50%;
      width: ${isHighlighted ? "16px" : "12px"};
      height: ${isHighlighted ? "16px" : "12px"};
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transition: all 0.2s;
    "></div>`,
    iconSize: [isHighlighted ? 16 : 12, isHighlighted ? 16 : 12],
    iconAnchor: [isHighlighted ? 8 : 6, isHighlighted ? 8 : 6],
  });
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M €`;
  if (price >= 1_000) return `${Math.round(price / 1_000)}k €`;
  return `${price} €`;
}

export function PropertyMarkers({
  properties,
  highlightedId,
  onMarkerHover,
  onMarkerClick,
}: PropertyMarkersProps) {
  return (
    <>
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.lat, property.lng]}
          icon={createMarkerIcon(property.id === highlightedId)}
          eventHandlers={{
            mouseover: () => onMarkerHover(property.id),
            mouseout: () => onMarkerHover(null),
            click: () => onMarkerClick(property.id),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <p className="font-semibold text-sm">{property.title}</p>
              <p className="text-blue-600 font-bold">{formatPrice(property.price)}</p>
              <p className="text-xs text-gray-500">
                {property.surface}m² • {property.rooms}p • {property.city}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
