<template>
  <div class="charge-container">
    <!-- Filtres -->
    <div class="filter-buttons">
      <button
        class="filter-btn"
        :class="{ 'is-active': periodFilter === 'toute' }"
        @click="periodFilter = 'toute'"
      >
        📅 Toute journée
      </button>
      <button
        class="filter-btn"
        :class="{ 'is-active': periodFilter === 'matin' }"
        @click="periodFilter = 'matin'"
      >
        🌅 Matin (6h-14h)
      </button>
      <button
        class="filter-btn"
        :class="{ 'is-active': periodFilter === 'soir' }"
        @click="periodFilter = 'soir'"
      >
        🌙 Soir (14h-22h)
      </button>
    </div>

    <!-- Liste -->
    <div class="charge-list">
      <div
        v-for="as in aideFiltered"
        :key="as.id"
        class="charge-row"
      >
        <div class="charge-as-info">
          <ASBadge :code="as.code" />
        </div>
        <div class="charge-bar-wrapper">
          <ChargeBar :minutes="getChargeForPeriod(as)" />
        </div>
        <div class="charge-stats">
          <span class="charge-minutes" :class="{ 'is-overload': getChargeForPeriod(as) >= 120 }">
            {{ getChargeForPeriod(as) }}min
          </span>
          <span class="charge-patients">· {{ as.nbPatients }} pts</span>
          <span v-if="getChargeForPeriod(as) >= 120" class="warning-icon">⚠️</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ASBadge from '@/components/ui/ASBadge.vue'
import ChargeBar from '@/components/ui/ChargeBar.vue'

const props = defineProps({
  aides: { type: Array, required: true },
  chargeParPeriode: { type: Object, required: true }
})

const periodFilter = ref('toute')

const aideFiltered = computed(() => props.aides)

const getChargeForPeriod = (as) => {
  if (periodFilter.value === 'toute') {
    return as.chargeMinutes
  }
  return props.chargeParPeriode[periodFilter.value]?.[as.code] || 0
}
</script>

<style scoped>
.charge-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Filtres */
.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  background: white;
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn.is-active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* Liste */
.charge-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.charge-row {
  display: grid;
  grid-template-columns: 50px 1fr 160px;
  gap: 14px;
  align-items: center;
}

.charge-stats {
  font-size: 12px;
  text-align: right;
  color: #94A3B8;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.charge-minutes {
  font-weight: 600;
  color: #1E293B;
}

.charge-minutes.is-overload {
  color: #DC2626;
}

.warning-icon {
  font-size: 12px;
}
</style>