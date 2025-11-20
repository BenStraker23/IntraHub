<template>
  <div class="notifications-management">
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
        <router-link to="/notifications" class="nav-link">
          <span>🔔</span> Notificaciones
        </router-link>
      </div>

      <div class="nav-user">
        <span class="user-name">{{ authStore.user?.name }}</span>
        <button @click="handleLogout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </nav>

    <main class="main-content">
      <div class="page-header">
        <h1>
          <i class="fas fa-bell"></i>
          Gestión de Notificaciones
        </h1>
        <p>Envía notificaciones a empleados y revisa el historial de envíos</p>
      </div>

      <div class="notifications-layout">
        <!-- Panel de envío -->
        <div class="notification-sender-section">
          <NotificationSender />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import NotificationSender from '../components/NotificationSender.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  // Verificar que el usuario esté autenticado
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<style scoped>
.notifications-management {
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

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  color: #1f2937;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.page-header h1 i {
  color: #667eea;
}

.page-header p {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
}

.notifications-layout {
  display: flex;
  justify-content: center;
}

.notification-sender-section {
  width: 100%;
  max-width: 900px;
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

  .page-header {
    padding: 1.5rem;
  }

  .page-header h1 {
    font-size: 2rem;
    flex-direction: column;
  }

  .page-header p {
    font-size: 1rem;
  }
}
</style>