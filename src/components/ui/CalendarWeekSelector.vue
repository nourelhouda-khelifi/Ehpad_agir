<template>
  <div class="calendar-week-selector" ref="dropdownRef">
    <!-- Bouton trigger compact -->
    <button class="selector-trigger" ref="triggerRef" @click="toggleCalendar">
      <div class="trigger-content">
        <span class="week-badge">📅 {{ weekDateRange }}</span>
        <span class="trigger-icon">{{ isCalendarOpen ? '▲' : '▼' }}</span>
      </div>
    </button>

    <!-- Calendrier dropdown -->
    <div v-if="isCalendarOpen" class="calendar-dropdown" :style="dropdownStyle">
      <!-- Navigation mois -->
      <div class="calendar-header">
        <button class="nav-month-btn" @click="previousMonth">‹</button>
        <div class="month-year">
          <div class="month-name">{{ currentMonthName }}</div>
          <div class="year">{{ currentYear }}</div>
        </div>
        <button class="nav-month-btn" @click="nextMonth">›</button>
      </div>

      <!-- Calendrier grid -->
      <div class="calendar-grid">
        <!-- En-têtes jours -->
        <div class="day-header" v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']" :key="day">
          {{ day }}
        </div>

        <!-- Jours du mois -->
        <div
          v-for="day in calendarDays"
          :key="`${day.year}-${day.month}-${day.date}`"
          class="day-cell"
          :class="{
            'is-today': isToday(day),
            'is-selected': isSelectedDay(day),
            'is-other-month': day.month !== currentMonth.getMonth(),
            'is-clickable': day.month === currentMonth.getMonth()
          }"
          @click="selectDay(day)"
        >
          {{ day.date }}
        </div>
      </div>

      <!-- Bouton aujourd'hui -->
      <div class="calendar-footer" v-if="!isToday(selectedDate)">
        <button class="btn-today" @click="selectToday">📍 Aujourd'hui</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  // ISO date string YYYY-MM-DD of the Monday of the selected week
  modelValue: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue'])

// Helper: returns a new Date set to the Monday of the given date's week
const getMonday = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return d
}

const toISO = (d) => d.toLocaleDateString('en-CA') // YYYY-MM-DD

// État interne
const isCalendarOpen = ref(false)
const currentMonth = ref(new Date(new Date().getFullYear(), new Date().getMonth()))
const selectedDate = ref(new Date())
const dropdownRef = ref(null)
const triggerRef = ref(null)
const dropdownStyle = ref({})

const DROPDOWN_WIDTH = 280
const EDGE_MARGIN = 12

const updateDropdownPosition = () => {
  if (!triggerRef.value || !dropdownRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const openBelow = rect.bottom + 360 + EDGE_MARGIN <= viewportHeight
  const alignRight = rect.left + DROPDOWN_WIDTH + EDGE_MARGIN > viewportWidth

  dropdownStyle.value = {
    top: openBelow ? 'calc(100% + 8px)' : 'auto',
    bottom: openBelow ? 'auto' : 'calc(100% + 8px)',
    left: alignRight ? 'auto' : '0',
    right: alignRight ? '0' : 'auto',
    maxHeight: `${Math.max(220, viewportHeight - rect.bottom - 20)}px`,
    overflowY: 'auto'
  }
}

const toggleCalendar = async () => {
  isCalendarOpen.value = !isCalendarOpen.value

  if (isCalendarOpen.value) {
    await nextTick()
    updateDropdownPosition()
  }
}

// Fermer le calendrier au clic en dehors
const closeCalendar = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isCalendarOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeCalendar)
  window.addEventListener('resize', updateDropdownPosition)
  window.addEventListener('scroll', updateDropdownPosition, true)
})

onUnmounted(() => {
  document.removeEventListener('click', closeCalendar)
  window.removeEventListener('resize', updateDropdownPosition)
  window.removeEventListener('scroll', updateDropdownPosition, true)
})

// Sync selectedDate when parent changes modelValue (e.g., "go to today" from view)
watch(() => props.modelValue, (isoMonday) => {
  if (!isoMonday) return
  const [y, m, d] = isoMonday.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  selectedDate.value = date
  currentMonth.value = new Date(y, m - 1)
}, { immediate: true })

const weekDateRange = computed(() => {
  const monday = getMonday(selectedDate.value)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const startDay = monday.getDate()
  const endDay = sunday.getDate()
  const monthName = monday.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')
  return `${startDay}-${endDay} ${monthName}`
})

// Noms des mois
const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const currentMonthName = computed(() => monthNames[currentMonth.value.getMonth()])
const currentYear = computed(() => currentMonth.value.getFullYear())

// Vérifications
const today = new Date()
today.setHours(0, 0, 0, 0)

// Générer les jours du calendrier
const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  
  // Premier jour du mois
  const firstDay = new Date(year, month, 1)
  // Dernier jour du mois
  const lastDay = new Date(year, month + 1, 0)
  
  // Jour de la semaine du premier jour (0=dimanche)
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  
  const days = []
  
  // Jours du mois précédent
  const prevMonth = new Date(year, month, 0)
  const prevLastDay = prevMonth.getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      date: prevLastDay - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year
    })
  }
  
  // Jours du mois courant
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: i,
      month: month,
      year: year
    })
  }
  
  // Jours du mois suivant
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: i,
      month: month + 1,
      year: month === 11 ? year + 1 : year
    })
  }
  
  return days
})

// Helpers
const isToday = (day) => {
  return day.date === today.getDate() &&
         day.month === today.getMonth() &&
         day.year === today.getFullYear()
}

const isSelectedDay = (day) => {
  // Highlight the whole selected week (Mon–Sun)
  const monday = getMonday(selectedDate.value)
  const dayDate = new Date(day.year, day.month, day.date)
  dayDate.setHours(0, 0, 0, 0)
  const diff = Math.round((dayDate - monday) / 86400000)
  return diff >= 0 && diff <= 6
}

const selectDay = (day) => {
  if (day.month !== currentMonth.value.getMonth()) {
    if (day.month < currentMonth.value.getMonth()) {
      previousMonth()
    } else {
      nextMonth()
    }
    return
  }
  selectedDate.value = new Date(day.year, day.month, day.date)
  emit('update:modelValue', toISO(getMonday(selectedDate.value)))
  isCalendarOpen.value = false
}

const selectToday = () => {
  const now = new Date()
  currentMonth.value = new Date(now.getFullYear(), now.getMonth())
  selectedDate.value = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  emit('update:modelValue', toISO(getMonday(selectedDate.value)))
  isCalendarOpen.value = false
}

const previousMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1)
}

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1)
}
</script>

<style scoped>
.calendar-week-selector {
  position: relative;
  display: inline-block;
  font-family: inherit;
}

/* Bouton trigger compact */
.selector-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.selector-trigger:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.trigger-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.week-badge {
  color: #2563eb;
  font-weight: 600;
}

.trigger-icon {
  font-size: 0.8rem;
  color: #6b7280;
  transition: transform 0.2s ease;
}

/* Dropdown container */
.calendar-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 12px;
  width: 280px;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Calendar header */
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.month-year {
  text-align: center;
}

.month-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.year {
  font-size: 0.8rem;
  color: #6b7280;
}

.nav-month-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-month-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  color: #1f2937;
}

.nav-month-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Calendar grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.day-header {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  padding: 4px 0;
}

.day-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: default;
  color: #6b7280;
  transition: all 0.15s ease;
}

.day-cell.is-clickable {
  cursor: pointer;
  color: #1f2937;
}

.day-cell.is-clickable:hover {
  background-color: #f3f4f6;
}

.day-cell.is-other-month {
  color: #d1d5db;
  pointer-events: none;
}

.day-cell.is-today {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
}

.day-cell.is-selected {
  background-color: #2563eb;
  color: white;
  font-weight: 600;
}

.day-cell.is-today.is-selected {
  background: linear-gradient(135deg, #fbbf24 0%, #2563eb 100%);
}

/* Calendar footer */
.calendar-footer {
  display: flex;
  justify-content: center;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.btn-today {
  background-color: #fef08a;
  border: 1px solid #fbbf24;
  color: #92400e;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-today:hover {
  background-color: #fbbf24;
  border-color: #f59e0b;
}

@media (max-width: 640px) {
  .calendar-dropdown {
    width: 260px;
  }
}
</style>
