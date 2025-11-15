import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import HomeNews from "../pages/HomeNews";
import Vacantes from "../pages/Vacantes";
import Perfil from "../pages/Perfil";
import Boletas from "../pages/Boletas";
import Navbar from "../components/Navbar";

export default function AppRouter() {
  return (
    <Routes>
      {/* Páginas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/restablecer" element={<ResetPassword />} />

      {/* Ahora HomeNews es público */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <HomeNews />
          </>
        }
      />

      <Route
        path="/vacantes"
        element={
          <>
            <Navbar />
            <Vacantes />
          </>
        }
      />

      <Route
        path="/perfil"
        element={
          <>
            <Navbar />
            <Perfil />
          </>
        }
      />

      <Route
        path="/boletas"
        element={
          <>
            <Navbar />
            <Boletas />
          </>
        }
      />
    </Routes>
  );
}
