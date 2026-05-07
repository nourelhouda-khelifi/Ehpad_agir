<template>
  <div class="charge-list">
    <div
      v-for="as in aides"
      :key="as.id"
      class="charge-row"
    >
      <div class="charge-as-info">
        <ASBadge :code="as.code" />
      </div>
      <div class="charge-bar-wrapper">
        <ChargeBar :minutes="as.chargeMinutes" />
      </div>
      <div class="charge-stats">
        <span class="charge-minutes" :class="{ 'is-overload': as.chargeMinutes >= 120 }">
          {{ as.chargeMinutes }}min
        </span>
        <span class="charge-patients">· {{ as.nbPatients }} pts</span>
        <span v-if="as.chargeMinutes >= 120" class="warning-icon">⚠️</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import ASBadge from '@/components/ui/ASBadge.vue'
import ChargeBar from '@/components/ui/ChargeBar.vue'

defineProps({
  aides: { type: Array, required: true }
})
</script>

<style scoped>
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