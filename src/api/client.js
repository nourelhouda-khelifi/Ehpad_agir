/**
 * Client HTTP réutilisable pour les appels API
 * Utilise la configuration centralisée
 */

import { API_CONFIG, getFullUrl } from './config.js'

/**
 * Client HTTP générique
 */
class ApiClient {
  /**
   * Effectue une requête HTTP
   * @param {string} method - Méthode HTTP (GET, POST, PUT, DELETE, etc.)
   * @param {string} endpoint - Endpoint API (ex: '/patients')
   * @param {object} options - Options additionnelles (data, id, headers, etc.)
   */
  async request(method, endpoint, options = {}) {
    const url = getFullUrl(endpoint, options.id)
    
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }

    // Ajouter le body pour POST, PUT, PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method) && options.data) {
      config.body = JSON.stringify(options.data)
    }

    try {
      console.log(`🔵 [API] ${method} ${url}`, options.data ? `Payload: ${config.body}` : '')
      
      const response = await fetch(url, config)
      console.log(`🔵 [API] Réponse: ${response.status} ${response.statusText}`)

      // Gérer les erreurs HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMsg = `API Error ${response.status}: ${errorData.message || response.statusText}`
        console.error(`❌ [API] ${errorMsg}`, errorData)
        throw new Error(errorMsg)
      }

      // Retourner la réponse (ou null pour 204 No Content)
      if (response.status === 204) {
        console.log(`🟢 [API] 204 No Content`)
        return null
      }

      const responseData = await response.json()
      console.log(`🟢 [API] Données reçues:`, responseData)
      return responseData
    } catch (error) {
      console.error(`❌ [API] Erreur lors de la requête ${method} ${url}:`, error)
      throw error
    }
  }

  // Méthodes raccourcies
  get(endpoint, options = {}) {
    return this.request('GET', endpoint, options)
  }

  post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, { ...options, data })
  }

  put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, { ...options, data })
  }

  delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, options)
  }

  patch(endpoint, data, options = {}) {
    return this.request('PATCH', endpoint, { ...options, data })
  }
}

// Exporter une instance singleton
export const apiClient = new ApiClient()

export default apiClient
