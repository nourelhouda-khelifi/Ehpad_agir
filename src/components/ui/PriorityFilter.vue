<template>
  <div class="priority-filter">
    <div class="filter-label">Priorité des soins:</div>
    <div class="filter-buttons">
      <button
        class="filter-button"
        :class="{ active: !modelValue }"
        @click="$emit('update:modelValue', null)"
      >
        Toutes priorités
      </button>
      <button
        v-for="priority in priorities"
        :key="priority"
        class="filter-button"
        :class="{ active: modelValue === priority }"
        @click="$emit('update:modelValue', modelValue === priority ? null : priority)"
      >
        <span class="priority-icon">
          {{ priority === 'basse' ? '🟢' : priority === 'normale' ? '🟡' : priority === 'haute' ? '🟠' : '🔴' }}
        </span>
        <span class="priority-text">{{ capitalizeLabel(priority) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

defineEmits(['update:modelValue'])

const priorities = ['basse', 'normale', 'haute', 'critique']

const capitalizeLabel = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
</script>

<style scoped>
.priority-filter {
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s ease;
}

.filter-button:hover {
  border-color: #9ca3af;
  background-color: #f9fafb;
}

.filter-button.active {
  border-color: #3b82f6;
  background-color: #eff6ff;
  color: #1e40af;
  font-weight: 600;
}

.priority-icon {
  font-size: 16px;
}

.priority-text {
  white-space: nowrap;
}
</style>
