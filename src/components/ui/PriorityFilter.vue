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
          {{ getPriorityIcon(priority) }}
        </span>
        <span class="priority-text">{{ getPriorityLabel(priority) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [Number, String],
    default: null
  }
})

defineEmits(['update:modelValue'])

const priorities = [1, 2, 3, 4]

const priorityLabels = {
  1: '1 - Basse',
  2: '2 - Normale',
  3: '3 - Haute',
  4: '4 - Critique'
}

const priorityIcons = {
  1: '🟢',
  2: '🟡',
  3: '🟠',
  4: '🔴'
}

const getPriorityLabel = (priority) => priorityLabels[priority] || '?'
const getPriorityIcon = (priority) => priorityIcons[priority] || '⚪'
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
