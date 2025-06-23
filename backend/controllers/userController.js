const Usuario = require("../models/Usuario");
const { nanoid } = require("nanoid");
const ProyectoGasto = require("../models/ProyectoGasto");
const admin = require("../config/firebaseAdminConfig");


/**
 * Crea un usuario si no existe, o actualiza sus datos (nombre, email).
 * Si el nombre o el email son actualizados, sincroniza estos cambios en todos
 * los proyectos donde el usuario participa o es creador.
 */
exports.createOrUpdateUser = async (req, res) => {
  try {
    // Validar que el usuario esté autenticado por el middleware
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: "No autorizado: falta token de usuario." });
    }

    const userId = req.user.uid;
    const { name: nuevoNombre, email: nuevoEmail } = req.body;

    // --- 1. PREPARACIÓN DE DATOS ---
    // Objeto para actualizar el documento principal del usuario
    const updateData = { uid: userId };
    
    // Objetos para la sincronización en proyectos (se llenarán condicionalmente)
    const syncSetDataCreador = {};
    const syncSetDataParticipante = {};

    // Verificar si se proporcionó un nuevo nombre válido
    if (nuevoNombre && nuevoNombre.trim() !== "") {
      const nombreLimpio = nuevoNombre.trim();
      updateData.name = nombreLimpio;
      syncSetDataCreador["creadoPor.nombre"] = nombreLimpio;
      syncSetDataParticipante["participantes.$.nombre"] = nombreLimpio;
    }

    // Verificar si se proporcionó un nuevo email válido
    if (nuevoEmail && nuevoEmail.trim() !== "") {
      const emailLimpio = nuevoEmail.trim();
      updateData.email = emailLimpio;
      syncSetDataCreador["creadoPor.email"] = emailLimpio;
      syncSetDataParticipante["participantes.$.email"] = emailLimpio;
    }

    // --- 2. ACTUALIZACIÓN DEL USUARIO PRINCIPAL ---
    const updatedUser = await Usuario.findOneAndUpdate(
      { uid: userId },
      updateData,
      { new: true, upsert: true } // 'upsert' crea el documento si no existe
    );

    // --- 3. SINCRONIZACIÓN EN PROYECTOS (SI HUBO CAMBIOS) ---
    if (Object.keys(syncSetDataCreador).length > 0) {
      console.log("Sincronizando datos de usuario en los proyectos...", syncSetDataCreador);

      // Sincronizar en proyectos donde el usuario es el creador
      await ProyectoGasto.updateMany(
        { "creadoPor.uid": userId },
        { "$set": syncSetDataCreador }
      );

      // Sincronizar en proyectos donde el usuario es un participante
      await ProyectoGasto.updateMany(
        { "participantes.uid": userId },
        { "$set": syncSetDataParticipante }
      );
      
      console.log("Sincronización de datos completada.");
    }
    
    // --- 4. LÓGICA PARA PROYECTO INDIVIDUAL ---
    // Esta parte se mantiene igual, pero se beneficia de tener 'updatedUser'
    const proyectoIndividualExistente = await ProyectoGasto.findOne({
      "creadoPor.uid": userId,
      nombre: "Individual",
    });

    if (!proyectoIndividualExistente) {
      const nombreParaProyecto = updatedUser.name || updatedUser.email || "Anónimo";
      const emailParaProyecto = updatedUser.email || "No disponible";

      const proyectoIndividual = new ProyectoGasto({
        nombre: "Individual",
        descripcion: "Proyecto individual para gastos propios",
        creadoPor: {
          uid: userId,
          nombre: nombreParaProyecto,
          email: emailParaProyecto,
        },
        participantes: [
          {
            uid: userId,
            nombre: nombreParaProyecto,
            email: emailParaProyecto,
            aceptado: true,
          },
        ],
        codigoUnico: nanoid(8),
      });

      await proyectoIndividual.save();
    }

    // --- 5. RESPUESTA EXITOSA ---
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Error en createOrUpdateUser:", error);
    return res.status(500).json({ message: "Error al guardar el usuario y sincronizar datos.", error });
  }
};

exports.getMyUserData = async (req, res) => {
  try {
    const user = await Usuario.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    res.status(500).json({ message: "Error al obtener los datos del usuario" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Verificar que la nueva contraseña es válida
    if (newPassword !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden." });
    }

    // UID ya está disponible en req.user gracias al middleware
    const uid = req.user.uid;

    // Intentar cambiar la contraseña con Firebase Admin SDK
    await admin.auth().updateUser(uid, {
      password: newPassword,
    });

    return res.status(200).json({ message: "Contraseña cambiada con éxito." });

  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    return res.status(500).json({ message: "Error al cambiar la contraseña.", error: error.message });
  }
};

// Método para obtener los datos de un usuario por su UID
exports.getUserDataByUid = async (req, res) => {
  try {
    const { uid } = req.params; // Extraemos el uid de la URL
    console.log("UID recibido:", uid);

    const user = await Usuario.findOne({ uid }); // Buscamos al usuario por su UID
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user); // Enviamos los datos del usuario
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    res.status(500).json({ message: "Error al obtener los datos del usuario" });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Buscamos a todos los usuarios EXCEPTO al que está haciendo la petición
        const users = await Usuario.find(
            { uid: { $ne: req.user.uid } },
            'uid name email' // Seleccionamos solo los campos necesarios
        ).lean(); 
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la lista de usuarios.' });
    }
};
