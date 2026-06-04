import { apiClient } from '../client.js'

export const typeSoinService = {
  getAll: () => apiClient.get('/types-soins'),
  getById: (id) => apiClient.get(`/types-soins/${id}`),
  create: (data) => apiClient.post('/types-soins', data),
  update: (id, data) => apiClient.put(`/types-soins/${id}`, data),
  delete: (id) => apiClient.delete(`/types-soins/${id}`)
}

export default typeSoinService
