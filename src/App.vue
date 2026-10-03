<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { eorzeaClockAt } from './domain/eorzea';
import { WEATHER_LABELS, islandWeatherAt } from './domain/weather';
import { startAlertSync } from './services/alertSync';
import { loadSettings } from './stores/settings';
import { formatClock } from './ui/format';
import { useNow } from './ui/useNow';
import PastureView from './views/PastureView.vue';
import TrackerView from './views/TrackerView.vue';

type Tab = 'tracker' | 'pasture';

const now = useNow();
const activeTab = ref<Tab>('tracker');
const isReady = ref(false);

const eorzeaTime = computed(() => formatClock(eorzeaClockAt(now.value)));
const currentWeather = computed(() => WEATHER_LABELS[islandWeatherAt(now.value)]);

onMounted(async () => {
  await loadSettings();
  startAlertSync();
  isReady.value = true;
});
</script>

<template>
  <header class="app-header">
    <h1>Island Tracker</h1>
    <div class="world-state">
      <span class="eorzea-time">ET {{ eorzeaTime }}</span>
      <span class="weather">{{ currentWeather }}</span>
    </div>
  </header>

  <nav class="tabs" role="tablist">
    <button type="button" role="tab" :aria-selected="activeTab === 'tracker'" @click="activeTab = 'tracker'">
      Tracker
    </button>
    <button type="button" role="tab" :aria-selected="activeTab === 'pasture'" @click="activeTab = 'pasture'">
      Pasture
    </button>
  </nav>

  <main v-if="isReady">
    <TrackerView v-if="activeTab === 'tracker'" :now="now" />
    <PastureView v-else />
  </main>
</template>
