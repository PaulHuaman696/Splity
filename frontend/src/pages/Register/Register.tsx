import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

  const handleRegister = async () => {
    setError("");

    if (pass !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredential.user;

      // Obtener token
      const token = await user.getIdToken();

      // Guardar token
      localStorage.setItem("token", token);

      // Llamar backend para crear/actualizar usuario
      await fetch(`${api_url}/api/user/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: user.email || "",
        }),
      });

      // Redirigir a home
      navigate("/home");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-left">
          <h1 className="register-brand">Splity</h1>
          <p className="register-slogan">
            Regístrate y comienza a controlar tus gastos compartidos.
          </p>
        </div>
        <div className="register-right">
          <h2 className="register-title">Crear cuenta</h2>
          <input
            type="text"
            placeholder="Nombre completo"
            onChange={(e) => setFullName(e.target.value)}
            className="register-input"
            value={fullName}
          />
          <input
            type="email"
            placeholder="Correo"
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPass(e.target.value)}
            className="register-input"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            onChange={(e) => setConfirmPass(e.target.value)}
            className="register-input"
          />
          {error && <p className="register-error">{error}</p>}
          <button onClick={handleRegister} className="register-button">
            Registrarse
          </button>
          <p className="register-login-text">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="register-link">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
