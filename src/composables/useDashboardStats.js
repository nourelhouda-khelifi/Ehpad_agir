/**
 * Composable pour gérer les statistiques du dashboard
 */

import { ref, computed } from 'vue'
import { patientService } from '../api/services/patientService.js'
import { patientAlertService } from '../api/services/patientAlertService.js'
import { executionSoinService } from '../api/services/executionSoinService.js'
import { aideSoignantService } from '../api/services/aideSoignantService.js'
import { typeSoinService } from '../api/services/typeSoinService.js'

export const useDashboardStats = () => {
  const patients = ref([])
  const alertes = ref([])
  const executions = ref([])
  const aidesSoignants = ref([])
  const typesSoin = ref([])
  const weeklyChargeData = ref({})
  const loading = ref(false)
  const error = ref(null)

  // Date de base pour le calcul des semaines
  const baseWeekStart = new Date(2026, 4, 11)

  /**
   * Calculer la semaine actuelle
   */
  const getCurrentWeek = () => {
    const today = new Date()
    const dayDiff = Math.floor((today - baseWeekStart) / (24 * 60 * 60 * 1000))
    return 19 + Math.floor(dayDiff / 7)
  }

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
  const loadWeeklyCharge = () => {
    const chargeData = {}
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
    const currentWeek = getCurrentWeek()

    aidesSoignants.value.forEach(as => {
      const chargeByDay = {}
      days.forEach(day => {
        chargeByDay[day] = 0
      })

      // Filtrer les ExecutionSoins pour cet AS et cette semaine
      executions.value.forEach(exec => {
        if (exec.aideSoignant?.code !== as.code) return

        const execDate = new Date(exec.dateExecution + 'T00:00:00')
        const dayDiff = Math.floor((execDate - baseWeekStart) / (24 * 60 * 60 * 1000))
        const execWeek = 19 + Math.floor(dayDiff / 7)
        
        if (execWeek !== currentWeek) return

        const dayOfWeek = dayDiff % 7
        const day = days[dayOfWeek]
        chargeByDay[day] = (chargeByDay[day] || 0) + 30
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
    const alertesActives = alertes.value.filter(a => !a.resolu).length
    const currentWeek = getCurrentWeek()
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

    // Récupérer les exécutions pour aujourd'hui
    const today = new Date().toISOString().split('T')[0]
    const todayExecutions = executions.value.filter(e => e.dateExecution === today)
    const soinsAujourdhui = todayExecutions.length

    // Compter les patients sans douche pour la semaine actuelle
    const patientIdsWithDouche = new Set()
    executions.value.forEach(exec => {
      const execDate = new Date(exec.dateExecution + 'T00:00:00')
      const dayDiff = Math.floor((execDate - baseWeekStart) / (24 * 60 * 60 * 1000))
      const execWeek = 19 + Math.floor(dayDiff / 7)
      
      if (execWeek !== currentWeek) return
      
      const typeSoin = typesSoin.value.find(t => t.id === exec.typeSoinId)
      if (typeSoin && typeSoin.code === 'DOUCHE') {
        patientIdsWithDouche.add(exec.patientId)
      }
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
    const currentWeek = getCurrentWeek()
    const charges = {
      toute: {},
      matin: {},
      soir: {}
    }

    aidesSoignants.value.forEach(as => {
      charges.toute[as.code] = 0
      charges.matin[as.code] = 0
      charges.soir[as.code] = 0

      const asExecutions = executions.value.filter(e => {
        if (e.aideSoignant?.code !== as.code) return false
        
        // Calculer la semaine de l'exécution
        const execDate = new Date(e.dateExecution + 'T00:00:00')
        const dayDiff = Math.floor((execDate - baseWeekStart) / (24 * 60 * 60 * 1000))
        const execWeek = 19 + Math.floor(dayDiff / 7)
        
        if (execWeek !== currentWeek) return false
        return true
      })

      asExecutions.forEach(e => {
        const typeSoin = typesSoin.value.find(t => t.id === e.typeSoinId)
        const minutes = typeSoin?.dureeParDefaut || 30
        
        // Récupérer l'heure (format "HH:MM")
        const heure = parseInt(e.heureExecution?.split(':')[0] || '0')
        
        // Classer par période
        if (heure >= 6 && heure < 14) {
          charges.matin[as.code] += minutes
        } else if (heure >= 14 && heure < 22) {
          charges.soir[as.code] += minutes
        }
        
        // Total toute journée
        charges.toute[as.code] += minutes
      })
    })

    return charges
  })

  /**
   * Charge hebdomadaire formatée pour le graphique BarChart
   */
  const chargeASParSemaine = computed(() => {
    const daysShort = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    const daysLong = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
    
    const colors = {
      SE1: '#97C459',
      SE2: '#E24B4A',
      SC1: '#378ADD',
      SC2: '#5DCAA5',
      SG: '#888780'
    }

    // Créer les séries avec les jours longs du weeklyChargeData
    const series = aidesSoignants.value.map(as => ({
      code: as.code,
      color: colors[as.code] || '#888780',
      values: daysLong.map(day => weeklyChargeData.value[as.code]?.[day] || 0)
    }))

    return {
      jours: daysShort,
      data: series.length > 0 ? series : [
        { code: 'SE1', color: colors.SE1, values: [0, 0, 0, 0, 0, 0, 0] },
        { code: 'SE2', color: colors.SE2, values: [0, 0, 0, 0, 0, 0, 0] },
        { code: 'SC1', color: colors.SC1, values: [0, 0, 0, 0, 0, 0, 0] },
        { code: 'SC2', color: colors.SC2, values: [0, 0, 0, 0, 0, 0, 0] },
        { code: 'SG', color: colors.SG, values: [0, 0, 0, 0, 0, 0, 0] }
      ]
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
