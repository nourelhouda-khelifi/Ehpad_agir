export const DUREE_DOUCHE = 30
export const DUREE_WC = null
export const DUREE_TOILETTE = null
export const DUREE_COUCHER = null
export const DUREE_REPAS = null

const dureeParActivite = {
  'douche': DUREE_DOUCHE,
  'wc': DUREE_WC,
  'toilette': DUREE_TOILETTE,
  'coucher': DUREE_COUCHER,
  'repas': DUREE_REPAS
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
