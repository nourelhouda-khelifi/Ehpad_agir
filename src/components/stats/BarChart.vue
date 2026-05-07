<template>
  <div class="bar-chart">
    <!-- Légende -->
    <div class="chart-legend">
      <div
        v-for="serie in series"
        :key="serie.code"
        class="legend-item"
      >
        <span class="legend-dot" :style="{ background: serie.color }"></span>
        <span class="legend-label">{{ serie.code }}</span>
      </div>
    </div>

    <!-- Chart -->
    <div class="chart-container">
      <!-- Axe Y -->
      <div class="y-axis">
        <div class="y-label">{{ maxValue }}</div>
        <div class="y-label">{{ Math.round(maxValue / 2) }}</div>
        <div class="y-label">0</div>
      </div>

      <!-- Zone graphique -->
      <div class="chart-area">
        <!-- Ligne seuil -->
        <div class="threshold-line" :style="{ bottom: thresholdPosition + '%' }">
          <span class="threshold-label">Seuil surcharge ({{ threshold }}min)</span>
        </div>

        <!-- Groupes de barres par jour -->
        <div class="bars-grid">
          <div
            v-for="(jour, jourIdx) in jours"
            :key="jour"
            class="day-group"
          >
            <div class="bars-stack">
              <div
                v-for="serie in series"
                :key="serie.code"
                class="bar"
                :style="{
                  height: getBarHeight(serie.values[jourIdx]) + '%',
                  background: serie.color
                }"
                :title="`${serie.code} ${jour}: ${serie.values[jourIdx]}min`"
              >
              </div>
            </div>
            <div class="day-label">{{ jour }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  jours: { type: Array, required: true },
  series: { type: Array, required: true },
  threshold: { type: Number, default: 120 }
})

const maxValue = computed(() => {
  let max = 0
  props.series.forEach(s => {
    s.values.forEach(v => { if (v > max) max = v })
  })
  return Math.ceil(max / 50) * 50
})

const getBarHeight = (value) => {
  return (value / maxValue.value) * 100
}

const thresholdPosition = computed(() => {
  return (props.threshold / maxValue.value) * 100
})
</script>

<style scoped>
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Legend */
.chart-legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* Chart */
.chart-container {
  display: flex;
  height: 240px;
  gap: 8px;
}

.y-axis {
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 24px;
}

.y-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
  text-align: right;
}

.chart-area {
  flex: 1;
  position: relative;
  padding-bottom: 24px;
  border-left: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
}

/* Ligne seuil */
.threshold-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  border-top: 1px dashed var(--color-danger);
  z-index: 1;
}

.threshold-label {
  position: absolute;
  right: 4px;
  top: -16px;
  font-size: 10px;
  color: var(--color-danger);
  background: white;
  padding: 1px 4px;
  font-weight: 500;
}

/* Bars */
.bars-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  padding: 0 4px;
}

.day-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.bars-stack {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  height: 100%;
  padding-bottom: 24px;
}

.bar {
  flex: 1;
  min-height: 2px;
  border-radius: 2px 2px 0 0;
  transition: opacity 0.15s ease;
  cursor: pointer;
  max-width: 12px;
}

.bar:hover {
  opacity: 0.7;
}

.day-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 500;
  padding-top: 6px;
}
</style>
