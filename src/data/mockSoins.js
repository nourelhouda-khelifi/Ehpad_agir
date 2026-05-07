// Données mockées des soins planifiés par patient
// Semaine 19 : 11-17 mai 2026 (Lun-Dim)

export const mockSoinsByPatient = {
  // Patient 2 : Cormier Elyane - 1 seule douche lundi (alerte)
  2: {
    douches: [
      { jour: 'lundi', date: '11/05', as: 'SE2', heure: '09h00', duree: 20, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 15,
      tempsVasque: 20,
      tempsMoyen: 17,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: true,
      ngt: false
    },
    sieste: {
      miseSieste: '13h30',
      leverSieste: '15h00'
    },
    couchers: {
      helios: '18h30',
      salle: '19h30'
    },
    commentaires: [
      { id: 1, contenu: '2 passages nécessaires pour toilette', date: '01/05/2026', important: false },
      { id: 2, contenu: 'Problèmes de mobilité - lever difficile', date: '04/05/2026', important: true }
    ],
    historique: [
      { id: 1, type: 'douche', as: 'SE2', date: 'Lundi 4 mai', heure: '09h15', statut: 'effectue' },
      { id: 2, type: 'toilette', as: 'SE2', date: 'Lundi 4 mai', heure: '07h30', statut: 'effectue' },
      { id: 3, type: 'wc', as: 'SE2', date: 'Mardi 5 mai', heure: '13h45', statut: 'effectue' }
    ]
  },

  // Patient 3 : Madoire - AUCUNE douche (alerte)
  3: {
    douches: [],
    soinsMatin: {
      tempsLit: 0,
      tempsVasque: 0,
      tempsMoyen: 0,
      aideSoignant: false,
      petitDejeuner: 'autonome'
    },
    wc: {
      wc13h: false,
      wc16h: false,
      ngt: false
    },
    sieste: {
      miseSieste: null,
      leverSieste: null
    },
    couchers: {
      helios: null,
      salle: null
    },
    commentaires: [
      { id: 1, contenu: 'Patient refusant les soins', date: '03/05/2026', important: true },
      { id: 2, contenu: 'À prévoir entretien avec la famille', date: '02/05/2026', important: true }
    ],
    historique: [
      { id: 1, type: 'note', as: 'Infirmière', date: 'Vendredi 1 mai', heure: '10h30', statut: 'note' }
    ]
  },

  // Patient 4 : Marysaël Jacqueline - douches planifiées
  4: {
    douches: [
      { jour: 'lundi', date: '11/05', as: 'SE2', heure: '10h00', duree: 25, statut: 'planifie' },
      { jour: 'jeudi', date: '14/05', as: 'SE2', heure: '09h30', duree: 25, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 20,
      tempsVasque: 25,
      tempsMoyen: 22,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: true,
      ngt: true
    },
    sieste: {
      miseSieste: '13h00',
      leverSieste: '14h30'
    },
    couchers: {
      helios: '18h00',
      salle: '19h00'
    },
    commentaires: [
      { id: 1, contenu: 'Patient stable', date: '05/05/2026', important: false }
    ],
    historique: [
      { id: 1, type: 'douche', as: 'SE2', date: 'Lundi 4 mai', heure: '10h00', statut: 'effectue' },
      { id: 2, type: 'toilette', as: 'SE2', date: 'Lundi 4 mai', heure: '07h45', statut: 'effectue' },
      { id: 3, type: 'wc', as: 'SE2', date: 'Mardi 5 mai', heure: '13h30', statut: 'effectue' }
    ]
  },

  // Patient 5 : Boyer Jeanine
  5: {
    douches: [
      { jour: 'vendredi', date: '15/05', as: 'SE2', heure: '09h00', duree: 20, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 0,
      tempsVasque: 0,
      tempsMoyen: 0,
      aideSoignant: false,
      petitDejeuner: 'autonome'
    },
    wc: {
      wc13h: true,
      wc16h: false,
      ngt: false
    },
    sieste: {
      miseSieste: '14h00',
      leverSieste: '15h30'
    },
    couchers: {
      helios: '19h00',
      salle: '20h00'
    },
    commentaires: [
      { id: 1, contenu: 'À appeler famille avant douche', date: '30/04/2026', important: true }
    ],
    historique: [
      { id: 1, type: 'douche', as: 'SE2', date: 'Vendredi 1 mai', heure: '09h00', statut: 'effectue' }
    ]
  },

  // Patient 6 : Lopez
  6: {
    douches: [
      { jour: 'lundi', date: '11/05', as: 'SE1', heure: '08h00', duree: 20, statut: 'planifie' },
      { jour: 'mercredi', date: '13/05', as: 'SE1', heure: '08h00', duree: 20, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 15,
      tempsVasque: 20,
      tempsMoyen: 17,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: true,
      ngt: false
    },
    sieste: {
      miseSieste: '13h30',
      leverSieste: '15h00'
    },
    couchers: {
      helios: '18h30',
      salle: '19h30'
    },
    commentaires: [],
    historique: [
      { id: 1, type: 'douche', as: 'SE1', date: 'Lundi 4 mai', heure: '08h00', statut: 'effectue' }
    ]
  },

  // Patient 7 : Gence Simone
  7: {
    douches: [
      { jour: 'lundi', date: '11/05', as: 'SE1', heure: '09h00', duree: 15, statut: 'planifie' },
      { jour: 'mardi', date: '12/05', as: 'SE1', heure: '09h00', duree: 15, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 5,
      tempsVasque: 10,
      tempsMoyen: 7,
      aideSoignant: false,
      petitDejeuner: 'autonome'
    },
    wc: {
      wc13h: true,
      wc16h: false,
      ngt: false
    },
    sieste: {
      miseSieste: '14h00',
      leverSieste: '15h30'
    },
    couchers: {
      helios: '20h00',
      salle: '20h30'
    },
    commentaires: [
      { id: 1, contenu: 'Patient autonome, peu d\'aide', date: '05/05/2026', important: false }
    ],
    historique: [
      { id: 1, type: 'douche', as: 'SE1', date: 'Lundi 4 mai', heure: '09h00', statut: 'effectue' }
    ]
  },

  // Patient 8 : Culié
  8: {
    douches: [],
    soinsMatin: {
      tempsLit: 0,
      tempsVasque: 0,
      tempsMoyen: 0,
      aideSoignant: false,
      petitDejeuner: 'autonome'
    },
    wc: {
      wc13h: false,
      wc16h: false,
      ngt: false
    },
    sieste: {
      miseSieste: null,
      leverSieste: null
    },
    couchers: {
      helios: null,
      salle: null
    },
    commentaires: [],
    historique: []
  },

  // Patient 9 : Raby
  9: {
    douches: [
      { jour: 'mardi', date: '12/05', as: 'SE1', heure: '10h00', duree: 20, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 15,
      tempsVasque: 20,
      tempsMoyen: 17,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: true,
      ngt: false
    },
    sieste: {
      miseSieste: '13h30',
      leverSieste: '15h00'
    },
    couchers: {
      helios: '18h30',
      salle: '19h30'
    },
    commentaires: [],
    historique: [
      { id: 1, type: 'toilette', as: 'SE1', date: 'Lundi 4 mai', heure: '07h30', statut: 'effectue' }
    ]
  },

  // Patient 10 : Tronca
  10: {
    douches: [
      { jour: 'lundi', date: '11/05', as: 'SE2', heure: '09h00', duree: 20, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 15,
      tempsVasque: 15,
      tempsMoyen: 15,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: false,
      wc16h: true,
      ngt: false
    },
    sieste: {
      miseSieste: '13h30',
      leverSieste: '15h00'
    },
    couchers: {
      helios: '18h30',
      salle: '19h30'
    },
    commentaires: [],
    historique: []
  },

  // Patient 11 : Vorillier Odette
  11: {
    douches: [
      { jour: 'lundi', date: '11/05', as: 'SE2', heure: '09h30', duree: 25, statut: 'planifie' },
      { jour: 'jeudi', date: '14/05', as: 'SE2', heure: '09h30', duree: 25, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 25,
      tempsVasque: 20,
      tempsMoyen: 22,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: true,
      ngt: true
    },
    sieste: {
      miseSieste: '13h00',
      leverSieste: '14h30'
    },
    couchers: {
      helios: '18h00',
      salle: '19h00'
    },
    commentaires: [
      { id: 1, contenu: 'Patient stable et coopérant', date: '05/05/2026', important: false }
    ],
    historique: [
      { id: 1, type: 'douche', as: 'SE2', date: 'Lundi 4 mai', heure: '09h30', statut: 'effectue' },
      { id: 2, type: 'toilette', as: 'SE2', date: 'Lundi 4 mai', heure: '07h45', statut: 'effectue' }
    ]
  },

  // Patient 12 : Loup - AUCUNE douche (alerte)
  12: {
    douches: [],
    soinsMatin: {
      tempsLit: 0,
      tempsVasque: 0,
      tempsMoyen: 0,
      aideSoignant: false,
      petitDejeuner: 'autonome'
    },
    wc: {
      wc13h: false,
      wc16h: false,
      ngt: false
    },
    sieste: {
      miseSieste: null,
      leverSieste: null
    },
    couchers: {
      helios: null,
      salle: null
    },
    commentaires: [
      { id: 1, contenu: 'Patient refusant les soins depuis 2 semaines', date: '02/05/2026', important: true },
      { id: 2, contenu: 'Entretien famille prévu mercredi', date: '05/05/2026', important: true }
    ],
    historique: []
  },

  // Patient 13 : Baez Paulette
  13: {
    douches: [
      { jour: 'lundi', date: '11/05', as: 'SC1', heure: '10h00', duree: 25, statut: 'planifie' },
      { jour: 'mardi', date: '12/05', as: 'SC1', heure: '10h00', duree: 25, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 15,
      tempsVasque: 25,
      tempsMoyen: 20,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: true,
      ngt: false
    },
    sieste: {
      miseSieste: '13h30',
      leverSieste: '15h00'
    },
    couchers: {
      helios: '18h30',
      salle: '19h30'
    },
    commentaires: [],
    historique: []
  },

  // Patient 14 : Daydé
  14: {
    douches: [
      { jour: 'mardi', date: '12/05', as: 'SC1', heure: '10h00', duree: 20, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 20,
      tempsVasque: 20,
      tempsMoyen: 20,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: false,
      ngt: false
    },
    sieste: {
      miseSieste: '14h00',
      leverSieste: '15h30'
    },
    couchers: {
      helios: '19h00',
      salle: '20h00'
    },
    commentaires: [],
    historique: []
  },

  // Patient 15 : Cassan
  15: {
    douches: [
      { jour: 'mercredi', date: '13/05', as: 'SC1', heure: '09h00', duree: 20, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 15,
      tempsVasque: 10,
      tempsMoyen: 12,
      aideSoignant: false,
      petitDejeuner: 'autonome'
    },
    wc: {
      wc13h: true,
      wc16h: false,
      ngt: false
    },
    sieste: {
      miseSieste: '14h00',
      leverSieste: '15h30'
    },
    couchers: {
      helios: '19h30',
      salle: '20h30'
    },
    commentaires: [],
    historique: []
  },

  // Patient 16 : Bernard René
  16: {
    douches: [
      { jour: 'lundi', date: '11/05', as: 'SC2', heure: '09h00', duree: 30, statut: 'planifie' },
      { jour: 'vendredi', date: '15/05', as: 'SC2', heure: '09h00', duree: 30, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 25,
      tempsVasque: 30,
      tempsMoyen: 27,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: true,
      ngt: true
    },
    sieste: {
      miseSieste: '13h00',
      leverSieste: '14h30'
    },
    couchers: {
      helios: '18h00',
      salle: '19h00'
    },
    commentaires: [
      { id: 1, contenu: 'Patient très coopérant', date: '05/05/2026', important: false }
    ],
    historique: []
  },

  // Patient 17 : Guy Robert
  17: {
    douches: [
      { jour: 'mardi', date: '12/05', as: 'SC2', heure: '11h00', duree: 30, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 30,
      tempsVasque: 20,
      tempsMoyen: 25,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: true,
      ngt: false
    },
    sieste: {
      miseSieste: '13h30',
      leverSieste: '15h00'
    },
    couchers: {
      helios: '18h30',
      salle: '19h30'
    },
    commentaires: [
      { id: 1, contenu: 'Vérifier tension avant douche', date: '03/05/2026', important: true }
    ],
    historique: []
  },

  // Patient 18 : Ibanez Maria
  18: {
    douches: [
      { jour: 'lundi', date: '11/05', as: 'SC2', heure: '08h00', duree: 20, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 15,
      tempsVasque: 20,
      tempsMoyen: 17,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: false,
      ngt: false
    },
    sieste: {
      miseSieste: '14h00',
      leverSieste: '15h30'
    },
    couchers: {
      helios: '19h00',
      salle: '20h00'
    },
    commentaires: [],
    historique: []
  },

  // Patient 19 : Salvayre Marie
  19: {
    douches: [
      { jour: 'mercredi', date: '13/05', as: 'SG', heure: '10h00', duree: 30, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 30,
      tempsVasque: 30,
      tempsMoyen: 30,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: true,
      ngt: true
    },
    sieste: {
      miseSieste: '13h00',
      leverSieste: '14h30'
    },
    couchers: {
      helios: '18h00',
      salle: '19h00'
    },
    commentaires: [],
    historique: []
  },

  // Patient 20 : Tequi Paulette
  20: {
    douches: [
      { jour: 'lundi', date: '11/05', as: 'SG', heure: '09h00', duree: 20, statut: 'planifie' },
      { jour: 'jeudi', date: '14/05', as: 'SG', heure: '09h00', duree: 20, statut: 'planifie' }
    ],
    soinsMatin: {
      tempsLit: 20,
      tempsVasque: 20,
      tempsMoyen: 20,
      aideSoignant: true,
      petitDejeuner: 'avec aide'
    },
    wc: {
      wc13h: true,
      wc16h: true,
      ngt: false
    },
    sieste: {
      miseSieste: '13h30',
      leverSieste: '15h00'
    },
    couchers: {
      helios: '18h30',
      salle: '19h30'
    },
    commentaires: [],
    historique: []
  }
}

// Soins planifiés pour le mercredi 13 mai 2026 (vue quotidienne par AS)
export const mockSoinsJour = [
  // SE1 — Secteur Est 1 (charge légère)
  { id: 1, asCode: 'SE1', patientId: 6, patientNom: 'Mme Lopez', chambre: '1er 16 S', type: 'toilette', heure: '07:30', duree: 15 },
  { id: 2, asCode: 'SE1', patientId: 9, patientNom: 'Mme Raby', chambre: '1er 19 S', type: 'toilette', heure: '08:00', duree: 20 },
  { id: 3, asCode: 'SE1', patientId: 7, patientNom: 'Mme Gence Simone', chambre: '1er 17 S', type: 'toilette', heure: '08:30', duree: 10 },
  { id: 4, asCode: 'SE1', patientId: 10, patientNom: 'Mme Cavailles J.', chambre: '1er 23 S', type: 'douche', heure: '09:00', duree: 25 },
  { id: 5, asCode: 'SE1', patientId: 8, patientNom: 'Mme Toulouse', chambre: '1er 22 S', type: 'repas', heure: '12:00', duree: 15 },

  // SE2 — Secteur Est 2 (SURCHARGÉ)
  { id: 6, asCode: 'SE2', patientId: 2, patientNom: 'Mme Cormier', chambre: '1er 12 S', type: 'toilette', heure: '07:15', duree: 15 },
  { id: 7, asCode: 'SE2', patientId: 4, patientNom: 'Mme Marysaël', chambre: '1er 14 S', type: 'toilette', heure: '07:45', duree: 25 },
  { id: 8, asCode: 'SE2', patientId: 5, patientNom: 'Mme Boyer', chambre: '1er 15 S', type: 'douche', heure: '09:00', duree: 20 },
  { id: 9, asCode: 'SE2', patientId: 10, patientNom: 'Mme Tronca', chambre: '1er 20 S', type: 'wc', heure: '14:00', duree: 10 },
  { id: 10, asCode: 'SE2', patientId: 11, patientNom: 'Mme Vorillier', chambre: '1er 21 S', type: 'coucher', heure: '19:00', duree: 15 },
  { id: 11, asCode: 'SE2', patientId: 9, patientNom: 'Mme Raby', chambre: '1er 19 S', type: 'wc', heure: '16:00', duree: 10 },

  // SC1 — Secteur Centre 1
  { id: 12, asCode: 'SC1', patientId: 17, patientNom: 'Mme Imart', chambre: '2ème 02P', type: 'toilette', heure: '07:30', duree: 10 },
  { id: 13, asCode: 'SC1', patientId: 13, patientNom: 'Mme Baez', chambre: '2ème 31 S', type: 'douche', heure: '10:00', duree: 15 },
  { id: 14, asCode: 'SC1', patientId: 15, patientNom: 'Mme Cassan', chambre: '2ème 33 S', type: 'wc', heure: '13:00', duree: 10 },

  // SC2 — Secteur Centre 2
  { id: 15, asCode: 'SC2', patientId: 14, patientNom: 'Mme Daydé', chambre: '2ème 32 S', type: 'toilette', heure: '08:00', duree: 20 },
  { id: 16, asCode: 'SC2', patientId: 16, patientNom: 'Mr Bernard René', chambre: '2ème 36 S', type: 'repas', heure: '12:00', duree: 15 },

  // SG — Secteur Général
  { id: 17, asCode: 'SG', patientId: 3, patientNom: 'Mr Madoire', chambre: '1er 13 S', type: 'toilette', heure: '07:00', duree: 15 },
  { id: 18, asCode: 'SG', patientId: 12, patientNom: 'Mme Loup', chambre: '1er 70 S', type: 'coucher', heure: '19:30', duree: 10 }
]

// Configuration des types de soins avec icônes et couleurs
export const TYPES_SOINS = {
  toilette: { label: 'Toilette', icon: '🚿', color: '#378ADD', bgColor: '#E6F1FB' },
  douche: { label: 'Douche', icon: '🛁', color: '#1D9E75', bgColor: '#E1F5EE' },
  wc: { label: 'WC', icon: '🚽', color: '#7F77DD', bgColor: '#EEEDF9' },
  repas: { label: 'Repas', icon: '🍽️', color: '#EF9F27', bgColor: '#FAEEDA' },
  coucher: { label: 'Coucher', icon: '🌙', color: '#854F0B', bgColor: '#FAEEDA' }
}
