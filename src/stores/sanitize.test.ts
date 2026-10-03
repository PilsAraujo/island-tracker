import { describe, expect, it } from 'vitest';
import { sanitizeAlerts, sanitizePasture } from './sanitize';

describe('sanitizeAlerts', () => {
  it('returns an empty list on first run', () => {
    expect(sanitizeAlerts(undefined)).toEqual([]);
  });

  it('keeps known slugs and drops unknown ones', () => {
    expect(sanitizeAlerts(['twinklefleece', 'removed-animal', 42])).toEqual(['twinklefleece']);
  });

  it('drops common animals because they have no spawn time', () => {
    expect(sanitizeAlerts(['lost-lamb', 'paissa'])).toEqual(['paissa']);
  });

  it('removes duplicates', () => {
    expect(sanitizeAlerts(['paissa', 'paissa'])).toEqual(['paissa']);
  });
});

describe('sanitizePasture', () => {
  it('returns no counts on first run', () => {
    expect(sanitizePasture(undefined)).toEqual({});
  });

  it('keeps positive integer counts of known animals', () => {
    expect(sanitizePasture({ alligator: 1, 'removed-animal': 3, paissa: -2, griffin: 1.5, lemur: 0 })).toEqual({
      alligator: 1,
    });
  });

  it('keeps common animals', () => {
    expect(sanitizePasture({ 'lost-lamb': 2, 'opo-opo': 1 })).toEqual({ 'lost-lamb': 2, 'opo-opo': 1 });
  });

  it('ignores a value that is not an object', () => {
    expect(sanitizePasture(['alligator'])).toEqual({});
  });
});
