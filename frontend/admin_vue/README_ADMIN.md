# Panel Administrativo IntraHub - Vue.js

Panel de administración construido con **Vue 3 + Vite** para la gestión de noticias y vacantes en IntraHub.

## 🚀 Características

- ✅ **Autenticación segura** con Laravel Sanctum
- 📰 **Gestión completa de noticias** (crear, editar, eliminar)
- 💼 **Administración de vacantes** con filtros avanzados
- 📱 **Diseño responsive** para dispositivos móviles
- 🎨 **Interfaz moderna** con componentes reutilizables
- 🔄 **Estado reactivo** con Pinia
- 📋 **Formularios con validación** y vista previa en tiempo real

## 🛠️ Tecnologías

- **Vue 3** (Composition API)
- **Vue Router 4** para navegación
- **Pinia** para manejo de estado
- **Axios** para peticiones HTTP
- **Vite** como bundler

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── router/             # Configuración de rutas
├── services/           # Servicios API
│   ├── api.js         # Configuración base de Axios
│   ├── authService.js  # Autenticación
│   ├── newsService.js  # Gestión de noticias
│   └── vacanteService.js # Gestión de vacantes
├── stores/             # Stores de Pinia
│   ├── auth.js        # Estado de autenticación
│   ├── news.js        # Estado de noticias
│   └── vacante.js     # Estado de vacantes
├── views/              # Vistas principales
│   ├── Dashboard.vue   # Panel principal
│   ├── Login.vue       # Formulario de login
│   ├── NewsList.vue    # Lista de noticias
│   ├── NewsForm.vue    # Formulario de noticias
│   ├── VacantesList.vue # Lista de vacantes
│   └── VacanteForm.vue  # Formulario de vacantes
├── App.vue
└── main.js
```

## 🚀 Configuración e Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar la URL del API
Edita `src/services/api.js` y ajusta la `baseURL`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Cambia por tu URL de Laravel
  timeout: 10000,
  // ...
})
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 4. Construir para producción
```bash
npm run build
```

## 🔐 Autenticación

### Requisitos para el usuario administrador:
- El usuario debe tener `is_admin = true` en la base de datos
- Credenciales válidas en el sistema Laravel

### Flujo de autenticación:
1. Login en `/login`
2. El token se guarda en `localStorage`
3. Todas las peticiones incluyen el token automáticamente
4. Redirección automática al dashboard después del login

## 📰 Gestión de Noticias

### Funcionalidades disponibles:
- ✅ **Crear noticias** con título, contenido y fecha de publicación
- ✅ **Editar noticias** existentes
- ✅ **Eliminar noticias** con confirmación
- ✅ **Vista previa en tiempo real** mientras escribes
- ✅ **Lista ordenada** por fecha de publicación

### Campos disponibles:
- `title` (requerido): Título de la noticia
- `content` (requerido): Contenido completo
- `published_at` (opcional): Fecha de publicación programada

## 💼 Gestión de Vacantes

### Funcionalidades disponibles:
- ✅ **Crear vacantes** completas con todos los detalles
- ✅ **Editar vacantes** existentes
- ✅ **Eliminar vacantes** con confirmación
- ✅ **Filtros avanzados** por estado y búsqueda de texto
- ✅ **Vista previa en tiempo real**
- ✅ **Estados**: Abierta/Cerrada

### Campos disponibles:
- `titulo` (requerido): Título del puesto
- `departamento`: Departamento de la empresa
- `ubicacion`: Ubicación del trabajo
- `modalidad`: Presencial, Remoto, Híbrido
- `tipo_empleo`: Tiempo Completo, Medio Tiempo, Temporal, Prácticas
- `salario_min/max`: Rango salarial en GTQ
- `descripcion` (requerido): Descripción detallada
- `estado`: Abierta/Cerrada
- `publicada_en`: Fecha de publicación
- `fecha_limite`: Fecha límite para aplicar

## 🎨 Características de UI/UX

### Diseño Responsive
- **Desktop**: Layout de 2 columnas con vista previa
- **Tablet**: Adaptación automática del grid
- **Mobile**: Layout de columna única optimizado

### Componentes Reutilizables
- **Botones** con estados y variantes
- **Formularios** con validación en tiempo real
- **Cards** informativos con acciones
- **Modales** de confirmación
- **Estados de carga** y manejo de errores

### Navegación
- **Sidebar navigation** en desktop
- **Breadcrumbs** para navegación contextual
- **Router guards** para proteger rutas
- **Estado de navegación** persistente

## 🔧 APIs Utilizadas

### Endpoints de Noticias:
- `GET /api/news` - Lista de noticias
- `GET /api/news/{id}` - Detalle de noticia
- `POST /api/news` - Crear noticia
- `PUT /api/news/{id}` - Actualizar noticia
- `DELETE /api/news/{id}` - Eliminar noticia

### Endpoints de Vacantes:
- `GET /api/vacantes` - Lista de vacantes (con filtros)
- `GET /api/vacantes/{id}` - Detalle de vacante
- `POST /api/vacantes` - Crear vacante
- `PUT /api/vacantes/{id}` - Actualizar vacante
- `DELETE /api/vacantes/{id}` - Eliminar vacante

### Autenticación:
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Información del usuario

## 🚦 Estados y Manejo de Errores

### Estados de loading:
- Indicadores visuales durante peticiones
- Deshabilitación de botones durante operaciones
- Feedback inmediato al usuario

### Manejo de errores:
- Mensajes de error descriptivos
- Retry automático en algunos casos
- Logout automático en errores 401
- Validación en cliente y servidor

## 📱 Responsive Design

### Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones:
- Navigation collapses en mobile
- Formularios se adaptan a pantalla única
- Grid de cards responsive
- Botones de tamaño completo en mobile

## 🔄 Estado Global (Pinia)

### Auth Store:
```javascript
{
  user: null,           // Usuario actual
  token: null,          // Token de autenticación
  isLoading: false,     // Estado de carga
  error: null          // Errores de autenticación
}
```

### News Store:
```javascript
{
  news: [],            // Array de noticias
  currentNews: null,   // Noticia actual en detalle
  isLoading: false,    // Estado de carga
  error: null         // Errores de operaciones
}
```

### Vacante Store:
```javascript
{
  vacantes: [],        // Array de vacantes
  currentVacante: null, // Vacante actual en detalle
  isLoading: false,    // Estado de carga
  error: null,         // Errores de operaciones
  filters: {           // Filtros activos
    estado: '',
    buscar: ''
  }
}
```

## 🎯 Próximas Mejoras

- [ ] Subida de imágenes para noticias
- [ ] Editor de texto rico (WYSIWYG)
- [ ] Exportación de datos a CSV/PDF
- [ ] Dashboard con estadísticas avanzadas
- [ ] Notificaciones push
- [ ] Gestión de permisos granulares
- [ ] Audit trail de cambios
- [ ] Modo oscuro

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto es parte del sistema IntraHub y está bajo la licencia del proyecto principal.

---

**Desarrollado con ❤️ para IntraHub**