const Prestamo = require('../models/Prestamo');
const Usuario = require('../models/Usuario'); // Lo usaremos para validar que el usuario exista

/**
 * Registra un nuevo préstamo. El usuario autenticado es el prestamista.
 */
exports.registrarPrestamo = async (req, res) => {
  const { monto, prestatario_uid, descripcion } = req.body;
  const prestamista_uid = req.user.uid;

  if (!monto || !prestatario_uid) {
    return res.status(400).json({ mensaje: 'El monto y el prestatario son obligatorios.' });
  }
  if (prestamista_uid === prestatario_uid) {
    return res.status(400).json({ mensaje: 'No puedes registrar un préstamo a ti mismo.' });
  }

  try {
    // Verificamos que el usuario prestatario exista en nuestra base de datos
    const prestatarioExiste = await Usuario.findOne({ uid: prestatario_uid });
    if (!prestatarioExiste) {
      return res.status(404).json({ mensaje: 'El usuario al que intentas prestarle dinero no existe.' });
    }

    const nuevoPrestamo = new Prestamo({
      monto,
      prestamista: prestamista_uid,
      prestatario: prestatario_uid,
      descripcion,
      estado: 'pendiente_aprobacion', // Estado inicial
    });

    await nuevoPrestamo.save();
    res.status(201).json({ mensaje: 'Préstamo registrado. Esperando confirmación del prestatario.', prestamo: nuevoPrestamo });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar el préstamo.', error: error.message });
  }
};

/**
 * Obtiene los préstamos pendientes de aprobación para el usuario actual (donde él es el prestatario).
 */
exports.getPrestamosPendientes = async (req, res) => {
  try {
    const prestamos = await Prestamo.find({
      prestatario: req.user.uid,
      estado: 'pendiente_aprobacion',
    }).lean();

    // Enriquecer con el nombre del prestamista
    const uidsDePrestamistas = [...new Set(prestamos.map(p => p.prestamista))];
    const usuarios = await Usuario.find({ uid: { $in: uidsDePrestamistas } }, 'uid name').lean();
    const usuariosMap = new Map(usuarios.map(u => [u.uid, u.name]));

    const prestamosEnriquecidos = prestamos.map(prestamo => ({
        ...prestamo,
        prestamista_nombre: usuariosMap.get(prestamo.prestamista) || 'Usuario Desconocido',
    }));

    res.status(200).json(prestamosEnriquecidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener préstamos pendientes.', error: error.message });
  }
};

/**
 * Confirma o rechaza un préstamo. Solo puede hacerlo el prestatario.
 */
exports.responderAPrestamo = async (req, res) => {
    try {
        const { prestamoId } = req.params;
        const { accion } = req.body; // La acción será 'confirmar' o 'rechazar'

        if (!['confirmar', 'rechazar'].includes(accion)) {
            return res.status(400).json({ mensaje: "La acción debe ser 'confirmar' o 'rechazar'." });
        }

        const prestamo = await Prestamo.findById(prestamoId);

        if (!prestamo) {
            return res.status(404).json({ mensaje: 'Préstamo no encontrado.' });
        }
        // Seguridad: Solo el prestatario puede responder
        if (prestamo.prestatario !== req.user.uid) {
            return res.status(403).json({ mensaje: 'No autorizado para esta acción.' });
        }
        if (prestamo.estado !== 'pendiente_aprobacion') {
            return res.status(400).json({ mensaje: 'Este préstamo ya fue procesado.' });
        }

        prestamo.estado = (accion === 'confirmar') ? 'activo' : 'rechazado';
        await prestamo.save();

        res.status(200).json({ mensaje: `Préstamo ${prestamo.estado} exitosamente.`, prestamo });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al responder al préstamo.', error: error.message });
    }
};

/**
 * Obtiene un historial de todos los préstamos (dados y recibidos) del usuario.
 */
exports.getMisPrestamos = async (req, res) => {
    try {
        const misPrestamosCrudos = await Prestamo.find({
            $or: [{ prestamista: req.user.uid }, { prestatario: req.user.uid }],
            estado: { $ne: 'rechazado' }
        }).sort({ createdAt: -1 }).lean(); // Usamos .lean() para mejor rendimiento

        // Extraemos todos los UIDs únicos para hacer una sola consulta a la base de datos
        const uids = [...new Set(misPrestamosCrudos.flatMap(p => [p.prestamista, p.prestatario]))];
        
        const usuarios = await Usuario.find({ uid: { $in: uids } }, 'uid name').lean();
        const usuariosMap = new Map(usuarios.map(u => [u.uid, u.name]));

        // Enriquecemos cada préstamo con los nombres correspondientes
        const misPrestamosEnriquecidos = misPrestamosCrudos.map(prestamo => ({
            ...prestamo,
            prestamista_nombre: usuariosMap.get(prestamo.prestamista) || 'Usuario Desconocido',
            prestatario_nombre: usuariosMap.get(prestamo.prestatario) || 'Usuario Desconocido',
        }));

        res.status(200).json(misPrestamosEnriquecidos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el historial de préstamos.', error: error.message });
    }
}