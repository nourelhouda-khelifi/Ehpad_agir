// 4 Catégories avec 14 profils détaillés (aligné avec le backend)
export const PATIENT_CATEGORIES = {

  NON_DEFINI: {
    id: 'NON_DEFINI',
    label: 'Non défini',
    color: '#9CA3AF',
    bgColor: 'rgba(156, 163, 175, 0.1)',
    borderColor: '#6B7280',
    icon: '🔹',
    description: 'Catégorie non définie'
  },

  CAT1: {
    id: 'CAT1',
    label: 'Catégorie 1',
    color: '#9CA3AF',
    bgColor: 'rgba(156, 163, 175, 0.1)',
    borderColor: '#6B7280',
    icon: '🚶',
    description: 'Atteinte aux tâches domestiques seulement'
  },
  CAT2: {
    id: 'CAT2',
    label: 'Catégorie 2',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: '#D97706',
    icon: '🤝',
    description: 'Atteinte motrice prédominante'
  },
  CAT3: {
    id: 'CAT3',
    label: 'Catégorie 3',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#1D4ED8',
    icon: '🧠',
    description: 'Atteinte mentale prédominante'
  },
  CAT4: {
    id: 'CAT4',
    label: 'Catégorie 4',
    color: '#D4AF8F',
    bgColor: 'rgba(212, 175, 143, 0.1)',
    borderColor: '#A0826D',
    icon: '⚠️',
    description: 'Atteinte mixte, motrice et mentale'

  }
}

// 14 profils détaillés
export const PATIENT_PROFILS = {
  profil1: {
    id: 'profil1',
    numero: 1,
    label: 'Lucide, ambulant',
    category: 'CAT1',
    description: 'Lucide, ambulant',
    priorite: 1
  },
  profil2: {
    id: 'profil2',
    numero: 2,
    label: 'Lucide, ambulant',
    category: 'CAT1',
    description: 'Lucide, ambulant',
    priorite: 1
  },
  profil3: {
    id: 'profil3',
    numero: 3,
    label: 'Lucide, ambulant',
    category: 'CAT1',
    description: 'Lucide, ambulant',
    priorite: 1
  },
  profil4: {
    id: 'profil4',
    numero: 4,
    label: 'Lucide, ambulant',
    category: 'CAT2',
    description: 'Lucide, ambulant',
    priorite: 2
  },
  profil5: {
    id: 'profil5',
    numero: 5,
    label: 'Pertes cogn. - ambulant',
    category: 'CAT3',
    description: 'Pertes cognitives, ambulant',
    priorite: 2
  },
  profil6: {
    id: 'profil6',
    numero: 6,
    label: 'Lucide, ambulant',
    category: 'CAT2',
    description: 'Lucide, ambulant',
    priorite: 2
  },
  profil7: {
    id: 'profil7',
    numero: 7,
    label: 'Pertes cogn. - ambulant',
    category: 'CAT3',
    description: 'Pertes cognitives, ambulant',
    priorite: 3
  },
  profil8: {
    id: 'profil8',
    numero: 8,
    label: 'Pertes cogn. - ambulant',
    category: 'CAT3',
    description: 'Pertes cognitives, ambulant',
    priorite: 3
  },
  profil9: {
    id: 'profil9',
    numero: 9,
    label: 'Lucide, non-ambulant',
    category: 'CAT2',
    description: 'Lucide, non-ambulant',
    priorite: 2
  },
  profil10: {
    id: 'profil10',
    numero: 10,
    label: 'Pertes cogn. - ambulant',
    category: 'CAT3',
    description: 'Pertes cognitives, ambulant',
    priorite: 3
  },
  profil11: {
    id: 'profil11',
    numero: 11,
    label: 'Pertes cogn. - non ambulant',
    category: 'CAT4',
    description: 'Pertes cognitives, non-ambulant',
    priorite: 4
  },
  profil12: {
    id: 'profil12',
    numero: 12,
    label: 'Pertes cogn. - ambulant',
    category: 'CAT4',
    description: 'Pertes cognitives, ambulant',
    priorite: 4
  },
  profil13: {
    id: 'profil13',
    numero: 13,
    label: 'Pertes cogn. - non ambulant',
    category: 'CAT4',
    description: 'Pertes cognitives, non-ambulant',
    priorite: 4
  },
  profil14: {
    id: 'profil14',
    numero: 14,
    label: 'Pertes cogn. - non ambulant',
    category: 'CAT4',
    description: 'Pertes cognitives, non-ambulant',
    priorite: 4
  }
}

// Utilitaires
export function getProfilById(profilId) {
  return PATIENT_PROFILS[profilId] || PATIENT_PROFILS.profil1
}

export function getCategoryById(categoryId) {
  return PATIENT_CATEGORIES[categoryId] || PATIENT_CATEGORIES.CAT1
}

export function getProfilCategory(profilId) {
  const profil = getProfilById(profilId)
  return getCategoryById(profil.category)
}

export function getProfilsInCategory(categoryId) {
  return Object.values(PATIENT_PROFILS).filter(p => p.category === categoryId)
}
