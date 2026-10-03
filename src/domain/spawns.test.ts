import { describe, expect, it } from 'vitest';
import { ANY_TIME, COMMON_PASTURE_ANIMALS, RARE_ANIMALS, RARE_PASTURE_ANIMALS, findRareAnimal } from './animals';
import { ET_DAY_MS, ET_HOUR_MS, WEATHER_PERIOD_MS } from './eorzea';
import { isActiveAt, spawnWindows, upcomingSpawnStarts } from './spawns';
import type { Weather, WeatherAt } from './weather';

const DAY_START = 1_000 * ET_DAY_MS;

const at = (eorzeaHour: number) => DAY_START + eorzeaHour * ET_HOUR_MS;

function fakeWeather(periods: [Weather, Weather, Weather], fallback: Weather = 'fairSkies'): WeatherAt {
  return (ms) => {
    const isToday = ms >= DAY_START && ms < DAY_START + ET_DAY_MS;
    if (!isToday) return fallback;
    return periods[Math.floor((ms - DAY_START) / WEATHER_PERIOD_MS)];
  };
}

const animal = (name: string) => findRareAnimal(name)!;

describe('spawn windows', () => {
  it('has the 29 rare animals with unique slugs', () => {
    const slugs = new Set(RARE_ANIMALS.map((a) => a.slug));
    expect(slugs.size).toBe(29);
  });

  it.each(RARE_ANIMALS.filter((a) => a.appears !== ANY_TIME))('gives $name a 3-hour time window', (timedAnimal) => {
    const windowLength = (timedAnimal.disappears - timedAnimal.appears + 24) % 24;
    expect(windowLength).toBe(3);
  });

  it('opens a time and weather window when both match', () => {
    const weather = fakeWeather(['clearSkies', 'clearSkies', 'fog']);

    const windows = spawnWindows(animal('twinklefleece'), at(0), at(24), weather);

    expect(windows).toEqual([{ slug: 'twinklefleece', startMs: at(18), endMs: at(21) }]);
  });

  it('starts mid-window when the weather changes inside the time window', () => {
    const weather = fakeWeather(['clouds', 'showers', 'clearSkies']);

    const windows = spawnWindows(animal('alligator'), at(0), at(24), weather);

    expect(windows).toEqual([{ slug: 'alligator', startMs: at(8), endMs: at(9) }]);
  });

  it('handles a window that crosses midnight', () => {
    const morbol = animal('morbol');
    const weather: WeatherAt = () => 'showers';

    expect(isActiveAt(morbol, at(23), weather)).toBe(true);
    expect(isActiveAt(morbol, at(24), weather)).toBe(false);
  });

  it('keeps a weather-only animal up for the whole weather period', () => {
    const weather = fakeWeather(['fairSkies', 'fairSkies', 'clearSkies']);

    const windows = spawnWindows(animal('black-chocobo'), at(0), at(24), weather);

    expect(windows).toEqual([{ slug: 'black-chocobo', startMs: at(16), endMs: at(24) }]);
  });

  it('merges consecutive periods with the same weather', () => {
    const weather = fakeWeather(['fairSkies', 'clearSkies', 'clearSkies']);

    const windows = spawnWindows(animal('black-chocobo'), at(0), at(24), weather);

    expect(windows).toEqual([{ slug: 'black-chocobo', startMs: at(8), endMs: at(24) }]);
  });

  it('repeats a time-only animal every Eorzea day', () => {
    const windows = spawnWindows(animal('star-marmot'), at(0), at(48));

    expect(windows.map((w) => w.startMs)).toEqual([at(9), at(33)]);
  });

  it('reports the real start of a window that is already open', () => {
    const windows = spawnWindows(animal('star-marmot'), at(10), at(12));

    expect(windows).toEqual([{ slug: 'star-marmot', startMs: at(9), endMs: at(12) }]);
  });

  it('skips the open window when listing upcoming starts', () => {
    const starts = upcomingSpawnStarts(animal('star-marmot'), at(10), at(48));

    expect(starts.map((w) => w.startMs)).toEqual([at(33)]);
  });

  it('finds at least one spawn for every animal within 7 real days', () => {
    const now = Date.UTC(2026, 9, 2);
    const sevenDays = now + 7 * 24 * 3600_000;

    for (const rareAnimal of RARE_ANIMALS) {
      expect(upcomingSpawnStarts(rareAnimal, now, sevenDays).length, rareAnimal.name).toBeGreaterThan(0);
    }
  });
});

describe('pasture animals', () => {
  it('lists 14 common and 29 rare animals with unique slugs', () => {
    const slugs = new Set([...COMMON_PASTURE_ANIMALS, ...RARE_PASTURE_ANIMALS].map((a) => a.slug));

    expect(COMMON_PASTURE_ANIMALS).toHaveLength(14);
    expect(RARE_PASTURE_ANIMALS).toHaveLength(29);
    expect(slugs.size).toBe(43);
  });
});
