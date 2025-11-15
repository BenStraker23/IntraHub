import api from './api.js'

export const authService = {
  // Login de administrador
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials)
      
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token)
        localStorage.setItem('admin_user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Error al hacer logout:', error)
    } finally {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    }
  },

  // Obtener información del usuario actual
  async me() {
    try {
      const response = await api.get('/me')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Verificar si hay una sesión activa
  isLoggedIn() {
    return !!localStorage.getItem('admin_token')
  },

  // Obtener usuario del localStorage
  getCurrentUser() {
    const user = localStorage.getItem('admin_user')
    return user ? JSON.parse(user) : null
  },

  // Verificar si el usuario es administrador
  isAdmin() {
    const user = this.getCurrentUser()
    return user && (
      user.role === 'admin' || 
      user.is_admin === true ||
      user.is_admin === 1
    )
  }
}