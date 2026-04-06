import pLimit from 'p-limit';
import { prisma } from '@/lib/db/prisma';
import { getAllProviders, getProvider } from '@/lib/providers';
import type { PropertyProvider, SearchParams } from '@/lib/providers/types';
import { normalizeRawListing } from '@/lib/normalizer/normalize';
import { enrichGeocode } from '@/lib/normalizer/geocode-enrichment';
import { deactivateStaleProperties } from '@/lib/db/queries';

export interface ProviderReport {
  provider: string;
  status: 'success' | 'error';
  listingsFound: number;
  listingsNew: number;
  listingsUpdated: number;
  durationMs: number;
  error?: string;
}

export interface CollectionReport {
  startedAt: Date;
  completedAt: Date;
  providers: ProviderReport[];
  totalFound: number;
  totalNew: number;
  totalUpdated: number;
  staleDeactivated: number;
}

async function collectFromSingleProvider(
  provider: PropertyProvider,
  params: SearchParams,
  limit?: number
): Promise<ProviderReport> {
  const start = Date.now();
  const report: ProviderReport = {
    provider: provider.config.name,
    status: 'success',
    listingsFound: 0,
    listingsNew: 0,
    listingsUpdated: 0,
    durationMs: 0,
  };

  // Create ScrapeRun record
  const scrapeRun = await prisma.scrapeRun.create({
    data: { provider: provider.config.name },
  });

  try {
    console.log(`[Collector] Starting ${provider.config.name}...`);

    // Fetch raw listings
    let rawListings = await provider.search(params);
    if (limit && rawListings.length > limit) {
      rawListings = rawListings.slice(0, limit);
    }

    report.listingsFound = rawListings.length;
    console.log(`[Collector] ${provider.config.name}: ${rawListings.length} raw listings`);

    // Normalize
    const normalized = rawListings
      .map((raw) => normalizeRawListing(raw))
      .filter((n): n is NonNullable<typeof n> => n !== null);

    console.log(`[Collector] ${provider.config.name}: ${normalized.length} normalized`);

    // Enrich geocoding for items missing lat/lng
    const enriched = await enrichGeocode(normalized);

    // Upsert into database
    for (const property of enriched) {
      try {
        const existing = await prisma.property.findUnique({
          where: {
            source_sourceId: {
              source: property.source,
              sourceId: property.sourceId,
            },
          },
        });

        if (existing) {
          await prisma.property.update({
            where: { id: existing.id },
            data: {
              ...property,
              lastSeenAt: new Date(),
              isActive: true,
            },
          });
          report.listingsUpdated++;
        } else {
          await prisma.property.create({
            data: {
              ...property,
              isActive: true,
              lastSeenAt: new Date(),
            },
          });
          report.listingsNew++;
        }
      } catch (error) {
        // Skip individual listing errors (e.g. dedup hash conflicts)
        console.warn(`[Collector] ${provider.config.name}: Skipped listing ${property.sourceId}:`, error);
      }
    }

    // Update ScrapeRun
    await prisma.scrapeRun.update({
      where: { id: scrapeRun.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        listingsFound: report.listingsFound,
        listingsNew: report.listingsNew,
      },
    });

    console.log(
      `[Collector] ${provider.config.name}: Done. ${report.listingsNew} new, ${report.listingsUpdated} updated.`
    );
  } catch (error) {
    report.status = 'error';
    report.error = error instanceof Error ? error.message : String(error);

    await prisma.scrapeRun.update({
      where: { id: scrapeRun.id },
      data: {
        status: 'error',
        completedAt: new Date(),
        errorMessage: report.error,
      },
    });

    console.error(`[Collector] ${provider.config.name} failed:`, report.error);
  }

  report.durationMs = Date.now() - start;
  return report;
}

export async function collectAll(
  params: SearchParams,
  concurrency = 3
): Promise<CollectionReport> {
  const startedAt = new Date();
  const limit = pLimit(concurrency);

  const providers = getAllProviders();
  console.log(`[Collector] Starting collection from ${providers.length} providers (concurrency: ${concurrency})`);

  const reports = await Promise.all(
    providers.map((provider) =>
      limit(() => collectFromSingleProvider(provider, params))
    )
  );

  // Deactivate stale properties
  const staleResult = await deactivateStaleProperties(48);

  const report: CollectionReport = {
    startedAt,
    completedAt: new Date(),
    providers: reports,
    totalFound: reports.reduce((sum, r) => sum + r.listingsFound, 0),
    totalNew: reports.reduce((sum, r) => sum + r.listingsNew, 0),
    totalUpdated: reports.reduce((sum, r) => sum + r.listingsUpdated, 0),
    staleDeactivated: staleResult.count,
  };

  console.log('\n[Collector] === Collection Report ===');
  console.log(`Total found: ${report.totalFound}`);
  console.log(`Total new: ${report.totalNew}`);
  console.log(`Total updated: ${report.totalUpdated}`);
  console.log(`Stale deactivated: ${report.staleDeactivated}`);
  console.log(`Duration: ${(report.completedAt.getTime() - report.startedAt.getTime()) / 1000}s`);

  for (const r of reports) {
    const status = r.status === 'success' ? 'OK' : `ERROR: ${r.error}`;
    console.log(`  ${r.provider}: ${r.listingsFound} found, ${r.listingsNew} new (${status}) [${r.durationMs}ms]`);
  }

  return report;
}

export async function collectFromProviderByName(
  name: string,
  params: SearchParams,
  limit?: number
): Promise<ProviderReport> {
  const provider = getProvider(name);
  if (!provider) {
    throw new Error(`Unknown provider: ${name}. Available: ${getAllProviders().map((p) => p.config.name).join(', ')}`);
  }
  return collectFromSingleProvider(provider, params, limit);
}
