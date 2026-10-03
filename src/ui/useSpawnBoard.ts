import { computed, type Ref } from 'vue';
import { ALERT_HORIZON_MS } from '../domain/alerts';
import { RARE_ANIMALS, type Animal } from '../domain/animals';
import { spawnWindows, type SpawnWindow } from '../domain/spawns';

export interface AnimalStatus {
  animal: Animal;
  window: SpawnWindow | null;
  isUp: boolean;
}

export function useSpawnBoard(now: Ref<number>) {
  const windowCache = new Map<string, SpawnWindow | null>();

  function currentWindow(animal: Animal, nowMs: number): SpawnWindow | null {
    const cached = windowCache.get(animal.slug);
    const isCacheValid = cached != null && cached.endMs > nowMs;
    if (isCacheValid) return cached;

    const [nextWindow = null] = spawnWindows(animal, nowMs, nowMs + ALERT_HORIZON_MS);
    windowCache.set(animal.slug, nextWindow);
    return nextWindow;
  }

  return computed<AnimalStatus[]>(() => {
    const nowMs = now.value;
    const statuses = RARE_ANIMALS.map((animal) => {
      const window = currentWindow(animal, nowMs);
      return { animal, window, isUp: window !== null && window.startMs <= nowMs };
    });

    const sortKey = (status: AnimalStatus) =>
      status.isUp ? 0 : (status.window?.startMs ?? Number.MAX_SAFE_INTEGER);
    return statuses.sort((a, b) => sortKey(a) - sortKey(b));
  });
}
