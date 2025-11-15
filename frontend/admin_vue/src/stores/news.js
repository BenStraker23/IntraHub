import { defineStore } from 'pinia'
import { newsService } from '../services/newsService.js'

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [],
    currentNews: null,
    isLoading: false,
    error: null
  }),

  getters: {
    sortedNews: (state) => {
      return [...state.news].sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    }
  },

  actions: {
    async fetchNews() {
      this.isLoading = true
      this.error = null
      
      try {
        const news = await newsService.getAll()
        this.news = news
        return news
      } catch (error) {
        this.error = error.message || 'Error al cargar las noticias'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchNewsById(id) {
      this.isLoading = true
      this.error = null
      
      try {
        const news = await newsService.getById(id)
        this.currentNews = news
        return news
      } catch (error) {
        this.error = error.message || 'Error al cargar la noticia'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createNews(newsData) {
      this.isLoading = true
      this.error = null
      
      try {
        const newNews = await newsService.create(newsData)
        this.news.unshift(newNews)
        return newNews
      } catch (error) {
        this.error = error.message || 'Error al crear la noticia'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateNews(id, newsData) {
      this.isLoading = true
      this.error = null
      
      try {
        const updatedNews = await newsService.update(id, newsData)
        const index = this.news.findIndex(n => n.id === id)
        if (index !== -1) {
          this.news[index] = updatedNews
        }
        return updatedNews
      } catch (error) {
        this.error = error.message || 'Error al actualizar la noticia'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteNews(id) {
      this.isLoading = true
      this.error = null
      
      try {
        await newsService.delete(id)
        this.news = this.news.filter(n => n.id !== id)
      } catch (error) {
        this.error = error.message || 'Error al eliminar la noticia'
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})