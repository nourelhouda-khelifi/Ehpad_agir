import { computed } from 'vue'
import { mockAidesSoignants } from '@/data/mockAides.js'
import { DUREE_DOUCHE } from '@/data/mockPlanning.js'

export function useCharge(planning) {
  const calculerChargeAS = (codeAS, planningData) => {
    let totalMinutes = 0
    let nbDouches = 0
    const patientsUniques = new Set()

    Object.entries(planningData || {}).forEach(([patientId, jours]) => {
      Object.values(jours || {}).forEach((cellData) => {
        // Support both old format (string) and new format ({ as, activity })
        const asCode = typeof cellData === 'string' ? cellData : cellData?.as
        if (asCode === codeAS) {
          totalMinutes += DUREE_DOUCHE
          nbDouches += 1
          patientsUniques.add(patientId)
        }
      })
    })

    return {
      totalMinutes,
      nbDouches,
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
    return mockAidesSoignants.map((as) => {
      const charge = calculerChargeAS(as.code, planning.value)
      const niveau = calculerNiveau(charge.totalMinutes)

      return {
        ...as,
        chargeMinutes: charge.totalMinutes,
        nbDouches: charge.nbDouches,
        nbPatients: charge.nbPatients,
        niveau,
        labelNiveau: getLabelNiveau(niveau)
      }
    })
  })

  const recommanderAS = computed(() => {
    const actifs = aidesSoignantsAvecCharge.value.filter((as) => as.actif)
    return [...actifs].sort((a, b) => a.chargeMinutes - b.chargeMinutes)[0] || null
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
