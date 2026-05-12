<template>
  <div class="priority-badge" :class="`priority-${Number(priority)}`" :title="priorityLabel">
    <span class="priority-icon">{{ priorityIcon }}</span>
    <span class="priority-label">{{ priorityLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  priority: {
    type: [Number, String],
    required: true,
    validator: (value) => [1, 2, 3, 4, '1', '2', '3', '4'].includes(value)
  }
})

const priorityLabel = computed(() => {
  const p = Number(props.priority)
  const labels = {
    1: '1 - Basse',
    2: '2 - Normale',
    3: '3 - Haute',
    4: '4 - Critique'
  }
  return labels[p] || 'N/A'
})

const priorityIcon = computed(() => {
  const p = Number(props.priority)
  const icons = {
    1: '🟢',
    2: '🟡',
    3: '🟠',
    4: '🔴'
  }
  return icons[p] || '⚪'
})
</script>

<style scoped>
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.priority-badge.priority-1 {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid #86efac;
}

.priority-badge.priority-2 {
  background-color: rgba(251, 146, 60, 0.1);
  color: #ea580c;
  border: 1px solid #fed7aa;
}

.priority-badge.priority-3 {
  background-color: rgba(249, 115, 22, 0.1);
  color: #c2410c;
  border: 1px solid #fecaca;
}

.priority-badge.priority-4 {
  background-color: rgba(239, 68, 68, 0.1);
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.priority-icon {
  font-size: 14px;
}

.priority-label {
  text-transform: capitalize;
}
</style>
