<template>
  <div class="charge-bar-container">
    <div class="charge-bar">
      <div
        class="charge-fill"
        :style="{ width: `${percentage}%`, background: color }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  minutes: { type: Number, required: true },
  maxMinutes: { type: Number, default: 140 }
})

const percentage = computed(() => {
  return Math.min((props.minutes / props.maxMinutes) * 100, 100)
})

const color = computed(() => {
  if (props.minutes < 60) return '#1D9E75'
  if (props.minutes < 90) return '#10B981'
  if (props.minutes < 120) return '#F59E0B'
  return '#EF4444'
})
</script>

<style scoped>
.charge-bar-container {
  width: 100%;
}

.charge-bar {
  width: 100%;
  height: 8px;
  background: #E5E7EB;
  border-radius: 9999px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
}

.charge-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width var(--transition-slow), background var(--transition-base);
  background: linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.charge-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  border-radius: 9999px;
}
</style>