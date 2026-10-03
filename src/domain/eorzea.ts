export const ET_HOUR_MS = 175_000;
export const ET_DAY_MS = 24 * ET_HOUR_MS;
export const WEATHER_PERIOD_MS = 8 * ET_HOUR_MS;

export interface EorzeaClock {
  hours: number;
  minutes: number;
}

export function eorzeaHourAt(ms: number): number {
  return Math.floor(ms / ET_HOUR_MS) % 24;
}

export function eorzeaClockAt(ms: number): EorzeaClock {
  const totalMinutes = Math.floor(ms / (ET_HOUR_MS / 60));
  return { hours: Math.floor(totalMinutes / 60) % 24, minutes: totalMinutes % 60 };
}

export function startOfEorzeaHour(ms: number): number {
  return ms - (ms % ET_HOUR_MS);
}
