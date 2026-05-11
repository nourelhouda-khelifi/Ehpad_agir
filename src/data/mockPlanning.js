export const DUREE_DOUCHE = 20

export const mockPlanningSemaine19 = {
  2: { 
    lundi: { as: 'SE2', activity: 'douche' }, 
    mardi: { as: 'SE1', activity: 'wc' }, 
    mercredi: { as: 'SC1', activity: 'toilette' }, 
    jeudi: { as: 'SE2', activity: 'coucher' }, 
    vendredi: { as: 'SC2', activity: 'repas' }, 
    samedi: { as: null, activity: null }, 
    dimanche: { as: null, activity: null } 
  },
  3: { 
    lundi: { as: null, activity: null }, 
    mardi: { as: 'SE2', activity: 'wc' }, 
    mercredi: { as: null, activity: null }, 
    jeudi: { as: null, activity: null }, 
    vendredi: { as: null, activity: null }, 
    samedi: { as: null, activity: null }, 
    dimanche: { as: null, activity: null } 
  },
  12: { 
    lundi: { as: null, activity: null }, 
    mardi: { as: null, activity: null }, 
    mercredi: { as: 'SC1', activity: 'repas' }, 
    jeudi: { as: null, activity: null }, 
    vendredi: { as: null, activity: null }, 
    samedi: { as: null, activity: null }, 
    dimanche: { as: null, activity: null } 
  },
  5: { 
    lundi: { as: 'SE1', activity: 'toilette' }, 
    mardi: { as: 'SE1', activity: 'douche' }, 
    mercredi: { as: null, activity: null }, 
    jeudi: { as: 'SE1', activity: 'wc' }, 
    vendredi: { as: 'SE1', activity: 'coucher' }, 
    samedi: { as: 'SC2', activity: 'repas' }, 
    dimanche: { as: null, activity: null } 
  },
  7: { 
    lundi: { as: 'SC1', activity: 'wc' }, 
    mardi: { as: 'SC1', activity: 'toilette' }, 
    mercredi: { as: 'SG', activity: 'wc' }, 
    jeudi: { as: null, activity: null }, 
    vendredi: { as: 'SC1', activity: 'wc' }, 
    samedi: { as: 'SG', activity: 'coucher' }, 
    dimanche: { as: 'SC1', activity: 'repas' } 
  },
  9: { 
    lundi: { as: 'SE2', activity: 'toilette' }, 
    mardi: { as: 'SE2', activity: 'coucher' }, 
    mercredi: { as: 'SE2', activity: 'douche' }, 
    jeudi: { as: 'SE2', activity: 'toilette' }, 
    vendredi: { as: 'SC2', activity: 'repas' }, 
    samedi: { as: 'SE2', activity: 'wc' }, 
    dimanche: { as: 'SE2', activity: 'coucher' } 
  },
  14: { 
    lundi: { as: 'SG', activity: 'wc' }, 
    mardi: { as: 'SG', activity: 'toilette' }, 
    mercredi: { as: 'SG', activity: 'wc' }, 
    jeudi: { as: 'SG', activity: 'toilette' }, 
    vendredi: { as: 'SG', activity: 'douche' }, 
    samedi: { as: 'SG', activity: 'repas' }, 
    dimanche: { as: null, activity: null } 
  },
  18: { 
    lundi: { as: 'SE1', activity: 'douche' }, 
    mardi: { as: 'SC2', activity: 'wc' }, 
    mercredi: { as: 'SE1', activity: 'toilette' }, 
    jeudi: { as: 'SE1', activity: 'coucher' }, 
    vendredi: { as: 'SC2', activity: 'repas' }, 
    samedi: { as: 'SE1', activity: 'douche' }, 
    dimanche: { as: 'SC2', activity: 'wc' } 
  },
  21: { 
    lundi: { as: 'SC1', activity: 'wc' }, 
    mardi: { as: 'SC1', activity: 'wc' }, 
    mercredi: { as: 'SC1', activity: 'toilette' }, 
    jeudi: { as: 'SC1', activity: 'wc' }, 
    vendredi: { as: 'SC1', activity: 'toilette' }, 
    samedi: { as: 'SC1', activity: 'wc' }, 
    dimanche: { as: 'SC1', activity: 'wc' } 
  },
  25: { 
    lundi: { as: 'SE2', activity: 'wc' }, 
    mardi: { as: 'SE2', activity: 'douche' }, 
    mercredi: { as: 'SE2', activity: 'coucher' }, 
    jeudi: { as: 'SE2', activity: 'wc' }, 
    vendredi: { as: 'SE2', activity: 'toilette' }, 
    samedi: { as: 'SE2', activity: 'coucher' }, 
    dimanche: { as: 'SE2', activity: 'douche' } 
  },
  28: { 
    lundi: { as: 'SG', activity: 'wc' }, 
    mardi: { as: 'SG', activity: 'toilette' }, 
    mercredi: { as: 'SG', activity: 'coucher' }, 
    jeudi: { as: 'SG', activity: 'douche' }, 
    vendredi: { as: 'SG', activity: 'wc' }, 
    samedi: { as: 'SG', activity: 'toilette' }, 
    dimanche: { as: 'SG', activity: 'coucher' } 
  },
  31: { 
    lundi: { as: 'SC2', activity: 'wc' }, 
    mardi: { as: 'SC2', activity: 'toilette' }, 
    mercredi: { as: 'SC2', activity: 'douche' }, 
    jeudi: { as: 'SC2', activity: 'coucher' }, 
    vendredi: { as: 'SC2', activity: 'wc' }, 
    samedi: { as: 'SC2', activity: 'toilette' }, 
    dimanche: { as: 'SC2', activity: 'coucher' } 
  }
}

export const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

export function createEmptyPlanningForPatients(patients) {
  return patients.reduce((planning, patient) => {
    planning[patient.id] = joursSemaine.reduce((jours, jour) => {
      jours[jour] = { as: null, activity: null }
      return jours
    }, {})
    return planning
  }, {})
}

export function clonePlanning(planning) {
  return JSON.parse(JSON.stringify(planning))
}
