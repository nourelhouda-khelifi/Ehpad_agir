<template>
  <div
    class="soin-card"
    :style="{ borderLeftColor: typeConfig.color }"
    @click="$emit('click')"
  >
    <div class="soin-header">
      <div class="soin-time-type">
        <span class="soin-time">{{ soin.heure }}</span>
        <span class="soin-separator">·</span>
        <span class="soin-type" :style="{ color: typeConfig.color }">
          {{ typeConfig.icon }} {{ typeConfig.label }}
        </span>
      </div>
      <span class="soin-duree">{{ soin.duree }}min</span>
    </div>
    <div class="soin-patient">
      {{ soin.patientNom }}
      <span class="soin-chambre">· {{ soin.chambre }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TYPES_SOINS } from '@/data/mockSoins.js'

const props = defineProps({
  soin: { type: Object, required: true }
})

defineEmits(['click'])

const typeConfig = computed(() => TYPES_SOINS[props.soin.type] || TYPES_SOINS.toilette)
</script>

<style scoped>
.soin-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 8px 10px;
  border-left: 3px solid;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
}

.soin-card:hover {
  transform: translateX(2px);
  box-shadow: var(--shadow-md);
}

.soin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.soin-time-type {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.soin-time {
  color: var(--color-text-primary);
}

.soin-separator {
  color: var(--color-text-tertiary);
}

.soin-type {
  font-weight: 600;
  font-size: 11px;
}

.soin-duree {
  color: var(--color-text-tertiary);
  font-size: 11px;
}

.soin-patient {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.soin-chambre {
  color: var(--color-text-tertiary);
  font-size: 11px;
}
</style>
