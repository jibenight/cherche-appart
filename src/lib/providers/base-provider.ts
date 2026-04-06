import pRetry from 'p-retry';
import { type PropertyProvider, type ProviderConfig, type SearchParams, type RawListing } from './types';

const DEFAULT_USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
];

function randomDelay(range: [number, number]): Promise<void> {
  const ms = range[0] + Math.random() * (range[1] - range[0]);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export abstract class BaseProvider implements PropertyProvider {
  abstract readonly config: ProviderConfig;

  abstract search(params: SearchParams): Promise<RawListing[]>;

  protected getRandomUserAgent(): string {
    return this.config.userAgent || DEFAULT_USER_AGENTS[Math.floor(Math.random() * DEFAULT_USER_AGENTS.length)];
  }

  protected async delay(): Promise<void> {
    await randomDelay(this.config.delayBetweenRequests);
  }

  protected async fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
    return pRetry(
      async () => {
        const response = await fetch(url, {
          ...init,
          headers: {
            'User-Agent': this.getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.5',
            ...init?.headers,
          },
        });

        if (response.status === 429) {
          throw new Error(`Rate limited by ${this.config.name}`);
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} from ${this.config.name}: ${url}`);
        }

        return response;
      },
      {
        retries: 3,
        minTimeout: 2000,
        maxTimeout: 10000,
        onFailedAttempt: (error) => {
          console.warn(
            `[${this.config.name}] Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`
          );
        },
      }
    );
  }

  protected async fetchHtml(url: string): Promise<string> {
    const response = await this.fetchWithRetry(url);
    return response.text();
  }

  protected async fetchJson<T = unknown>(url: string, init?: RequestInit): Promise<T> {
    const response = await this.fetchWithRetry(url, {
      ...init,
      headers: {
        'Accept': 'application/json',
        ...init?.headers,
      },
    });
    return response.json() as Promise<T>;
  }
}
