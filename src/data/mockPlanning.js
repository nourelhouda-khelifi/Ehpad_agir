export const DUREE_DOUCHE = 20

export const mockPlanningSemaine19 = {
  2: { lundi: 'SE2', mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
  3: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
  12: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null }
}

export const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

export function createEmptyPlanningForPatients(patients) {
  return patients.reduce((planning, patient) => {
    planning[patient.id] = joursSemaine.reduce((jours, jour) => {
      jours[jour] = null
      return jours
    }, {})
    return planning
  }, {})
}

export function clonePlanning(planning) {
  return JSON.parse(JSON.stringify(planning))
}
