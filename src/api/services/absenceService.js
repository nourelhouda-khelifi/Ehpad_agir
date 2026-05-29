import { API_CONFIG } from '../config.js'

export const absenceService = {
  /**
   * Récupérer toutes les absences
   */
  async getAll() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/absences`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer les absences d'un aide-soignant
   */
  async getByAideSoignant(aideSoignantId) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/absences/aide-soignant/${aideSoignantId}`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer une absence par ID
   */
  async getById(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/absences/${id}`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Créer une nouvelle absence
   */
  async create(data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/absences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Mettre à jour une absence
   */
  async update(id, data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/absences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Supprimer une absence
   */
  async delete(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/absences/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
  },

  /**
   * Annuler une absence
   */
  async annuler(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/absences/${id}/annuler`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  }
}

export default absenceService
