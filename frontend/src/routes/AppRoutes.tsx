// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import GastosList from "../pages/Gastos/GastosList";
import GastoForm from "../pages/Gastos/GastoForm";
import IngresosList from "../pages/Ingresos/IngresosList";
import IngresoForm from "../pages/Ingresos/IngresoForm";
import ProyectoGastoForm from "../pages/ProyectoGasto/ProyectoGastoForm";
import ProyectosGastoList from "../pages/ProyectoGasto/ProyectosGastoList";
import PrestamoForm from "../pages/Prestamo/PrestamoForm";
import Reportes from "../pages/Reportes/Reportes";
import Perfil from "../pages/Perfil/Perfil";
import MainLayout from "../layouts/MainLayout";
import HistorialPrestamos from "../components/HistorialPrestamos/HistorialPrestamos";

export default function AppRoutes() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/gastos/crear" element={<GastoForm />} />
        <Route path="/gastos/lista" element={<GastosList />} />
        <Route path="/ingresos/lista" element={<IngresosList />} />
        <Route path="/ingresos/crear" element={<IngresoForm />} />
        <Route path="/proyectos-gastos/lista" element={<ProyectosGastoList />} />
        <Route path="/proyectos-gastos/crear" element={<ProyectoGastoForm />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/prestamos/nuevo" element={<PrestamoForm />} />
        <Route path="/prestamos/historial" element={<HistorialPrestamos />} />
      </Routes>
    </MainLayout>
  );
}
