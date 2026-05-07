<template>
  <div class="repartition-chart">
    <svg class="chart-svg" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        :stroke-dasharray="circumference"
        stroke-dashoffset="0"
        stroke="none"
      />
      <circle
        v-for="(segment, index) in segments"
        :key="index"
        cx="50"
        cy="50"
        r="40"
        fill="none"
        :stroke="segment.color"
        stroke-width="12"
        :stroke-dasharray="segment.dasharray"
        :stroke-dashoffset="segment.offset"
        stroke-linecap="round"
      />
    </svg>
    <div class="chart-legend">
      <div v-for="item in data" :key="item.label" class="legend-item">
        <span class="legend-dot" :style="{ background: item.color }"></span>
        <span class="legend-label">{{ item.label }}</span>
        <span class="legend-value">{{ item.count }} ({{ item.percentage }}%)</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true }
})

const circumference = 2 * Math.PI * 40

const segments = computed(() => {
  let offset = 0
  return props.data.map((item) => {
    const dasharray = (item.percentage / 100) * circumference
    const segment = {
      color: item.color,
      dasharray: `${dasharray} ${circumference}`,
      offset: -offset
    }
    offset += dasharray
    return segment
  })
})
</script>

<style scoped>
.repartition-chart {
  display: flex;
  align-items: center;
  gap: 24px;
}

.chart-svg {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  transform: rotate(-90deg);
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-weight: 500;
  color: #1E293B;
  min-width: 70px;
}

.legend-value {
  color: #94A3B8;
  font-size: 11px;
  margin-left: auto;
}

@media (max-width: 768px) {
  .repartition-chart {
    flex-direction: column;
    gap: 16px;
  }

  .chart-svg {
    width: 100px;
    height: 100px;
  }

  .legend-item {
    justify-content: space-between;
  }
}
</style>