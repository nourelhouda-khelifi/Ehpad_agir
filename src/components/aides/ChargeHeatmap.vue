<template>
  <div class="heatmap">
    <!-- Header avec jours -->
    <div class="heatmap-grid">
      <div class="heatmap-cell heatmap-corner"></div>
      <div
        v-for="jour in jours"
        :key="jour.key"
        class="heatmap-cell heatmap-day-label"
      >
        {{ jour.label }}
      </div>

      <!-- Lignes par AS -->
      <template v-for="as in aides" :key="as.code">
        <div class="heatmap-cell heatmap-as-label">
          {{ as.code }}
        </div>
        <div
          v-for="jour in jours"
          :key="`${as.code}-${jour.key}`"
          class="heatmap-cell heatmap-data"
          :style="{ background: getColor(charge[as.code]?.[jour.key] || 0) }"
          :title="`${as.code} - ${jour.label} : ${charge[as.code]?.[jour.key] || 0}min`"
        >
          <span v-if="showValues" class="heatmap-value" :class="{ 'is-light': isLightCell(charge[as.code]?.[jour.key] || 0) }">
            {{ charge[as.code]?.[jour.key] || 0 }}
          </span>
        </div>
      </template>
    </div>

    <!-- Légende -->
    <div class="heatmap-legend">
      <span class="legend-label">Charge :</span>
      <div class="legend-scale">
        <span class="legend-text">Faible</span>
        <div class="legend-gradient">
          <div class="gradient-step" style="background: #E1F5EE"></div>
          <div class="gradient-step" style="background: #5DCAA5"></div>
          <div class="gradient-step" style="background: #97C459"></div>
          <div class="gradient-step" style="background: #EF9F27"></div>
          <div class="gradient-step" style="background: #E24B4A"></div>
        </div>
        <span class="legend-text">Élevée</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  aides: { type: Array, required: true },
  charge: { type: Object, required: true },
  showValues: { type: Boolean, default: true }
})

const jours = [
  { key: 'lundi', label: 'Lun' },
  { key: 'mardi', label: 'Mar' },
  { key: 'mercredi', label: 'Mer' },
  { key: 'jeudi', label: 'Jeu' },
  { key: 'vendredi', label: 'Ven' },
  { key: 'samedi', label: 'Sam' },
  { key: 'dimanche', label: 'Dim' }
]

// Échelle de couleurs selon la charge
const getColor = (minutes) => {
  if (minutes === 0) return '#F1EFE8'
  if (minutes < 30) return '#E1F5EE'
  if (minutes < 60) return '#9FE1CB'
  if (minutes < 90) return '#5DCAA5'
  if (minutes < 110) return '#97C459'
  if (minutes < 130) return '#EF9F27'
  return '#E24B4A'
}

const isLightCell = (minutes) => minutes < 60
</script>

<style scoped>
.heatmap {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  padding: 18px 20px;
}

/* Grid */
.heatmap-grid {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  gap: 4px;
}

.heatmap-cell {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: var(--radius-sm);
}

.heatmap-corner {
  background: transparent;
}

.heatmap-day-label,
.heatmap-as-label {
  font-weight: 600;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
}

.heatmap-as-label {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.heatmap-data {
  position: relative;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.heatmap-data:hover {
  transform: scale(1.05);
  z-index: 1;
}

.heatmap-value {
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.heatmap-value.is-light {
  color: var(--color-text-primary);
}

/* Légende */
.heatmap-legend {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  gap: 16px;
}

.legend-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.legend-scale {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-text {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.legend-gradient {
  display: flex;
  gap: 2px;
}

.gradient-step {
  width: 18px;
  height: 14px;
  border-radius: 2px;
}
</style>
