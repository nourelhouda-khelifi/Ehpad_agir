<template>
  <div class="top-patients">
    <div
      v-for="(patient, i) in patients"
      :key="patient.id"
      class="top-item"
    >
      <div class="top-rank">
        <span class="rank-medal" :class="`rank-${i + 1}`">
          {{ getMedal(i) }}
        </span>
      </div>

      <div class="top-info">
        <div class="top-name">{{ patient.nom }}</div>
        <div class="top-room">{{ patient.chambre }}</div>
      </div>

      <div class="top-stats">
        <div class="stat-count">
          <span class="count-value">{{ patient.nbSoins }}</span>
          <span class="count-label">soins</span>
        </div>
        <div class="evolution" :class="getEvolutionClass(patient.evolution)">
          {{ getEvolutionIcon(patient.evolution) }} {{ Math.abs(patient.evolution) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  patients: { type: Array, required: true }
})

const getMedal = (i) => {
  const medals = ['🥇', '🥈', '🥉']
  return medals[i] || `${i + 1}`
}

const getEvolutionClass = (val) => {
  if (val > 0) return 'evo-up'
  if (val < 0) return 'evo-down'
  return 'evo-neutral'
}

const getEvolutionIcon = (val) => {
  if (val > 0) return '↑'
  if (val < 0) return '↓'
  return '='
}
</script>

<style scoped>
.top-patients {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.top-item {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  transition: background 0.15s ease;
}

.top-item:hover {
  background: var(--color-bg-secondary);
}

.top-rank {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-medal {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.rank-medal.rank-1,
.rank-medal.rank-2,
.rank-medal.rank-3 {
  font-size: 22px;
}

.top-info {
  min-width: 0;
}

.top-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-room {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.top-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-count {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.count-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.count-label {
  font-size: 10px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.evolution {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.evo-up {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.evo-down {
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
}

.evo-neutral {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}
</style>
