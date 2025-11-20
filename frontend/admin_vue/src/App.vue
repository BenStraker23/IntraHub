<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// La lógica del router y autenticación está en los composables y router
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  color: #2c3e50;
}

#app {
  width: 100%;
  min-height: 100vh;
}

/* Utilidades globales */
.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
}

/* Botones globales */
.btn-primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2980b9, #1f618d);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
  border: 2px solid #bdc3c7;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #d5dbdb;
  border-color: #95a5a6;
}

/* Responsive */
@media (max-width: 768px) {
  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: 1rem;
  }
}
</style>
