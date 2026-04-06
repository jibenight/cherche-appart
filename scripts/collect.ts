/**
 * CLI script to collect property listings from all providers.
 *
 * Usage:
 *   npx tsx scripts/collect.ts
 *   npx tsx scripts/collect.ts --provider pap --limit 10
 *   npx tsx scripts/collect.ts --lat 48.8566 --lng 2.3522 --radius 20
 *   npx tsx scripts/collect.ts --provider bienici --transaction rent
 */

import { collectAll, collectFromProviderByName } from '../src/lib/scheduler/collector';
import { getProviderNames } from '../src/lib/providers';
import type { SearchParams } from '../src/lib/providers/types';

function parseArgs(): {
  provider?: string;
  limit?: number;
  lat: number;
  lng: number;
  radius: number;
  transaction: 'buy' | 'rent';
} {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--') && i + 1 < args.length) {
      parsed[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }

  return {
    provider: parsed.provider,
    limit: parsed.limit ? parseInt(parsed.limit) : undefined,
    lat: parseFloat(parsed.lat || '48.8566'),  // Paris by default
    lng: parseFloat(parsed.lng || '2.3522'),
    radius: parseFloat(parsed.radius || '20'),
    transaction: (parsed.transaction as 'buy' | 'rent') || 'buy',
  };
}

async function main() {
  const config = parseArgs();

  console.log('=== Cherche-Appart Property Collector ===');
  console.log(`Location: ${config.lat}, ${config.lng} (radius: ${config.radius}km)`);
  console.log(`Transaction: ${config.transaction}`);
  if (config.provider) {
    console.log(`Provider: ${config.provider}`);
    if (config.limit) console.log(`Limit: ${config.limit}`);
  } else {
    console.log(`Providers: all (${getProviderNames().join(', ')})`);
  }
  console.log('');

  const searchParams: SearchParams = {
    transactionType: config.transaction,
    lat: config.lat,
    lng: config.lng,
    radiusKm: config.radius,
  };

  try {
    if (config.provider) {
      const report = await collectFromProviderByName(
        config.provider,
        searchParams,
        config.limit
      );
      console.log('\n=== Result ===');
      console.log(`Provider: ${report.provider}`);
      console.log(`Status: ${report.status}`);
      console.log(`Found: ${report.listingsFound}`);
      console.log(`New: ${report.listingsNew}`);
      console.log(`Updated: ${report.listingsUpdated}`);
      console.log(`Duration: ${report.durationMs}ms`);
      if (report.error) console.error(`Error: ${report.error}`);
    } else {
      await collectAll(searchParams);
    }
  } catch (error) {
    console.error('Collection failed:', error);
    process.exit(1);
  }
}

main();
