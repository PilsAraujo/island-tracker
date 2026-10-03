import { describe, expect, it } from 'vitest';
import { addAnimal, canAdd, canRemove, pastureTotal, removeAnimal } from './pasture';

describe('pasture', () => {
  it('adds an animal and updates the total', () => {
    const counts = addAnimal({ twinklefleece: 2, alligator: 1 }, 'paissa');

    expect(counts.paissa).toBe(1);
    expect(pastureTotal(counts)).toBe(4);
  });

  it('does not add past 20 animals', () => {
    const full = { twinklefleece: 20 };

    expect(canAdd(full)).toBe(false);
    expect(addAnimal(full, 'paissa')).toBe(full);
  });

  it('does not go below zero', () => {
    expect(canRemove({}, 'paissa')).toBe(false);
    expect(removeAnimal({}, 'paissa')).toEqual({});
  });

  it('removes the slug when the count reaches zero', () => {
    expect(removeAnimal({ paissa: 1, alligator: 2 }, 'paissa')).toEqual({ alligator: 2 });
  });
});
