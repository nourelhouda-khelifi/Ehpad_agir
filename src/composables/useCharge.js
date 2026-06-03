import { computed } from 'vue'
import { DUREE_DOUCHE } from '@/data/mockPlanning.js'

export function useCharge(planning, aidesSoignants) {
  const calculerChargeAS = (codeAS, planningData) => {
    let totalMinutes = 0
    let nbActivites = 0
    const patientsUniques = new Set()

    Object.entries(planningData || {}).forEach(([patientId, jours]) => {
      Object.values(jours || {}).forEach((dayActivities) => {
        // dayActivities is now { activity: { as, duree, moment } or { type: 'shared', ases, durees, moment }, ... }
        Object.values(dayActivities || {}).forEach((activity) => {
          if (activity?.type === 'shared') {
            // Activité à 2 aides
            const asIndex = activity.ases?.indexOf(codeAS)
            if (asIndex !== undefined && asIndex >= 0) {
              totalMinutes += activity.durees?.[asIndex] || 0
              nbActivites += 1
              patientsUniques.add(patientId)
            }
          } else if (activity?.as === codeAS) {
            // Activité simple
            totalMinutes += activity.duree || 0
            nbActivites += 1
            patientsUniques.add(patientId)
          }
        })
      })
    })

    return {
      totalMinutes,
      nbActivites,
      nbPatients: patientsUniques.size
    }
  }

  const calculerNiveau = (minutes) => {
    if (minutes < 60) return 'leger'
    if (minutes < 90) return 'normal'
    if (minutes < 120) return 'eleve'
    return 'surcharge'
  }

  const getLabelNiveau = (niveau) => {
    const labels = {
      leger: 'Léger',
      normal: 'Normal',
      eleve: 'Élevé',
      surcharge: 'Surchargé'
    }
    return labels[niveau] || 'Normal'
  }

  const aidesSoignantsAvecCharge = computed(() => {
    return aidesSoignants.value.map((as) => {
      const charge = calculerChargeAS(as.code, planning.value)
      const niveau = calculerNiveau(charge.totalMinutes)

      return {
        ...as,
        chargeMinutes: charge.totalMinutes,
        nbActivites: charge.nbActivites,
        nbPatients: charge.nbPatients,
        niveau,
        labelNiveau: getLabelNiveau(niveau)
      }
    })
  })

  const recommanderAS = computed(() => {
    // Recommander l'AS avec la charge la plus faible (depuis que le champ actif n'existe plus)
    return [...aidesSoignantsAvecCharge.value].sort((a, b) => a.chargeMinutes - b.chargeMinutes)[0] || null
  })

  const chargeMoyenne = computed(() => {
    const total = aidesSoignantsAvecCharge.value.reduce((sum, as) => sum + as.chargeMinutes, 0)
    return Math.round(total / Math.max(aidesSoignantsAvecCharge.value.length, 1))
  })

  return {
    aidesSoignantsAvecCharge,
    recommanderAS,
    chargeMoyenne,
    calculerChargeAS,
    calculerNiveau
  }
}
