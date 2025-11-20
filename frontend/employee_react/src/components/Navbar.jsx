import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
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
          <span>{user?.name || 'Usuario'}</span>
          {isAdmin() && <small className="admin-badge">Admin</small>}
        </div>
        
        {/* NOTIFICACIONES */}
        <div className="sidebar-notifications">
          <NotificationDropdown />
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
        <NavLink to="/cargacv" className={linkClass}>
          Carga de CV
        </NavLink>
        <NavLink to="/notifications" className={linkClass}>
          Notificaciones
        </NavLink>
        <NavLink to="/perfil" className={linkClass}>
          Mi perfil
        </NavLink>
        <NavLink to="/boletas" className={linkClass}>
          Boletas
        </NavLink>
        
        {/* OPCIONES DE ADMIN */}
        {isAdmin() && (
          <>
            <div className="sidebar-divider"></div>
            <span className="sidebar-section-title">Administración</span>
            <NavLink to="/admin/vacantes" className={linkClass}>
              Gestionar Vacantes
            </NavLink>
            <NavLink to="/admin/news" className={linkClass}>
              Gestionar Noticias
            </NavLink>
          </>
        )}
      </nav>

      {/* BOTÓN SALIR */}
      <button className="sidebar-logout" onClick={handleLogout}>
        Salir
      </button>
    </aside>
  );
}
