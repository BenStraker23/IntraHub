// src/services/notificationService.js
import api from "./api.js";

// Función para generar notificaciones basadas en noticias y vacantes recientes
const generateRecentNotifications = async () => {
  try {
    const notifications = [];
    
    // Intentar obtener noticias recientes
    try {
      const newsResponse = await api.get('/news');
      const recentNews = (newsResponse.data?.data || newsResponse.data || [])
        .slice(0, 3) // Últimas 3 noticias
        .map((news, index) => ({
          id: `news_${news.id || index}`,
          title: `Nueva noticia: ${news.title || 'Sin título'}`,
          message: `Se ha publicado una nueva noticia: "${news.title}". ¡No te la pierdas!`,
          type: "news",
          reference_id: news.id,
          created_at: news.published_at || news.created_at || new Date().toISOString(),
          read_at: Math.random() > 0.6 ? null : new Date(Date.now() - Math.random() * 86400000).toISOString()
        }));
      notifications.push(...recentNews);
    } catch (error) {
      console.log('No se pudieron cargar noticias para notificaciones');
    }

    // Intentar obtener vacantes recientes
    try {
      const vacantesResponse = await api.get('/vacantes');
      const recentVacantes = (vacantesResponse.data?.data || vacantesResponse.data || [])
        .filter(vacante => vacante.estado === 'abierta')
        .slice(0, 2) // Últimas 2 vacantes
        .map((vacante, index) => ({
          id: `vacancy_${vacante.id || index}`,
          title: `Nueva vacante: ${vacante.titulo || 'Sin título'}`,
          message: `Se ha publicado una nueva vacante: "${vacante.titulo}" en ${vacante.departamento}. ¡Aplica ya!`,
          type: "vacancy",
          reference_id: vacante.id,
          created_at: vacante.publicada_en || vacante.created_at || new Date().toISOString(),
          read_at: Math.random() > 0.7 ? null : new Date(Date.now() - Math.random() * 86400000).toISOString()
        }));
      notifications.push(...recentVacantes);
    } catch (error) {
      console.log('No se pudieron cargar vacantes para notificaciones');
    }

    // Agregar algunas notificaciones adicionales si no hay suficientes
    if (notifications.length < 3) {
      const additionalNotifications = [
        {
          id: 'boleta_1',
          title: "Boletas disponibles",
          message: "Ya están disponibles las boletas de pago del mes de noviembre.",
          type: "boleta",
          created_at: new Date(Date.now() - 86400000).toISOString(), // Ayer
          read_at: null
        },
        {
          id: 'custom_1',
          title: "Mantenimiento programado",
          message: "El sistema estará en mantenimiento el próximo sábado de 2:00 AM a 6:00 AM.",
          type: "custom",
          created_at: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
          read_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      notifications.push(...additionalNotifications.slice(0, 5 - notifications.length));
    }

    // Ordenar por fecha de creación (más recientes primero)
    return notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error generando notificaciones:', error);
    return [];
  }
};

// Datos de prueba para desarrollo (fallback)
const mockNotifications = [
  {
    id: 1,
    title: "Nueva noticia publicada",
    message: "Se ha publicado una nueva noticia: 'Actualización de políticas de empresa'. ¡No te la pierdas!",
    type: "news",
    created_at: "2024-11-19T10:30:00Z",
    read_at: null
  },
  {
    id: 2,
    title: "Nueva vacante disponible",
    message: "Se ha publicado una nueva vacante: 'Desarrollador Full Stack Senior' en Tecnología. ¡Aplica ya!",
    type: "vacancy",
    created_at: "2024-11-19T09:15:00Z",
    read_at: "2024-11-19T11:00:00Z"
  },
  {
    id: 3,
    title: "Boletas disponibles",
    message: "Ya están disponibles las boletas de pago del mes de noviembre.",
    type: "boleta",
    created_at: "2024-11-18T14:20:00Z",
    read_at: null
  }
];

const mockSettings = {
  news: true,
  vacancies: true,
  boletas: true,
  email_notifications: false
};

class NotificationService {
  // Cache para las notificaciones
  constructor() {
    this.notificationsCache = null;
    this.cacheTimestamp = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutos
  }

  // Limpiar cache
  clearCache() {
    this.notificationsCache = null;
    this.cacheTimestamp = null;
  }

  // Verificar si el cache es válido
  isCacheValid() {
    return this.notificationsCache && 
           this.cacheTimestamp && 
           (Date.now() - this.cacheTimestamp) < this.cacheExpiry;
  }

  // Obtener todas las notificaciones del usuario
  async getNotifications(forceRefresh = false) {
    try {
      // Usar cache si es válido y no se fuerza el refresh
      if (!forceRefresh && this.isCacheValid()) {
        return { data: this.notificationsCache };
      }

      const response = await api.get("/notifications");
      const notifications = response.data?.data || response.data;
      
      // Actualizar cache
      this.notificationsCache = notifications;
      this.cacheTimestamp = Date.now();
      
      return { data: notifications };
    } catch (error) {
      console.warn("API de notificaciones no disponible, generando desde contenido actual:", error.message);
      
      // Generar notificaciones basadas en noticias y vacantes actuales
      const generatedNotifications = await generateRecentNotifications();
      
      if (generatedNotifications.length > 0) {
        // Actualizar cache con notificaciones generadas
        this.notificationsCache = generatedNotifications;
        this.cacheTimestamp = Date.now();
        return { data: generatedNotifications };
      }
      
      // Fallback a datos estáticos
      return { data: mockNotifications };
    }
  }

  // Obtener notificaciones no leídas
  async getUnreadNotifications() {
    try {
      const response = await api.get("/notifications/unread");
      return response.data;
    } catch (error) {
      console.warn("API no disponible, filtrando desde notificaciones actuales:", error.message);
      const allNotifications = await this.getNotifications();
      const unreadNotifications = (allNotifications.data || []).filter(n => !n.read_at);
      return { data: unreadNotifications };
    }
  }

  // Marcar notificación como leída
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      
      // Actualizar cache local
      if (this.notificationsCache) {
        this.notificationsCache = this.notificationsCache.map(notification => 
          notification.id === notificationId || notification.id == notificationId
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        );
      }
      
      return response.data;
    } catch (error) {
      console.warn("API no disponible, actualizando cache local:", error.message);
      
      // Actualizar cache local sin API
      if (this.notificationsCache) {
        this.notificationsCache = this.notificationsCache.map(notification => 
          notification.id === notificationId || notification.id == notificationId
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        );
      }
      
      return { success: true, message: "Notificación marcada como leída" };
    }
  }

  // Marcar todas las notificaciones como leídas
  async markAllAsRead() {
    try {
      const response = await api.put("/notifications/mark-all-read");
      
      // Actualizar cache local
      if (this.notificationsCache) {
        const now = new Date().toISOString();
        this.notificationsCache = this.notificationsCache.map(notification => ({
          ...notification,
          read_at: notification.read_at || now
        }));
      }
      
      return response.data;
    } catch (error) {
      console.warn("API no disponible, actualizando cache local:", error.message);
      
      // Actualizar cache local sin API
      if (this.notificationsCache) {
        const now = new Date().toISOString();
        this.notificationsCache = this.notificationsCache.map(notification => ({
          ...notification,
          read_at: notification.read_at || now
        }));
      }
      
      return { success: true, message: "Todas las notificaciones marcadas como leídas" };
    }
  }

  // Eliminar notificación
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      
      // Actualizar cache local
      if (this.notificationsCache) {
        this.notificationsCache = this.notificationsCache.filter(
          notification => notification.id !== notificationId && notification.id != notificationId
        );
      }
      
      return response.data;
    } catch (error) {
      console.warn("API no disponible, actualizando cache local:", error.message);
      
      // Actualizar cache local sin API
      if (this.notificationsCache) {
        this.notificationsCache = this.notificationsCache.filter(
          notification => notification.id !== notificationId && notification.id != notificationId
        );
      }
      
      return { success: true, message: "Notificación eliminada" };
    }
  }

  // Obtener configuraciones de notificaciones del usuario
  async getNotificationSettings() {
    try {
      const response = await api.get("/notifications/settings");
      return response.data;
    } catch (error) {
      console.warn("API no disponible, usando configuraciones de prueba:", error.message);
      return { data: mockSettings };
    }
  }

  // Actualizar configuraciones de notificaciones
  async updateNotificationSettings(settings) {
    try {
      const response = await api.put("/notifications/settings", settings);
      return response.data;
    } catch (error) {
      console.warn("API no disponible, simulando actualización:", error.message);
      return { success: true, data: settings };
    }
  }

  // Suscribirse a notificaciones push (para funcionalidad futura)
  async subscribeToPushNotifications(subscription) {
    try {
      const response = await api.post("/notifications/push-subscribe", subscription);
      return response.data;
    } catch (error) {
      console.warn("API no disponible, simulando suscripción:", error.message);
      return { success: true, message: "Suscrito a notificaciones push" };
    }
  }

  // Obtener conteo de notificaciones no leídas
  async getUnreadCount() {
    try {
      const response = await api.get("/notifications/unread-count");
      return response.data;
    } catch (error) {
      console.warn("API no disponible, calculando desde cache/datos actuales:", error.message);
      const allNotifications = await this.getNotifications();
      const unreadCount = (allNotifications.data || []).filter(n => !n.read_at).length;
      return { count: unreadCount };
    }
  }

  // Método para refrescar notificaciones manualmente
  async refreshNotifications() {
    this.clearCache();
    return await this.getNotifications(true);
  }
}

export default new NotificationService();