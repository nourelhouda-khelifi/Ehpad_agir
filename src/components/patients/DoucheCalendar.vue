<template>
  <div class="douche-calendar">
    <div class="calendar-header">
      <h3 class="calendar-title">Planning douches — Semaine 19</h3>
      <button class="btn-add">➕ Planifier</button>
    </div>

    <div class="calendar-grid">
      <div
        v-for="day in days"
        :key="day.key"
        class="day-cell"
        :class="getDayClass(day)"
        @click="$emit('toggle-douche', day.key)"
      >
        <div class="day-label">{{ day.label }}</div>
        <div class="day-content">
          <ASBadge v-if="douches[day.key]" :code="douches[day.key]" />
          <span v-else class="day-empty">+</span>
        </div>
        <div class="day-meta">
          {{ douches[day.key] ? 'Douche' : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ASBadge from '@/components/ui/ASBadge.vue'

const props = defineProps({
  douches: { type: Object, required: true }
})

defineEmits(['toggle-douche'])

const days = [
  { key: 'lundi', label: 'Lun 11' },
  { key: 'mardi', label: 'Mar 12' },
  { key: 'mercredi', label: 'Mer 13' },
  { key: 'jeudi', label: 'Jeu 14' },
  { key: 'vendredi', label: 'Ven 15' },
  { key: 'samedi', label: 'Sam 16' },
  { key: 'dimanche', label: 'Dim 17' }
]

const getDayClass = (day) => {
  const value = props.douches[day.key]
  if (value) return 'is-assigned'
  return 'is-empty'
}
</script>

<style scoped>
.douche-calendar {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  padding: 20px 24px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
}

.douche-calendar:hover {
  box-shadow: var(--shadow-md);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.calendar-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.btn-add {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%);
  color: white;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-xs);
  border: none;
  cursor: pointer;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.day-cell {
  border-radius: var(--radius-md);
  padding: 14px 10px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  border: 1.5px solid transparent;
  box-shadow: var(--shadow-xs);
}

.day-cell.is-empty {
  background: #F8FAFC;
  border-color: #E2E8F0;
}

.day-cell.is-empty:hover {
  background: #EFF6FF;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.day-cell.is-assigned {
  background: linear-gradient(135deg, #DCFCE7 0%, #D1FAE5 100%);
  border: 1.5px solid #BBF7D0;
  box-shadow: 0 4px 12px rgba(29, 158, 117, 0.15);
}

.day-cell.is-assigned:hover {
  box-shadow: 0 6px 16px rgba(29, 158, 117, 0.25);
  transform: translateY(-2px);
}

.day-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-content {
  margin-bottom: 8px;
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-empty {
  font-size: 20px;
  color: #CBD5E1;
}

.day-meta {
  font-size: 10px;
  color: var(--color-text-tertiary);
  min-height: 12px;
  font-weight: 500;
}
</style>