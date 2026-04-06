import { createHash } from 'crypto';

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function computeDedupHash(
  title: string,
  price: number,
  city: string,
  surface: number
): string {
  const input = [
    normalizeText(title),
    Math.round(price).toString(),
    normalizeText(city),
    Math.round(surface).toString(),
  ].join('|');

  return createHash('md5').update(input).digest('hex');
}
