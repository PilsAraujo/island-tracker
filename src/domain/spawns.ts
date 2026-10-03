import { ANY_TIME, type Animal } from './animals';
import { ET_HOUR_MS, eorzeaHourAt, startOfEorzeaHour } from './eorzea';
import { islandWeatherAt, type WeatherAt } from './weather';

export interface SpawnWindow {
  slug: string;
  startMs: number;
  endMs: number;
}

const MAX_LOOKBEHIND_HOURS = 24 * 30;
const MAX_LOOKAHEAD_HOURS = 24 * 30;

export function isInTimeWindow(animal: Animal, eorzeaHour: number): boolean {
  if (animal.appears === ANY_TIME) return true;

  const windowCrossesMidnight = animal.appears > animal.disappears;
  if (windowCrossesMidnight) {
    return eorzeaHour >= animal.appears || eorzeaHour < animal.disappears;
  }
  return eorzeaHour >= animal.appears && eorzeaHour < animal.disappears;
}

export function isActiveAt(animal: Animal, ms: number, weatherAt: WeatherAt = islandWeatherAt): boolean {
  const weatherMatches = animal.weather === 'any' || weatherAt(ms) === animal.weather;
  return weatherMatches && isInTimeWindow(animal, eorzeaHourAt(ms));
}

function findWindowStart(animal: Animal, activeHourMs: number, weatherAt: WeatherAt): number {
  let startMs = activeHourMs;
  for (let step = 0; step < MAX_LOOKBEHIND_HOURS; step++) {
    const previousHourMs = startMs - ET_HOUR_MS;
    if (!isActiveAt(animal, previousHourMs, weatherAt)) break;
    startMs = previousHourMs;
  }
  return startMs;
}

/**
 * Returns every spawn window that overlaps [fromMs, untilMs).
 * A window already open at fromMs keeps its real start time, which can be before fromMs.
 */
export function spawnWindows(
  animal: Animal,
  fromMs: number,
  untilMs: number,
  weatherAt: WeatherAt = islandWeatherAt,
): SpawnWindow[] {
  const windows: SpawnWindow[] = [];
  let openWindowStart: number | null = null;

  for (let hourMs = startOfEorzeaHour(fromMs); hourMs < untilMs; hourMs += ET_HOUR_MS) {
    const isActive = isActiveAt(animal, hourMs, weatherAt);

    if (isActive && openWindowStart === null) {
      const isFirstHour = windows.length === 0 && hourMs <= fromMs;
      openWindowStart = isFirstHour ? findWindowStart(animal, hourMs, weatherAt) : hourMs;
    }

    if (!isActive && openWindowStart !== null) {
      windows.push({ slug: animal.slug, startMs: openWindowStart, endMs: hourMs });
      openWindowStart = null;
    }
  }

  if (openWindowStart !== null) {
    windows.push({ slug: animal.slug, startMs: openWindowStart, endMs: findWindowEnd(animal, untilMs, weatherAt) });
  }

  return windows;
}

function findWindowEnd(animal: Animal, fromMs: number, weatherAt: WeatherAt): number {
  let hourMs = startOfEorzeaHour(fromMs);
  for (let step = 0; step < MAX_LOOKAHEAD_HOURS && isActiveAt(animal, hourMs, weatherAt); step++) {
    hourMs += ET_HOUR_MS;
  }
  return hourMs;
}

export function upcomingSpawnStarts(
  animal: Animal,
  fromMs: number,
  untilMs: number,
  weatherAt: WeatherAt = islandWeatherAt,
): SpawnWindow[] {
  return spawnWindows(animal, fromMs, untilMs, weatherAt).filter((window) => window.startMs > fromMs);
}
