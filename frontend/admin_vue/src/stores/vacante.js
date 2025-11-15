import { defineStore } from 'pinia'
import { vacanteService } from '../services/vacanteService.js'

export const useVacanteStore = defineStore('vacante', {
  state: () => ({
    vacantes: [],
    currentVacante: null,
    isLoading: false,
    error: null,
    filters: {
      estado: '',
      buscar: ''
    }
  }),

  getters: {
    sortedVacantes: (state) => {
      return [...state.vacantes].sort((a, b) => new Date(b.publicada_en) - new Date(a.publicada_en))
    },
    
    activeVacantes: (state) => {
      return state.vacantes.filter(v => v.estado === 'abierta')
    }
  },

  actions: {
    async fetchVacantes(filters = {}) {
      this.isLoading = true
      this.error = null
      
      try {
        const vacantes = await vacanteService.getAll(filters)
        this.vacantes = vacantes
        return vacantes
      } catch (error) {
        this.error = error.message || 'Error al cargar las vacantes'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchVacanteById(id) {
      this.isLoading = true
      this.error = null
      
      try {
        const vacante = await vacanteService.getById(id)
        this.currentVacante = vacante
        return vacante
      } catch (error) {
        this.error = error.message || 'Error al cargar la vacante'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createVacante(vacanteData) {
      this.isLoading = true
      this.error = null
      
      try {
        const newVacante = await vacanteService.create(vacanteData)
        this.vacantes.unshift(newVacante)
        return newVacante
      } catch (error) {
        this.error = error.message || 'Error al crear la vacante'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateVacante(id, vacanteData) {
      this.isLoading = true
      this.error = null
      
      try {
        const updatedVacante = await vacanteService.update(id, vacanteData)
        const index = this.vacantes.findIndex(v => v.id === id)
        if (index !== -1) {
          this.vacantes[index] = updatedVacante
        }
        return updatedVacante
      } catch (error) {
        this.error = error.message || 'Error al actualizar la vacante'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteVacante(id) {
      this.isLoading = true
      this.error = null
      
      try {
        await vacanteService.delete(id)
        this.vacantes = this.vacantes.filter(v => v.id !== id)
      } catch (error) {
        this.error = error.message || 'Error al eliminar la vacante'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})