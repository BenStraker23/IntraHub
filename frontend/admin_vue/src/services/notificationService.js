import api from './api.js'

// Datos de prueba para desarrollo
const mockNotificationHistory = [
  {
    id: 1,
    title: "Nueva noticia: Políticas de empresa",
    message: "Se ha publicado una nueva noticia sobre políticas de empresa",
    type: "news",
    created_at: "2024-11-19T10:30:00Z"
  },
  {
    id: 2,
    title: "Nueva vacante: Desarrollador Frontend",
    message: "Se ha publicado una nueva vacante en el área de desarrollo",
    type: "vacancy",
    created_at: "2024-11-18T15:20:00Z"
  }
];

class NotificationService {
  // Enviar notificación sobre nueva noticia
  async sendNewsNotification(newsId, title, message) {
    try {
      const response = await api.post('/notifications/send', {
        type: 'news',
        reference_id: newsId,
        title: title,
        message: message,
        target: 'all_employees'
      })
      return response.data
    } catch (error) {
      console.warn('API no disponible, simulando envío de notificación:', error.message)
      return { success: true, message: 'Notificación enviada (simulado)' }
    }
  }

  // Enviar notificación sobre nueva vacante
  async sendVacanteNotification(vacanteId, title, message) {
    try {
      const response = await api.post('/notifications/send', {
        type: 'vacancy',
        reference_id: vacanteId,
        title: title,
        message: message,
        target: 'all_employees'
      })
      return response.data
    } catch (error) {
      console.warn('API no disponible, simulando envío de notificación:', error.message)
      return { success: true, message: 'Notificación enviada (simulado)' }
    }
  }

  // Enviar notificación sobre nuevas boletas
  async sendBoletaNotification(title, message) {
    try {
      const response = await api.post('/notifications/send', {
        type: 'boleta',
        title: title,
        message: message,
        target: 'all_employees'
      })
      return response.data
    } catch (error) {
      console.warn('API no disponible, simulando envío de notificación:', error.message)
      return { success: true, message: 'Notificación enviada (simulado)' }
    }
  }

  // Enviar notificación personalizada
  async sendCustomNotification(data) {
    try {
      const response = await api.post('/notifications/send', data)
      return response.data
    } catch (error) {
      console.warn('API no disponible, simulando envío de notificación:', error.message)
      return { success: true, message: 'Notificación enviada (simulado)' }
    }
  }

  // Obtener historial de notificaciones enviadas
  async getNotificationHistory() {
    try {
      const response = await api.get('/notifications/history')
      return response.data
    } catch (error) {
      console.warn('API no disponible, usando datos de prueba:', error.message)
      return { data: mockNotificationHistory }
    }
  }
}

export default new NotificationService()