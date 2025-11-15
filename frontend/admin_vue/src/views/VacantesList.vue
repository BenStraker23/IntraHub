<template>
  <div class="vacantes-list">
    <div class="header">
      <h1>Gestión de Vacantes</h1>
      <router-link to="/vacantes/create" class="btn btn-primary">
        <span>💼</span> Nueva Vacante
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="filters">
      <div class="filter-group">
        <label for="estado">Estado:</label>
        <select 
          id="estado"
          v-model="filters.estado" 
          @change="applyFilters"
        >
          <option value="">Todos</option>
          <option value="abierta">Abiertas</option>
          <option value="cerrada">Cerradas</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="buscar">Buscar:</label>
        <input
          id="buscar"
          v-model="filters.buscar"
          @input="applyFilters"
          type="text"
          placeholder="Título, departamento, ubicación..."
        />
      </div>

      <button @click="clearFilters" class="btn btn-secondary">
        Limpiar Filtros
      </button>
    </div>

    <div v-if="vacanteStore.isLoading" class="loading">
      <p>Cargando vacantes...</p>
    </div>

    <div v-else-if="vacanteStore.error" class="error">
      <p>Error: {{ vacanteStore.error }}</p>
      <button @click="loadVacantes" class="btn btn-secondary">Reintentar</button>
    </div>

    <div v-else class="vacantes-grid">
      <div v-if="vacanteStore.sortedVacantes.length === 0" class="empty-state">
        <div class="empty-icon">💼</div>
        <h3>No hay vacantes publicadas</h3>
        <p>Comienza creando tu primera vacante</p>
        <router-link to="/vacantes/create" class="btn btn-primary">
          Crear Vacante
        </router-link>
      </div>

      <div 
        v-for="vacante in vacanteStore.sortedVacantes" 
        :key="vacante.id"
        class="vacante-card"
        :class="{ 'card-closed': vacante.estado === 'cerrada' }"
      >
        <div class="vacante-header">
          <h3>{{ vacante.titulo }}</h3>
          <span 
            class="estado-badge"
            :class="vacante.estado"
          >
            {{ vacante.estado === 'abierta' ? '🟢 Abierta' : '🔴 Cerrada' }}
          </span>
        </div>

        <div class="vacante-details">
          <div class="detail-row" v-if="vacante.departamento">
            <span class="label">🏢 Departamento:</span>
            <span>{{ vacante.departamento }}</span>
          </div>
          
          <div class="detail-row" v-if="vacante.ubicacion">
            <span class="label">📍 Ubicación:</span>
            <span>{{ vacante.ubicacion }}</span>
          </div>
          
          <div class="detail-row" v-if="vacante.modalidad">
            <span class="label">💻 Modalidad:</span>
            <span>{{ formatModalidad(vacante.modalidad) }}</span>
          </div>
          
          <div class="detail-row" v-if="vacante.tipo_empleo">
            <span class="label">⏰ Tipo:</span>
            <span>{{ formatTipoEmpleo(vacante.tipo_empleo) }}</span>
          </div>
          
          <div class="detail-row" v-if="vacante.salario_min || vacante.salario_max">
            <span class="label">💰 Salario:</span>
            <span>{{ formatSalario(vacante.salario_min, vacante.salario_max) }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">📅 Publicada:</span>
            <span>{{ formatDate(vacante.publicada_en) }}</span>
          </div>
          
          <div class="detail-row" v-if="vacante.fecha_limite">
            <span class="label">⏳ Fecha límite:</span>
            <span>{{ formatDate(vacante.fecha_limite) }}</span>
          </div>
        </div>

        <div class="vacante-content">
          <p>{{ truncateContent(vacante.descripcion, 150) }}</p>
        </div>

        <div class="vacante-actions">
          <router-link 
            :to="`/vacantes/${vacante.id}/edit`" 
            class="btn btn-secondary btn-sm"
          >
            ✏️ Editar
          </router-link>
          <button 
            @click="confirmDelete(vacante)"
            class="btn btn-danger btn-sm"
            :disabled="vacanteStore.isLoading"
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
        <p>¿Estás seguro de que deseas eliminar la vacante "<strong>{{ vacanteToDelete?.titulo }}</strong>"?</p>
        <p class="warning">Esta acción no se puede deshacer.</p>
        
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn btn-secondary">
            Cancelar
          </button>
          <button 
            @click="deleteVacante" 
            class="btn btn-danger"
            :disabled="vacanteStore.isLoading"
          >
            {{ vacanteStore.isLoading ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useVacanteStore } from '../stores/vacante.js'

const vacanteStore = useVacanteStore()

const showDeleteModal = ref(false)
const vacanteToDelete = ref(null)

const filters = reactive({
  estado: '',
  buscar: ''
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatModalidad = (modalidad) => {
  const modalidades = {
    'presencial': 'Presencial',
    'remoto': 'Remoto',
    'híbrido': 'Híbrido'
  }
  return modalidades[modalidad] || modalidad
}

const formatTipoEmpleo = (tipo) => {
  const tipos = {
    'tiempo_completo': 'Tiempo Completo',
    'medio_tiempo': 'Medio Tiempo',
    'temporal': 'Temporal',
    'prácticas': 'Prácticas'
  }
  return tipos[tipo] || tipo
}

const formatSalario = (min, max) => {
  if (min && max) {
    return `Q${min.toLocaleString()} - Q${max.toLocaleString()}`
  }
  if (min) {
    return `Desde Q${min.toLocaleString()}`
  }
  if (max) {
    return `Hasta Q${max.toLocaleString()}`
  }
  return 'A convenir'
}

const truncateContent = (content, length) => {
  if (!content) return ''
  if (content.length <= length) return content
  return content.slice(0, length) + '...'
}

const confirmDelete = (vacante) => {
  vacanteToDelete.value = vacante
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  vacanteToDelete.value = null
}

const deleteVacante = async () => {
  try {
    await vacanteStore.deleteVacante(vacanteToDelete.value.id)
    closeDeleteModal()
  } catch (error) {
    console.error('Error al eliminar vacante:', error)
  }
}

const applyFilters = () => {
  loadVacantes()
}

const clearFilters = () => {
  filters.estado = ''
  filters.buscar = ''
  loadVacantes()
}

const loadVacantes = () => {
  const activeFilters = {}
  if (filters.estado) activeFilters.estado = filters.estado
  if (filters.buscar) activeFilters.buscar = filters.buscar
  
  vacanteStore.fetchVacantes(activeFilters)
}

onMounted(() => {
  loadVacantes()
})
</script>

<style scoped>
.vacantes-list {
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

.filters {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
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

.vacantes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.vacante-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid #10b981;
}

.vacante-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-closed {
  border-left-color: #ef4444 !important;
  opacity: 0.8;
}

.vacante-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.vacante-header h3 {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

.estado-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  white-space: nowrap;
}

.estado-badge.abierta {
  background-color: #dcfce7;
  color: #166534;
}

.estado-badge.cerrada {
  background-color: #fee2e2;
  color: #991b1b;
}

.vacante-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  gap: 0.5rem;
}

.detail-row .label {
  font-weight: 500;
  color: #6b7280;
  min-width: 100px;
  flex-shrink: 0;
}

.vacante-content p {
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.vacante-actions {
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
  .vacantes-list {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    min-width: auto;
  }

  .vacantes-grid {
    grid-template-columns: 1fr;
  }

  .vacante-header {
    flex-direction: column;
    align-items: start;
  }

  .modal {
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>