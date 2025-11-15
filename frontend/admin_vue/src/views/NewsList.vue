<template>
  <div class="news-list">
    <div class="header">
      <h1>Gestión de Noticias</h1>
      <router-link to="/news/create" class="btn btn-primary">
        <span>✨</span> Nueva Noticia
      </router-link>
    </div>

    <div v-if="newsStore.isLoading" class="loading">
      <p>Cargando noticias...</p>
    </div>

    <div v-else-if="newsStore.error" class="error">
      <p>Error: {{ newsStore.error }}</p>
      <button @click="loadNews" class="btn btn-secondary">Reintentar</button>
    </div>

    <div v-else class="news-grid">
      <div v-if="newsStore.sortedNews.length === 0" class="empty-state">
        <div class="empty-icon">📰</div>
        <h3>No hay noticias publicadas</h3>
        <p>Comienza creando tu primera noticia</p>
        <router-link to="/news/create" class="btn btn-primary">
          Crear Noticia
        </router-link>
      </div>

      <div 
        v-for="news in newsStore.sortedNews" 
        :key="news.id"
        class="news-card"
      >
        <div class="news-header">
          <h3>{{ news.title }}</h3>
          <div class="news-meta">
            <span class="author">{{ news.author?.name }}</span>
            <span class="date">{{ formatDate(news.published_at) }}</span>
          </div>
        </div>

        <div class="news-content">
          <p>{{ truncateContent(news.content, 150) }}</p>
        </div>

        <div class="news-actions">
          <router-link 
            :to="`/news/${news.id}/edit`" 
            class="btn btn-secondary btn-sm"
          >
            ✏️ Editar
          </router-link>
          <button 
            @click="confirmDelete(news)"
            class="btn btn-danger btn-sm"
            :disabled="newsStore.isLoading"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal" @click.stop>
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar la noticia "<strong>{{ newsToDelete?.title }}</strong>"?</p>
        <p class="warning">Esta acción no se puede deshacer.</p>
        
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn btn-secondary">
            Cancelar
          </button>
          <button 
            @click="deleteNews" 
            class="btn btn-danger"
            :disabled="newsStore.isLoading"
          >
            {{ newsStore.isLoading ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNewsStore } from '../stores/news.js'

const newsStore = useNewsStore()

const showDeleteModal = ref(false)
const newsToDelete = ref(null)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const truncateContent = (content, length) => {
  if (content.length <= length) return content
  return content.slice(0, length) + '...'
}

const confirmDelete = (news) => {
  newsToDelete.value = news
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  newsToDelete.value = null
}

const deleteNews = async () => {
  try {
    await newsStore.deleteNews(newsToDelete.value.id)
    closeDeleteModal()
  } catch (error) {
    console.error('Error al eliminar noticia:', error)
  }
}

const loadNews = () => {
  newsStore.fetchNews()
}

onMounted(() => {
  loadNews()
})
</script>

<style scoped>
.news-list {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #1f2937;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.error {
  text-align: center;
  padding: 3rem;
  color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.news-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.news-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.news-header h3 {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.news-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.author {
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 500;
}

.date {
  color: #6b7280;
  font-size: 0.875rem;
}

.news-content p {
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.news-actions {
  display: flex;
  gap: 0.75rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  color: #1f2937;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.modal p {
  color: #4b5563;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
}

.warning {
  color: #dc2626;
  font-size: 0.875rem;
  font-style: italic;
  margin-bottom: 1.5rem !important;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .news-list {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .modal {
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>