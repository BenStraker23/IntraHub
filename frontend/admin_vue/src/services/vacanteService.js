import api from './api.js'

export const vacanteService = {
  // Obtener todas las vacantes
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()
      
      if (filters.estado) params.append('estado', filters.estado)
      if (filters.buscar) params.append('buscar', filters.buscar)
      
      const response = await api.get(`/vacantes?${params.toString()}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener una vacante por ID
  async getById(id) {
    try {
      const response = await api.get(`/vacantes/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Crear nueva vacante
  async create(vacanteData) {
    try {
      const response = await api.post('/vacantes', vacanteData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Actualizar vacante
  async update(id, vacanteData) {
    try {
      const response = await api.put(`/vacantes/${id}`, vacanteData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Eliminar vacante
  async delete(id) {
    try {
      const response = await api.delete(`/vacantes/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}