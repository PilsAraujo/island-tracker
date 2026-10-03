import { findRareAnimal } from './animals';
import { upcomingSpawnStarts } from './spawns';
import { islandWeatherAt, type WeatherAt } from './weather';

export const ALERT_LEAD_MS = 60_000;
export const ALERT_HORIZON_MS = 7 * 24 * 3600_000;

export interface ScheduledAlert {
  slug: string;
  name: string;
  atMs: number;
}

export function buildAlertQueue(
  slugs: readonly string[],
  nowMs: number,
  weatherAt: WeatherAt = islandWeatherAt,
): ScheduledAlert[] {
  const untilMs = nowMs + ALERT_HORIZON_MS;

  return slugs
    .flatMap((slug) => {
      const animal = findRareAnimal(slug);
      if (!animal) return [];
      return upcomingSpawnStarts(animal, nowMs, untilMs, weatherAt).map((spawn) => ({
        slug,
        name: animal.name,
        atMs: spawn.startMs - ALERT_LEAD_MS,
      }));
    })
    .filter((alert) => alert.atMs > nowMs)
    .sort((a, b) => a.atMs - b.atMs);
}
