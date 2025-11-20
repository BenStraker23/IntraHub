import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (form.password !== form.password_confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Ajusta la ruta a tu backend real
      await api.post("/register", form);
      setMensaje("Usuario creado correctamente. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setError("Error al crear el usuario. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2>Crear usuario</h2>
          <p className="login-subtitle">
            Registra tu cuenta para acceder a IntraHub.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Nombre completo:</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Correo:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <label>Confirmar contraseña:</label>
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />

            {error && <p className="error">{error}</p>}
            {mensaje && <p className="success">{mensaje}</p>}

            <button type="submit">Crear cuenta</button>
          </form>

          <div className="login-links">
            <span>¿Ya tienes cuenta?</span>
            <Link to="/login">Iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
