import { API_CONFIG } from '../config.js'

export const typeSoinService = {
  /**
   * Récupérer tous les types de soins
   */
  async getAll() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/types-soins`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer un type de soin par ID
   */
  async getById(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/types-soins/${id}`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Créer un type de soin
   */
  async create(data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/types-soins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Mettre à jour un type de soin
   */
  async update(id, data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/types-soins/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Supprimer un type de soin
   */
  async delete(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/types-soins/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
  }
}

export default typeSoinService
