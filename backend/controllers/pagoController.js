const Pago = require('../models/Pago');
const Proyecto = require('../models/ProyectoGasto'); // Necesitamos verificar que el proyecto existe
const Usuario = require('../models/Usuario');
const Prestamo = require('../models/Prestamo');

/**
 * Un usuario (el deudor) registra un pago que le hizo a otro usuario (el acreedor).
 * El pago se crea en estado 'pendiente'.
 */
exports.registrarPago = async (req, res) => {
  // 1. EXTRACCIÓN DE DATOS
  // Obtenemos los datos del cuerpo de la petición y del usuario autenticado
  const { monto, a_usuario, proyectoId, prestamoId } = req.body;
  const de_usuario = req.user.uid; // El pagador es el usuario que está logueado

  // 2. VALIDACIONES INICIALES
  // Verificamos que los datos esenciales estén presentes
  if (!monto || !a_usuario || (!proyectoId && !prestamoId)) {
    return res.status(400).json({
      mensaje: 'Faltan datos requeridos (monto, destinatario, y el ID del proyecto o préstamo).'
    });
  }

  // Un usuario no puede registrar un pago a sí mismo
  if (de_usuario === a_usuario) {
    return res.status(400).json({ mensaje: 'No puedes registrar un pago a ti mismo.' });
  }

  // Un pago solo puede pertenecer a un proyecto O a un préstamo, no a ambos
  if (proyectoId && prestamoId) {
    return res.status(400).json({ mensaje: 'Un pago no puede estar asociado a un proyecto y a un préstamo al mismo tiempo.' });
  }

  try {
    // 3. CREAR EL OBJETO DEL NUEVO PAGO
    const nuevoPagoData = {
      monto: parseFloat(monto),
      de_usuario,
      a_usuario,
      // El estado por defecto ya es 'pendiente' según nuestro modelo, pero lo ponemos para ser explícitos
      estado: 'pendiente',
    };

    // 4. VERIFICAR EL CONTEXTO Y AÑADIR LA REFERENCIA
    if (proyectoId) {
      // Si el pago es para un proyecto...
      const proyectoExiste = await Proyecto.findById(proyectoId);
      if (!proyectoExiste) {
        return res.status(404).json({ mensaje: 'El proyecto asociado no fue encontrado.' });
      }
      nuevoPagoData.proyecto = proyectoId;

    } else {
      // Si no, es para un préstamo...
      const prestamoExiste = await Prestamo.findById(prestamoId);
      if (!prestamoExiste) {
        return res.status(404).json({ mensaje: 'El préstamo asociado no fue encontrado.' });
      }
      // Verificación de seguridad extra: ¿Realmente soy yo el que debe este préstamo?
      if (prestamoExiste.prestatario !== de_usuario) {
        return res.status(403).json({ mensaje: 'No estás autorizado para pagar este préstamo.' });
      }
      nuevoPagoData.prestamo = prestamoId;
    }

    // 5. GUARDAR EN LA BASE DE DATOS
    const nuevoPago = new Pago(nuevoPagoData);
    await nuevoPago.save();

    // 6. ENVIAR RESPUESTA EXITOSA
    res.status(201).json({ mensaje: 'Registro de pago enviado para confirmación.', pago: nuevoPago });

  } catch (error) {
    console.error("Error al registrar pago:", error);
    res.status(500).json({ mensaje: 'Error interno al registrar el pago.', error: error.message });
  }
};

/** 
 * Obtiene todos los pagos pendientes de confirmación para el usuario autenticado.
 * Estos son los pagos que otros usuarios dicen haberle hecho.
 */
exports.getPagosPendientes = async (req, res) => {
  try {
    const pagos = await Pago.find({ a_usuario: req.user.uid, estado: 'pendiente' })
      .populate('proyecto', 'nombre')
      .populate('prestamo', 'descripcion')
      .lean();

    // Enriquecer con el nombre del pagador
    const uidsDePagadores = [...new Set(pagos.map(p => p.de_usuario))];
    const usuarios = await Usuario.find({ uid: { $in: uidsDePagadores } }, 'uid name').lean();
    const usuariosMap = new Map(usuarios.map(u => [u.uid, u.name]));

    const pagosEnriquecidos = pagos.map(pago => ({
      ...pago,
      de_usuario_nombre: usuariosMap.get(pago.de_usuario) || 'Usuario Desconocido',
    }));

    res.status(200).json(pagosEnriquecidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pagos pendientes.', error: error.message });
  }
};

/**
 * Confirma un pago pendiente. Solo puede hacerlo el usuario que recibe el dinero.
 */
exports.confirmarPago = async (req, res) => {
  try {
    const { pagoId } = req.params;
    const pago = await Pago.findById(pagoId);

    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado.' });
    }
    // Verificación de seguridad: solo el receptor puede confirmar
    if (pago.a_usuario !== req.user.uid) {
      return res.status(403).json({ mensaje: 'No autorizado para confirmar este pago.' });
    }
    if (pago.estado !== 'pendiente') {
      return res.status(400).json({ mensaje: 'Este pago ya ha sido procesado.' });
    }

    pago.estado = 'confirmado';
    pago.fechaConfirmacion = new Date();
    await pago.save();

    // Si este pago está asociado a un préstamo, verificamos si ya se saldó la deuda.
    if (pago.prestamo) {
      const prestamoId = pago.prestamo;

      // Buscamos todos los pagos confirmados para ese préstamo
      const pagosRealizados = await Pago.find({ prestamo: prestamoId, estado: 'confirmado' });
      const totalPagado = pagosRealizados.reduce((acc, p) => acc + p.monto, 0);

      const prestamo = await Prestamo.findById(prestamoId);
      if (prestamo && totalPagado >= prestamo.monto) {
        prestamo.estado = 'devuelto';
        prestamo.fechaDevolucion = new Date();
        await prestamo.save();
        console.log(`Préstamo ${prestamoId} saldado por completo.`);
      }
    }

    res.status(200).json({ mensaje: 'Pago confirmado exitosamente.', pago });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al confirmar el pago.', error: error.message });
  }
};

/**
 * Rechaza un pago pendiente. Solo puede hacerlo el usuario que recibe el dinero.
 */
exports.rechazarPago = async (req, res) => {
  try {
    const { pagoId } = req.params;
    const pago = await Pago.findById(pagoId);

    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado.' });
    }
    if (pago.a_usuario !== req.user.uid) {
      return res.status(403).json({ mensaje: 'No autorizado para rechazar este pago.' });
    }
    if (pago.estado !== 'pendiente') {
      return res.status(400).json({ mensaje: 'Este pago ya ha sido procesado.' });
    }

    pago.estado = 'rechazado';
    await pago.save();

    res.status(200).json({ mensaje: 'Pago rechazado exitosamente.', pago });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al rechazar el pago.', error: error.message });
  }
};