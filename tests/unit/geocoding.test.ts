import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchCities, reverseGeocode } from "@/services/geocoding";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockApiResponse = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [4.8357, 45.764],
      },
      properties: {
        label: "Lyon",
        name: "Lyon",
        postcode: "69000",
        city: "Lyon",
        context: "69, Rhône, Auvergne-Rhône-Alpes",
        type: "municipality",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [4.77, 45.74],
      },
      properties: {
        label: "Lyon 5e Arrondissement",
        name: "Lyon 5e Arrondissement",
        postcode: "69005",
        city: "Lyon 5e Arrondissement",
        context: "69, Rhône, Auvergne-Rhône-Alpes",
        type: "municipality",
      },
    },
  ],
};

beforeEach(() => {
  mockFetch.mockReset();
});

describe("searchCities", () => {
  it("returns empty array for queries shorter than 2 characters", async () => {
    const result = await searchCities("L");
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns empty array for empty/whitespace query", async () => {
    const result = await searchCities("  ");
    expect(result).toEqual([]);
  });

  it("calls API Adresse with correct parameters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    await searchCities("Lyon");

    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("api-adresse.data.gouv.fr/search");
    expect(calledUrl).toContain("q=Lyon");
    expect(calledUrl).toContain("type=municipality");
    expect(calledUrl).toContain("limit=7");
  });

  it("parses API response into GeoSuggestion array", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    const results = await searchCities("Lyon");

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      label: "Lyon",
      name: "Lyon",
      postcode: "69000",
      department: "Rhône",
      coordinates: [4.8357, 45.764],
    });
  });

  it("throws on API error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(searchCities("Lyon")).rejects.toThrow("Geocoding API error");
  });

  it("returns empty array on abort", async () => {
    const abortError = new Error("Aborted");
    abortError.name = "AbortError";
    mockFetch.mockRejectedValueOnce(abortError);

    const result = await searchCities("Lyon");
    expect(result).toEqual([]);
  });
});

describe("reverseGeocode", () => {
  it("returns suggestion for valid coordinates", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        type: "FeatureCollection",
        features: [mockApiResponse.features[0]],
      }),
    });

    const result = await reverseGeocode(45.764, 4.8357);

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Lyon");
  });

  it("returns null when no features found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        type: "FeatureCollection",
        features: [],
      }),
    });

    const result = await reverseGeocode(0, 0);
    expect(result).toBeNull();
  });

  it("returns null on fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await reverseGeocode(45.764, 4.8357);
    expect(result).toBeNull();
  });
});
