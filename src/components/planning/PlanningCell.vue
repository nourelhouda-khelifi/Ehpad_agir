<template>
  <div class="planning-cell" :class="cellClass" @click="$emit('click')">
    <div v-if="asCode" class="cell-content">
      <ASBadge :code="asCode" />
      <div class="cell-meta">
        <span v-if="duree" class="cell-duration">{{ duree }}m</span>
        <span v-if="moment" class="cell-moment">{{ moment === 'matin' ? '🌅' : '🌙' }}</span>
      </div>
    </div>
    <span v-else-if="isWarning" class="cell-warning">+ Assigner</span>
    <span v-else class="cell-empty">—</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ASBadge from '@/components/ui/ASBadge.vue'

const props = defineProps({
  asCode: { type: String, default: null },
  duree: { type: Number, default: null },
  moment: { type: String, default: null },
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
  position: relative;
  overflow: hidden;
}

.planning-cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.planning-cell:hover {
  background: var(--color-bg-secondary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.planning-cell:hover::before {
  opacity: 0.5;
}

.cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  animation: slideIn 0.3s ease-out;
  z-index: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.is-assigned {
  background: linear-gradient(135deg, #DCFCE7 0%, #D1FAE5 100%);
  box-shadow: 0 1px 3px rgba(5, 150, 105, 0.1);
  border-left: 3px solid #059669;
}

.is-assigned:hover {
  background: linear-gradient(135deg, #C8F3DA 0%, #BBF7D0 100%);
  box-shadow: 0 2px 6px rgba(5, 150, 105, 0.15);
}

.cell-duration {
  font-size: 10px;
  color: #059669;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.cell-meta {
  display: flex;
  gap: 4px;
  align-items: center;
}

.cell-moment {
  font-size: 12px;
  animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

.is-warning {
  background: rgba(226, 75, 74, 0.08);
  border: 1px dashed var(--color-danger);
  border-left: 3px dashed var(--color-danger);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    background: rgba(226, 75, 74, 0.08);
  }
  50% {
    background: rgba(226, 75, 74, 0.12);
  }
}

.is-warning:hover {
  background: rgba(226, 75, 74, 0.15);
  animation: none;
}

.cell-warning {
  color: var(--color-danger-dark);
  font-size: 11px;
  font-weight: 700;
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cell-empty {
  color: var(--color-text-tertiary);
  font-size: 14px;
}
</style>
