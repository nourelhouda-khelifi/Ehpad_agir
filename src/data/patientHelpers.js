import { mockPatients } from './mockPatients.js'

const defaultDetails = {
  tempsToiletteMoyen: 0,
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
}

export const getPatientById = (id) => {
  const patient = mockPatients.find(p => p.id === parseInt(id))
  if (!patient) return null
  return { ...defaultDetails, ...patient }
}