/**
 * Composable pour gérer les statistiques du dashboard
 */

import { ref, computed } from 'vue'
import { patientService } from '../api/services/patientService.js'
import { patientAlertService } from '../api/services/patientAlertService.js'
import { executionSoinService } from '../api/services/executionSoinService.js'
import { aideSoignantService } from '../api/services/aideSoignantService.js'
import { typeSoinService } from '../api/services/typeSoinService.js'
import { getCurrentWeekMonday, getISOWeekNumber, getDayIndexInCurrentWeek } from '../utils/dateUtils.js'

export const useDashboardStats = () => {
  const patients = ref([])
  const alertes = ref([])
  const executions = ref([])
  const aidesSoignants = ref([])
  const typesSoin = ref([])
  const weeklyChargeData = ref({})
  const loading = ref(false)
  const error = ref(null)

  const currentMondayStr = getCurrentWeekMonday()

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
   * Charger tous les ExecutionSoins
   */
  const loadAllExecutions = async () => {
    try {
      executions.value = await executionSoinService.getAll()
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
   * Charger les types de soins
   */
  const loadTypesSoin = async () => {
    try {
      typesSoin.value = await typeSoinService.getAll()
    } catch (err) {
      console.error('Erreur lors du chargement des types de soins:', err)
      error.value = err.message
      typesSoin.value = []
    }
  }

  /**
   * Charger la charge hebdomadaire des aides-soignants
   */
  const parseDuree = (commentaire) =>
    parseInt(commentaire?.match(/Dur[ée]+: (\d+)/)?.[1] || '30')

  // Même logique de déduplication que AidesSoignantsView :
  // pour un AS donné, un seul exec par (patientId + jour + typeSoinId)
  const getDeduplicatedExecs = (asCode) => {
    const seen = new Set()
    const result = []
    executions.value.forEach(exec => {
      if (exec.aideSoignant?.code !== asCode) return
      const dayIndex = getDayIndexInCurrentWeek(exec.dateExecution, currentMondayStr)
      if (dayIndex === -1) return
      const key = `${exec.patientId}_${dayIndex}_${exec.typeSoinId}`
      if (seen.has(key)) return
      seen.add(key)
      result.push({ exec, dayIndex })
    })
    return result
  }

  const loadWeeklyCharge = () => {
    const chargeData = {}
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

    aidesSoignants.value.forEach(as => {
      const chargeByDay = {}
      days.forEach(day => { chargeByDay[day] = 0 })

      getDeduplicatedExecs(as.code).forEach(({ exec, dayIndex }) => {
        const day = days[dayIndex]
        chargeByDay[day] = (chargeByDay[day] || 0) + parseDuree(exec.commentaire)
      })

      chargeData[as.code] = chargeByDay
    })

    weeklyChargeData.value = chargeData
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
        loadAllExecutions(),
        loadAidesSoignants(),
        loadTypesSoin()
      ])
      // Charger la charge hebdomadaire après avoir chargé les aides-soignants et exécutions
      loadWeeklyCharge()
    } finally {
      loading.value = false
    }
  }

  /**
   * Statistiques calculées
   */
  const stats = computed(() => {
    const totalPatients = patients.value.length
    const alertesActives = alertes.value.filter(a => !a.resolue).length

    const today = new Date().toISOString().split('T')[0]
    const soinsAujourdhui = executions.value.filter(e => e.dateExecution === today).length

    const patientIdsWithDouche = new Set()
    executions.value.forEach(exec => {
      if (getDayIndexInCurrentWeek(exec.dateExecution, currentMondayStr) === -1) return
      const typeSoin = typesSoin.value.find(t => t.id === exec.typeSoinId)
      if (typeSoin && typeSoin.code === 'DOUCHE') patientIdsWithDouche.add(exec.patientId)
    })
    const sansDouche = patients.value.filter(p => !patientIdsWithDouche.has(p.id)).length

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
      .map(a => {
        // Enrichir avec le nom du patient
        const patient = patients.value.find(p => p.id === a.patientId)
        return {
          ...a,
          patientNom: patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu',
          chambre: patient?.numeroChambre
        }
      })
      .filter(a => !a.resolue)
      .sort((a, b) => new Date(b.createdAt || b.dateCreation) - new Date(a.createdAt || a.dateCreation))
      .slice(0, 5)
  })

  /**
   * Répartition des soins par type
   */
  const repartitionSoins = computed(() => {
    const repartition = {}

    executions.value.forEach(exec => {
      const typeSoin = typesSoin.value.find(t => t.id === exec.typeSoinId)
      const label = typeSoin ? typeSoin.libelle : 'Autre'
      repartition[label] = (repartition[label] || 0) + 1
    })

    // Convertir en format de graphique
    return Object.entries(repartition).map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / (executions.value.length || 1)) * 100) || 0
    }))
  })

  /**
   * Charge par aide-soignant et par période pour la semaine actuelle
   */
  const chargeAidesSoignants = computed(() => {
    const charges = {
      toute: {},
      matin: {},
      soir: {},
      nbPatients: {}
    }

    aidesSoignants.value.forEach(as => {
      charges.toute[as.code] = 0
      charges.matin[as.code] = 0
      charges.soir[as.code] = 0
      const patientsUniques = new Set()

      getDeduplicatedExecs(as.code).forEach(({ exec }) => {
        const minutes = parseDuree(exec.commentaire)
        const heure = parseInt(exec.heureExecution?.split(':')[0] || '0')

        if (heure >= 6 && heure < 14) {
          charges.matin[as.code] += minutes
        } else if (heure >= 14 && heure < 22) {
          charges.soir[as.code] += minutes
        }

        charges.toute[as.code] += minutes
        if (exec.patientId) patientsUniques.add(exec.patientId)
      })

      charges.nbPatients[as.code] = patientsUniques.size
    })

    return charges
  })

  /**
   * Charge hebdomadaire formatée pour le graphique BarChart
   */
  const chargeASParSemaine = computed(() => {
    const daysShort = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    const daysLong = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
    
    const series = aidesSoignants.value.map(as => ({
      code: as.code,
      color: as.color || '#888780',
      values: daysLong.map(day => weeklyChargeData.value[as.code]?.[day] || 0)
    }))

    return {
      jours: daysShort,
      data: series
    }
  })

  return {
    patients,
    alertes,
    executions,
    aidesSoignants,
    typesSoin,
    loading,
    error,
    stats,
    alertesCritiques,
    repartitionSoins,
    chargeAidesSoignants,
    chargeASParSemaine,
    loadPatients,
    loadAlertes,
    loadAllExecutions,
    loadAidesSoignants,
    loadTypesSoin,
    loadDashboardData
  }
}

export default useDashboardStats
