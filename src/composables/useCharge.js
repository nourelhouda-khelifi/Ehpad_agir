import { computed } from 'vue'

export function useCharge(planning, aidesSoignants) {
  const calculerChargeAS = (codeAS, planningData) => {
    let nbActivites = 0
    const patientsUniques = new Set()

    Object.entries(planningData || {}).forEach(([patientId, jours]) => {
      Object.values(jours || {}).forEach((dayActivities) => {
        Object.values(dayActivities || {}).forEach((activity) => {
          if (activity?.type === 'shared') {
            const asIndex = activity.ases?.indexOf(codeAS)
            if (asIndex !== undefined && asIndex >= 0) {
              nbActivites += 1
              patientsUniques.add(patientId)
            }
          } else if (activity?.as === codeAS) {
            nbActivites += 1
            patientsUniques.add(patientId)
          }
        })
      })
    })

    return { nbActivites, nbPatients: patientsUniques.size }
  }

  const calculerNiveau = (nbSoins) => {
    if (nbSoins < 15) return 'leger'
    if (nbSoins < 25) return 'normal'
    if (nbSoins < 35) return 'eleve'
    return 'surcharge'
  }

  const getLabelNiveau = (niveau) => {
    const labels = { leger: 'Léger', normal: 'Normal', eleve: 'Élevé', surcharge: 'Surchargé' }
    return labels[niveau] || 'Normal'
  }

  const aidesSoignantsAvecCharge = computed(() => {
    return aidesSoignants.value.map((as) => {
      const charge = calculerChargeAS(as.code, planning.value)
      const niveau = calculerNiveau(charge.nbActivites)

      return {
        ...as,
        chargeMinutes: charge.nbActivites,
        nbActivites: charge.nbActivites,
        nbPatients: charge.nbPatients,
        niveau,
        labelNiveau: getLabelNiveau(niveau)
      }
    })
  })

  const recommanderAS = computed(() => {
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
