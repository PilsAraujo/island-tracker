import { invoke, isTauri } from '@tauri-apps/api/core';
import { watch } from 'vue';
import { buildAlertQueue } from '../domain/alerts';
import { useSettings } from '../stores/settings';

const REFRESH_INTERVAL_MS = 3600_000;

export function startAlertSync(): void {
  if (!isTauri()) return;

  const { settings } = useSettings();
  const sync = () => invoke('schedule_alerts', { alerts: buildAlertQueue(settings.alerts, Date.now()) });

  watch(() => [...settings.alerts], sync, { immediate: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sync();
  });
  setInterval(sync, REFRESH_INTERVAL_MS);
}

export function playTestAlert(): Promise<void> {
  return isTauri() ? invoke('test_alert') : Promise.resolve();
}
