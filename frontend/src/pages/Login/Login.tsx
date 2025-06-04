import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

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
      setError((err as Error).message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h1 className="login-brand">Splity</h1>
          <p className="login-slogan">
            Organiza tus finanzas compartidas fácilmente.
          </p>
        </div>
        <div className="login-right">
          <h2 className="login-title">Iniciar Sesión</h2>
          <input
            type="email"
            placeholder="Correo"
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPass(e.target.value)}
            className="login-input"
          />
          {error && <p className="login-error">{error}</p>}
          <button onClick={handleLogin} className="login-button">
            Iniciar sesión
          </button>
          <p className="login-register-text">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="login-link">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
