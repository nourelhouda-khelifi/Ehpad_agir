export const DUREE_DOUCHE = 30
export const DUREE_WC = null
export const DUREE_TOILETTE = null
export const DUREE_COUCHER = null
export const DUREE_REPAS = null
export const DUREE_LEVER = 20
export const DUREE_SIESTE = 60
export const DUREE_PETIT_DEJEUNER = 25

const dureeParActivite = {
  'douche': DUREE_DOUCHE,
  'wc': DUREE_WC,
  'toilette': DUREE_TOILETTE,
  'coucher': DUREE_COUCHER,
  'repas': DUREE_REPAS,
  'lever': DUREE_LEVER,
  'sieste': DUREE_SIESTE,
  'petitDejeuner': DUREE_PETIT_DEJEUNER
}

function createActivity(as, activity, moment = 'matin') {
  if (!activity || !as) return { as: null, duree: null, moment: null }
  return {
    as,
    duree: dureeParActivite[activity] || null,
    moment
  }
}

export const mockPlanningSemaine19 = {
  2: { 
    lundi: { douche: { as: 'SE2', duree: 30, moment: 'matin' } }, 
    mardi: {}, 
    mercredi: { toilette: { as: 'SC1', duree: null, moment: 'soir' } }, 
    jeudi: {}, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  },
  3: { 
    lundi: {}, 
    mardi: { wc: { as: 'SE2', duree: null, moment: 'matin' } }, 
    mercredi: {}, 
    jeudi: {}, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  },
  12: { 
    lundi: {}, 
    mardi: {}, 
    mercredi: {}, 
    jeudi: {}, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  },
  5: { 
    lundi: { toilette: { as: 'SE1', duree: null, moment: 'matin' } }, 
    mardi: { douche: { as: 'SE1', duree: 30, moment: 'matin' } }, 
    mercredi: {}, 
    jeudi: {}, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  },
  7: { 
    lundi: { wc: { as: 'SC1', duree: null, moment: 'matin' } }, 
    mardi: {}, 
    mercredi: {}, 
    jeudi: {}, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  },
  9: { 
    lundi: {}, 
    mardi: {}, 
    mercredi: { douche: { as: 'SE2', duree: 30, moment: 'matin' } }, 
    jeudi: {}, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  },
  14: { 
    lundi: {}, 
    mardi: { toilette: { as: 'SG', duree: null, moment: 'soir' } }, 
    mercredi: {}, 
    jeudi: {}, 
    vendredi: { douche: { as: 'SG', duree: 30, moment: 'matin' } }, 
    samedi: {}, 
    dimanche: {} 
  },
  18: { 
    lundi: { douche: { as: 'SE1', duree: 30, moment: 'matin' } }, 
    mardi: {}, 
    mercredi: {}, 
    jeudi: {}, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  },
  21: { 
    lundi: { wc: { as: 'SC1', duree: null, moment: 'matin' } }, 
    mardi: {}, 
    mercredi: { toilette: { as: 'SC1', duree: null, moment: 'soir' } }, 
    jeudi: {}, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  },
  25: { 
    lundi: {}, 
    mardi: { douche: { as: 'SE2', duree: 30, moment: 'matin' } }, 
    mercredi: {}, 
    jeudi: {}, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  },
  28: { 
    lundi: {}, 
    mardi: { toilette: { as: 'SG', duree: null, moment: 'soir' } }, 
    mercredi: {}, 
    jeudi: { douche: { as: 'SG', duree: 30, moment: 'matin' } }, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  },
  31: { 
    lundi: {}, 
    mardi: { toilette: { as: 'SC2', duree: null, moment: 'soir' } }, 
    mercredi: { douche: { as: 'SC2', duree: 30, moment: 'matin' } }, 
    jeudi: {}, 
    vendredi: {}, 
    samedi: {}, 
    dimanche: {} 
  }
}

// SEMAINE 20 : 18-24 MAI 2026 (semaine actuelle - données complètes)
export const mockPlanningSemaine20 = {
  2: { 
    lundi: { douche: { as: 'SE2', duree: 30, moment: 'matin' }, wc: { as: 'SC1', duree: null, moment: 'soir' } }, 
    mardi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    mercredi: { douche: { as: 'SE2', duree: 30, moment: 'matin' } }, 
    jeudi: { toilette: { as: 'SC1', duree: null, moment: 'soir' } }, 
    vendredi: { douche: { as: 'SE2', duree: 30, moment: 'matin' } }, 
    samedi: { toilette: { as: 'SC2', duree: null, moment: 'matin' } }, 
    dimanche: {} 
  },
  3: { 
    lundi: { toilette: { as: 'SC1', duree: null, moment: 'matin' }, wc: { as: 'SE1', duree: null, moment: 'matin' } }, 
    mardi: { douche: { as: 'SE1', duree: 30, moment: 'soir' } }, 
    mercredi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    jeudi: { wc: { as: 'SE1', duree: null, moment: 'matin' } }, 
    vendredi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    samedi: {}, 
    dimanche: {} 
  },
  4: { 
    lundi: { wc: { as: 'SE2', duree: null, moment: 'matin' }, douche: { as: 'SE2', duree: 30, moment: 'soir' } }, 
    mardi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    mercredi: { wc: { as: 'SE2', duree: null, moment: 'matin' } }, 
    jeudi: { douche: { as: 'SE2', duree: 30, moment: 'matin' } }, 
    vendredi: { toilette: { as: 'SC1', duree: null, moment: 'soir' } }, 
    samedi: { wc: { as: 'SC2', duree: null, moment: 'matin' } }, 
    dimanche: {} 
  },
  5: { 
    lundi: { douche: { as: 'SE1', duree: 30, moment: 'matin' } }, 
    mardi: { wc: { as: 'SC1', duree: null, moment: 'matin' }, toilette: { as: 'SC1', duree: null, moment: 'soir' } }, 
    mercredi: { douche: { as: 'SE1', duree: 30, moment: 'matin' } }, 
    jeudi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    vendredi: { wc: { as: 'SE1', duree: null, moment: 'matin' } }, 
    samedi: { douche: { as: 'SC2', duree: 30, moment: 'matin' } }, 
    dimanche: {} 
  },
  6: { 
    lundi: { toilette: { as: 'SC1', duree: null, moment: 'matin' }, wc: { as: 'SE1', duree: null, moment: 'soir' } }, 
    mardi: { douche: { as: 'SE1', duree: 30, moment: 'matin' } }, 
    mercredi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    jeudi: { douche: { as: 'SE1', duree: 30, moment: 'soir' } }, 
    vendredi: { wc: { as: 'SC1', duree: null, moment: 'matin' } }, 
    samedi: {}, 
    dimanche: {} 
  },
  7: { 
    lundi: { wc: { as: 'SC1', duree: null, moment: 'matin' } }, 
    mardi: { toilette: { as: 'SC1', duree: null, moment: 'soir' }, douche: { as: 'SE2', duree: 30, moment: 'soir' } }, 
    mercredi: { wc: { as: 'SC1', duree: null, moment: 'matin' } }, 
    jeudi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    vendredi: { douche: { as: 'SE2', duree: 30, moment: 'matin' } }, 
    samedi: { wc: { as: 'SC2', duree: null, moment: 'matin' } }, 
    dimanche: {} 
  },
  9: { 
    lundi: { douche: { as: 'SE2', duree: 30, moment: 'matin' }, toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    mardi: { wc: { as: 'SE2', duree: null, moment: 'soir' } }, 
    mercredi: { douche: { as: 'SE2', duree: 30, moment: 'matin' } }, 
    jeudi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    vendredi: { douche: { as: 'SE2', duree: 30, moment: 'soir' } }, 
    samedi: { toilette: { as: 'SC2', duree: null, moment: 'matin' } }, 
    dimanche: {} 
  },
  10: { 
    lundi: { toilette: { as: 'SC1', duree: null, moment: 'matin' }, wc: { as: 'SE2', duree: null, moment: 'soir' } }, 
    mardi: { douche: { as: 'SE2', duree: 30, moment: 'matin' } }, 
    mercredi: { wc: { as: 'SE2', duree: null, moment: 'matin' } }, 
    jeudi: { douche: { as: 'SE2', duree: 30, moment: 'soir' } }, 
    vendredi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    samedi: { douche: { as: 'SC2', duree: 30, moment: 'matin' } }, 
    dimanche: {} 
  },
  11: { 
    lundi: { wc: { as: 'SC1', duree: null, moment: 'matin' }, douche: { as: 'SE1', duree: 30, moment: 'matin' } }, 
    mardi: { toilette: { as: 'SC1', duree: null, moment: 'soir' } }, 
    mercredi: { douche: { as: 'SE1', duree: 30, moment: 'matin' } }, 
    jeudi: { wc: { as: 'SC1', duree: null, moment: 'matin' } }, 
    vendredi: { douche: { as: 'SE1', duree: 30, moment: 'matin' } }, 
    samedi: { toilette: { as: 'SC2', duree: null, moment: 'matin' } }, 
    dimanche: {} 
  },
  12: { 
    lundi: { toilette: { as: 'SC1', duree: null, moment: 'matin' }, wc: { as: 'SG', duree: null, moment: 'soir' } }, 
    mardi: { douche: { as: 'SG', duree: 30, moment: 'matin' } }, 
    mercredi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    jeudi: { douche: { as: 'SG', duree: 30, moment: 'soir' } }, 
    vendredi: { wc: { as: 'SG', duree: null, moment: 'matin' } }, 
    samedi: { toilette: { as: 'SC2', duree: null, moment: 'matin' } }, 
    dimanche: {} 
  },
  13: { 
    lundi: { douche: { as: 'SE1', duree: 30, moment: 'matin' }, toilette: { as: 'SC1', duree: null, moment: 'soir' } }, 
    mardi: { wc: { as: 'SE1', duree: null, moment: 'matin' } }, 
    mercredi: { douche: { as: 'SE1', duree: 30, moment: 'matin' } }, 
    jeudi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    vendredi: { douche: { as: 'SE1', duree: 30, moment: 'soir' } }, 
    samedi: { wc: { as: 'SC2', duree: null, moment: 'matin' } }, 
    dimanche: {} 
  },
  14: { 
    lundi: { wc: { as: 'SG', duree: null, moment: 'matin' } }, 
    mardi: { toilette: { as: 'SG', duree: null, moment: 'soir' }, douche: { as: 'SG', duree: 30, moment: 'soir' } }, 
    mercredi: { wc: { as: 'SG', duree: null, moment: 'matin' } }, 
    jeudi: { toilette: { as: 'SG', duree: null, moment: 'matin' } }, 
    vendredi: { douche: { as: 'SG', duree: 30, moment: 'matin' } }, 
    samedi: { wc: { as: 'SC2', duree: null, moment: 'matin' } }, 
    dimanche: {} 
  },
  15: { 
    lundi: { toilette: { as: 'SC1', duree: null, moment: 'matin' }, douche: { as: 'SE2', duree: 30, moment: 'soir' } }, 
    mardi: { wc: { as: 'SE2', duree: null, moment: 'matin' } }, 
    mercredi: { toilette: { as: 'SC1', duree: null, moment: 'matin' } }, 
    jeudi: { douche: { as: 'SE2', duree: 30, moment: 'matin' } }, 
    vendredi: { wc: { as: 'SE2', duree: null, moment: 'soir' } }, 
    samedi: { toilette: { as: 'SC2', duree: null, moment: 'matin' } }, 
    dimanche: {} 
  }
}

export const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

export function createEmptyPlanningForPatients(patients) {
  return patients.reduce((planning, patient) => {
    planning[patient.id] = joursSemaine.reduce((jours, jour) => {
      jours[jour] = {}
      return jours
    }, {})
    return planning
  }, {})
}

export function clonePlanning(planning) {
  return JSON.parse(JSON.stringify(planning))
}
