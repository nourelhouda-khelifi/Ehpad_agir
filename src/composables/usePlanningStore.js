import { ref, watch, onMounted } from 'vue'
import { clonePlanning, mockPlanningSemaine19, mockPlanningSemaine20 } from '@/data/mockPlanning.js'

// LocalStorage key
const PLANNING_STORAGE_KEY = 'ehpad_planning_data'

const hasAnyActivity = (weekPlanning) => {
  return Object.values(weekPlanning || {}).some((patientDays) => {
    return Object.values(patientDays || {}).some((dayActivities) => {
      return Object.keys(dayActivities || {}).length > 0
    })
  })
}

const buildDefaultPlanningByWeek = () => ({
  19: clonePlanning(mockPlanningSemaine19),
  20: clonePlanning(mockPlanningSemaine20)
})

const mergeStoredPlanningWithDefaults = (storedPlanning) => {
  const merged = buildDefaultPlanningByWeek()

  if (storedPlanning && typeof storedPlanning === 'object') {
    Object.entries(storedPlanning).forEach(([week, planning]) => {
      if (hasAnyActivity(planning)) {
        merged[week] = planning
      }
    })
  }

  return merged
}

// Référence unique partagée
let planningByWeekRef = null

export const usePlanningStore = () => {
  // Initialiser seulement une fois
  if (!planningByWeekRef) {
    planningByWeekRef = ref(buildDefaultPlanningByWeek())
    
    // Charger depuis localStorage au premier accès
    onMounted(() => {
      loadFromStorage()
    })
    
    // Sauvegarder automatiquement les changements
    watch(
      () => planningByWeekRef.value,
      (newValue) => {
        saveToStorage(newValue)
      },
      { deep: true }
    )
  }

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(PLANNING_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
          planningByWeekRef.value = mergeStoredPlanningWithDefaults(parsed)
      }
    } catch (error) {
      console.error('Erreur chargement planning depuis localStorage:', error)
    }
  }

  const saveToStorage = (planning) => {
    try {
      localStorage.setItem(PLANNING_STORAGE_KEY, JSON.stringify(planning))
    } catch (error) {
      console.error('Erreur sauvegarde planning dans localStorage:', error)
    }
  }

  return planningByWeekRef
}
