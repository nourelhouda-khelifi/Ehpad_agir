/**
 * Service Patient
 * Centralise tous les appels API pour les patients
 */

import { apiClient } from '../client.js'
import { API_CONFIG } from '../config.js'

/**
 * Service Patient
 */
export const patientService = {
  /**
   * Récupérer tous les patients
   */
  getAll: () => apiClient.get(API_CONFIG.ENDPOINTS.PATIENTS),

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
