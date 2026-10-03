<script setup lang="ts">
import { isTauri } from '@tauri-apps/api/core';
import { computed, ref } from 'vue';
import { playTestAlert } from '../services/alertSync';
import { useSettings } from '../stores/settings';
import { describeTime, describeWeather, formatDuration } from '../ui/format';
import { useSpawnBoard, type AnimalStatus } from '../ui/useSpawnBoard';

const props = defineProps<{ now: number }>();

const { isAlertOn, toggleAlert } = useSettings();
const board = useSpawnBoard(computed(() => props.now));
const showAlertsOnly = ref(false);
const canTestAlert = isTauri();

const visibleStatuses = computed(() =>
  showAlertsOnly.value ? board.value.filter((status) => isAlertOn(status.animal.slug)) : board.value,
);

function statusText({ window, isUp }: AnimalStatus): string {
  if (window === null) return 'No spawn in 7 days';
  if (isUp) return `Up · ends in ${formatDuration(window.endMs - props.now)}`;
  return `In ${formatDuration(window.startMs - props.now)}`;
}
</script>

<template>
  <section class="tracker">
    <div class="toolbar">
      <button v-if="canTestAlert" type="button" class="test-alert" @click="playTestAlert">Test alert</button>
      <label class="toggle">
        <input v-model="showAlertsOnly" type="checkbox" />
        Alerts only
      </label>
    </div>

    <p v-if="visibleStatuses.length === 0" class="empty">
      No alerts on. Click the bell of an animal to get a sound 1 minute before it spawns.
    </p>

    <ul class="animal-list">
      <li
        v-for="status in visibleStatuses"
        :key="status.animal.slug"
        class="animal-row"
        :class="{ 'is-up': status.isUp, 'has-alert': isAlertOn(status.animal.slug) }"
      >
        <span class="status-dot" :aria-label="status.isUp ? 'Up' : 'Waiting'" />
        <div class="animal-info">
          <span class="animal-name">{{ status.animal.name }}</span>
          <span class="animal-conditions">
            {{ describeTime(status.animal) }} · {{ describeWeather(status.animal) }}
          </span>
        </div>
        <span class="animal-status">{{ statusText(status) }}</span>
        <button
          class="bell"
          type="button"
          :aria-pressed="isAlertOn(status.animal.slug)"
          :title="isAlertOn(status.animal.slug) ? 'Turn alert off' : 'Turn alert on'"
          @click="toggleAlert(status.animal.slug)"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M12 3a6 6 0 0 0-6 6v3.6L4.3 15.4A1 1 0 0 0 5.2 17h13.6a1 1 0 0 0 .9-1.6L18 12.6V9a6 6 0 0 0-6-6Zm-2 15a2 2 0 0 0 4 0"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <path v-if="!isAlertOn(status.animal.slug)" d="M4 4l16 16" stroke="currentColor" stroke-width="1.8" />
          </svg>
        </button>
      </li>
    </ul>
  </section>
</template>
