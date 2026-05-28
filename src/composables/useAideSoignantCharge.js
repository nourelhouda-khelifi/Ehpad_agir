/**
 * Composable pour gérer la charge d'un aide-soignant
 */

import { ref, computed } from 'vue'
import { planningService } from '../api/services/planningService.js'

/**
 * Composable pour gérer la charge d'un aide-soignant
 */
export const useAideSoignantCharge = () => {
  const plannings = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Charger les plannings pour un aide-soignant
   */
  const loadChargeForAideSoignant = async (aideSoignantId) => {
    loading.value = true
    error.value = null

    try {
      plannings.value = await planningService.getByAideSoignant(aideSoignantId)
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors du chargement de la charge:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Calculer la charge totale en minutes
   */
  const totalCharge = computed(() => {
    return plannings.value.reduce((total, planning) => {
      return total + (planning.dureeMinutes || 0)
    }, 0)
  })

  /**
   * Obtenir la charge par jour (structure {jour: minutes})
   */
  const chargeParJour = computed(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    const chargeByDay = {}

    // Initialiser tous les jours
    days.forEach(day => {
      chargeByDay[day] = 0
    })

    // Additionner les minutes pour chaque jour
    plannings.value.forEach(planning => {
      if (planning.datePlanification) {
        // Récupérer le jour de la semaine
        const date = new Date(planning.datePlanification)
        const dayIndex = date.getDay()
        // Convertir JS day (0=dimanche) en jours français (0=lundi)
        const frenchDayIndex = dayIndex === 0 ? 6 : dayIndex - 1
        const day = days[frenchDayIndex]
        
        chargeByDay[day] += planning.dureeMinutes || 0
      }
    })

    return chargeByDay
  })

  /**
   * Compter le nombre de patients uniques
   */
  const patientCount = computed(() => {
    const patientIds = new Set()
    plannings.value.forEach(planning => {
      if (planning.patientId) {
        patientIds.add(planning.patientId)
      }
    })
    return patientIds.size
  })

  return {
    plannings,
    loading,
    error,
    totalCharge,
    chargeParJour,
    patientCount,
    loadChargeForAideSoignant
  }
}

export default useAideSoignantCharge
