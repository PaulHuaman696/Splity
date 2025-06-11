import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f9fafb",
  },
  contentWrapper: {
    display: "flex",
    flex: 1,
    overflow: "hidden", // clave para evitar scroll duplicado
  },
  main: {
    flex: 1,
    padding: "24px",
    overflowY: "auto", // permite que el contenido crezca scrollable
  },
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  return (
    <div style={styles.layout}>
      <Navbar toggleSidebar={toggleSidebar}/>
      <div style={styles.contentWrapper}>
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)}/>
        <main style={styles.main} onClick={() => sidebarOpen && setSidebarOpen(false)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;