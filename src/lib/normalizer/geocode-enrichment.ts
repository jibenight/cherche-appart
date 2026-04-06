import type { NormalizedProperty } from './normalize';

const API_ADRESSE_URL = 'https://api-adresse.data.gouv.fr/search';

interface GeoApiFeature {
  geometry: { coordinates: [number, number] };
  properties: { postcode?: string; city?: string };
}

interface GeoApiResponse {
  features: GeoApiFeature[];
}

export async function enrichGeocode(
  properties: NormalizedProperty[]
): Promise<NormalizedProperty[]> {
  const results: NormalizedProperty[] = [];

  for (const prop of properties) {
    if (prop.lat !== 0 && prop.lng !== 0) {
      results.push(prop);
      continue;
    }

    const query = [prop.address, prop.city, prop.postcode]
      .filter(Boolean)
      .join(' ');

    if (!query.trim()) {
      results.push(prop);
      continue;
    }

    try {
      const url = `${API_ADRESSE_URL}?q=${encodeURIComponent(query)}&limit=1`;
      const response = await fetch(url);

      if (!response.ok) {
        results.push(prop);
        continue;
      }

      const data = (await response.json()) as GeoApiResponse;

      if (data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.geometry.coordinates;

        results.push({
          ...prop,
          lat,
          lng,
          postcode: prop.postcode || feature.properties.postcode || '',
        });
      } else {
        results.push(prop);
      }

      // Rate limit: 50 req/s for API Adresse
      await new Promise((resolve) => setTimeout(resolve, 25));
    } catch {
      results.push(prop);
    }
  }

  return results;
}
