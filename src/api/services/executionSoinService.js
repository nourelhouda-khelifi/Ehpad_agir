import { API_CONFIG } from '../config.js'

export const executionSoinService = {
  /**
   * Récupérer toutes les exécutions de soins
   */
  async getAll() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/executions`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer une exécution de soin par ID
   */
  async getById(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/executions/${id}`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer les exécutions par patient
   */
  async getByPatient(patientId) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/executions/patient/${patientId}`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer les exécutions par aide-soignant
   */
  async getByAideSoignant(aideSoignantId) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/executions/aide-soignant/${aideSoignantId}`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer les exécutions par date
   */
  async getByDate(date) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/executions/date/${date}`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer les exécutions pour aujourd'hui
   */
  async getTodayExecutions() {
    const today = new Date().toISOString().split('T')[0]
    return this.getByDate(today)
  },

  /**
   * Créer une exécution de soin
   */
  async create(data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/executions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Mettre à jour une exécution de soin
   */
  async update(id, data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/executions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Supprimer une exécution de soin
   */
  async delete(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/executions/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
  }
}

export default executionSoinService
