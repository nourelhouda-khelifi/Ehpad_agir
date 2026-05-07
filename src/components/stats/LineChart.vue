<template>
  <div class="line-chart">
    <svg viewBox="0 0 600 200" class="chart-svg" preserveAspectRatio="none">
      <!-- Axes -->
      <line x1="40" y1="20" x2="40" y2="170" stroke="var(--color-border)" stroke-width="0.5"/>
      <line x1="40" y1="170" x2="580" y2="170" stroke="var(--color-border)" stroke-width="0.5"/>

      <!-- Y axis labels -->
      <text x="35" y="25" text-anchor="end" font-size="10" fill="var(--color-text-tertiary)">{{ maxY }}</text>
      <text x="35" y="100" text-anchor="end" font-size="10" fill="var(--color-text-tertiary)">{{ Math.round(maxY / 2) }}</text>
      <text x="35" y="173" text-anchor="end" font-size="10" fill="var(--color-text-tertiary)">0</text>

      <!-- Zone sous la courbe -->
      <polygon
        :points="areaPoints"
        fill="var(--color-primary-light)"
        opacity="0.5"
      />

      <!-- Ligne -->
      <polyline
        :points="linePoints"
        fill="none"
        stroke="var(--color-primary)"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Points + labels -->
      <g v-for="(point, i) in points" :key="i">
        <circle
          :cx="point.x"
          :cy="point.y"
          r="5"
          fill="white"
          stroke="var(--color-primary)"
          stroke-width="2"
        />
        <text
          :x="point.x"
          :y="point.y - 12"
          text-anchor="middle"
          font-size="11"
          font-weight="600"
          fill="var(--color-primary)"
        >
          {{ data[i].value }}
        </text>
        <text
          :x="point.x"
          :y="190"
          text-anchor="middle"
          font-size="11"
          fill="var(--color-text-secondary)"
        >
          {{ data[i].semaine }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true }
})

const maxY = computed(() => {
  const max = Math.max(...props.data.map(d => d.value))
  return Math.ceil(max / 100) * 100
})

const points = computed(() => {
  const xStart = 80
  const xEnd = 540
  const yTop = 25
  const yBottom = 165
  const stepX = (xEnd - xStart) / (props.data.length - 1)

  return props.data.map((d, i) => ({
    x: xStart + i * stepX,
    y: yTop + (yBottom - yTop) * (1 - d.value / maxY.value)
  }))
})

const linePoints = computed(() => {
  return points.value.map(p => `${p.x},${p.y}`).join(' ')
})

const areaPoints = computed(() => {
  const linePart = points.value.map(p => `${p.x},${p.y}`).join(' ')
  const last = points.value[points.value.length - 1]
  const first = points.value[0]
  return `${first.x},170 ${linePart} ${last.x},170`
})
</script>

<style scoped>
.line-chart {
  width: 100%;
  height: 220px;
}

.chart-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
