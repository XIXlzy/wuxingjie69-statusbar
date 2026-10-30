<script setup lang="ts">
defineProps<{ label: string; value: number | null; tone?: string; path: string }>();
</script>
<template>
  <div class="meter" :class="tone" :data-field="path">
    <div class="meter-label"><span>{{ label }}</span><span class="meter-value">{{ value ?? '—' }}<small v-if="value !== null"> / 100</small></span></div>
    <div class="meter-track" :role="value === null ? undefined : 'meter'" :aria-label="label" :aria-valuemin="value === null ? undefined : 0" :aria-valuemax="value === null ? undefined : 100" :aria-valuenow="value ?? undefined" :aria-valuetext="value === null ? '—' : undefined"><span v-if="value !== null" :style="{ width: `${value}%` }"></span></div>
  </div>
</template>
