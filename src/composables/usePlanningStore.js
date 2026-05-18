import { ref, watch, onMounted } from 'vue'
import { clonePlanning, mockPlanningSemaine19, mockPlanningSemaine20 } from '@/data/mockPlanning.js'

// LocalStorage key
const PLANNING_STORAGE_KEY = 'ehpad_planning_data'

// Référence unique partagée
let planningByWeekRef = null

export const usePlanningStore = () => {
  // Initialiser seulement une fois
  if (!planningByWeekRef) {
    planningByWeekRef = ref({
      19: clonePlanning(mockPlanningSemaine19),
      20: clonePlanning(mockPlanningSemaine20)
    })
    
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
        // Fusionner avec les données existantes (garder les semaines)
        Object.assign(planningByWeekRef.value, parsed)
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
