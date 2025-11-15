import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo-intrahub.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🚀 Redirección directa SIN login real
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          {/* LOGO */}
          <div className="logo-wrapper">
            <img src={logo} alt="IntraHub Logo" className="login-logo" />
          </div>

          <h2>Iniciar sesión</h2>
          <p className="login-subtitle">
            Accede al portal interno de IntraHub.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Correo:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Entrar</button>
          </form>

          <div className="login-links">
            <span>¿No tienes cuenta?</span>
            <Link to="/registro">Crear usuario</Link>
          </div>
          <div className="login-links">
            <span>¿Olvidaste tu contraseña?</span>
            <Link to="/restablecer">Restablecer contraseña</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
