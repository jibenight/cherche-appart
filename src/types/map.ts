/** Marker data for displaying a property on the map */
export interface MapMarker {
  id: string;
  position: [number, number]; // [lat, lng]
  price: number;
  priceLabel: string; // "250k", "1.2M"
  propertyId: string;
}

/** Popup data shown when clicking a marker */
export interface MapPopup {
  propertyId: string;
  thumbnail: string;
  price: number;
  surface: number;
  rooms: number;
  city: string;
}

/** Current map viewport state */
export interface MapViewport {
  center: [number, number];
  zoom: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

/** Format a price into a short label (e.g., "250k", "1.2M") */
export function formatPriceLabel(price: number): string {
  if (price >= 1_000_000) {
    const m = price / 1_000_000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (price >= 1_000) {
    const k = Math.round(price / 1_000);
    return `${k}k`;
  }
  return `${price}`;
}
