import { findRareAnimal, isPastureAnimalSlug } from '../domain/animals';

export type PastureCounts = Record<string, number>;

const isRareSlug = (slug: unknown): slug is string => typeof slug === 'string' && findRareAnimal(slug) !== undefined;

export function sanitizeAlerts(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.filter(isRareSlug))];
}

export function sanitizePasture(raw: unknown): PastureCounts {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};

  const counts: PastureCounts = {};
  for (const [slug, count] of Object.entries(raw)) {
    const isValidCount = Number.isInteger(count) && (count as number) > 0;
    if (isPastureAnimalSlug(slug) && isValidCount) counts[slug] = count as number;
  }
  return counts;
}
