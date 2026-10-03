<script setup lang="ts">
import { computed } from 'vue';
import { COMMON_PASTURE_ANIMALS, RARE_PASTURE_ANIMALS } from '../domain/animals';
import { PASTURE_CAPACITY, canAdd, canRemove, countOf, pastureTotal } from '../stores/pasture';
import { useSettings } from '../stores/settings';

const { settings, addToPasture, removeFromPasture } = useSettings();

const total = computed(() => pastureTotal(settings.pasture));
const isFull = computed(() => !canAdd(settings.pasture));
const fillPercent = computed(() => (total.value / PASTURE_CAPACITY) * 100);

const groups = [
  { title: 'Common', animals: COMMON_PASTURE_ANIMALS },
  { title: 'Rare', animals: RARE_PASTURE_ANIMALS },
];
</script>

<template>
  <section class="pasture">
    <div class="pasture-summary" :class="{ 'is-full': isFull }">
      <span>
        Pasture: <strong>{{ total }} / {{ PASTURE_CAPACITY }}</strong>
      </span>
      <div class="capacity-bar" role="progressbar" :aria-valuenow="total" :aria-valuemax="PASTURE_CAPACITY">
        <div class="capacity-fill" :style="{ width: `${fillPercent}%` }" />
      </div>
    </div>

    <div v-for="group in groups" :key="group.title" class="pasture-group">
      <h2 class="group-title">{{ group.title }}</h2>
      <ul class="animal-list">
        <li v-for="animal in group.animals" :key="animal.slug" class="animal-row pasture-row">
          <span class="animal-name">{{ animal.name }}</span>
          <div class="counter">
            <button
              type="button"
              :disabled="!canRemove(settings.pasture, animal.slug)"
              :aria-label="`Remove one ${animal.name}`"
              @click="removeFromPasture(animal.slug)"
            >
              −
            </button>
            <span class="count" :class="{ 'is-zero': countOf(settings.pasture, animal.slug) === 0 }">
              {{ countOf(settings.pasture, animal.slug) }}
            </span>
            <button
              type="button"
              :disabled="isFull"
              :aria-label="`Add one ${animal.name}`"
              @click="addToPasture(animal.slug)"
            >
              +
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
