import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredential.user;

      // ✅ Obtener token del usuario autenticado
      const token = await user.getIdToken();

      // ✅ Guardar token en localStorage (opcional, para usarlo luego en peticiones)
      localStorage.setItem("token", token);

      // ✅ Crear o actualizar el usuario en tu backend
      await fetch("http://localhost:4000/api/user/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName || "", // por si no tiene displayName
          email: user.email || "",
        }),
      });

      navigate("/home");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.leftPanel}>
          <h1 style={styles.brand}>Splity</h1>
          <p style={styles.slogan}>
            Organiza tus finanzas compartidas fácilmente.
          </p>
        </div>
        <div style={styles.rightPanel}>
          <h2 style={styles.title}>Iniciar Sesión</h2>
          <input
            type="email"
            placeholder="Correo"
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPass(e.target.value)}
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button onClick={handleLogin} style={styles.button}>
            Iniciar sesión
          </button>
          <p style={styles.registerText}>
            ¿No tienes una cuenta?{" "}
            <Link to="/register" style={styles.link}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#FFF8E7",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },
  leftPanel: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    color: "white",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  brand: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  slogan: {
    fontSize: "1.2rem",
    lineHeight: 1.5,
  },
  rightPanel: {
    flex: 1,
    padding: "3rem 2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1rem",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
    color: "#1E3A8A",
    textAlign: "center",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "8px",
    backgroundColor: "#1E3A8A",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  registerText: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#333",
  },
  link: {
    color: "#1E3A8A",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;
