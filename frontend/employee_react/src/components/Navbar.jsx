import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Si más adelante usas token, aquí lo borras
    // localStorage.removeItem("AUTH_TOKEN");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    "sidebar-link" + (isActive ? " sidebar-link-active" : "");

  return (
    <aside className="sidebar">
      {/* LOGO + NOMBRE */}
      <div className="sidebar-header">
        <div className="sidebar-logo-circle">IH</div>
        <div className="sidebar-title">
          <h1>IntraHub</h1>
          <span>Empleado</span>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="sidebar-nav">
        <NavLink to="/" className={linkClass}>
          Noticias
        </NavLink>
        <NavLink to="/vacantes" className={linkClass}>
          Vacantes
        </NavLink>
        <NavLink to="/perfil" className={linkClass}>
          Mi perfil
        </NavLink>
        <NavLink to="/boletas" className={linkClass}>
          Boletas
        </NavLink>
      </nav>

      {/* BOTÓN SALIR */}
      <button className="sidebar-logout" onClick={handleLogout}>
        Salir
      </button>
    </aside>
  );
}
