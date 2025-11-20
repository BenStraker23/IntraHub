import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

// Importar las vistas
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import NewsList from '../views/NewsList.vue'
import NewsForm from '../views/NewsForm.vue'
import VacantesList from '../views/VacantesList.vue'
import VacanteForm from '../views/VacanteForm.vue'
import NotificationsManagement from '../views/NotificationsManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/news',
    name: 'NewsList',
    component: NewsList,
    meta: { requiresAuth: true }
  },
  {
    path: '/news/create',
    name: 'CreateNews',
    component: NewsForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/news/:id/edit',
    name: 'EditNews',
    component: NewsForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/vacantes',
    name: 'VacantesList',
    component: VacantesList,
    meta: { requiresAuth: true }
  },
  {
    path: '/vacantes/create',
    name: 'CreateVacante',
    component: VacanteForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/vacantes/:id/edit',
    name: 'EditVacante',
    component: VacanteForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'NotificationsManagement',
    component: NotificationsManagement,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guards de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Inicializar autenticación desde localStorage
  authStore.initializeAuth()
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  if (requiresAuth && !authStore.isLoggedIn) {
    // Ruta requiere autenticación pero no está logueado
    next('/login')
  } else if (requiresGuest && authStore.isLoggedIn) {
    // Ruta para invitados pero ya está logueado
    next('/dashboard')
  } else if (requiresAuth && !authStore.isAdmin) {
    // Verificar si es admin para rutas protegidas
    console.warn('Acceso denegado: Usuario no es administrador')
    next('/login')
  } else {
    next()
  }
})

export default router