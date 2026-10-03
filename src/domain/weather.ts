import { ET_DAY_MS, ET_HOUR_MS } from './eorzea';

export type Weather = 'clearSkies' | 'fairSkies' | 'clouds' | 'rain' | 'fog' | 'showers';

export type WeatherAt = (ms: number) => Weather;

export const WEATHER_LABELS: Record<Weather, string> = {
  clearSkies: 'Clear Skies',
  fairSkies: 'Fair Skies',
  clouds: 'Clouds',
  rain: 'Rain',
  fog: 'Fog',
  showers: 'Showers',
};

const ISLAND_WEATHER_RATES: ReadonlyArray<[upperBound: number, weather: Weather]> = [
  [25, 'clearSkies'],
  [70, 'fairSkies'],
  [80, 'clouds'],
  [90, 'rain'],
  [95, 'fog'],
  [100, 'showers'],
];

/**
 * Weather forecast hash used by the game client (see SaintCoinach WeatherRate.cs).
 * The bitwise operators intentionally truncate to 32-bit integers.
 */
export function weatherValueAt(ms: number): number {
  const eorzeaHours = ms / ET_HOUR_MS;
  const eorzeaDays = ms / ET_DAY_MS;
  const periodIncrement = (eorzeaHours + 8 - (eorzeaHours % 8)) % 24;

  const step1 = (eorzeaDays << 32) >>> 0;
  const step2 = step1 * 100 + periodIncrement;
  const step3 = ((step2 << 11) ^ step2) >>> 0;
  const step4 = ((step3 >>> 8) ^ step3) >>> 0;

  return step4 % 100;
}

export function islandWeatherAt(ms: number): Weather {
  const value = weatherValueAt(ms);
  const [, weather] = ISLAND_WEATHER_RATES.find(([upperBound]) => value < upperBound)!;
  return weather;
}
