import { isTauri } from '@tauri-apps/api/core';

export interface KeyValueStorage {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

const SETTINGS_FILE = 'settings.json';
const BROWSER_PREFIX = 'island-tracker:';

async function openTauriStorage(): Promise<KeyValueStorage> {
  const { load } = await import('@tauri-apps/plugin-store');
  const store = await load(SETTINGS_FILE, { defaults: {}, autoSave: true });
  return {
    get: (key) => store.get(key),
    set: (key, value) => store.set(key, value),
  };
}

function openBrowserStorage(): KeyValueStorage {
  return {
    async get(key) {
      try {
        const raw = localStorage.getItem(BROWSER_PREFIX + key);
        return raw === null ? undefined : JSON.parse(raw);
      } catch {
        return undefined;
      }
    },
    async set(key, value) {
      try {
        localStorage.setItem(BROWSER_PREFIX + key, JSON.stringify(value));
      } catch {
        // Browser preview only: losing data here is acceptable.
      }
    },
  };
}

export function openStorage(): Promise<KeyValueStorage> {
  return isTauri() ? openTauriStorage() : Promise.resolve(openBrowserStorage());
}
