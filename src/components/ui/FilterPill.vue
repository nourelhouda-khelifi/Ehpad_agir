<template>
  <button
    class="filter-pill"
    :class="{ 'is-active': active, [`variant-${variant}`]: true }"
    @click="$emit('click')"
  >
    <slot />
    <span v-if="count !== null" class="filter-count">{{ count }}</span>
  </button>
</template>

<script setup>
defineProps({
  active: { type: Boolean, default: false },
  count: { type: [Number, null], default: null },
  variant: { type: String, default: 'default' }
})

defineEmits(['click'])
</script>

<style scoped>
.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 600;
  background: #F1F5F9;
  color: #64748B;
  border: 1.5px solid #E2E8F0;
  transition: all var(--transition-base);
  cursor: pointer;
  box-shadow: var(--shadow-xs);
}

.filter-pill:hover {
  background: #E2E8F0;
  color: #475569;
  border-color: #CBD5E1;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.filter-pill.is-active {
  background: #2563EB;
  color: white;
  border-color: #1D4ED8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  font-weight: 700;
  transform: translateY(-1px);
}

.filter-pill.variant-danger {
  background: #FEE2E2;
  color: #DC2626;
  border-color: #FECACA;
}

.filter-pill.variant-danger:hover {
  background: #FECACA;
  color: #B91C1C;
  border-color: #FCA5A5;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.filter-pill.variant-danger.is-active {
  background: #EF4444;
  color: white;
  border-color: #DC2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.filter-count {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
  transition: background var(--transition-base);
}

.filter-pill.is-active .filter-count {
  background: rgba(255, 255, 255, 0.3);
}

.filter-pill.variant-danger.is-active .filter-count {
  background: rgba(255, 255, 255, 0.3);
}
</style>