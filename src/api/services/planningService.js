/**
 * Service Planning Soin
 * Centralise tous les appels API pour les plannings/soins
 */

import { apiClient } from '../client.js'
import { API_CONFIG } from '../config.js'

/**
 * Service Planning
 */
export const planningService = {
  /**
   * Récupérer tous les plannings
   */
  getAll: () => apiClient.get(API_CONFIG.ENDPOINTS.PLANNINGS),

  /**
   * Récupérer un planning par ID
   */
  getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.PLANNINGS, { id }),

  /**
   * Récupérer les plannings d'un patient
   */
  getByPatient: (patientId) => apiClient.get(`${API_CONFIG.ENDPOINTS.PLANNINGS}/patient/${patientId}`),

  /**
   * Récupérer les plannings d'un aide-soignant
   */
  getByAideSoignant: (aideSoignantId) => apiClient.get(`${API_CONFIG.ENDPOINTS.PLANNINGS}/aide-soignant/${aideSoignantId}`),

  /**
   * Récupérer les plannings d'une date spécifique
   */
  getByDate: (date) => apiClient.get(`${API_CONFIG.ENDPOINTS.PLANNINGS}/date/${date}`),

  /**
   * Récupérer les plannings d'un patient à une date spécifique
   */
  getByPatientAndDate: (patientId, date) => apiClient.get(`${API_CONFIG.ENDPOINTS.PLANNINGS}/patient/${patientId}/date/${date}`),

  /**
   * Créer un planning
   */
  create: (data) => apiClient.post(API_CONFIG.ENDPOINTS.PLANNINGS, data),

  /**
   * Modifier un planning
   */
  update: (id, data) => apiClient.put(API_CONFIG.ENDPOINTS.PLANNINGS, data, { id }),

  /**
   * Supprimer un planning
   */
  delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.PLANNINGS, { id })
}

export default planningService
