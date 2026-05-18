<template>
  <div class="week-selector">
    <button class="nav-btn" @click="selectWeek(modelValue - 1)" :disabled="modelValue <= minWeek">
      ‹ Précédent
    </button>
    
    <div class="week-info">
      <select v-model.number="selectedWeek" class="week-select">
        <option v-for="week in availableWeeks" :key="week" :value="week">
          Semaine {{ week }} · {{ getWeekLabel(week) }}
        </option>
      </select>
      <span v-if="isCurrentWeek" class="current-badge">📍 Actuelle</span>
    </div>

    <button class="nav-btn" @click="selectWeek(modelValue + 1)" :disabled="modelValue >= maxWeek">
      Suivant ›
    </button>

    <button class="btn-today" @click="selectWeek(currentWeek)">
      Aujourd'hui
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  minWeek: { type: Number, default: 1 },
  maxWeek: { type: Number, default: 53 },
  currentWeek: { type: Number, default: 19 },
  baseWeekStart: { type: Date, required: true }
})

const emit = defineEmits(['update:modelValue'])

const selectedWeek = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const availableWeeks = computed(() => {
  const weeks = []
  for (let i = props.minWeek; i <= props.maxWeek; i++) {
    weeks.push(i)
  }
  return weeks
})

const isCurrentWeek = computed(() => props.modelValue === props.currentWeek)

const selectWeek = (week) => {
  if (week >= props.minWeek && week <= props.maxWeek) {
    selectedWeek.value = week
  }
}

const getWeekLabel = (week) => {
  const start = new Date(props.baseWeekStart)
  start.setDate(props.baseWeekStart.getDate() + (week - 19) * 7)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  const startStr = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  const endStr = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return `${startStr} - ${endStr}`
}
</script>

<style scoped>
.week-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.nav-btn {
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.week-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.week-select {
  padding: 8px 12px;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 220px;
}

.week-select:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.week-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.current-badge {
  padding: 4px 8px;
  background: #DBEAFE;
  color: #0C63E4;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
}

.btn-today {
  padding: 8px 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-today:hover {
  background: var(--color-primary-dark);
  transform: scale(1.05);
}
</style>
