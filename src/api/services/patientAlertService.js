import apiClient from '../client.js'
import { API_CONFIG } from '../config.js'

export const patientAlertService = {
  /**
   * Récupérer toutes les alertes
   */
  async getAll() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/alertes`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    const data = await response.json()
    // Gérer à la fois les réponses array et {value: [...]} 
    return Array.isArray(data) ? data : (data.value || [])
  },

  /**
   * Récupérer une alerte par ID
   */
  async getById(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/alertes/${id}`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer les alertes non résolues
   */
  async getUnresolved() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/alertes/unresolved`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer les alertes résolues
   */
  async getResolved() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/alertes/resolved`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer les alertes par patient
   */
  async getByPatient(patientId) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/alertes/patient/${patientId}`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Récupérer les alertes par aide-soignant
   */
  async getByAideSoignant(aideSoignantId) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/alertes/aide-soignant/${aideSoignantId}`)
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Créer une alerte
   */
  async create(data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/alertes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  },

  /**
   * Mettre à jour une alerte
   */
  async update(id, data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/alertes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`Erreur: ${response.statusText}`)
    return response.json()
  }
}

export default patientAlertService
