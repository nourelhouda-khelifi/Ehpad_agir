/**
 * Configuration API centralisée
 * Utilise des variables d'environnement Vite pour la flexibilité
 */

// URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  API_PREFIX: '/api',
  
  // Endpoints groupés par ressource
  ENDPOINTS: {
    PATIENTS: '/patients',
    ALERTES: '/alertes',
    AIDES_SOIGNANTS: '/aides-soignants',
    EXECUTIONS: '/executions',
    PLANNINGS: '/plannings',
    NOTES: '/notes',
    TYPES_SOINS: '/types-soins',
    PING: '/ping'
  }
}

/**
 * Génère l'URL complète pour un endpoint
 * @param {string} endpoint - L'endpoint (ex: '/patients')
 * @param {string|number} id - ID optionnel (ex: 1)
 * @returns {string} L'URL complète (ex: 'http://localhost:8081/api/patients/1')
 */
export const getFullUrl = (endpoint, id = null) => {
  let url = `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`
  if (id) {
    url += `/${id}`
  }
  return url
}

export default API_CONFIG
