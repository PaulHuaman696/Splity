import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [gastosOpen, setGastosOpen] = useState(false);
  const location = useLocation();

  // Detecta si la ruta actual es parte del módulo de gastos
  const isGastoPath = location.pathname.startsWith("/gastos");

  return (
    <aside style={sidebarStyle}>
      <ul style={ulStyle}>
        <NavLink
          to="/home"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/ingresos"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Ingresos
        </NavLink>

        <li style={{ marginTop: "10px" }}>
          <div
            onClick={() => setGastosOpen(!gastosOpen)}
            style={{
              ...styles.link,
              ...(isGastoPath ? styles.active : {}),
              cursor: "pointer",
            }}
          >
            Gastos {gastosOpen ? "▲" : "▼"}
          </div>
          {gastosOpen && (
            <ul style={{ listStyle: "none", paddingLeft: "15px", marginTop: "5px" }}>
              <li>
                <NavLink
                  to="/gastos/crear"
                  style={({ isActive }) =>
                    isActive ? { ...styles.subLink, ...styles.activeSub } : styles.subLink
                  }
                >
                  Crear Gasto
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/gastos/lista"
                  style={({ isActive }) =>
                    isActive ? { ...styles.subLink, ...styles.activeSub } : styles.subLink
                  }
                >
                  Ver Gastos
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <NavLink
          to="/compartidos"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Compartidos
        </NavLink>

        <NavLink
          to="/reportes"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Reportes
        </NavLink>

        <NavLink
          to="/perfil"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Perfil
        </NavLink>
      </ul>
    </aside>
  );
};

const sidebarStyle: React.CSSProperties = {
  width: "220px",
  backgroundColor: "#f9fafb",
  padding: "1rem",
  height: "100vh",
  position: "fixed",
  top: "60px",
  left: 0,
  borderRight: "1px solid #e5e7eb",
  boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
};

const ulStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  listStyle: "none",
  padding: 0,
};

const styles = {
  link: {
    textDecoration: "none",
    color: "#1f2937",
    fontWeight: 500,
    padding: "10px",
    borderRadius: "6px",
    transition: "all 0.2s ease-in-out",
  },
  active: {
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "bold",
  },
  subLink: {
    textDecoration: "none",
    color: "#374151",
    fontWeight: 400,
    padding: "8px 12px",
    display: "block",
    borderRadius: "4px",
    transition: "all 0.2s ease-in-out",
  },
  activeSub: {
    backgroundColor: "#6366f1",
    color: "white",
    fontWeight: "bold",
  },
};

export default Sidebar;
