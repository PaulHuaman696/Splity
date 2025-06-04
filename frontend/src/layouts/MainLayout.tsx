import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

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
  return (
    <div style={styles.layout}>
      <Navbar />
      <div style={styles.contentWrapper}>
        <Sidebar />
        <main style={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;