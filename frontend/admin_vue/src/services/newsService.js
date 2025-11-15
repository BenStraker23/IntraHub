import api from './api.js'

export const newsService = {
  // Obtener todas las noticias
  async getAll() {
    try {
      const response = await api.get('/news')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener una noticia por ID
  async getById(id) {
    try {
      const response = await api.get(`/news/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Crear nueva noticia
  async create(newsData) {
    try {
      const response = await api.post('/news', newsData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Actualizar noticia
  async update(id, newsData) {
    try {
      const response = await api.put(`/news/${id}`, newsData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Eliminar noticia
  async delete(id) {
    try {
      const response = await api.delete(`/news/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}