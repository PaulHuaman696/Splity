import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Usamos el evento del form
    setCargando(true); // 
    setError("");
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
      await fetch(`${api_url}/api/user/profile`, {
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
      setError("Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h1 className="login-brand">Splity</h1>
          <p className="login-slogan">
            Organiza tus finanzas compartidas de forma simple y elegante.
          </p>
        </div>
        <div className="login-right">
          <form onSubmit={handleLogin}>
            <h2 className="login-title">Iniciar Sesión</h2>

            <div className="login-form-group">
              <label htmlFor="email" className="visually-hidden">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="visually-hidden">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                className="login-input"
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-button" disabled={cargando}>
              {cargando ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <p className="login-register-text">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="login-link">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
