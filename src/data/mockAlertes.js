export const mockAlertes = [
  {
    id: 1,
    patientId: 12,
    patientNom: 'Mme Loup',
    chambre: '1er 70 S',
    type: 'douche_manquante',
    niveau: 'critique',
    message: 'Aucune douche planifiée cette semaine'
  },
  {
    id: 2,
    patientId: 3,
    patientNom: 'Mr Madoire',
    chambre: '1er 13 S',
    type: 'douche_manquante',
    niveau: 'critique',
    message: 'Aucune douche planifiée cette semaine'
  },
  {
    id: 3,
    patientId: null,
    patientNom: 'SE2',
    chambre: '',
    type: 'as_surcharge',
    niveau: 'moyen',
    message: 'SE2 surchargé (130min vs 69min moyenne)'
  }
]