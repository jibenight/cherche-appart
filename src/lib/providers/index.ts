import type { PropertyProvider } from './types';
import { PapProvider } from './pap';
import { ParuVenduProvider } from './paruvendu';
import { OuestFranceImmoProvider } from './ouestfrance-immo';
import { ImmonotProvider } from './immonot';
import { GreenAcresProvider } from './green-acres';
import { FnaimPacaProvider } from './fnaim-paca';
import { EtreProprioProvider } from './etreproprio';
import { BieniciProvider } from './bienici';
import { OrpiProvider } from './orpi';
import { LeboncoinProvider } from './leboncoin';
import { SeLogerProvider } from './seloger';
import { LogicImmoProvider } from './logic-immo';

const providerInstances: PropertyProvider[] = [
  // Tier 1 - HTML scraping (cheerio)
  new PapProvider(),
  new ParuVenduProvider(),
  new OuestFranceImmoProvider(),
  new ImmonotProvider(),
  new GreenAcresProvider(),
  new FnaimPacaProvider(),
  new EtreProprioProvider(),
  // Tier 2 - JSON API
  new BieniciProvider(),
  new OrpiProvider(),
  // Tier 3 - Anti-bot
  new LeboncoinProvider(),
  new SeLogerProvider(),
  new LogicImmoProvider(),
];

const providerMap = new Map<string, PropertyProvider>(
  providerInstances.map((p) => [p.config.name, p])
);

export function getAllProviders(): PropertyProvider[] {
  return providerInstances.filter((p) => p.config.enabled);
}

export function getProvider(name: string): PropertyProvider | undefined {
  return providerMap.get(name);
}

export function getProviderNames(): string[] {
  return providerInstances.map((p) => p.config.name);
}
