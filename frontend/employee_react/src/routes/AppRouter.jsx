import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import HomeNews from "../pages/HomeNews";
import Vacantes from "../pages/Vacantes";
import Perfil from "../pages/Perfil";
import Boletas from "../pages/Boletas";
import AdminVacantes from "../pages/AdminVacantes";
import AdminNews from "../pages/AdminNews";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* Páginas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/restablecer" element={<ResetPassword />} />

      {/* Páginas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navbar />
            <HomeNews />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vacantes"
        element={
          <ProtectedRoute>
            <Navbar />
            <Vacantes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Navbar />
            <Perfil />
          </ProtectedRoute>
        }
      />

      <Route
        path="/boletas"
        element={
          <ProtectedRoute>
            <Navbar />
            <Boletas />
          </ProtectedRoute>
        }
      />

      {/* Rutas de administración (solo admin) */}
      <Route
        path="/admin/vacantes"
        element={
          <ProtectedRoute adminOnly={true}>
            <Navbar />
            <AdminVacantes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/news"
        element={
          <ProtectedRoute adminOnly={true}>
            <Navbar />
            <AdminNews />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
