import { describe, expect, it } from 'vitest';
import reference from './__fixtures__/weather-reference.json';
import { WEATHER_PERIOD_MS } from './eorzea';
import { islandWeatherAt, weatherValueAt } from './weather';

describe('weather', () => {
  it.each(reference)('matches the Thonky reference at $ms', ({ ms, value, weather }) => {
    expect(weatherValueAt(ms)).toBe(value);
    expect(islandWeatherAt(ms)).toBe(weather);
  });

  it('stays the same during one 8-hour Eorzea period', () => {
    const periodStart = WEATHER_PERIOD_MS * 1_000_000;
    const periodEnd = periodStart + WEATHER_PERIOD_MS - 1;

    expect(islandWeatherAt(periodEnd)).toBe(islandWeatherAt(periodStart));
  });
});
