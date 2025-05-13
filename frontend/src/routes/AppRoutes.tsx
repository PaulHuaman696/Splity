// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import GastosList from "../pages/Gastos/GastosList";
import GastoForm from "../pages/Gastos/GastoForm";
import Ingresos from "../pages/Ingresos";
import Compartidos from "../pages/Compartidos";
import Reportes from "../pages/Reportes";
import Perfil from "../pages/Perfil";
import MainLayout from "../layouts/MainLayout";

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
        <Route path="/ingresos" element={<Ingresos />} />
        <Route path="/compartidos" element={<Compartidos />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </MainLayout>
  );
}
