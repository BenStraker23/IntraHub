import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo-intrahub.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { login, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log('Login form submitted with:', { email });

    try {
      const result = await login(email, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to home...');
        // Redireccionar al dashboard
        navigate("/");
      } else {
        console.log('Login failed:', result.error);
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error('Login exception:', error);
      setError("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
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

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
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
