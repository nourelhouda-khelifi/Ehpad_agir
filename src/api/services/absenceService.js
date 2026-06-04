import { apiClient } from '../client.js'

export const absenceService = {
  getAll: () => apiClient.get('/absences'),
  getByAideSoignant: (aideSoignantId) => apiClient.get(`/absences/aide-soignant/${aideSoignantId}`),
  getById: (id) => apiClient.get(`/absences/${id}`),
  create: (data) => apiClient.post('/absences', data),
  update: (id, data) => apiClient.put(`/absences/${id}`, data),
  delete: (id) => apiClient.delete(`/absences/${id}`),
  annuler: (id) => apiClient.post(`/absences/${id}/annuler`, {})
}

export default absenceService
