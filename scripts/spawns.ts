import { RARE_ANIMALS } from '../src/domain/animals';
import { eorzeaClockAt } from '../src/domain/eorzea';
import { spawnWindows } from '../src/domain/spawns';
import { WEATHER_LABELS, islandWeatherAt } from '../src/domain/weather';
import { describeTime, describeWeather, formatClock, formatDuration } from '../src/ui/format';

const now = Date.now();
const sevenDays = now + 7 * 24 * 3600_000;

console.log(`Eorzea time ${formatClock(eorzeaClockAt(now))} · ${WEATHER_LABELS[islandWeatherAt(now)]}\n`);

const rows = RARE_ANIMALS.map((animal) => {
  const [nextWindow] = spawnWindows(animal, now, sevenDays);
  const isUp = nextWindow.startMs <= now;
  const status = isUp
    ? `UP, ends in ${formatDuration(nextWindow.endMs - now)}`
    : `in ${formatDuration(nextWindow.startMs - now)}`;
  return { animal, status, sortKey: isUp ? 0 : nextWindow.startMs };
}).sort((a, b) => a.sortKey - b.sortKey);

for (const { animal, status } of rows) {
  const conditions = `${describeTime(animal)} · ${describeWeather(animal)}`;
  console.log(`${animal.name.padEnd(22)} ${conditions.padEnd(32)} ${status}`);
}
