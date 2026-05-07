<template>
  <div class="planning-cell" :class="cellClass" @click="$emit('click')">
    <ASBadge v-if="asCode" :code="asCode" />
    <span v-else-if="isWarning" class="cell-warning">+ Assigner</span>
    <span v-else class="cell-empty">—</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ASBadge from '@/components/ui/ASBadge.vue'

const props = defineProps({
  asCode: { type: String, default: null },
  isWarning: { type: Boolean, default: false }
})

defineEmits(['click'])

const cellClass = computed(() => ({
  'is-assigned': !!props.asCode,
  'is-warning': props.isWarning && !props.asCode,
  'is-empty': !props.asCode && !props.isWarning
}))
</script>

<style scoped>
.planning-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 8px;
  cursor: pointer;
  border-left: 1px solid var(--color-border-light);
  transition: all var(--transition-base);
  background: white;
}

.planning-cell:hover {
  background: var(--color-bg-secondary);
}

.is-assigned {
  background: linear-gradient(135deg, #DCFCE7 0%, #D1FAE5 100%);
}

.is-assigned:hover {
  background: linear-gradient(135deg, #C8F3DA 0%, #BBF7D0 100%);
}

.is-warning {
  background: rgba(226, 75, 74, 0.06);
  border: 1px dashed var(--color-danger);
}

.is-warning:hover {
  background: rgba(226, 75, 74, 0.12);
}

.cell-warning {
  color: var(--color-danger-dark);
  font-size: 11px;
  font-weight: 600;
}

.cell-empty {
  color: var(--color-text-tertiary);
  font-size: 14px;
}
</style>
