export const mockPatients = [
  {
    id: 2,
    chambre: '1er 12 S',
    nom: 'Cormier',
    prenom: 'Elyane',
    etage: 1,
    statut: 'hospitalise',
    tempsToiletteLit: 15,
    tempsToiletteVasque: 20,
    tempsToiletteMoyen: 15,
    alertes: 2,
    asReferent: 'SE2',
    prochainSoin: { type: 'douche', jour: 'Lun', heure: '09h' },

    // Détails soins matin
    aideSoignant: true,
    petitDejeunerAide: true,
    commentairesMatin: '2 passages',

    // WC
    wc13h: true,
    wc16h: false,
    ngt: false,

    // Sieste
    miseSieste: true,
    leverSieste: true,

    // Couchers
    coucherHelios: '18h30',
    coucherSalle: null,
    tempsCoucherL: 10,
    tempsCoucherV: 5,

    // Planning douches semaine 19 (Lundi à Dimanche)
    douches: {
      lundi: 'SE2',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Commentaires/notes
    notes: [
      { id: 1, date: '2026-05-04', auteur: 'Sophie P.', contenu: 'Pb pour la douche', important: true },
      { id: 2, date: '2026-05-01', auteur: 'Sophie P.', contenu: '2 passages nécessaires le matin', important: false }
    ],

    // Historique
    historique: [
      { date: '2026-05-04T09:15', type: 'douche', as: 'SE2', statut: 'effectue' },
      { date: '2026-05-04T07:30', type: 'toilette', as: 'SE1', statut: 'effectue' },
      { date: '2026-05-01', type: 'note', contenu: '2 passages', statut: 'note' }
    ]
  },
  {
    id: 3,
    chambre: '1er 13 S',
    nom: 'Madoire',
    prenom: '',
    etage: 1,
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 0,
    alertes: 1,
    sansDouche: true,
    asReferent: null,
    prochainSoin: null,
    aideSoignant: false,
    petitDejeunerAide: false,
    commentairesMatin: '',
    wc13h: false,
    wc16h: false,
    ngt: false,
    miseSieste: false,
    leverSieste: false,
    coucherHelios: null,
    coucherSalle: null,
    tempsCoucherL: 0,
    tempsCoucherV: 0,
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 12,
    chambre: '1er 70 S',
    nom: 'Loup',
    prenom: '',
    etage: 1,
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 0,
    alertes: 2,
    sansDouche: true,
    asReferent: null,
    prochainSoin: null,
    aideSoignant: true,
    petitDejeunerAide: false,
    commentairesMatin: '"tombe" trop lourde pour lève-personne',
    wc13h: false,
    wc16h: false,
    ngt: false,
    miseSieste: false,
    leverSieste: false,
    coucherHelios: null,
    coucherSalle: null,
    tempsCoucherL: 0,
    tempsCoucherV: 0,
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [
      { id: 1, date: '2026-05-03', auteur: 'Sophie P.', contenu: '"tombe" trop lourde pour lève-personne', important: true }
    ],
    historique: []
  }
 
]