export const mockPatients = [
  {
    id: 2,
    chambre: '1er 12 S',
    nom: 'Cormier',
    prenom: 'Elyane',
    etage: 1,
    profil: 'profil4',
    categorie: 'cat2',
    statut: 'hospitalise',
    tempsToiletteLit: 15,
    tempsToiletteVasque: 20,
    tempsToiletteMoyen: 15,
    tempsWCMoyen: 15,
    tempsCoucherMoyen: 8,
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

    // Planning WC semaine 19
    wcs: {
      lundi: null,
      mardi: 'SE1',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: null,
      mardi: 'Léger inconfort le matin',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Planning Toilette semaine 19
    toilettes: {
      lundi: null,
      mardi: null,
      mercredi: 'SC1',
      jeudi: null,
      vendredi: 'SC1',
      samedi: 'SC1',
      dimanche: null
    },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: {
      lundi: null,
      mardi: null,
      mercredi: 'Toilette au lit - pas de vasque',
      jeudi: null,
      vendredi: 'Toilette à la vasque - mobilité normale',
      samedi: 'Toilette au lit - cliente fatiguée',
      dimanche: null
    },

    // Planning Coucher semaine 19
    couchers: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: 'SE2',
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Planning Repas semaine 19
    repas: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: 'SC2',
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
    prenom: 'Monique',
    etage: 1,
    profil: 'profil1',
    categorie: 'cat1',
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 0,
    tempsWCMoyen: 12,
    tempsCoucherMoyen: 6,
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

    // Planning WC semaine 19
    wcs: {
      lundi: null,
      mardi: 'SE2',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: null,
      mardi: 'Pas de problème',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Planning Toilette semaine 19
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },

    // Planning Coucher semaine 19
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },

    // Planning Repas semaine 19
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 12,
    chambre: '1er 70 S',
    nom: 'Loup',
    prenom: 'Robert',
    etage: 1,
    profil: 'profil14',
    categorie: 'cat5',
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 0,
    tempsWCMoyen: 20,
    tempsCoucherMoyen: 10,
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

    // Planning WC semaine 19
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },

    // Planning Toilette semaine 19
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },

    // Planning Coucher semaine 19
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },

    // Planning Repas semaine 19
    repas: {
      lundi: null,
      mardi: null,
      mercredi: 'SC1',
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },
    notes: [
      { id: 1, date: '2026-05-03', auteur: 'Sophie P.', contenu: '"tombe" trop lourde pour lève-personne', important: true }
    ],
    historique: []
  },
<<<<<<< Updated upstream
  // Patients supplémentaires 4-11, 13-20
  {
    id: 4,
    chambre: '1er 14 S',
    nom: 'Marysaël',
    prenom: 'Suzanne',
    etage: 1,
    profil: 'profil2',
    categorie: 'cat1',
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 10,
    tempsToiletteMoyen: 5,
    tempsWCMoyen: 10,
    tempsCoucherMoyen: 5,
    alertes: 0,
    asReferent: 'SE1',
    aideSoignant: false,
    petitDejeunerAide: false,
    wc13h: false,
    wc16h: false,
    ngt: false,
    miseSieste: false,
    leverSieste: false,
    coucherHelios: null,
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 5,
    chambre: '1er 15 S',
    nom: 'Boyer',
    prenom: 'Lucienne',
    etage: 1,
    profil: 'profil7',
    categorie: 'cat3',
    statut: 'hospitalise',
    tempsToiletteLit: 10,
    tempsToiletteVasque: 12,
    tempsToiletteMoyen: 10,
    tempsWCMoyen: 12,
    tempsCoucherMoyen: 8,
    alertes: 1,
    asReferent: 'SE2',
    aideSoignant: true,
    petitDejeunerAide: false,
    wc13h: true,
    wc16h: false,
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '19h00',
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 6,
    chambre: '1er 16 S',
    nom: 'Lopez',
    prenom: 'Maria',
    etage: 1,
    profil: 'profil11',
    categorie: 'cat4',
    statut: 'hospitalise',
    tempsToiletteLit: 20,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 18,
    tempsWCMoyen: 18,
    tempsCoucherMoyen: 12,
    alertes: 2,
    asReferent: 'SE1',
    aideSoignant: true,
    petitDejeunerAide: true,
    wc13h: true,
    wc16h: true,
    ngt: true,
    miseSieste: true,
    leverSieste: false,
    coucherHelios: '18h00',
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
=======
  {
    id: 5,
    chambre: '2e 24 N',
    nom: 'Bernard',
    prenom: 'Michel',
    etage: 2,
    statut: 'hospitalise',
    tempsToiletteLit: 20,
    tempsToiletteVasque: 25,
    tempsToiletteMoyen: 20,
    tempsWCMoyen: 18,
    tempsCoucherMoyen: 12,
    alertes: 1,
    asReferent: 'SE1',
    prochainSoin: { type: 'wc', jour: 'Mar', heure: '10h' },
    aideSoignant: true,
    petitDejeunerAide: false,
    commentairesMatin: '',
    wc13h: true,
    wc16h: true,
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '19h',
    coucherSalle: null,
    tempsCoucherL: 8,
    tempsCoucherV: 4,
    douches: {
      lundi: null,
      mardi: 'SE1',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },
    wcs: {
      lundi: null,
      mardi: 'SC2',
      mercredi: null,
      jeudi: 'SE1',
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: null,
      mardi: 'Transfert habituel',
      mercredi: null,
      jeudi: 'Transfert habituel',
      vendredi: null,
      samedi: null,
      dimanche: null
    },
    toilettes: {
      lundi: 'SE1',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: {
      lundi: 'Toilette à la vasque - transfert normal',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    couchers: {
      lundi: null,
      mardi: null,
      mercredi: 'SC1',
      jeudi: null,
      vendredi: 'SE1',
      samedi: null,
      dimanche: null
    },
    repas: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: 'SC2',
      dimanche: null
    },
>>>>>>> Stashed changes
    notes: [],
    historique: []
  },
  {
    id: 7,
<<<<<<< Updated upstream
    chambre: '1er 17 S',
    nom: 'Gence',
    prenom: 'Simone',
    etage: 1,
    profil: 'profil4',
    categorie: 'cat2',
    statut: 'hospitalise',
    tempsToiletteLit: 15,
    tempsToiletteVasque: 18,
    tempsToiletteMoyen: 16,
    tempsWCMoyen: 14,
    tempsCoucherMoyen: 9,
    alertes: 1,
    asReferent: 'SE1',
    aideSoignant: true,
    petitDejeunerAide: true,
    wc13h: true,
    wc16h: false,
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '19h00',
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 8,
    chambre: '1er 18 S',
    nom: 'Raby',
    prenom: 'Simone',
    etage: 1,
    profil: 'profil8',
    categorie: 'cat3',
    statut: 'hospitalise',
    tempsToiletteLit: 18,
    tempsToiletteVasque: 18,
    tempsToiletteMoyen: 16,
    tempsWCMoyen: 14,
    tempsCoucherMoyen: 9,
    alertes: 1,
    asReferent: 'SE1',
    aideSoignant: true,
    petitDejeunerAide: true,
    wc13h: true,
    wc16h: false,
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '19h30',
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
=======
    chambre: '2e 31 S',
    nom: 'Dubois',
    prenom: 'Chantal',
    etage: 2,
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 0,
    tempsWCMoyen: 25,
    tempsCoucherMoyen: 15,
    alertes: 3,
    sansDouche: true,
    asReferent: 'SC1',
    prochainSoin: { type: 'coucher', jour: 'Mer', heure: '20h' },
    aideSoignant: true,
    petitDejeunerAide: true,
    commentairesMatin: 'Vigilance requise',
    wc13h: true,
    wc16h: false,
    ngt: true,
    miseSieste: true,
    leverSieste: false,
    coucherHelios: '20h',
    coucherSalle: null,
    tempsCoucherL: 12,
    tempsCoucherV: 3,
    douches: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },
    wcs: {
      lundi: 'SC1',
      mardi: null,
      mercredi: 'SG',
      jeudi: null,
      vendredi: 'SC1',
      samedi: null,
      dimanche: null
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: 'Vigilance requise',
      mardi: null,
      mercredi: 'Vigilance requise',
      jeudi: null,
      vendredi: 'Vigilance requise - risque de chute',
      samedi: null,
      dimanche: null
    },
    toilettes: {
      lundi: null,
      mardi: 'SC1',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: {
      lundi: null,
      mardi: 'Toilette au lit - vigilance requise',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    couchers: {
      lundi: 'SC1',
      mardi: null,
      mercredi: 'SC1',
      jeudi: null,
      vendredi: null,
      samedi: 'SG',
      dimanche: null
    },
    repas: {
      lundi: null,
      mardi: 'SC1',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: 'SC1'
    },
    notes: [
      { id: 1, date: '2026-05-05', auteur: 'Dominique L.', contenu: 'Vigilance requise - antécédents', important: true }
    ],
>>>>>>> Stashed changes
    historique: []
  },
  {
    id: 9,
<<<<<<< Updated upstream
    chambre: '1er 19 S',
    nom: 'Tronca',
    prenom: 'Thérèse',
    etage: 1,
    profil: 'profil3',
    categorie: 'cat1',
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 10,
    tempsToiletteMoyen: 7,
=======
    chambre: '3e 15 N',
    nom: 'Rousseau',
    prenom: 'Jeannine',
    etage: 3,
    statut: 'hospitalise',
    tempsToiletteLit: 10,
    tempsToiletteVasque: 15,
    tempsToiletteMoyen: 10,
>>>>>>> Stashed changes
    tempsWCMoyen: 10,
    tempsCoucherMoyen: 5,
    alertes: 0,
    asReferent: 'SE2',
<<<<<<< Updated upstream
    aideSoignant: false,
    petitDejeunerAide: false,
=======
    prochainSoin: { type: 'toilette', jour: 'Jeu', heure: '14h' },
    aideSoignant: false,
    petitDejeunerAide: false,
    commentairesMatin: 'Autonome',
>>>>>>> Stashed changes
    wc13h: false,
    wc16h: false,
    ngt: false,
    miseSieste: false,
    leverSieste: false,
<<<<<<< Updated upstream
    coucherHelios: null,
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 10,
    chambre: '1er 20 S',
    nom: 'Vorillier',
    prenom: 'Odette',
    etage: 1,
    profil: 'profil13',
    categorie: 'cat5',
    statut: 'hospitalise',
    tempsToiletteLit: 28,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 24,
    tempsWCMoyen: 22,
    tempsCoucherMoyen: 18,
    alertes: 2,
    asReferent: 'SE2',
    aideSoignant: true,
    petitDejeunerAide: true,
    wc13h: true,
    wc16h: true,
    ngt: true,
    miseSieste: true,
    leverSieste: false,
    coucherHelios: '18h00',
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 11,
    chambre: '1er 21 S',
    nom: 'Baez',
    prenom: 'Francisca',
    etage: 1,
    profil: 'profil9',
    categorie: 'cat2',
    statut: 'hospitalise',
    tempsToiletteLit: 20,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 16,
    tempsWCMoyen: 16,
    tempsCoucherMoyen: 10,
    alertes: 1,
    asReferent: 'SC1',
    aideSoignant: true,
    petitDejeunerAide: true,
    wc13h: true,
    wc16h: false,
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '18h30',
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 13,
    chambre: '2ème 31 S',
    nom: 'Daydé',
    prenom: 'Thérèse',
    etage: 2,
    profil: 'profil5',
    categorie: 'cat3',
    statut: 'hospitalise',
    tempsToiletteLit: 16,
    tempsToiletteVasque: 16,
    tempsToiletteMoyen: 14,
    tempsWCMoyen: 12,
    tempsCoucherMoyen: 8,
    alertes: 0,
    asReferent: 'SC1',
    aideSoignant: true,
    petitDejeunerAide: true,
    wc13h: true,
    wc16h: false,
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '19h00',
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
=======
    coucherHelios: '21h',
    coucherSalle: null,
    tempsCoucherL: 3,
    tempsCoucherV: 2,
    douches: {
      lundi: null,
      mardi: null,
      mercredi: 'SE2',
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },
    wcs: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: 'SE2',
      dimanche: null
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: 'Autonome',
      dimanche: null
    },
    toilettes: {
      lundi: 'SE2',
      mardi: null,
      mercredi: null,
      jeudi: 'SE2',
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: {
      lundi: 'Toilette à la vasque - autonome',
      mardi: null,
      mercredi: null,
      jeudi: 'Toilette à la vasque - autonome',
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    couchers: {
      lundi: null,
      mardi: 'SE2',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: 'SE2'
    },
    repas: {
      lundi: 'SC2',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: 'SC2',
      samedi: null,
      dimanche: null
    },
>>>>>>> Stashed changes
    notes: [],
    historique: []
  },
  {
    id: 14,
<<<<<<< Updated upstream
    chambre: '2ème 32 S',
    nom: 'Cassan',
    prenom: 'Gabrielle',
    etage: 2,
    profil: 'profil1',
    categorie: 'cat1',
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 12,
    tempsToiletteMoyen: 8,
    tempsWCMoyen: 10,
    tempsCoucherMoyen: 5,
    alertes: 0,
    asReferent: 'SC1',
    aideSoignant: false,
    petitDejeunerAide: false,
    wc13h: false,
    wc16h: false,
    ngt: false,
    miseSieste: false,
    leverSieste: false,
    coucherHelios: null,
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 15,
    chambre: '2ème 33 S',
    nom: 'Bernard',
    prenom: 'René',
    etage: 2,
    profil: 'profil12',
    categorie: 'cat4',
    statut: 'hospitalise',
    tempsToiletteLit: 26,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 22,
    tempsWCMoyen: 20,
    tempsCoucherMoyen: 16,
    alertes: 2,
    asReferent: 'SC2',
    aideSoignant: true,
    petitDejeunerAide: true,
    wc13h: true,
    wc16h: true,
    ngt: true,
    miseSieste: true,
    leverSieste: false,
    coucherHelios: '18h00',
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 16,
    chambre: '2ème 36 S',
    nom: 'Guy',
    prenom: 'Robert',
    etage: 2,
    profil: 'profil6',
    categorie: 'cat2',
    statut: 'hospitalise',
    tempsToiletteLit: 18,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 14,
    tempsWCMoyen: 16,
    tempsCoucherMoyen: 10,
    alertes: 1,
    asReferent: 'SC2',
    aideSoignant: true,
    petitDejeunerAide: true,
    wc13h: true,
    wc16h: true,
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '19h00',
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 17,
    chambre: '2ème 37 S',
    nom: 'Conan',
    prenom: 'Anne-Marie',
    etage: 2,
    profil: 'profil2',
    categorie: 'cat1',
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 10,
    tempsToiletteMoyen: 7,
    tempsWCMoyen: 9,
    tempsCoucherMoyen: 5,
    alertes: 0,
    asReferent: 'SG',
    aideSoignant: false,
    petitDejeunerAide: false,
    wc13h: false,
    wc16h: false,
    ngt: false,
    miseSieste: false,
    leverSieste: false,
    coucherHelios: null,
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    notes: [],
    historique: []
  },
  {
    id: 18,
    chambre: '2ème 26 S',
    nom: 'Salvayre',
    prenom: 'Simone',
    etage: 2,
    profil: 'profil10',
    categorie: 'cat3',
    statut: 'hospitalise',
    tempsToiletteLit: 14,
    tempsToiletteVasque: 14,
    tempsToiletteMoyen: 13,
    tempsWCMoyen: 11,
    tempsCoucherMoyen: 7,
    alertes: 0,
    asReferent: 'SG',
    aideSoignant: true,
    petitDejeunerAide: true,
    wc13h: true,
    wc16h: false,
=======
    chambre: '3e 42 S',
    nom: 'Fournier',
    prenom: 'Claude',
    etage: 3,
    statut: 'hospitalise',
    tempsToiletteLit: 30,
    tempsToiletteVasque: 35,
    tempsToiletteMoyen: 30,
    tempsWCMoyen: 22,
    tempsCoucherMoyen: 18,
    alertes: 2,
    asReferent: 'SG',
    prochainSoin: { type: 'douche', jour: 'Ven', heure: '10h' },
    aideSoignant: true,
    petitDejeunerAide: true,
    commentairesMatin: 'Transfert difficile',
    wc13h: true,
    wc16h: true,
>>>>>>> Stashed changes
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '19h30',
<<<<<<< Updated upstream
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
=======
    coucherSalle: null,
    tempsCoucherL: 15,
    tempsCoucherV: 3,
    douches: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: 'SG',
      samedi: null,
      dimanche: null
    },
    wcs: {
      lundi: 'SG',
      mardi: null,
      mercredi: 'SG',
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: 'SG'
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: 'Transfert difficile - lève-personne obligatoire',
      mardi: null,
      mercredi: 'Transfert difficile - lève-personne obligatoire',
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: 'Transfert difficile - lève-personne obligatoire'
    },
    toilettes: {
      lundi: null,
      mardi: 'SG',
      mercredi: null,
      jeudi: 'SG',
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: {
      lundi: null,
      mardi: 'Toilette au lit - transfert difficile',
      mercredi: null,
      jeudi: 'Toilette au lit - transfert difficile',
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    couchers: {
      lundi: 'SG',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: 'SG',
      samedi: null,
      dimanche: null
    },
    repas: {
      lundi: null,
      mardi: 'SG',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: 'SG',
      dimanche: null
    },
    notes: [
      { id: 1, date: '2026-05-04', auteur: 'Dominique L.', contenu: 'Transfert difficile - utiliser lève-personne', important: true }
    ],
    historique: []
  },
  {
    id: 18,
    chambre: '1er 08 N',
    nom: 'Martin',
    prenom: 'Lucette',
    etage: 1,
    statut: 'hospitalise',
    tempsToiletteLit: 25,
    tempsToiletteVasque: 30,
    tempsToiletteMoyen: 25,
    tempsWCMoyen: 16,
    tempsCoucherMoyen: 9,
    alertes: 1,
    asReferent: 'SE1',
    prochainSoin: { type: 'douche', jour: 'Sam', heure: '09h' },
    aideSoignant: false,
    petitDejeunerAide: false,
    commentairesMatin: '',
    wc13h: true,
    wc16h: false,
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '21h',
    coucherSalle: null,
    tempsCoucherL: 5,
    tempsCoucherV: 4,
    douches: {
      lundi: 'SE1',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: 'SE1',
      dimanche: null
    },
    wcs: {
      lundi: null,
      mardi: 'SC2',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: 'SC2'
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: null,
      mardi: 'Normal',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: 'Normal'
    },
    toilettes: {
      lundi: null,
      mardi: null,
      mercredi: 'SE1',
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: {
      lundi: null,
      mardi: null,
      mercredi: 'Toilette à la vasque - normal',
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    couchers: {
      lundi: 'SE1',
      mardi: null,
      mercredi: null,
      jeudi: 'SE1',
      vendredi: null,
      samedi: null,
      dimanche: null
    },
    repas: {
      lundi: null,
      mardi: 'SC2',
      mercredi: null,
      jeudi: null,
      vendredi: 'SC2',
      samedi: null,
      dimanche: 'SC2'
    },
>>>>>>> Stashed changes
    notes: [],
    historique: []
  },
  {
<<<<<<< Updated upstream
    id: 19,
    chambre: '2ème 34 S',
    nom: 'Tequi',
    prenom: 'Simone',
    etage: 2,
    profil: 'profil3',
    categorie: 'cat1',
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 10,
    tempsToiletteMoyen: 7,
    tempsWCMoyen: 9,
    tempsCoucherMoyen: 5,
    alertes: 0,
    asReferent: 'SG',
    aideSoignant: false,
    petitDejeunerAide: false,
=======
    id: 21,
    chambre: '2e 05 S',
    nom: 'Moreau',
    prenom: 'Simone',
    etage: 2,
    statut: 'hospitalise',
    tempsToiletteLit: 0,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 0,
    tempsWCMoyen: 30,
    tempsCoucherMoyen: 20,
    alertes: 4,
    sansDouche: true,
    asReferent: 'SC1',
    prochainSoin: { type: 'wc', jour: 'Lun', heure: '08h' },
    aideSoignant: true,
    petitDejeunerAide: true,
    commentairesMatin: 'Vigilance et aide requises',
    wc13h: true,
    wc16h: true,
    ngt: true,
    miseSieste: false,
    leverSieste: false,
    coucherHelios: '20h',
    coucherSalle: null,
    tempsCoucherL: 18,
    tempsCoucherV: 2,
    douches: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },
    wcs: {
      lundi: 'SC1',
      mardi: 'SC1',
      mercredi: null,
      jeudi: 'SC1',
      vendredi: null,
      samedi: 'SC1',
      dimanche: 'SC1'
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: 'Surveillance accrue - risque de chute',
      mardi: 'Surveillance accrue - risque de chute',
      mercredi: null,
      jeudi: 'Surveillance accrue - risque de chute',
      vendredi: null,
      samedi: 'Surveillance accrue - risque de chute',
      dimanche: 'Surveillance accrue - risque de chute'
    },
    toilettes: {
      lundi: null,
      mardi: null,
      mercredi: 'SC1',
      jeudi: null,
      vendredi: 'SC1',
      samedi: null,
      dimanche: null
    },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: {
      lundi: null,
      mardi: null,
      mercredi: 'Toilette au lit - surveillance accrue',
      jeudi: null,
      vendredi: 'Toilette au lit - surveillance accrue',
      samedi: null,
      dimanche: null
    },

    couchers: {
      lundi: 'SC1',
      mardi: null,
      mercredi: 'SC1',
      jeudi: null,
      vendredi: 'SC1',
      samedi: null,
      dimanche: 'SC1'
    },
    repas: {
      lundi: 'SC1',
      mardi: null,
      mercredi: null,
      jeudi: 'SC1',
      vendredi: null,
      samedi: 'SC1',
      dimanche: null
    },
    notes: [
      { id: 1, date: '2026-05-05', auteur: 'Sophie P.', contenu: 'Vigilance accrue - risque de chute', important: true },
      { id: 2, date: '2026-05-02', auteur: 'Dominique L.', contenu: 'Aide requise pour transferts', important: true }
    ],
    historique: []
  },
  {
    id: 25,
    chambre: '3e 20 N',
    nom: 'Leclerc',
    prenom: 'Georges',
    etage: 3,
    statut: 'hospitalise',
    tempsToiletteLit: 18,
    tempsToiletteVasque: 22,
    tempsToiletteMoyen: 18,
    tempsWCMoyen: 14,
    tempsCoucherMoyen: 7,
    alertes: 0,
    asReferent: 'SE2',
    prochainSoin: { type: 'toilette', jour: 'Mar', heure: '15h' },
    aideSoignant: false,
    petitDejeunerAide: false,
    commentairesMatin: 'Autonome - bon moral',
>>>>>>> Stashed changes
    wc13h: false,
    wc16h: false,
    ngt: false,
    miseSieste: false,
    leverSieste: false,
<<<<<<< Updated upstream
    coucherHelios: null,
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
=======
    coucherHelios: '21h30',
    coucherSalle: null,
    tempsCoucherL: 4,
    tempsCoucherV: 3,
    douches: {
      lundi: null,
      mardi: 'SE2',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: 'SE2'
    },
    wcs: {
      lundi: 'SE2',
      mardi: null,
      mercredi: null,
      jeudi: 'SE2',
      vendredi: null,
      samedi: null,
      dimanche: null
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: 'Autonome',
      mardi: null,
      mercredi: null,
      jeudi: 'Autonome',
      vendredi: null,
      samedi: null,
      dimanche: null
    },
    toilettes: {
      lundi: null,
      mardi: 'SE2',
      mercredi: null,
      jeudi: null,
      vendredi: 'SE2',
      samedi: null,
      dimanche: null
    },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: {
      lundi: null,
      mardi: 'Toilette à la vasque - mobilité réduite',
      mercredi: null,
      jeudi: null,
      vendredi: 'Toilette à la vasque - mobilité réduite',
      samedi: null,
      dimanche: null
    },

    couchers: {
      lundi: null,
      mardi: null,
      mercredi: 'SE2',
      jeudi: null,
      vendredi: null,
      samedi: 'SE2',
      dimanche: null
    },
    repas: {
      lundi: 'SC2',
      mardi: null,
      mercredi: null,
      jeudi: 'SC2',
      vendredi: null,
      samedi: null,
      dimanche: 'SC2'
    },
>>>>>>> Stashed changes
    notes: [],
    historique: []
  },
  {
<<<<<<< Updated upstream
    id: 20,
    chambre: '2ème 41 S',
    nom: 'André',
    prenom: 'Michel',
    etage: 2,
    profil: 'profil11',
    categorie: 'cat4',
    statut: 'hospitalise',
    tempsToiletteLit: 22,
    tempsToiletteVasque: 0,
    tempsToiletteMoyen: 18,
    tempsWCMoyen: 18,
    tempsCoucherMoyen: 14,
    alertes: 1,
    asReferent: 'SG',
    aideSoignant: true,
    petitDejeunerAide: true,
    wc13h: true,
    wc16h: true,
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '18h30',
    douches: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    wcs: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    toilettes: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    couchers: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
    repas: { lundi: null, mardi: null, mercredi: null, jeudi: null, vendredi: null, samedi: null, dimanche: null },
=======
    id: 28,
    chambre: '2e 40 S',
    nom: 'Dupont',
    prenom: 'Yvonne',
    etage: 2,
    statut: 'hospitalise',
    tempsToiletteLit: 35,
    tempsToiletteVasque: 40,
    tempsToiletteMoyen: 35,
    tempsWCMoyen: 28,
    tempsCoucherMoyen: 16,
    alertes: 3,
    asReferent: 'SG',
    prochainSoin: { type: 'douche', jour: 'Jeu', heure: '09h' },
    aideSoignant: true,
    petitDejeunerAide: true,
    commentairesMatin: 'Mobilité réduite',
    wc13h: true,
    wc16h: false,
    ngt: true,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '19h',
    coucherSalle: null,
    tempsCoucherL: 14,
    tempsCoucherV: 2,
    douches: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: 'SG',
      vendredi: null,
      samedi: null,
      dimanche: null
    },
    wcs: {
      lundi: 'SG',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: 'SG',
      samedi: null,
      dimanche: null
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: 'Mobilité réduite - surveillance',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: 'Mobilité réduite - surveillance',
      samedi: null,
      dimanche: null
    },
    toilettes: {
      lundi: null,
      mardi: 'SG',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: 'SG',
      dimanche: null
    },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: {
      lundi: null,
      mardi: 'Toilette au lit - mobilité réduite',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: 'Toilette au lit - mobilité réduite',
      dimanche: null
    },

    couchers: {
      lundi: 'SG',
      mardi: null,
      mercredi: 'SG',
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: 'SG'
    },
    repas: {
      lundi: null,
      mardi: 'SG',
      mercredi: null,
      jeudi: null,
      vendredi: 'SG',
      samedi: null,
      dimanche: null
    },
    notes: [
      { id: 1, date: '2026-05-04', auteur: 'Dominique L.', contenu: 'Mobilité réduite - surveillance continue', important: true }
    ],
    historique: []
  },
  {
    id: 31,
    chambre: '1er 22 N',
    nom: 'Garnier',
    prenom: 'Philippe',
    etage: 1,
    statut: 'hospitalise',
    tempsToiletteLit: 12,
    tempsToiletteVasque: 16,
    tempsToiletteMoyen: 12,
    tempsWCMoyen: 11,
    tempsCoucherMoyen: 6,
    alertes: 1,
    asReferent: 'SC2',
    prochainSoin: { type: 'douche', jour: 'Mer', heure: '10h' },
    aideSoignant: false,
    petitDejeunerAide: false,
    commentairesMatin: '',
    wc13h: false,
    wc16h: false,
    ngt: false,
    miseSieste: true,
    leverSieste: true,
    coucherHelios: '21h',
    coucherSalle: null,
    tempsCoucherL: 3,
    tempsCoucherV: 3,
    douches: {
      lundi: null,
      mardi: null,
      mercredi: 'SC2',
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null
    },
    wcs: {
      lundi: 'SC2',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: 'SC2',
      samedi: null,
      dimanche: null
    },

    // Commentaires WC semaine 19
    wcsCommentaires: {
      lundi: 'Normal',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: 'Normal',
      samedi: null,
      dimanche: null
    },
    toilettes: {
      lundi: null,
      mardi: 'SC2',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: 'SC2',
      dimanche: null
    },

    // Commentaires Toilette semaine 19
    toilettesCommentaires: {
      lundi: null,
      mardi: 'Toilette à la vasque - autonome',
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: 'Toilette à la vasque - autonome',
      dimanche: null
    },

    couchers: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: 'SC2',
      vendredi: null,
      samedi: null,
      dimanche: 'SC2'
    },
    repas: {
      lundi: 'SC2',
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: 'SC2'
    },
>>>>>>> Stashed changes
    notes: [],
    historique: []
  }
]