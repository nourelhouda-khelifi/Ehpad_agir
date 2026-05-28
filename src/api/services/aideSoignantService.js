/**
 * Service Aide-Soignant
 * Centralise tous les appels API pour les aides-soignants
 */

import { apiClient } from '../client.js'
import { API_CONFIG } from '../config.js'

/**
 * Service Aide-Soignant
 */
export const aideSoignantService = {
  /**
   * Récupérer tous les aides-soignants
   */
  getAll: () => apiClient.get(API_CONFIG.ENDPOINTS.AIDES_SOIGNANTS),

  /**
   * Récupérer un aide-soignant par ID
   */
  getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.AIDES_SOIGNANTS, { id }),

  /**
   * Créer un aide-soignant
   */
  create: (data) => apiClient.post(API_CONFIG.ENDPOINTS.AIDES_SOIGNANTS, data),

  /**
   * Modifier un aide-soignant
   */
  update: (id, data) => apiClient.put(API_CONFIG.ENDPOINTS.AIDES_SOIGNANTS, data, { id }),

  /**
   * Supprimer un aide-soignant
   */
  delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.AIDES_SOIGNANTS, { id })
}

export default aideSoignantService
