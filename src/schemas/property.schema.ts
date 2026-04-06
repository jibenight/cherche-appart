import { z } from 'zod';

export const RawListingSchema = z.object({
  sourceId: z.string().min(1),
  source: z.string().min(1),
  externalUrl: z.string().url(),
  transactionType: z.string().optional(),
  type: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional().default(''),
  price: z.number().positive(),
  surface: z.number().positive().optional(),
  rooms: z.number().int().nonnegative().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  floor: z.number().int().nullable().optional(),
  totalFloors: z.number().int().positive().nullable().optional(),
  hasParking: z.boolean().optional().default(false),
  hasElevator: z.boolean().optional().default(false),
  hasBalcony: z.boolean().optional().default(false),
  dpe: z.string().optional().default('unknown'),
  condition: z.string().optional().default('good'),
  address: z.string().optional().default(''),
  city: z.string().min(1),
  postcode: z.string().optional().default(''),
  lat: z.number().optional(),
  lng: z.number().optional(),
  images: z.array(z.string()).optional().default([]),
  publishedAt: z.string().optional(),
});

export type ValidatedRawListing = z.infer<typeof RawListingSchema>;
