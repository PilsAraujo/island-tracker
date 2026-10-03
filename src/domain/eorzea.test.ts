import { describe, expect, it } from 'vitest';
import { ET_DAY_MS, ET_HOUR_MS, eorzeaClockAt, eorzeaHourAt } from './eorzea';

describe('eorzea time', () => {
  it('converts the Unix epoch to 00:00', () => {
    expect(eorzeaClockAt(0)).toEqual({ hours: 0, minutes: 0 });
  });

  it('advances one Eorzea hour every 175 real seconds', () => {
    expect(eorzeaHourAt(175_000)).toBe(1);
  });

  it('wraps to 00:00 after 24 Eorzea hours', () => {
    expect(eorzeaHourAt(ET_DAY_MS)).toBe(0);
  });

  it('reads minutes inside an hour', () => {
    expect(eorzeaClockAt(18 * ET_HOUR_MS + ET_HOUR_MS / 2)).toEqual({ hours: 18, minutes: 30 });
  });
});
