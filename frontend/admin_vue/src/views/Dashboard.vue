<template>
  <div class="dashboard">
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
      <div class="dashboard-grid">
        <div class="stat-card">
          <div class="stat-icon">📰</div>
          <div class="stat-content">
            <h3>{{ newsStore.news.length }}</h3>
            <p>Noticias Publicadas</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💼</div>
          <div class="stat-content">
            <h3>{{ vacanteStore.vacantes.length }}</h3>
            <p>Total de Vacantes</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ vacanteStore.activeVacantes.length }}</h3>
            <p>Vacantes Activas</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>{{ new Date().toLocaleDateString('es-ES') }}</h3>
            <p>Fecha Actual</p>
          </div>
        </div>
      </div>

      <div class="recent-section">
        <div class="recent-news">
          <div class="section-header">
            <h3>Noticias Recientes</h3>
            <router-link to="/news" class="view-all-btn">Ver todas</router-link>
          </div>
          
          <div v-if="newsStore.isLoading" class="loading">
            Cargando noticias...
          </div>
          
          <div v-else class="items-list">
            <div 
              v-for="news in recentNews" 
              :key="news.id"
              class="item-card"
            >
              <h4>{{ news.title }}</h4>
              <p class="item-date">{{ formatDate(news.published_at) }}</p>
            </div>
            
            <div v-if="recentNews.length === 0" class="empty-state">
              No hay noticias publicadas
            </div>
          </div>
        </div>

        <div class="recent-vacantes">
          <div class="section-header">
            <h3>Vacantes Recientes</h3>
            <router-link to="/vacantes" class="view-all-btn">Ver todas</router-link>
          </div>
          
          <div v-if="vacanteStore.isLoading" class="loading">
            Cargando vacantes...
          </div>
          
          <div v-else class="items-list">
            <div 
              v-for="vacante in recentVacantes" 
              :key="vacante.id"
              class="item-card"
            >
              <h4>{{ vacante.titulo }}</h4>
              <p class="item-department">{{ vacante.departamento }}</p>
              <p class="item-date">{{ formatDate(vacante.publicada_en) }}</p>
            </div>
            
            <div v-if="recentVacantes.length === 0" class="empty-state">
              No hay vacantes publicadas
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useNewsStore } from '../stores/news.js'
import { useVacanteStore } from '../stores/vacante.js'

const router = useRouter()
const authStore = useAuthStore()
const newsStore = useNewsStore()
const vacanteStore = useVacanteStore()

const recentNews = computed(() => {
  return newsStore.sortedNews.slice(0, 3)
})

const recentVacantes = computed(() => {
  return vacanteStore.sortedVacantes.slice(0, 3)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  newsStore.fetchNews()
  vacanteStore.fetchVacantes()
})
</script>

<style scoped>
.dashboard {
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
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content h3 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.stat-content p {
  color: #6b7280;
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
}

.recent-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.recent-news, .recent-vacantes {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.view-all-btn {
  color: #2563eb;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.view-all-btn:hover {
  text-decoration: underline;
}

.loading, .empty-state {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 2rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-card {
  border-left: 3px solid #e5e7eb;
  padding-left: 1rem;
  transition: border-color 0.2s;
}

.item-card:hover {
  border-left-color: #2563eb;
}

.item-card h4 {
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

.item-department {
  color: #7c3aed;
  font-size: 0.75rem;
  margin: 0;
  font-weight: 500;
}

.item-date {
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0.25rem 0 0 0;
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

  .recent-section {
    grid-template-columns: 1fr;
  }
}
</style>