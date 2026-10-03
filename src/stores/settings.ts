import { reactive, readonly, watch } from 'vue';
import { addAnimal, removeAnimal } from './pasture';
import { sanitizeAlerts, sanitizePasture, type PastureCounts } from './sanitize';
import { openStorage } from './storage';

interface Settings {
  alerts: string[];
  pasture: PastureCounts;
}

const settings = reactive<Settings>({ alerts: [], pasture: {} });

let loading: Promise<void> | null = null;

async function loadAndPersist(): Promise<void> {
  const storage = await openStorage();
  settings.alerts = sanitizeAlerts(await storage.get('alerts'));
  settings.pasture = sanitizePasture(await storage.get('pasture'));

  watch(() => [...settings.alerts], (alerts) => storage.set('alerts', alerts));
  watch(() => ({ ...settings.pasture }), (pasture) => storage.set('pasture', pasture));
}

export function loadSettings(): Promise<void> {
  loading ??= loadAndPersist();
  return loading;
}

export function useSettings() {
  return {
    settings: readonly(settings),

    isAlertOn: (slug: string) => settings.alerts.includes(slug),

    toggleAlert(slug: string) {
      settings.alerts = settings.alerts.includes(slug)
        ? settings.alerts.filter((alertSlug) => alertSlug !== slug)
        : [...settings.alerts, slug];
    },

    addToPasture(slug: string) {
      settings.pasture = addAnimal(settings.pasture, slug);
    },

    removeFromPasture(slug: string) {
      settings.pasture = removeAnimal(settings.pasture, slug);
    },
  };
}
