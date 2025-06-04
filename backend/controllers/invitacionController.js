const Invitacion = require("../models/Invitacion");
const ProyectoGasto = require("../models/ProyectoGasto");

exports.crearInvitacion = async (req, res) => {
  const { proyectoId, emailInvitado } = req.body;
  const enviadoPor = req.user.uid;

  try {
    // Validar que no exista invitación pendiente para ese email y proyecto
    const invitacionExistente = await Invitacion.findOne({
      proyectoId,
      emailInvitado,
      estado: "pendiente",
    });

    if (invitacionExistente) {
      return res
        .status(400)
        .json({ mensaje: "Ya existe una invitación pendiente para este usuario." });
    }

    // Crear invitación nueva
    const nuevaInvitacion = new Invitacion({
      proyectoId,
      emailInvitado,
      enviadoPor,
    });

    await nuevaInvitacion.save();

    return res.status(201).json(nuevaInvitacion);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al crear invitación", error });
  }
};

exports.listarInvitacionesUsuario = async (req, res) => {
  const emailUsuario = req.user.email;

  try {
    const invitaciones = await Invitacion.find({
      emailInvitado: emailUsuario,
      estado: "pendiente",
    }).populate("proyectoId");

    return res.status(200).json(invitaciones);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener invitaciones", error });
  }
};

exports.responderInvitacion = async (req, res) => {
  const { invitacionId, aceptar } = req.body;
  const usuarioUid = req.user.uid;

  try {
    const invitacion = await Invitacion.findById(invitacionId);
    if (!invitacion) {
      return res.status(404).json({ mensaje: "Invitación no encontrada" });
    }

    if (aceptar) {
      // Agregar usuario a proyecto como participante aceptado
      const proyecto = await ProyectoGasto.findById(invitacion.proyectoId);
      if (!proyecto) {
        return res.status(404).json({ mensaje: "Proyecto no encontrado" });
      }

      // Evitar duplicados
      const yaParticipa = proyecto.participantes.some(p => p.uid === usuarioUid);
      if (!yaParticipa) {
        proyecto.participantes.push({
          uid: usuarioUid,
          nombre: req.user.name || req.user.email || "Anónimo",
          aceptado: true,
        });
        await proyecto.save();
      }

      invitacion.estado = "aceptada";
    } else {
      invitacion.estado = "rechazada";
    }

    await invitacion.save();

    return res.status(200).json({ mensaje: "Respuesta guardada", invitacion });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al responder invitación", error });
  }
};
