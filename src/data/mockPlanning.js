export const DUREE_DOUCHE = 30
export const DUREE_WC = 15
export const DUREE_TOILETTE = 20
export const DUREE_COUCHER = 15
export const DUREE_REPAS = 25

const dureeParActivite = {
  'douche': DUREE_DOUCHE,
  'wc': DUREE_WC,
  'toilette': DUREE_TOILETTE,
  'coucher': DUREE_COUCHER,
  'repas': DUREE_REPAS
}

function createActivity(as, activity) {
  if (!activity || !as) return { as: null, activity: null, duree: null }
  return {
    as,
    activity,
    duree: dureeParActivite[activity] || 15
  }
}

export const mockPlanningSemaine19 = {
  2: { 
    lundi: { as: 'SE2', activity: 'douche', duree: 30 }, 
    mardi: { as: 'SE1', activity: 'wc', duree: 15 }, 
    mercredi: { as: 'SC1', activity: 'toilette', duree: 20 }, 
    jeudi: { as: 'SE2', activity: 'coucher', duree: 15 }, 
    vendredi: { as: 'SC2', activity: 'repas', duree: 25 }, 
    samedi: { as: null, activity: null, duree: null }, 
    dimanche: { as: null, activity: null, duree: null } 
  },
  3: { 
    lundi: { as: null, activity: null, duree: null }, 
    mardi: { as: 'SE2', activity: 'wc', duree: 15 }, 
    mercredi: { as: null, activity: null, duree: null }, 
    jeudi: { as: null, activity: null, duree: null }, 
    vendredi: { as: null, activity: null, duree: null }, 
    samedi: { as: null, activity: null, duree: null }, 
    dimanche: { as: null, activity: null, duree: null } 
  },
  12: { 
    lundi: { as: null, activity: null, duree: null }, 
    mardi: { as: null, activity: null, duree: null }, 
    mercredi: { as: 'SC1', activity: 'repas', duree: 25 }, 
    jeudi: { as: null, activity: null, duree: null }, 
    vendredi: { as: null, activity: null, duree: null }, 
    samedi: { as: null, activity: null, duree: null }, 
    dimanche: { as: null, activity: null, duree: null } 
  },
  5: { 
    lundi: { as: 'SE1', activity: 'toilette', duree: 20 }, 
    mardi: { as: 'SE1', activity: 'douche', duree: 30 }, 
    mercredi: { as: null, activity: null, duree: null }, 
    jeudi: { as: 'SE1', activity: 'wc', duree: 15 }, 
    vendredi: { as: 'SE1', activity: 'coucher', duree: 15 }, 
    samedi: { as: 'SC2', activity: 'repas', duree: 25 }, 
    dimanche: { as: null, activity: null, duree: null } 
  },
  7: { 
    lundi: { as: 'SC1', activity: 'wc', duree: 15 }, 
    mardi: { as: 'SC1', activity: 'toilette', duree: 20 }, 
    mercredi: { as: 'SG', activity: 'wc', duree: 15 }, 
    jeudi: { as: null, activity: null, duree: null }, 
    vendredi: { as: 'SC1', activity: 'wc', duree: 15 }, 
    samedi: { as: 'SG', activity: 'coucher', duree: 15 }, 
    dimanche: { as: 'SC1', activity: 'repas', duree: 25 } 
  },
  9: { 
    lundi: { as: 'SE2', activity: 'toilette', duree: 20 }, 
    mardi: { as: 'SE2', activity: 'coucher', duree: 15 }, 
    mercredi: { as: 'SE2', activity: 'douche', duree: 30 }, 
    jeudi: { as: 'SE2', activity: 'toilette', duree: 20 }, 
    vendredi: { as: 'SC2', activity: 'repas', duree: 25 }, 
    samedi: { as: 'SE2', activity: 'wc', duree: 15 }, 
    dimanche: { as: 'SE2', activity: 'coucher', duree: 15 } 
  },
  14: { 
    lundi: { as: 'SG', activity: 'wc', duree: 15 }, 
    mardi: { as: 'SG', activity: 'toilette', duree: 20 }, 
    mercredi: { as: 'SG', activity: 'wc', duree: 15 }, 
    jeudi: { as: 'SG', activity: 'toilette', duree: 20 }, 
    vendredi: { as: 'SG', activity: 'douche', duree: 30 }, 
    samedi: { as: 'SG', activity: 'repas', duree: 25 }, 
    dimanche: { as: null, activity: null, duree: null } 
  },
  18: { 
    lundi: { as: 'SE1', activity: 'douche', duree: 30 }, 
    mardi: { as: 'SC2', activity: 'wc', duree: 15 }, 
    mercredi: { as: 'SE1', activity: 'toilette', duree: 20 }, 
    jeudi: { as: 'SE1', activity: 'coucher', duree: 15 }, 
    vendredi: { as: 'SC2', activity: 'repas', duree: 25 }, 
    samedi: { as: 'SE1', activity: 'douche', duree: 30 }, 
    dimanche: { as: 'SC2', activity: 'wc', duree: 15 } 
  },
  21: { 
    lundi: { as: 'SC1', activity: 'wc', duree: 15 }, 
    mardi: { as: 'SC1', activity: 'wc', duree: 15 }, 
    mercredi: { as: 'SC1', activity: 'toilette', duree: 20 }, 
    jeudi: { as: 'SC1', activity: 'wc', duree: 15 }, 
    vendredi: { as: 'SC1', activity: 'toilette', duree: 20 }, 
    samedi: { as: 'SC1', activity: 'wc', duree: 15 }, 
    dimanche: { as: 'SC1', activity: 'wc', duree: 15 } 
  },
  25: { 
    lundi: { as: 'SE2', activity: 'wc', duree: 15 }, 
    mardi: { as: 'SE2', activity: 'douche', duree: 30 }, 
    mercredi: { as: 'SE2', activity: 'coucher', duree: 15 }, 
    jeudi: { as: 'SE2', activity: 'wc', duree: 15 }, 
    vendredi: { as: 'SE2', activity: 'toilette', duree: 20 }, 
    samedi: { as: 'SE2', activity: 'coucher', duree: 15 }, 
    dimanche: { as: 'SE2', activity: 'douche', duree: 30 } 
  },
  28: { 
    lundi: { as: 'SG', activity: 'wc', duree: 15 }, 
    mardi: { as: 'SG', activity: 'toilette', duree: 20 }, 
    mercredi: { as: 'SG', activity: 'coucher', duree: 15 }, 
    jeudi: { as: 'SG', activity: 'douche', duree: 30 }, 
    vendredi: { as: 'SG', activity: 'wc', duree: 15 }, 
    samedi: { as: 'SG', activity: 'toilette', duree: 20 }, 
    dimanche: { as: 'SG', activity: 'coucher', duree: 15 } 
  },
  31: { 
    lundi: { as: 'SC2', activity: 'wc', duree: 15 }, 
    mardi: { as: 'SC2', activity: 'toilette', duree: 20 }, 
    mercredi: { as: 'SC2', activity: 'douche', duree: 30 }, 
    jeudi: { as: 'SC2', activity: 'coucher', duree: 15 }, 
    vendredi: { as: 'SC2', activity: 'wc', duree: 15 }, 
    samedi: { as: 'SC2', activity: 'toilette', duree: 20 }, 
    dimanche: { as: 'SC2', activity: 'coucher', duree: 15 } 
  }
}

export const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

export function createEmptyPlanningForPatients(patients) {
  return patients.reduce((planning, patient) => {
    planning[patient.id] = joursSemaine.reduce((jours, jour) => {
      jours[jour] = { as: null, activity: null, duree: null }
      return jours
    }, {})
    return planning
  }, {})
}

export function clonePlanning(planning) {
  return JSON.parse(JSON.stringify(planning))
}
