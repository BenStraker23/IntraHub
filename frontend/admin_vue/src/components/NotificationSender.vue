<template>
  <div class="notification-sender">
    <div class="notification-card">
      <div class="card-header">
        <h3>
          <i class="fas fa-bell"></i>
          Enviar Notificación
        </h3>
      </div>
      
      <div class="card-body">
        <form @submit.prevent="sendNotification">
          <div class="form-group">
            <label for="type">Tipo de Notificación</label>
            <select 
              id="type" 
              v-model="form.type" 
              class="form-control" 
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="news">Nueva Noticia</option>
              <option value="vacancy">Nueva Vacante</option>
              <option value="boleta">Nueva Boleta</option>
              <option value="custom">Personalizada</option>
            </select>
          </div>

          <div class="form-group">
            <label for="title">Título</label>
            <input 
              id="title"
              type="text" 
              v-model="form.title" 
              class="form-control" 
              placeholder="Título de la notificación"
              required
              maxlength="100"
            />
          </div>

          <div class="form-group">
            <label for="message">Mensaje</label>
            <textarea 
              id="message"
              v-model="form.message" 
              class="form-control" 
              placeholder="Contenido del mensaje"
              rows="4"
              required
              maxlength="500"
            ></textarea>
            <small class="text-muted">{{ form.message.length }}/500 caracteres</small>
          </div>

          <div class="form-group" v-if="form.type !== 'custom'">
            <label for="referenceId">ID de Referencia (opcional)</label>
            <input 
              id="referenceId"
              type="number" 
              v-model="form.reference_id" 
              class="form-control" 
              placeholder="ID del elemento relacionado"
            />
          </div>

          <div class="form-group">
            <label for="target">Destinatarios</label>
            <select 
              id="target" 
              v-model="form.target" 
              class="form-control" 
              required
            >
              <option value="all_employees">Todos los Empleados</option>
              <option value="active_employees">Empleados Activos</option>
              <option value="specific_department">Departamento Específico</option>
            </select>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="loading || !isFormValid"
            >
              <i class="fas fa-paper-plane"></i>
              {{ loading ? 'Enviando...' : 'Enviar Notificación' }}
            </button>
            
            <button 
              type="button" 
              class="btn btn-secondary"
              @click="resetForm"
              :disabled="loading"
            >
              <i class="fas fa-redo"></i>
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Historial de notificaciones -->
    <div class="notification-history" v-if="showHistory">
      <div class="card-header">
        <h4>
          <i class="fas fa-history"></i>
          Historial de Notificaciones
        </h4>
        <button 
          class="btn btn-sm btn-outline-primary"
          @click="loadHistory"
        >
          <i class="fas fa-refresh"></i>
          Actualizar
        </button>
      </div>
      
      <div class="history-list">
        <div 
          v-for="notification in history" 
          :key="notification.id" 
          class="history-item"
        >
          <div class="history-content">
            <div class="history-header">
              <span class="notification-type">{{ getTypeLabel(notification.type) }}</span>
              <span class="notification-date">{{ formatDate(notification.created_at) }}</span>
            </div>
            <h5>{{ notification.title }}</h5>
            <p>{{ notification.message }}</p>
          </div>
          <div class="history-status">
            <span class="badge badge-success">Enviado</span>
          </div>
        </div>
        
        <div v-if="history.length === 0" class="no-history">
          <i class="fas fa-inbox"></i>
          <p>No hay notificaciones enviadas</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notificationService from '@/services/notificationService.js'

export default {
  name: 'NotificationSender',
  
  data() {
    return {
      loading: false,
      showHistory: true,
      form: {
        type: '',
        title: '',
        message: '',
        reference_id: null,
        target: 'all_employees'
      },
      history: []
    }
  },
  
  computed: {
    isFormValid() {
      return this.form.type && 
             this.form.title.trim() && 
             this.form.message.trim() && 
             this.form.target
    }
  },
  
  mounted() {
    this.loadHistory()
  },
  
  methods: {
    async sendNotification() {
      if (!this.isFormValid) return
      
      this.loading = true
      
      try {
        let result
        
        switch (this.form.type) {
          case 'news':
            result = await notificationService.sendNewsNotification(
              this.form.reference_id,
              this.form.title,
              this.form.message
            )
            break
            
          case 'vacancy':
            result = await notificationService.sendVacanteNotification(
              this.form.reference_id,
              this.form.title,
              this.form.message
            )
            break
            
          case 'boleta':
            result = await notificationService.sendBoletaNotification(
              this.form.title,
              this.form.message
            )
            break
            
          default:
            result = await notificationService.sendCustomNotification(this.form)
        }
        
        this.$toast.success('Notificación enviada exitosamente')
        this.resetForm()
        this.loadHistory()
        
      } catch (error) {
        console.error('Error enviando notificación:', error)
        this.$toast.error('Error al enviar la notificación')
      } finally {
        this.loading = false
      }
    },
    
    async loadHistory() {
      try {
        const response = await notificationService.getNotificationHistory()
        this.history = response.data || response
      } catch (error) {
        console.error('Error cargando historial:', error)
      }
    },
    
    resetForm() {
      this.form = {
        type: '',
        title: '',
        message: '',
        reference_id: null,
        target: 'all_employees'
      }
    },
    
    getTypeLabel(type) {
      const labels = {
        'news': 'Noticia',
        'vacancy': 'Vacante',
        'boleta': 'Boleta',
        'custom': 'Personalizada'
      }
      return labels[type] || type
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.notification-sender {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.notification-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px 10px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-body {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.notification-history {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header h4 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.history-list {
  padding: 20px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  border-bottom: 1px solid #e1e8ed;
  transition: background-color 0.3s ease;
}

.history-item:hover {
  background-color: #f8f9fa;
}

.history-item:last-child {
  border-bottom: none;
}

.history-content {
  flex: 1;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.notification-type {
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #495057;
}

.notification-date {
  font-size: 12px;
  color: #6c757d;
}

.history-content h5 {
  margin: 0 0 5px 0;
  color: #333;
}

.history-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.no-history {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.no-history i {
  font-size: 48px;
  margin-bottom: 15px;
}

.text-muted {
  color: #6c757d;
  font-size: 12px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 12px;
}

.btn-outline-primary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline-primary:hover {
  background: #667eea;
  color: white;
}
</style>