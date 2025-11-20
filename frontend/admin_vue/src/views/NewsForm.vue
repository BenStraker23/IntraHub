<template>
  <div class="news-form">
    <nav class="navbar">
      <div class="nav-brand">
        <h2>IntraHub Admin</h2>
      </div>
      
      <div class="nav-menu">
        <router-link to="/dashboard" class="nav-link">
          <span>📊</span> Dashboard
        </router-link>
        <router-link to="/news" class="nav-link">
          <span>📰</span> Noticias
        </router-link>
        <router-link to="/vacantes" class="nav-link">
          <span>💼</span> Vacantes
        </router-link>
      </div>

      <div class="nav-user">
        <span class="user-name">{{ authStore.user?.name }}</span>
        <button @click="handleLogout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </nav>

    <main class="main-content">
      <div class="form-header">
        <router-link to="/news" class="back-btn">
          ← Volver a Noticias
        </router-link>
        <h1>{{ isEditing ? 'Editar Noticia' : 'Nueva Noticia' }}</h1>
      </div>

      <div class="form-container">
        <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="title" class="required">Título de la Noticia</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            :disabled="isLoading"
            placeholder="Introduce el título de la noticia"
            maxlength="255"
          />
          <small class="field-help">Máximo 255 caracteres</small>
        </div>

        <div class="form-group">
          <label for="content" class="required">Contenido</label>
          <textarea
            id="content"
            v-model="form.content"
            required
            :disabled="isLoading"
            placeholder="Escribe el contenido de la noticia..."
            rows="12"
          ></textarea>
          <small class="field-help">{{ form.content.length }} caracteres</small>
        </div>

        <div class="form-group">
          <label for="published_at">Fecha de Publicación</label>
          <input
            id="published_at"
            v-model="form.published_at"
            type="datetime-local"
            :disabled="isLoading"
          />
          <small class="field-help">
            Si no seleccionas una fecha, se publicará inmediatamente
          </small>
        </div>

        <div class="form-group">
          <div class="checkbox-group">
            <input
              id="send_notification"
              v-model="form.send_notification"
              type="checkbox"
              :disabled="isLoading"
            />
            <label for="send_notification" class="checkbox-label">
              📧 Enviar notificación a empleados
            </label>
          </div>
          <small class="field-help">
            Se enviará una notificación a todos los empleados sobre esta nueva noticia
          </small>
        </div>

        <div v-if="error" class="error-message">
          <strong>Error:</strong> {{ error }}
        </div>

        <div class="form-actions">
          <router-link to="/news" class="btn btn-secondary">
            Cancelar
          </router-link>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isLoading || !isFormValid"
          >
            {{ getSubmitButtonText() }}
          </button>
        </div>
      </form>

      <!-- Preview -->
      <div class="preview-section">
        <h3>Vista Previa</h3>
        <div class="preview-card">
          <div class="preview-header">
            <h4>{{ form.title || 'Título de la noticia' }}</h4>
            <div class="preview-meta">
              <span class="preview-author">{{ currentUser?.name }}</span>
              <span class="preview-date">
                {{ formatPreviewDate(form.published_at) }}
              </span>
            </div>
          </div>
          <div class="preview-content">
            <p>{{ form.content || 'El contenido de la noticia aparecerá aquí...' }}</p>
          </div>
        </div>
      </div>
    </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNewsStore } from '../stores/news.js'
import { useAuthStore } from '../stores/auth.js'
import notificationService from '../services/notificationService.js'

const router = useRouter()
const route = useRoute()
const newsStore = useNewsStore()
const authStore = useAuthStore()

const props = defineProps({
  id: String
})

const isEditing = computed(() => !!props.id)
const isLoading = ref(false)
const error = ref(null)

const form = reactive({
  title: '',
  content: '',
  published_at: '',
  send_notification: false
})

const currentUser = computed(() => authStore.user)

const isFormValid = computed(() => {
  return form.title.trim() && form.content.trim()
})

const formatPreviewDate = (date) => {
  if (!date) {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getSubmitButtonText = () => {
  if (isLoading.value) {
    return isEditing.value ? 'Actualizando...' : 'Creando...'
  }
  return isEditing.value ? 'Actualizar Noticia' : 'Crear Noticia'
}

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  try {
    const newsData = {
      title: form.title.trim(),
      content: form.content.trim(),
      published_at: form.published_at || null
    }

    let createdNews
    if (isEditing.value) {
      createdNews = await newsStore.updateNews(props.id, newsData)
    } else {
      createdNews = await newsStore.createNews(newsData)
    }

    // Enviar notificación si está marcada la opción
    if (form.send_notification && createdNews) {
      try {
        await notificationService.sendNewsNotification(
          createdNews.id,
          `Nueva noticia: ${form.title}`,
          `Se ha publicado una nueva noticia: "${form.title}". ¡No te la pierdas!`
        )
      } catch (notificationError) {
        console.error('Error enviando notificación:', notificationError)
        // No bloquear el flujo si falla la notificación
      }
    }

    router.push('/news')
  } catch (err) {
    error.value = err.message || 'Error al guardar la noticia'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

const loadNewsForEditing = async () => {
  if (isEditing.value) {
    try {
      isLoading.value = true
      const news = await newsStore.fetchNewsById(props.id)
      
      form.title = news.title
      form.content = news.content
      
      if (news.published_at) {
        // Convertir la fecha al formato datetime-local
        const date = new Date(news.published_at)
        form.published_at = date.toISOString().slice(0, 16)
      }
    } catch (err) {
      error.value = 'Error al cargar la noticia'
      console.error('Error:', err)
    } finally {
      isLoading.value = false
    }
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadNewsForEditing()
})
</script>

<style scoped>
.news-form {
  min-height: 100vh;
  background-color: #f8fafc;
}

.navbar {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e7eb;
}

.nav-brand h2 {
  color: #1f2937;
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.nav-link.router-link-active {
  background-color: #dbeafe;
  color: #2563eb;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: #374151;
  font-weight: 500;
}

.logout-btn {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #b91c1c;
}

.main-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-block;
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 1rem;
  font-weight: 500;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #374151;
}

.form-header h1 {
  color: #1f2937;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
}

.form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.required::after {
  content: ' *';
  color: #dc2626;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-group input:disabled,
.form-group textarea:disabled {
  background-color: #f9fafb;
  color: #6b7280;
}

.form-group textarea {
  resize: vertical;
  min-height: 200px;
  line-height: 1.5;
}

.field-help {
  display: block;
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.checkbox-label {
  color: #374151;
  font-weight: 500;
  margin: 0;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
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

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Preview Styles */
.preview-section {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.preview-section h3 {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.preview-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border-left: 4px solid #2563eb;
}

.preview-header h4 {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  min-height: 1.5rem;
}

.preview-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.preview-author {
  color: #2563eb;
  font-weight: 500;
}

.preview-date {
  color: #6b7280;
}

.preview-content p {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  min-height: 1.5rem;
}

@media (max-width: 1024px) {
  .form-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .preview-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .nav-menu {
    justify-content: space-around;
  }

  .nav-user {
    justify-content: space-between;
  }

  .main-content {
    padding: 1rem;
  }

  .form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>