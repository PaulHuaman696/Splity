// src/pages/Perfil.tsx
import { useState, useEffect } from "react";
import { authFetch } from "../../utils/authFetch"; // Suponiendo que authFetch está en utils
import "./Perfil.css";
import { auth } from "../../firebase/firebaseConfig"; // Importa auth desde el archivo firebaseConfig
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth"; // Importa las funciones necesarias de Firebase Auth

interface Usuario {
  name?: string;
  email: string;
  uid: string;
}

const Perfil = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null); // Estado para los datos del usuario
  const [editando, setEditando] = useState<boolean>(false); // Estado para saber si estamos editando
  const [formData, setFormData] = useState<Usuario>({} as Usuario); // Estado para el formulario
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [cargando, setCargando] = useState(false);

  const api_url = import.meta.env.VITE_API_URL; // URL de la API

  const fetchUserData = async () => {
    try {
      const data = await authFetch(`${api_url}/api/user/me`);
      setUsuario(data); // Guardamos los datos del usuario en el estado
      setFormData(data); // Establecemos los datos iniciales del formulario
    } catch (error) {
      console.error("Error al obtener los datos del usuario", error);
    }
  };

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => { fetchUserData(); }, []);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      const response = await authFetch(`${api_url}/api/user/profile`, {
        method: "POST", body: JSON.stringify(formData),
      });
      setUsuario(response);
      setEditando(false);
    } catch (error) { console.error("Error al actualizar el perfil", error); }
    finally { setCargando(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return;
    }
    const user = auth.currentUser;
    if (!user || !user.email) { setPasswordError("No se pudo verificar el usuario."); return; }

    setCargando(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, passwordForm.oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordForm.newPassword);
      alert("Contraseña cambiada con éxito.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error al cambiar la contraseña", error);
      setPasswordError("La contraseña actual es incorrecta o la nueva es muy débil.");
    } finally {
      setCargando(false);
    }
  };

  if (!usuario) return <p className="loading-message">Cargando perfil...</p>;

  return (
    <div className="perfil-page-container">
      <h1 className="perfil-page-title">Mi Perfil</h1>
      <div className="perfil-grid">

        {/* --- Tarjeta de Información de Perfil --- */}
        <div className="form-card">
          <h2 className="form-title">Información de la Cuenta</h2>
          {editando ? (
            <form onSubmit={handleSubmit} className="form-card-content">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input id="name" type="text" name="name" value={formData.name || ""} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" value={formData.email || ""} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setEditando(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary" disabled={cargando}>{cargando ? "Guardando..." : "Guardar"}</button>
              </div>
            </form>
          ) : (
            <div className="profile-display">
              <div className="info-item"><span>Nombre</span><strong>{usuario.name || "No especificado"}</strong></div>
              <div className="info-item"><span>Email</span><strong>{usuario.email}</strong></div>
              <div className="form-actions">
                <button onClick={() => setEditando(true)} className="btn-primary">Editar Perfil</button>
              </div>
            </div>
          )}
        </div>

        {/* --- Tarjeta de Cambio de Contraseña --- */}
        <div className="form-card">
          <h2 className="form-title">Cambiar Contraseña</h2>
          <form onSubmit={handlePasswordChange} className="form-card-content">
            <div className="form-group">
              <label htmlFor="oldPassword">Contraseña Actual</label>
              <input id="oldPassword" type="password" name="oldPassword" value={passwordForm.oldPassword} onChange={handlePasswordFormChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input id="newPassword" type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordFormChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
              <input id="confirmPassword" type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordFormChange} className="form-input" />
            </div>
            {passwordError && <p className="form-error">{passwordError}</p>}
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={cargando}>{cargando ? "Cambiando..." : "Cambiar Contraseña"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
