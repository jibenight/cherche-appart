import { z } from "zod";

/** Schema for a single feature from the API Adresse response */
export const geoFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  }),
  properties: z.object({
    label: z.string(),
    name: z.string(),
    postcode: z.string(),
    city: z.string(),
    context: z.string(), // "69, Rhône, Auvergne-Rhône-Alpes"
    type: z.string(),
    importance: z.number().optional(),
  }),
});

/** Schema for the full API Adresse response */
export const geoApiResponseSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(geoFeatureSchema),
  attribution: z.string().optional(),
  licence: z.string().optional(),
  query: z.string().optional(),
  limit: z.number().optional(),
});

/** Type inferred from schemas */
export type GeoFeature = z.infer<typeof geoFeatureSchema>;
export type GeoApiResponse = z.infer<typeof geoApiResponseSchema>;
