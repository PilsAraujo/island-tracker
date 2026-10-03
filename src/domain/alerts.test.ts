import { describe, expect, it } from 'vitest';
import { ALERT_LEAD_MS, buildAlertQueue } from './alerts';
import { ET_DAY_MS, ET_HOUR_MS } from './eorzea';

const DAY_START = 1_000 * ET_DAY_MS;
const at = (eorzeaHour: number) => DAY_START + eorzeaHour * ET_HOUR_MS;

describe('buildAlertQueue', () => {
  it('schedules each spawn 60 seconds before it starts', () => {
    const queue = buildAlertQueue(['star-marmot'], at(0));

    expect(queue[0]).toEqual({ slug: 'star-marmot', name: 'Star Marmot', atMs: at(9) - ALERT_LEAD_MS });
  });

  it('is empty when no animal is selected', () => {
    expect(buildAlertQueue([], at(0))).toEqual([]);
  });

  it('sorts alerts of several animals by time', () => {
    const queue = buildAlertQueue(['island-stag', 'star-marmot'], at(0));

    expect(queue.slice(0, 2).map((alert) => alert.slug)).toEqual(['star-marmot', 'island-stag']);
    expect(queue.every((alert, i) => i === 0 || alert.atMs >= queue[i - 1].atMs)).toBe(true);
  });

  it('skips the current window when the animal is already up', () => {
    const queue = buildAlertQueue(['star-marmot'], at(10));

    expect(queue[0].atMs).toBe(at(33) - ALERT_LEAD_MS);
  });

  it('skips an alert whose time already passed', () => {
    const queue = buildAlertQueue(['star-marmot'], at(9) - 30_000);

    expect(queue[0].atMs).toBe(at(33) - ALERT_LEAD_MS);
  });

  it('ignores unknown slugs', () => {
    expect(buildAlertQueue(['removed-animal'], at(0))).toEqual([]);
  });
});
