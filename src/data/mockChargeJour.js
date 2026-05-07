// Charge en minutes par AS et par jour de la semaine 19
export const mockChargeJour = {
  SE1: { lundi: 60, mardi: 80, mercredi: 65, jeudi: 110, vendredi: 75, samedi: 25, dimanche: 20 },
  SE2: { lundi: 130, mardi: 125, mercredi: 95, jeudi: 130, vendredi: 100, samedi: 40, dimanche: 35 },
  SC1: { lundi: 70, mardi: 60, mercredi: 65, jeudi: 55, vendredi: 30, samedi: 20, dimanche: 15 },
  SC2: { lundi: 50, mardi: 35, mercredi: 60, jeudi: 30, vendredi: 25, samedi: 20, dimanche: 15 },
  SG: { lundi: 25, mardi: 20, mercredi: 45, jeudi: 25, vendredi: 30, samedi: 15, dimanche: 10 }
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
