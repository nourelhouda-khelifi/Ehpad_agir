/**
 * Composable pour gérer les statistiques du dashboard
 */

import { ref, computed } from 'vue'
import { patientService } from '../api/services/patientService.js'
import { patientAlertService } from '../api/services/patientAlertService.js'
import { executionSoinService } from '../api/services/executionSoinService.js'
import { aideSoignantService } from '../api/services/aideSoignantService.js'

export const useDashboardStats = () => {
  const patients = ref([])
  const alertes = ref([])
  const executions = ref([])
  const aidesSoignants = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Charger tous les patients
   */
  const loadPatients = async () => {
    try {
      patients.value = await patientService.getAll()
    } catch (err) {
      console.error('Erreur lors du chargement des patients:', err)
      error.value = err.message
      patients.value = []
    }
  }

  /**
   * Charger toutes les alertes
   */
  const loadAlertes = async () => {
    try {
      alertes.value = await patientAlertService.getAll()
    } catch (err) {
      console.error('Erreur lors du chargement des alertes:', err)
      error.value = err.message
      alertes.value = []
    }
  }

  /**
   * Charger les exécutions d'aujourd'hui
   */
  const loadTodayExecutions = async () => {
    try {
      executions.value = await executionSoinService.getTodayExecutions()
    } catch (err) {
      console.error('Erreur lors du chargement des exécutions:', err)
      error.value = err.message
      executions.value = []
    }
  }

  /**
   * Charger les aides-soignants
   */
  const loadAidesSoignants = async () => {
    try {
      aidesSoignants.value = await aideSoignantService.getAll()
    } catch (err) {
      console.error('Erreur lors du chargement des aides-soignants:', err)
      error.value = err.message
      aidesSoignants.value = []
    }
  }

  /**
   * Charger toutes les données du dashboard
   */
  const loadDashboardData = async () => {
    loading.value = true
    error.value = null

    try {
      await Promise.all([
        loadPatients(),
        loadAlertes(),
        loadTodayExecutions(),
        loadAidesSoignants()
      ])
    } finally {
      loading.value = false
    }
  }

  /**
   * Statistiques calculées
   */
  const stats = computed(() => {
    const totalPatients = patients.value.length
    const alertesActives = alertes.value.filter(a => !a.resolu).length
    const soinsAujourdhui = executions.value.length

    // Compter les patients sans douche (à adapter selon les données réelles)
    const sansDouche = patients.value.filter(p => !p.dateLastDouche).length

    // Compter les patients par étage
    const patientsByFloor = {}
    patients.value.forEach(p => {
      const floor = p.etage || 0
      patientsByFloor[floor] = (patientsByFloor[floor] || 0) + 1
    })

    return {
      totalPatients,
      sansDouche,
      soinsAujourdhui,
      alertesActives,
      patientsByFloor
    }
  })

  /**
   * Alertes critiques (les plus récentes)
   */
  const alertesCritiques = computed(() => {
    return alertes.value
      .filter(a => !a.resolu)
      .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
      .slice(0, 5)
  })

  /**
   * Répartition des soins par type
   */
  const repartitionSoins = computed(() => {
    const repartition = {}

    executions.value.forEach(exec => {
      const type = exec.typeSoin || 'Autre'
      repartition[type] = (repartition[type] || 0) + 1
    })

    // Convertir en format de graphique
    return Object.entries(repartition).map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / executions.value.length) * 100) || 0
    }))
  })

  /**
   * Charge par aide-soignant (simplifié)
   */
  const chargeAidesSoignants = computed(() => {
    const charges = {}

    aidesSoignants.value.forEach(as => {
      const asExecutions = executions.value.filter(e => e.aideSoignantId === as.id)
      const totalMinutes = asExecutions.reduce((sum, e) => sum + (e.dureeMinutes || 0), 0)
      charges[as.code] = totalMinutes
    })

    return charges
  })

  return {
    patients,
    alertes,
    executions,
    aidesSoignants,
    loading,
    error,
    stats,
    alertesCritiques,
    repartitionSoins,
    chargeAidesSoignants,
    loadPatients,
    loadAlertes,
    loadTodayExecutions,
    loadAidesSoignants,
    loadDashboardData
  }
}

export default useDashboardStats
