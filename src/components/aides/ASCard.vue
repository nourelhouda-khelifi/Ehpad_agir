<template>
  <div
    class="as-card"
    :class="`niveau-${as.niveau}`"
    @click="$emit('click')"
  >
    <!-- Header card -->
    <div class="card-header">
      <div class="as-info">
        <div class="as-avatar" :style="{ background: as.color }">
          {{ as.code }}
        </div>
        <div>
          <div class="as-code">{{ as.code }}</div>
          <div class="as-secteur">Secteur {{ as.secteur }}</div>
        </div>
      </div>
      <div class="niveau-badge" :class="`badge-${as.niveau}`">
        {{ niveauIcon }} {{ niveauLabel }}
      </div>
    </div>

    <!-- Charge bar -->
    <div class="charge-section">
      <div class="charge-row">
        <span class="charge-label">Charge semaine</span>
        <span class="charge-value" :class="{ 'is-overload': as.niveau === 'surcharge' }">
          {{ as.chargeMinutes }} min
          <span v-if="as.niveau === 'surcharge'" class="warning-icon">⚠️</span>
        </span>
      </div>
      <ChargeBar :minutes="as.chargeMinutes" />
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat">
        <span class="stat-icon">👥</span>
        <span class="stat-value">{{ as.nbPatients }}</span>
        <span class="stat-label">patients</span>
      </div>
      <div class="stat">
        <span class="stat-icon">📋</span>
        <span class="stat-value">{{ as.nbSoins }}</span>
        <span class="stat-label">soins</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ChargeBar from '@/components/ui/ChargeBar.vue'

const props = defineProps({
  as: { type: Object, required: true }
})

defineEmits(['click'])

const niveauLabel = computed(() => {
  const labels = {
    leger: 'Léger',
    normal: 'Normal',
    eleve: 'Élevé',
    surcharge: 'Surchargé'
  }
  return labels[props.as.niveau]
})

const niveauIcon = computed(() => {
  const icons = {
    leger: '🟢',
    normal: '🟡',
    eleve: '🟠',
    surcharge: '🔴'
  }
  return icons[props.as.niveau]
})
</script>

<style scoped>
.as-card {
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.as-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.as-card.niveau-surcharge {
  background: rgba(226, 75, 74, 0.03);
  border-color: var(--color-danger);
}

.as-card.niveau-eleve {
  background: rgba(239, 159, 39, 0.03);
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.as-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.as-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.as-code {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.as-secteur {
  font-size: 11px;
  color: var(--color-text-secondary);
}

/* Niveau badge */
.niveau-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: var(--radius-full);
}

.badge-leger {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.badge-normal {
  background: #FFF3D6;
  color: #6E5108;
}

.badge-eleve {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.badge-surcharge {
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
}

/* Charge */
.charge-section {
  margin-bottom: 12px;
}

.charge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
}

.charge-label {
  color: var(--color-text-secondary);
}

.charge-value {
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.charge-value.is-overload {
  color: var(--color-danger-dark);
}

.warning-icon {
  font-size: 11px;
}

/* Stats */
.stats-row {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-light);
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.stat-icon {
  font-size: 13px;
}

.stat-value {
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-label {
  color: var(--color-text-tertiary);
}
</style>
