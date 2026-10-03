import type { PastureCounts } from './sanitize';

export const PASTURE_CAPACITY = 20;

export function pastureTotal(counts: PastureCounts): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

export function countOf(counts: PastureCounts, slug: string): number {
  return counts[slug] ?? 0;
}

export function canAdd(counts: PastureCounts): boolean {
  return pastureTotal(counts) < PASTURE_CAPACITY;
}

export function canRemove(counts: PastureCounts, slug: string): boolean {
  return countOf(counts, slug) > 0;
}

export function addAnimal(counts: PastureCounts, slug: string): PastureCounts {
  if (!canAdd(counts)) return counts;
  return { ...counts, [slug]: countOf(counts, slug) + 1 };
}

export function removeAnimal(counts: PastureCounts, slug: string): PastureCounts {
  if (!canRemove(counts, slug)) return counts;

  const { [slug]: current, ...others } = counts;
  return current === 1 ? others : { ...others, [slug]: current - 1 };
}
