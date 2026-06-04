import { apiClient } from '../client.js'

export const patientAlertService = {
  getAll: () => apiClient.get('/alertes'),
  getById: (id) => apiClient.get(`/alertes/${id}`),
  getUnresolved: () => apiClient.get('/alertes/unresolved'),
  getResolved: () => apiClient.get('/alertes/resolved'),
  getByPatient: (patientId) => apiClient.get(`/alertes/patient/${patientId}`),
  getByAideSoignant: (aideSoignantId) => apiClient.get(`/alertes/aide-soignant/${aideSoignantId}`),
  create: (data) => apiClient.post('/alertes', data),
  update: (id, data) => apiClient.put(`/alertes/${id}`, data)
}

export default patientAlertService
