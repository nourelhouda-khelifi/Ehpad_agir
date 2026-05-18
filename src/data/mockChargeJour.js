// Charge en minutes par AS et par jour de la semaine 19
export const mockChargeJour = {
  SE1: { lundi: 60, mardi: 80, mercredi: 65, jeudi: 110, vendredi: 75, samedi: 25, dimanche: 20 },
  SE2: { lundi: 130, mardi: 125, mercredi: 95, jeudi: 130, vendredi: 100, samedi: 40, dimanche: 35 },
  SC1: { lundi: 70, mardi: 60, mercredi: 65, jeudi: 55, vendredi: 30, samedi: 20, dimanche: 15 },
  SC2: { lundi: 50, mardi: 35, mercredi: 60, jeudi: 30, vendredi: 25, samedi: 20, dimanche: 15 },
  SG: { lundi: 25, mardi: 20, mercredi: 45, jeudi: 25, vendredi: 30, samedi: 15, dimanche: 10 }
}

// Charge par période (matin: 06h-14h, soir: 14h-22h)
export const mockChargePeriode = {
  SE1: { matin: 35, soir: 40 },
  SE2: { matin: 70, soir: 65 },
  SC1: { matin: 40, soir: 38 },
  SC2: { matin: 28, soir: 32 },
  SG: { matin: 15, soir: 18 }
}

// Charge par jour ET par période (matin/soir de chaque jour)
export const mockChargeJourPeriode = {
  SE1: {
    lundi: { matin: 30, soir: 30 },
    mardi: { matin: 40, soir: 40 },
    mercredi: { matin: 32, soir: 33 },
    jeudi: { matin: 55, soir: 55 },
    vendredi: { matin: 38, soir: 37 },
    samedi: { matin: 12, soir: 13 },
    dimanche: { matin: 10, soir: 10 }
  },
  SE2: {
    lundi: { matin: 65, soir: 65 },
    mardi: { matin: 62, soir: 63 },
    mercredi: { matin: 47, soir: 48 },
    jeudi: { matin: 65, soir: 65 },
    vendredi: { matin: 50, soir: 50 },
    samedi: { matin: 20, soir: 20 },
    dimanche: { matin: 17, soir: 18 }
  },
  SC1: {
    lundi: { matin: 35, soir: 35 },
    mardi: { matin: 30, soir: 30 },
    mercredi: { matin: 32, soir: 33 },
    jeudi: { matin: 27, soir: 28 },
    vendredi: { matin: 15, soir: 15 },
    samedi: { matin: 10, soir: 10 },
    dimanche: { matin: 7, soir: 8 }
  },
  SC2: {
    lundi: { matin: 25, soir: 25 },
    mardi: { matin: 17, soir: 18 },
    mercredi: { matin: 30, soir: 30 },
    jeudi: { matin: 15, soir: 15 },
    vendredi: { matin: 12, soir: 13 },
    samedi: { matin: 10, soir: 10 },
    dimanche: { matin: 7, soir: 8 }
  },
  SG: {
    lundi: { matin: 12, soir: 13 },
    mardi: { matin: 10, soir: 10 },
    mercredi: { matin: 22, soir: 23 },
    jeudi: { matin: 12, soir: 13 },
    vendredi: { matin: 15, soir: 15 },
    samedi: { matin: 7, soir: 8 },
    dimanche: { matin: 5, soir: 5 }
  }
}

// Patients gérés par chaque AS (pour le détail)
export const mockPatientsParAS = {
  SE1: [
    { id: 6, nom: 'Mme Lopez', chambre: '1er 16 S', soinsParSemaine: 7 },
    { id: 7, nom: 'Mme Gence Simone', chambre: '1er 17 S', soinsParSemaine: 5 },
    { id: 9, nom: 'Mme Raby', chambre: '1er 19 S', soinsParSemaine: 8 }
  ],
  SE2: [
    { id: 2, nom: 'Mme Cormier', chambre: '1er 12 S', soinsParSemaine: 8 },
    { id: 4, nom: 'Mme Marysaël', chambre: '1er 14 S', soinsParSemaine: 9 },
    { id: 5, nom: 'Mme Boyer', chambre: '1er 15 S', soinsParSemaine: 7 },
    { id: 10, nom: 'Mme Tronca', chambre: '1er 20 S', soinsParSemaine: 6 },
    { id: 11, nom: 'Mme Vorillier', chambre: '1er 21 S', soinsParSemaine: 8 }
  ],
  SC1: [
    { id: 13, nom: 'Mme Baez', chambre: '2ème 31 S', soinsParSemaine: 6 },
    { id: 14, nom: 'Mme Daydé', chambre: '2ème 32 S', soinsParSemaine: 5 },
    { id: 15, nom: 'Mme Cassan', chambre: '2ème 33 S', soinsParSemaine: 5 }
  ],
  SC2: [
    { id: 16, nom: 'Mr Bernard René', chambre: '2ème 36 S', soinsParSemaine: 6 },
    { id: 17, nom: 'Mr Guy Robert', chambre: '2ème 37 S', soinsParSemaine: 6 }
  ],
  SG: [
    { id: 19, nom: 'Mme Salvayre', chambre: '2ème 40 S', soinsParSemaine: 3 },
    { id: 20, nom: 'Mme Tequi', chambre: '2ème 41 S', soinsParSemaine: 3 }
  ]
}
