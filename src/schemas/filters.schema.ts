import { z } from "zod";

/** Property type enum schema */
export const PropertyTypeSchema = z.enum([
  "apartment",
  "house",
  "studio",
  "loft",
  "land",
  "commercial",
  "other",
]);

/** DPE rating schema */
export const DPERatingSchema = z.enum([
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "unknown",
]);

/** Transaction type schema */
export const TransactionTypeSchema = z.enum(["buy", "rent"]);

/** Property condition schema */
export const PropertyConditionSchema = z.enum([
  "new",
  "good",
  "to_renovate",
  "any",
]);

/** Range filter schema */
export const RangeFilterSchema = z.object({
  min: z.number().nullable(),
  max: z.number().nullable(),
});

/** Complete filter set schema */
export const FilterSetSchema = z.object({
  transactionType: TransactionTypeSchema,
  propertyTypes: z.array(PropertyTypeSchema),
  priceRange: RangeFilterSchema,
  surfaceRange: RangeFilterSchema,
  minRooms: z.number().int().min(0).nullable(),
  minBedrooms: z.number().int().min(0).nullable(),
  floorRange: RangeFilterSchema,
  hasParking: z.boolean().nullable(),
  hasElevator: z.boolean().nullable(),
  hasBalcony: z.boolean().nullable(),
  minDPE: DPERatingSchema.nullable(),
  condition: PropertyConditionSchema,
});

/** Validate and parse filter data from external sources */
export function parseFilters(data: unknown) {
  return FilterSetSchema.safeParse(data);
}

/** URL search params schema for filter validation */
export const FilterParamsSchema = z.object({
  type: TransactionTypeSchema.optional(),
  ptype: z.string().optional(),
  pmin: z.coerce.number().optional(),
  pmax: z.coerce.number().optional(),
  smin: z.coerce.number().optional(),
  smax: z.coerce.number().optional(),
  rooms: z.coerce.number().int().min(0).optional(),
  beds: z.coerce.number().int().min(0).optional(),
  cond: PropertyConditionSchema.optional(),
});
