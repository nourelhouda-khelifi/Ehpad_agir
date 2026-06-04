import { apiClient } from '../client.js'

export const executionSoinService = {
  getAll: () => apiClient.get('/executions'),
  getById: (id) => apiClient.get(`/executions/${id}`),
  getByPatient: (patientId) => apiClient.get(`/executions/patient/${patientId}`),
  getByAideSoignant: (aideSoignantId) => apiClient.get(`/executions/aide-soignant/${aideSoignantId}`),
  getByDate: (date) => apiClient.get(`/executions/date/${date}`),
  getTodayExecutions() {
    const today = new Date().toISOString().split('T')[0]
    return this.getByDate(today)
  },
  create: (data) => apiClient.post('/executions', data),
  update: (id, data) => apiClient.put(`/executions/${id}`, data),
  delete: (id) => apiClient.delete(`/executions/${id}`)
}

export default executionSoinService
