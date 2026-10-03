import { ANY_TIME, type Animal } from '../domain/animals';
import type { EorzeaClock } from '../domain/eorzea';
import { WEATHER_LABELS } from '../domain/weather';

export const pad = (n: number) => String(n).padStart(2, '0');

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatClock({ hours, minutes }: EorzeaClock): string {
  return `${pad(hours)}:${pad(minutes)}`;
}

export function describeTime(animal: Animal): string {
  return animal.appears === ANY_TIME ? 'Any time' : `${pad(animal.appears)}:00–${pad(animal.disappears)}:00 ET`;
}

export function describeWeather(animal: Animal): string {
  return animal.weather === 'any' ? 'Any weather' : WEATHER_LABELS[animal.weather];
}
