import { geoApiResponseSchema } from "@/schemas/location.schema";
import type { GeoSuggestion } from "@/types/location";

const API_BASE = "https://api-adresse.data.gouv.fr/search";

interface GeocodingOptions {
  /** Limit number of results (default: 7) */
  limit?: number;
  /** Filter by type (default: municipality) */
  type?: "municipality" | "street" | "housenumber" | "locality";
}

/**
 * Search for French communes using the API Adresse.
 * Returns autocomplete suggestions for city names and postal codes.
 *
 * @see https://adresse.data.gouv.fr/api-doc/adresse
 */
export async function searchCities(
  query: string,
  options: GeocodingOptions = {},
): Promise<GeoSuggestion[]> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) {
    return [];
  }

  const { limit = 7, type = "municipality" } = options;

  const params = new URLSearchParams({
    q: trimmedQuery,
    type,
    limit: String(limit),
  });

  const url = `${API_BASE}?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data: unknown = await response.json();

    // Validate response with Zod
    const parsed = geoApiResponseSchema.parse(data);

    return parsed.features.map((feature) => {
      // Extract department from context (format: "69, Rhône, Auvergne-Rhône-Alpes")
      const contextParts = feature.properties.context.split(", ");
      const department = contextParts[1] ?? contextParts[0] ?? "";

      return {
        label: feature.properties.label,
        name: feature.properties.city || feature.properties.name,
        postcode: feature.properties.postcode,
        department,
        coordinates: feature.geometry.coordinates,
      };
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return [];
    }
    console.error("Geocoding search failed:", error);
    throw error;
  }
}

/**
 * Reverse geocode coordinates to get the nearest city.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<GeoSuggestion | null> {
  const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${lng}&lat=${lat}&type=municipality`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data: unknown = await response.json();
    const parsed = geoApiResponseSchema.parse(data);

    if (parsed.features.length === 0) return null;

    const feature = parsed.features[0];
    const contextParts = feature.properties.context.split(", ");
    const department = contextParts[1] ?? contextParts[0] ?? "";

    return {
      label: feature.properties.label,
      name: feature.properties.city || feature.properties.name,
      postcode: feature.properties.postcode,
      department,
      coordinates: feature.geometry.coordinates,
    };
  } catch {
    return null;
  }
}
