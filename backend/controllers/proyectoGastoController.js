const ProyectoGasto = require("../models/ProyectoGasto");
const Usuario = require("../models/Usuario");
const { nanoid } = require("nanoid");

// Crear nuevo proyecto
exports.createProyecto = async (req, res) => {
  try {
    const { nombre, descripcion, participantes = [] } = req.body;
    const uid = req.user.uid;
    const nombreUsuario = req.user.nombre || req.user.email || "Anónimo";
    const emailUsuario = req.user.email || "Anónimo"; // Obtenemos el email del usuario

    const codigoUnico = nanoid(8); // genera un código único de 8 caracteres

    const proyecto = new ProyectoGasto({
      nombre,
      descripcion,
      codigoUnico,
      creadoPor: {
        uid,
        nombre: nombreUsuario,
        email: emailUsuario,
      },
      participantes: [
        {
          uid,
          nombre,
          email,
          aceptado: true,
        },
        ...participantes.map((p) => ({
          ...p,
        })),
      ],
    });

    await proyecto.save();
    res.status(201).json(proyecto);
  } catch (error) {
    console.error("Error en createProyecto:", error);
    res.status(500).json({ mensaje: "Error al crear proyecto", error });
  }
};

// Obtener todos los proyectos donde participa el usuario
exports.getProyectosByUser = async (req, res) => {
  try {
    // Verificar que el usuario esté autenticado y tenga un UID
    if (!req.user || !req.user.uid) {
      return res.status(400).json({ mensaje: "Usuario no autenticado" });
    }
    // Obtienes todos los proyectos donde el usuario es participante
    const proyectos = await ProyectoGasto.find({
      "participantes.uid": req.user.uid,
    });

    // Verificar si no se encuentran proyectos
    if (!proyectos.length) {
      return res.status(404).json({ mensaje: "No se encontraron proyectos para este usuario" });
    }

    // Obtener los datos completos de los participantes (nombre, email, etc.)
    const proyectosConDatosParticipantes = await Promise.all(
      proyectos.map(async (proyecto) => {
        // Obtener los datos completos de cada participante
        const participantesConDatos = await Promise.all(
          proyecto.participantes.map(async (participante) => {
            const usuario = await Usuario.findOne({ uid: participante.uid });

            // Asegúrate de que el usuario tenga datos
            return {
              ...participante,
              nombre: usuario?.name || "Anónimo",
              email: usuario?.email || "No disponible",
            };
          })
        );

        return { ...proyecto.toObject(), participantes: participantesConDatos };
      })
    );
    res.status(200).json(proyectosConDatosParticipantes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener proyectos", error });
  }
};

// Unirse a un proyecto por código
exports.joinProyectoByCodigo = async (req, res) => {
  try {
    const { codigo } = req.body;
    const uid = req.user.uid;
    const nombre = req.user.nombre || req.user.email || "Anónimo";
    const email = req.user.email || "Anónimo"; // Obtenemos el email del usuario

    const proyecto = await ProyectoGasto.findOne({ codigoUnico: codigo });

    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    const yaParticipa = proyecto.participantes.some((p) => p.uid === uid);
    if (yaParticipa) {
      return res
        .status(400)
        .json({ mensaje: "Ya eres participante de este proyecto" });
    }

    proyecto.participantes.push({ uid, nombre: nombre, email: email, aceptado: true });
    await proyecto.save();

    res.status(200).json({ mensaje: "Unido correctamente", proyecto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al unirse al proyecto", error });
  }
};

// Eliminar proyecto (solo el creador puede)
exports.deleteProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const proyecto = await ProyectoGasto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    if (proyecto.creadoPor.uid !== uid) {
      return res
        .status(403)
        .json({ mensaje: "No estás autorizado para eliminar este proyecto" });
    }

    await ProyectoGasto.findByIdAndDelete(id);
    res.status(200).json({ mensaje: "Proyecto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar proyecto", error });
  }
};

exports.getProyectoIndividual = async (req, res) => {
  try {
    const proyectoIndividual = await ProyectoGasto.findOne({
      "participantes.uid": req.user.uid,
      nombre: "Individual",
    });
    if (!proyectoIndividual) {
      return res
        .status(404)
        .json({ mensaje: "Proyecto individual no encontrado" });
    }
    res.status(200).json(proyectoIndividual);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener proyecto individual", error });
  }
};

exports.eliminarParticipante = async (req, res) => {
  try {
    const { id, uid } = req.params;
    const userUid = req.user.uid;

    const proyecto = await ProyectoGasto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    // Solo el creador o el mismo participante puede eliminar a un participante
    if (proyecto.creadoPor.uid !== userUid && userUid !== uid) {
      return res
        .status(403)
        .json({ mensaje: "No autorizado para eliminar este participante" });
    }

    // Filtrar participantes removiendo al uid que quieres eliminar
    proyecto.participantes = proyecto.participantes.filter(
      (p) => p.uid !== uid
    );

    await proyecto.save();

    res.status(200).json({ mensaje: "Participante eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar participante:", error);
    res.status(500).json({ mensaje: "Error al eliminar participante", error });
  }
};
