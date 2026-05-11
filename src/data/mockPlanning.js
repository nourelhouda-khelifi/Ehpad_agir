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
