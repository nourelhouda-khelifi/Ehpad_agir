// KPIs principaux
export const mockStatsKPI = {
  semaine: {
    totalSoins: 847,
    soinsPrecedent: 756,
    tauxCompletion: 94,
    tauxPrecedent: 91,
    tempsMoyen: 17,
    tempsMoyenRef: 15,
    equilibreCharge: 73,
    equilibrePrecedent: 68
  },
  mois: {
    totalSoins: 3420,
    soinsPrecedent: 3280,
    tauxCompletion: 92,
    tauxPrecedent: 89,
    tempsMoyen: 18,
    tempsMoyenRef: 15,
    equilibreCharge: 70,
    equilibrePrecedent: 65
  },
  trimestre: {
    totalSoins: 10250,
    soinsPrecedent: 9800,
    tauxCompletion: 91,
    tauxPrecedent: 88,
    tempsMoyen: 18,
    tempsMoyenRef: 15,
    equilibreCharge: 68,
    equilibrePrecedent: 62
  }
}

// Charge des AS sur la semaine (pour graphique en barres)
export const mockChargeASSemaine = {
  jours: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  data: {
    SE1: [60, 80, 65, 110, 75, 25, 20],
    SE2: [130, 125, 95, 130, 100, 40, 35],
    SC1: [70, 60, 65, 55, 30, 20, 15],
    SC2: [50, 35, 60, 30, 25, 20, 15],
    SG: [25, 20, 45, 25, 30, 15, 10]
  }
}

// Répartition par type de soin
export const mockRepartitionSoins = [
  { label: 'Toilettes', count: 340, percentage: 40, color: '#378ADD' },
  { label: 'Douches', count: 212, percentage: 25, color: '#1D9E75' },
  { label: 'Repas', count: 169, percentage: 20, color: '#EF9F27' },
  { label: 'Couchers', count: 126, percentage: 15, color: '#7F77DD' }
]

// Top 5 patients les plus suivis
export const mockTopPatients = [
  { id: 16, nom: 'Mr Bernard René', chambre: '2ème 36 S', nbSoins: 28, evolution: 2 },
  { id: 17, nom: 'Mr Guy Robert', chambre: '2ème 37 S', nbSoins: 26, evolution: -1 },
  { id: 11, nom: 'Mme Vorillier Odette', chambre: '1er 21 S', nbSoins: 24, evolution: 3 },
  { id: 18, nom: 'Mme Conan Anne-Marie', chambre: '2ème 26 S', nbSoins: 22, evolution: 0 },
  { id: 19, nom: 'Mme Frances Aline', chambre: '2ème 34 S', nbSoins: 20, evolution: 1 }
]

// Évolution sur 4 semaines
export const mockEvolution = [
  { semaine: 'S16', value: 720 },
  { semaine: 'S17', value: 765 },
  { semaine: 'S18', value: 810 },
  { semaine: 'S19', value: 847 }
]
