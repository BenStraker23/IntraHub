import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      // Ajusta la ruta a tu backend real
      await api.post("/auth/forgot-password", { email });
      setMensaje(
        "Si el correo existe en el sistema, se enviarán instrucciones para restablecer la contraseña."
      );
    } catch {
      setError("Ocurrió un error. Inténtalo más tarde.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2>Restablecer contraseña</h2>
          <p className="login-subtitle">
            Ingresa tu correo para recibir instrucciones.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Correo:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="error">{error}</p>}
            {mensaje && <p className="success">{mensaje}</p>}

            <button type="submit">Enviar enlace</button>
          </form>

          <div className="login-links">
            <span>¿Recordaste tu contraseña?</span>
            <Link to="/login">Volver al login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
