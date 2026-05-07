<template>
  <div class="alert-card" :class="`alert-${niveau}`">
    <div class="alert-content">
      <div class="alert-title">
        <span class="alert-icon">{{ icon }}</span>
        {{ title }}
      </div>
      <div class="alert-message">{{ message }}</div>
    </div>
    <button v-if="actionLabel" class="alert-action" @click="$emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  niveau: { type: String, default: 'info' },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  actionLabel: { type: String, default: '' }
})

defineEmits(['action'])

const icon = computed(() => {
  const icons = {
    critique: '🔴',
    moyen: '🟠',
    info: '🔵'
  }
  return icons[props.niveau] || '🔵'
})
</script>

<style scoped>
.alert-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 3px solid;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  animation: slideInDown var(--transition-base) ease;
}

.alert-card:hover {
  box-shadow: var(--shadow-md);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-critique {
  background: #FEE2E2;
  border-color: #EF4444;
}

.alert-moyen {
  background: #FEF3C7;
  border-color: #D97706;
}

.alert-info {
  background: #DBEAFE;
  border-color: #0EA5E9;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.alert-critique .alert-title {
  color: #DC2626;
}

.alert-moyen .alert-title {
  color: #D97706;
}

.alert-message {
  font-size: 12px;
  color: #94A3B8;
}

.alert-action {
  background: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #1E293B;
  white-space: nowrap;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-xs);
}

.alert-action:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.alert-action:active {
  transform: translateY(0);
}
</style>