# 🗄️ Configuración de Base de Datos para IntraHub

## Configuración Compartida

Tanto **admin_vue** (Vue.js) como **employee_react** (React) usan la **misma base de datos** y tabla `users`.

### 📊 **Base de Datos MySQL**
```
Host: 127.0.0.1
Port: 3307
Database: intrahub_db
Username: root
Password: admon
```

### 👥 **Tabla Users Compartida**
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified_at TIMESTAMP NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('cliente', 'admin') DEFAULT 'cliente',
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 Usuarios de Prueba

### 👨‍💼 **Administrador** (para admin_vue)
```
Email: admin@intrahub.com
Password: admin123
Role: admin
```

### 👥 **Empleados** (para employee_react)
```
Email: empleado@intrahub.com
Password: empleado123
Role: cliente

Email: maria@intrahub.com  
Password: maria123
Role: cliente

Email: carlos@intrahub.com
Password: carlos123  
Role: cliente
```

## 🔄 Flujo de Autenticación

### Para **Admin Vue** (Puerto 5173):
1. Login en: `http://localhost:5173/login`
2. Usar: `admin@intrahub.com / admin123`
3. Dashboard: `http://localhost:5173/dashboard`

### Para **Employee React** (Puerto 3000):
1. Login en: `http://localhost:3000/login`
2. Usar cualquier empleado: `empleado@intrahub.com / empleado123`
3. Dashboard: `http://localhost:3000/dashboard`

## 🌐 URLs del Proyecto

### Backend (Laravel API)
- **URL**: `http://localhost:8000`
- **API Base**: `http://localhost:8000/api`

### Frontend Admin (Vue.js)
- **URL**: `http://localhost:5173`
- **Panel**: Administración de noticias y vacantes

### Frontend Employee (React)
- **URL**: `http://localhost:3000`  
- **Panel**: Vista de empleado (noticias, vacantes, perfil)

## 🚀 Comandos Útiles

### Iniciar Backend Laravel:
```bash
cd backend/laravel_api
php artisan serve --port=8000
```

### Iniciar Frontend Admin Vue:
```bash
cd frontend/admin_vue  
npm run dev
```

### Iniciar Frontend Employee React:
```bash
cd frontend/employee_react
npm run dev
```

### Resetear Base de Datos:
```bash
cd backend/laravel_api
php artisan migrate:fresh
php artisan db:seed --class=UsersSeeder
```

## 📝 Variables de Entorno

### Backend (.env)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1  
DB_PORT=3307
DB_DATABASE=intrahub_db
DB_USERNAME=root
DB_PASSWORD=admon
```

### Admin Vue (.env)
```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=IntraHub Admin
```

### Employee React (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_NAME=IntraHub Employee
```

## 🔐 Roles y Permisos

| Role    | Admin Vue | Employee React | Crear Noticias | Crear Vacantes | Ver Noticias | Ver Vacantes |
|---------|-----------|----------------|----------------|----------------|--------------|--------------|
| admin   | ✅        | ❌             | ✅             | ✅             | ✅           | ✅           |
| cliente | ❌        | ✅             | ❌             | ❌             | ✅           | ✅           |

## 🛡️ Seguridad

- **Laravel Sanctum** para autenticación API
- **Tokens** almacenados en localStorage
- **Guards** en rutas frontend
- **Middleware** de verificación de admin en backend
- **Validación** de roles tanto en frontend como backend

---

**¡La configuración está lista para desarrollo!** 🎉