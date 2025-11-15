<template>
  <div class="vacante-form">
    <div class="form-header">
      <router-link to="/vacantes" class="back-btn">
        ← Volver a Vacantes
      </router-link>
      <h1>{{ isEditing ? 'Editar Vacante' : 'Nueva Vacante' }}</h1>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="form">
        <!-- Información básica -->
        <div class="form-section">
          <h3>Información Básica</h3>
          
          <div class="form-group">
            <label for="titulo" class="required">Título del Puesto</label>
            <input
              id="titulo"
              v-model="form.titulo"
              type="text"
              required
              :disabled="isLoading"
              placeholder="Ej: Desarrollador Full Stack Senior"
              maxlength="255"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="departamento">Departamento</label>
              <input
                id="departamento"
                v-model="form.departamento"
                type="text"
                :disabled="isLoading"
                placeholder="Ej: Tecnología"
                maxlength="255"
              />
            </div>

            <div class="form-group">
              <label for="ubicacion">Ubicación</label>
              <input
                id="ubicacion"
                v-model="form.ubicacion"
                type="text"
                :disabled="isLoading"
                placeholder="Ej: Ciudad de Guatemala"
                maxlength="255"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="modalidad">Modalidad de Trabajo</label>
              <select
                id="modalidad"
                v-model="form.modalidad"
                :disabled="isLoading"
              >
                <option value="">Seleccionar modalidad</option>
                <option value="presencial">Presencial</option>
                <option value="remoto">Remoto</option>
                <option value="híbrido">Híbrido</option>
              </select>
            </div>

            <div class="form-group">
              <label for="tipo_empleo">Tipo de Empleo</label>
              <select
                id="tipo_empleo"
                v-model="form.tipo_empleo"
                :disabled="isLoading"
              >
                <option value="">Seleccionar tipo</option>
                <option value="tiempo_completo">Tiempo Completo</option>
                <option value="medio_tiempo">Medio Tiempo</option>
                <option value="temporal">Temporal</option>
                <option value="prácticas">Prácticas</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Información salarial -->
        <div class="form-section">
          <h3>Información Salarial</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="salario_min">Salario Mínimo (GTQ)</label>
              <input
                id="salario_min"
                v-model.number="form.salario_min"
                type="number"
                :disabled="isLoading"
                placeholder="8000"
                min="0"
                step="100"
              />
            </div>

            <div class="form-group">
              <label for="salario_max">Salario Máximo (GTQ)</label>
              <input
                id="salario_max"
                v-model.number="form.salario_max"
                type="number"
                :disabled="isLoading"
                placeholder="12000"
                min="0"
                step="100"
              />
            </div>
          </div>
        </div>

        <!-- Descripción y fechas -->
        <div class="form-section">
          <h3>Descripción y Fechas</h3>
          
          <div class="form-group">
            <label for="descripcion" class="required">Descripción del Puesto</label>
            <textarea
              id="descripcion"
              v-model="form.descripcion"
              required
              :disabled="isLoading"
              placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
              rows="10"
            ></textarea>
            <small class="field-help">{{ form.descripcion.length }} caracteres</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="publicada_en">Fecha de Publicación</label>
              <input
                id="publicada_en"
                v-model="form.publicada_en"
                type="datetime-local"
                :disabled="isLoading"
              />
              <small class="field-help">
                Si no seleccionas una fecha, se publicará inmediatamente
              </small>
            </div>

            <div class="form-group">
              <label for="fecha_limite">Fecha Límite de Aplicación</label>
              <input
                id="fecha_limite"
                v-model="form.fecha_limite"
                type="date"
                :disabled="isLoading"
              />
              <small class="field-help">
                Fecha hasta la cual se aceptarán aplicaciones
              </small>
            </div>
          </div>

          <div class="form-group">
            <label for="estado">Estado de la Vacante</label>
            <select
              id="estado"
              v-model="form.estado"
              :disabled="isLoading"
            >
              <option value="abierta">🟢 Abierta</option>
              <option value="cerrada">🔴 Cerrada</option>
            </select>
          </div>
        </div>

        <div v-if="error" class="error-message">
          <strong>Error:</strong> {{ error }}
        </div>

        <div class="form-actions">
          <router-link to="/vacantes" class="btn btn-secondary">
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
            <h4>{{ form.titulo || 'Título del puesto' }}</h4>
            <span 
              class="estado-badge"
              :class="form.estado"
            >
              {{ form.estado === 'abierta' ? '🟢 Abierta' : '🔴 Cerrada' }}
            </span>
          </div>

          <div class="preview-details">
            <div class="detail-row" v-if="form.departamento">
              <span class="label">🏢 Departamento:</span>
              <span>{{ form.departamento }}</span>
            </div>
            
            <div class="detail-row" v-if="form.ubicacion">
              <span class="label">📍 Ubicación:</span>
              <span>{{ form.ubicacion }}</span>
            </div>
            
            <div class="detail-row" v-if="form.modalidad">
              <span class="label">💻 Modalidad:</span>
              <span>{{ formatModalidad(form.modalidad) }}</span>
            </div>
            
            <div class="detail-row" v-if="form.tipo_empleo">
              <span class="label">⏰ Tipo:</span>
              <span>{{ formatTipoEmpleo(form.tipo_empleo) }}</span>
            </div>
            
            <div class="detail-row" v-if="form.salario_min || form.salario_max">
              <span class="label">💰 Salario:</span>
              <span>{{ formatSalario(form.salario_min, form.salario_max) }}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">📅 Publicada:</span>
              <span>{{ formatPreviewDate(form.publicada_en) }}</span>
            </div>
            
            <div class="detail-row" v-if="form.fecha_limite">
              <span class="label">⏳ Fecha límite:</span>
              <span>{{ formatDate(form.fecha_limite) }}</span>
            </div>
          </div>

          <div class="preview-content">
            <p>{{ form.descripcion || 'La descripción del puesto aparecerá aquí...' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVacanteStore } from '../stores/vacante.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const vacanteStore = useVacanteStore()
const authStore = useAuthStore()

const props = defineProps({
  id: String
})

const isEditing = computed(() => !!props.id)
const isLoading = ref(false)
const error = ref(null)

const form = reactive({
  titulo: '',
  departamento: '',
  ubicacion: 'Ciudad de Guatemala',
  modalidad: 'presencial',
  tipo_empleo: 'tiempo_completo',
  salario_min: null,
  salario_max: null,
  descripcion: '',
  estado: 'abierta',
  publicada_en: '',
  fecha_limite: ''
})

const isFormValid = computed(() => {
  return form.titulo.trim() && form.descripcion.trim()
})

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

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

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
  return isEditing.value ? 'Actualizar Vacante' : 'Crear Vacante'
}

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  try {
    const vacanteData = {
      titulo: form.titulo.trim(),
      departamento: form.departamento.trim() || null,
      ubicacion: form.ubicacion.trim() || null,
      modalidad: form.modalidad || null,
      tipo_empleo: form.tipo_empleo || null,
      salario_min: form.salario_min || null,
      salario_max: form.salario_max || null,
      descripcion: form.descripcion.trim(),
      estado: form.estado,
      publicada_en: form.publicada_en || null,
      fecha_limite: form.fecha_limite || null
    }

    if (isEditing.value) {
      await vacanteStore.updateVacante(props.id, vacanteData)
    } else {
      await vacanteStore.createVacante(vacanteData)
    }

    router.push('/vacantes')
  } catch (err) {
    error.value = err.message || 'Error al guardar la vacante'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

const loadVacanteForEditing = async () => {
  if (isEditing.value) {
    try {
      isLoading.value = true
      const vacante = await vacanteStore.fetchVacanteById(props.id)
      
      form.titulo = vacante.titulo || ''
      form.departamento = vacante.departamento || ''
      form.ubicacion = vacante.ubicacion || ''
      form.modalidad = vacante.modalidad || 'presencial'
      form.tipo_empleo = vacante.tipo_empleo || 'tiempo_completo'
      form.salario_min = vacante.salario_min || null
      form.salario_max = vacante.salario_max || null
      form.descripcion = vacante.descripcion || ''
      form.estado = vacante.estado || 'abierta'
      
      if (vacante.publicada_en) {
        const date = new Date(vacante.publicada_en)
        form.publicada_en = date.toISOString().slice(0, 16)
      }
      
      if (vacante.fecha_limite) {
        const date = new Date(vacante.fecha_limite)
        form.fecha_limite = date.toISOString().slice(0, 10)
      }
    } catch (err) {
      error.value = 'Error al cargar la vacante'
      console.error('Error:', err)
    } finally {
      isLoading.value = false
    }
  }
}

onMounted(() => {
  loadVacanteForEditing()
})
</script>

<style scoped>
.vacante-form {
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

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f3f4f6;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h3 {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-group input:disabled,
.form-group textarea:disabled,
.form-group select:disabled {
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
  border-left: 4px solid #10b981;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.preview-header h4 {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  min-height: 1.5rem;
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

.preview-details {
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
  .vacante-form {
    padding: 1rem;
  }

  .form {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .preview-header {
    flex-direction: column;
    align-items: start;
  }
}
</style>