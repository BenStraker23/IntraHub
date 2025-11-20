import React, { useState } from "react";

export default function CargaCV() {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    direccion: "",
    dpi: "",
    telefono1: "",
    telefono2: "",
    ocupacion: "",
    correo: "",
    expectativaSalarial: "",
    linkedin: "",
    experiencia: "",
    disponibilidad: "Inmediata",
  });

  const [cvFile, setCvFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Solo se permiten archivos PDF.");
      e.target.value = null;
      setCvFile(null);
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cvFile) {
      alert("Por favor adjunta tu CV en formato PDF.");
      return;
    }

    // Aquí podrías armar un FormData y enviarlo al backend.
    console.log("Datos del formulario:", form);
    console.log("Archivo CV:", cvFile);

    alert("CV enviado correctamente (simulado).");

    // Opcional: limpiar formulario
    // e.target.reset();
    // setCvFile(null);
  };

  return (
    <div className="home-wrapper">
      {/* Encabezado centrado */}
      <div className="home-header">
        <h1 className="home-title">Carga de CV</h1>
        <p className="home-subtitle">
          Completa tus datos y adjunta tu currículum en PDF para futuras vacantes internas.
        </p>
      </div>

      {/* Contenedor principal */}
      <div className="cargacv-container">
        <form className="perfil-box cargacv-form" onSubmit={handleSubmit}>
          {/* FILA 1 */}
          <div className="cargacv-grid">
            <div>
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* FILA 2 */}
          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Ej. Ciudad de Guatemala, Zona 7"
          />

          {/* FILA 3 */}
          <div className="cargacv-grid">
            <div>
              <label>DPI</label>
              <input
                type="text"
                name="dpi"
                value={form.dpi}
                onChange={handleChange}
                placeholder="0000 00000 0000"
              />
            </div>

            <div>
              <label>Teléfono principal</label>
              <input
                type="text"
                name="telefono1"
                value={form.telefono1}
                onChange={handleChange}
                placeholder="Ej. 5555-5555"
              />
            </div>

            <div>
              <label>Teléfono secundario</label>
              <input
                type="text"
                name="telefono2"
                value={form.telefono2}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
          </div>

          {/* FILA 4 */}
          <div className="cargacv-grid">
            <div>
              <label>Ocupación actual</label>
              <input
                type="text"
                name="ocupacion"
                value={form.ocupacion}
                onChange={handleChange}
                placeholder="Ej. Desarrollador Jr., Estudiante, etc."
              />
            </div>

            <div>
              <label>Correo electrónico</label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="tucorreo@empresa.com"
                required
              />
            </div>
          </div>

          {/* FILA 5 */}
          <div className="cargacv-grid">
            <div>
              <label>Expectativa salarial (mensual)</label>
              <input
                type="text"
                name="expectativaSalarial"
                value={form.expectativaSalarial}
                onChange={handleChange}
                placeholder="Ej. Q6,000"
              />
            </div>

            <div>
              <label>LinkedIn / Portafolio</label>
              <input
                type="url"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/usuario"
              />
            </div>
          </div>

          {/* EXPERIENCIA */}
          <label>Resumen de experiencia</label>
          <textarea
            name="experiencia"
            value={form.experiencia}
            onChange={handleChange}
            rows={4}
            placeholder="Describe brevemente tu experiencia, tecnologías que manejas o áreas de interés."
            className="cargacv-textarea"
          />

          {/* DISPONIBILIDAD */}
          <label>Disponibilidad</label>
          <select
            name="disponibilidad"
            value={form.disponibilidad}
            onChange={handleChange}
          >
            <option value="Inmediata">Inmediata</option>
            <option value="15 días">15 días</option>
            <option value="30 días">30 días</option>
          </select>

          {/* CARGA DE PDF */}
          <label>Adjuntar CV (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
          {cvFile && (
            <p className="cv-file-name">
              Archivo seleccionado: <strong>{cvFile.name}</strong>
            </p>
          )}

          {/* BOTÓN ENVIAR */}
          <button type="submit" className="vacante-btn">
            Enviar CV
          </button>
        </form>
      </div>
    </div>
  );
}
