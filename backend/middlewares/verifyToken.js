const admin = require("../config/firebaseAdminConfig");
const Usuario = require('../models/Usuario');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];
  try {
    // Verificamos el token con Firebase como siempre
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 3. ¡EL PASO NUEVO Y MÁS IMPORTANTE!
    //    Usamos el uid del token para buscar el perfil completo en nuestra base de datos MongoDB.
    const usuarioDeDB = await Usuario.findOne({ uid: decodedToken.uid }).lean();

    if (!usuarioDeDB) {
      // Este es un caso de seguridad: el usuario está en Firebase pero no en nuestra DB.
      // Devolvemos un error para forzar una sincronización o manejar el caso.
      return res.status(404).json({ message: "Perfil de usuario no encontrado en la base de datos." });
    }

    // 4. Adjuntamos el perfil COMPLETO de nuestra base de datos a req.user
    req.user = usuarioDeDB;
    // 5. Continuamos al siguiente controlador (ej. createProyecto)
    next();
  } catch (error) {
    console.error("Error de autenticación de token:", error);
    if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({ mensaje: 'Token expirado, por favor inicie sesión de nuevo.' });
    }
    return res.status(403).json({ message: "Token inválido." });
  }
};

module.exports = verifyToken;
