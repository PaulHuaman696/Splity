const Usuario = require("../models/Usuario");
import { nanoid } from "nanoid";
const ProyectoGasto = require("../models/ProyectoGasto");

exports.createOrUpdateUser = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      console.log("No hay usuario autenticado en req.user");
      return res
        .status(401)
        .json({ message: "No autorizado: falta usuario autenticado" });
    }

    const userId = req.user.uid;
    console.log("UID usuario autenticado:", userId);
    console.log("Datos recibidos en req.body:", req.body);

    const updatedUser = await Usuario.findOneAndUpdate(
      { uid: userId },
      { ...req.body, uid: userId },
      { new: true, upsert: true }
    );
    console.log("Usuario actualizado o creado:", updatedUser);

    const proyectoIndividualExistente = await ProyectoGasto.findOne({
      "creadoPor.uid": userId,
      nombre: "Individual",
    });

    if (proyectoIndividualExistente) {
      console.log("Proyecto individual ya existe:", proyectoIndividualExistente._id);
    } else {
      console.log("No existe proyecto individual. Creando uno nuevo...");
      const proyectoIndividual = new ProyectoGasto({
        nombre: "Individual",
        descripcion: "Proyecto individual para gastos propios",
        creadoPor: {
          uid: userId,
          nombre: updatedUser.name || updatedUser.email || "Anónimo",
        },
        participantes: [
          {
            uid: userId,
            nombre: updatedUser.name || updatedUser.email || "Anónimo",
            aceptado: true,
          },
        ],
        codigoUnico: nanoid(8),
      });

      const guardado = await proyectoIndividual.save();
      console.log("Proyecto individual creado:", guardado._id);
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error en createOrUpdateUser:", error);
    return res.status(500).json({ message: "Error al guardar usuario", error });
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
