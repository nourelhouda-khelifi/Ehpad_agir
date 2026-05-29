/**
 * Service Patient
 * Centralise tous les appels API pour les patients
 */

import { apiClient } from '../client.js'
import { API_CONFIG } from '../config.js'

/**
 * Mapper les données du patient depuis l'API
 */
const mapPatient = (patient) => ({
  ...patient,
  chambre: patient.numeroChambre || '',
  asReferent: patient.aideSoignant || ''
})

/**
 * Service Patient
 */
export const patientService = {
  /**
   * Récupérer tous les patients
   */
  async getAll() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.PATIENTS)
    // Gérer à la fois les réponses array et {value: [...]} 
    const data = Array.isArray(response) ? response : (response.value || [])
    return data.map(mapPatient)
  },

  /**
   * Récupérer un patient par ID
   */
  getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.PATIENTS, { id }),

  /**
   * Créer un patient
   */
  create: (data) => apiClient.post(API_CONFIG.ENDPOINTS.PATIENTS, data),

  /**
   * Modifier un patient
   */
  update: (id, data) => apiClient.put(API_CONFIG.ENDPOINTS.PATIENTS, data, { id }),

  /**
   * Supprimer un patient
   */
  delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.PATIENTS, { id }),

  /**
   * Récupérer les patients par étage
   */
  getByFloor: (floor) => apiClient.get(`${API_CONFIG.ENDPOINTS.PATIENTS}/floor/${floor}`),

  /**
   * Récupérer les patients par chambre
   */
  getByRoom: (room) => apiClient.get(`${API_CONFIG.ENDPOINTS.PATIENTS}/room/${room}`),

  /**
   * Récupérer les patients par statut
   */
  getByStatus: (status) => apiClient.get(`${API_CONFIG.ENDPOINTS.PATIENTS}/status/${status}`),

  /**
   * Récupérer les patients par catégorie
   */
  getByCategory: (category) => apiClient.get(`${API_CONFIG.ENDPOINTS.PATIENTS}/category/${category}`)
}
