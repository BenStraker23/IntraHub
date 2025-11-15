import { defineStore } from 'pinia'
import { authService } from '../services/authService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => {
      // Verificar tanto role === 'admin' como is_admin para compatibilidad
      return state.user && (
        state.user.role === 'admin' || 
        state.user.is_admin === true ||
        state.user.is_admin === 1
      )
    }
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await authService.login(credentials)
        this.user = response.user
        this.token = response.token
        return response
      } catch (error) {
        this.error = error.message || 'Error al iniciar sesión'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true
      
      try {
        await authService.logout()
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        this.user = null
        this.token = null
        this.isLoading = false
      }
    },

    async fetchUser() {
      try {
        const user = await authService.me()
        this.user = user
        return user
      } catch (error) {
        this.logout()
        throw error
      }
    },

    initializeAuth() {
      const token = localStorage.getItem('admin_token')
      const user = authService.getCurrentUser()
      
      if (token && user) {
        this.token = token
        this.user = user
      }
    }
  }
})