import React, { useState } from "react";

export default function Perfil() {
  const [form, setForm] = useState({
    nombre: "Empleado Demo",
    correo: "empleado@empresa.com",
    telefono: "5555-5555",
    direccion: "Ciudad de Guatemala, Zona 1",
    puesto: "Analista de Sistemas",
    edad: "25",
    nacimiento: "2000-05-20"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = () => {
    alert("Información actualizada correctamente.");
  };

  return (
    <div className="home-wrapper">
      <div className="home-header">
        <h1 className="home-title">Mi Perfil</h1>
        <p className="home-subtitle">
          Actualiza tu información personal registrada en IntraHub.
        </p>
      </div>

      <div className="perfil-container">
        <div className="perfil-box">
          {/* NOMBRE */}
          <label>Nombre completo</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />

          {/* CORREO */}
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
          />

          {/* TELÉFONO */}
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
          />

          {/* DIRECCIÓN */}
          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
          />

          {/* PUESTO */}
          <label>Puesto</label>
          <input
            type="text"
            name="puesto"
            value={form.puesto}
            onChange={handleChange}
          />

          {/* EDAD */}
          <label>Edad</label>
          <input
            type="number"
            name="edad"
            value={form.edad}
            onChange={handleChange}
          />

          {/* FECHA DE NACIMIENTO */}
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="nacimiento"
            value={form.nacimiento}
            onChange={handleChange}
          />

          <button className="vacante-btn" onClick={guardarCambios}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
