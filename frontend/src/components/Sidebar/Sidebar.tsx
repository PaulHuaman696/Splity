import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";
interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}
const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const [gastosOpen, setGastosOpen] = useState(false);
  const [ingresosOpen, setIngresosOpen] = useState(false);
  const [proyectosOpen, setProyectosOpen] = useState(false);
  const location = useLocation();

  // Detecta si la ruta actual es parte del módulo de gastos
  const isGastoPath = location.pathname.startsWith("/gastos");
  // Detecta si la ruta actual es parte del módulo de gastos
  const isIngresoPath = location.pathname.startsWith("/ingresos");
  // Detecta si la ruta actual es parte del módulo de gastos
  const isProyectoPath = location.pathname.startsWith("/proyectos-gastos");
  // Cierra el sidebar al hacer click en un enlace (opcional)
  const handleLinkClick = () => {
    if (window.innerWidth < 768) closeSidebar();
  };
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul className="sidebar-list">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
          onClick={handleLinkClick}>
          Dashboard
        </NavLink>

        <li className="sidebar-item">
          <div
            onClick={() => setIngresosOpen(!ingresosOpen)}
            className={`sidebar-link sidebar-toggle ${
              isIngresoPath ? "active" : ""
            }`}>
            Ingresos {ingresosOpen ? "▲" : "▼"}
          </div>
          {ingresosOpen && (
            <ul className="sidebar-sublist">
              <li>
                <NavLink
                  to="/ingresos/crear"
                  className={({ isActive }) =>
                    isActive ? "sidebar-sublink active-sub" : "sidebar-sublink"
                  }
                  onClick={handleLinkClick}>
                  Crear Ingreso
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/ingresos/lista"
                  className={({ isActive }) =>
                    isActive ? "sidebar-sublink active-sub" : "sidebar-sublink"
                  }
                  onClick={handleLinkClick}>
                  Ver Ingresos
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="sidebar-item">
          <div
            onClick={() => setGastosOpen(!gastosOpen)}
            className={`sidebar-link sidebar-toggle ${
              isGastoPath ? "active" : ""
            }`}>
            Gastos {gastosOpen ? "▲" : "▼"}
          </div>
          {gastosOpen && (
            <ul className="sidebar-sublist">
              <li>
                <NavLink
                  to="/gastos/crear"
                  className={({ isActive }) =>
                    isActive ? "sidebar-sublink active-sub" : "sidebar-sublink"
                  }
                  onClick={handleLinkClick}>
                  Crear Gasto
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/gastos/lista"
                  className={({ isActive }) =>
                    isActive ? "sidebar-sublink active-sub" : "sidebar-sublink"
                  }
                  onClick={handleLinkClick}>
                  Ver Gastos
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="sidebar-item">
          <div
            onClick={() => setProyectosOpen(!proyectosOpen)}
            className={`sidebar-link sidebar-toggle ${
              isProyectoPath ? "active" : ""
            }`}>
            Proyectos {proyectosOpen ? "▲" : "▼"}
          </div>
          {proyectosOpen && (
            <ul className="sidebar-sublist">
              <li>
                <NavLink
                  to="/proyectos-gastos/crear"
                  className={({ isActive }) =>
                    isActive ? "sidebar-sublink active-sub" : "sidebar-sublink"
                  }
                  onClick={handleLinkClick}>
                  Crear Proyecto
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/proyectos-gastos/lista"
                  className={({ isActive }) =>
                    isActive ? "sidebar-sublink active-sub" : "sidebar-sublink"
                  }
                  onClick={handleLinkClick}>
                  Ver Proyectos
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <NavLink
          to="/reportes"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
          onClick={handleLinkClick}>
          Reportes
        </NavLink>

        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
          onClick={handleLinkClick}>
          Perfil
        </NavLink>
      </ul>
    </aside>
  );
};

export default Sidebar;
