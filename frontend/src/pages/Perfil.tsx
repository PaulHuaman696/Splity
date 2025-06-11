// src/pages/Perfil.tsx
import { useState, useEffect } from "react";
import { authFetch } from "../utils/authFetch"; // Suponiendo que authFetch está en utils
import "./Perfil.css";
import { auth } from "../firebase/firebaseConfig"; // Importa auth desde el archivo firebaseConfig
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"; // Importa las funciones necesarias de Firebase Auth

interface Usuario {
  name?: string;
  email: string;
  uid: string;
}

const Perfil = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null); // Estado para los datos del usuario
  const [editando, setEditando] = useState<boolean>(false); // Estado para saber si estamos editando
  const [formData, setFormData] = useState<Usuario>({} as Usuario); // Estado para el formulario
  const api_url = import.meta.env.VITE_API_URL; // URL de la API

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Obtener el usuario actual de Firebase
      const user = auth.currentUser; // Obtén el usuario autenticado
      if (!user) {
        setPasswordError("Usuario no autenticado.");
        return;
      }

      // Crear las credenciales con la contraseña antigua
      const credential = EmailAuthProvider.credential(
        user.email!,
        passwordForm.oldPassword
      );

      // Reautenticar al usuario con la contraseña actual
      await reauthenticateWithCredential(user, credential);

      // Ahora, realizar la solicitud para cambiar la contraseña
      const response = await authFetch(`${api_url}/api/user/change-password`, {
        method: "POST",
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      });
      // Verifica la respuesta en la consola
      console.log("Respuesta del backend:", response);
      // Procesar la respuesta
      // Procesar la respuesta
      if (response.message === "Contraseña cambiada con éxito.") {
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        alert("Contraseña cambiada con éxito.");
      } else {
        setPasswordError("Error al cambiar la contraseña.");
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña", error);
      setPasswordError("Error al cambiar la contraseña.");
    }
  };

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authFetch(`${api_url}/api/user/me`, {
          method: "GET",
        });
        setUsuario(data); // Guardamos los datos del usuario en el estado
        setFormData(data); // Establecemos los datos iniciales del formulario
      } catch (error) {
        console.error("Error al obtener los datos del usuario", error);
      }
    };
    fetchUserData();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar envío de formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authFetch(`${api_url}/api/user/profile`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setUsuario(response); // Actualizamos los datos del usuario
      setEditando(false); // Salimos del modo de edición
    } catch (error) {
      console.error("Error al actualizar el perfil", error);
    }
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div className="container">
      <h2>Mi Perfil</h2>
      <div className="profile-section">
        {editando ? (
          <form onSubmit={handleSubmit}>
            <label>
              Nombre:
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
            </label>
            <br />
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={() => setEditando(false)}>
              Cancelar
            </button>
          </form>
        ) : (
          <>
            <p>Nombre: {usuario.name}</p>
            <p>Email: {usuario.email}</p>
            <button onClick={() => setEditando(true)}>Editar Perfil</button>
          </>
        )}
      </div>

      {/* Cambio de contraseña */}
      <div className="change-password-section">
        <h3>Cambiar Contraseña</h3>
        <form onSubmit={handlePasswordChange}>
          <label>
            Contraseña actual:
            <input
              type="password"
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  oldPassword: e.target.value,
                })
              }
            />
          </label>
          <br />
          <label>
            Nueva contraseña:
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
            />
          </label>
          <br />
          <label>
            Confirmar nueva contraseña:
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />
          </label>
          <br />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          <button type="submit">Cambiar Contraseña</button>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
