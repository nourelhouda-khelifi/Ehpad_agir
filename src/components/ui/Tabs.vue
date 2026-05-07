<template>
  <div class="tabs">
    <div class="tabs-list">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ 'is-active': modelValue === tab.id }"
        @click="$emit('update:modelValue', tab.id)"
      >
        <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  tabs: { type: Array, required: true }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.tabs-list {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--color-border-light);
  overflow-x: auto;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  white-space: nowrap;
  transition: all var(--transition-base);
  position: relative;
  background: transparent;
  cursor: pointer;
  border: none;
}

.tab-btn:hover {
  color: var(--color-text-primary);
  background: rgba(37, 99, 235, 0.05);
}

.tab-btn.is-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
  background: rgba(37, 99, 235, 0.05);
}

.tab-icon {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-badge {
  background: var(--color-danger);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  margin-left: 4px;
  min-width: 16px;
  text-align: center;
  animation: slideIn var(--transition-fast) ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>