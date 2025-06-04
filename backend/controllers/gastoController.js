const Gasto = require("../models/Gasto");

const createGasto = async (req, res) => {
  const {
    itemId,
    categoria,
    monto,
    descripcion,
    fecha,
    tipo,
    proyectoId,
  } = req.body;

  const usuarioId = req.user.uid;

  try {
    const nuevoGasto = new Gasto({
      itemId: itemId,
      categoria: categoria,
      monto,
      descripcion,
      fecha,
      tipo,
      proyectoId: proyectoId,
      usuarioUid: usuarioId,
    });

    await nuevoGasto.save();
    return res.status(201).json(nuevoGasto);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al crear el gasto", error });
  }
};

const getGastosByUser = async (req, res) => {
  const usuarioId = req.user.uid;
  try {
    const gastos = await Gasto.find({ usuarioUid: usuarioId }).populate({
      path: "itemId",
      populate: {
        path: "categoria",
      },
    }).populate("proyectoId");
    return res.status(200).json(gastos);
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener los gastos", error });
  }
};

const updateGasto = async (req, res) => {
  const { itemId, categoria, monto, descripcion, fecha, tipo, proyectoId } =
    req.body;

  const usuarioId = req.user.uid;

  try {
    const gasto = await Gasto.findOne({
      _id: req.params.id,
      usuarioUid: usuarioId,
    });

    if (!gasto) {
      return res.status(404).json({ mensaje: "Gasto no encontrado" });
    }

    gasto.itemId = itemId;
    gasto.categoria = categoria;
    gasto.monto = monto;
    gasto.descripcion = descripcion;
    gasto.fecha = fecha;
    gasto.tipo = tipo;
    gasto.proyectoId = proyectoId;

    await gasto.save();

    return res.status(200).json(gasto);
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al actualizar el gasto", error });
  }
};

const deleteGasto = async (req, res) => {
  const usuarioId = req.user.uid;

  try {
    const gasto = await Gasto.findOneAndDelete({
      _id: req.params.id,
      usuarioUid: usuarioId,
    });

    if (!gasto) {
      return res
        .status(404)
        .json({ mensaje: "Gasto no encontrado o no autorizado" });
    }

    return res.status(200).json({ mensaje: "Gasto eliminado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al eliminar el gasto", error });
  }
};

const getGastosParaReporte = async (req, res) => {
  try {
    // Aquí puedes añadir filtros, por ejemplo:
    // const { fechaInicio, fechaFin, proyectoId } = req.query;

    const gastos = await Gasto.find()
      .populate({
        path: "itemId",
        populate: {
          path: "categoria",
          select: "nombre",
        },
        select: "nombre categoria",
      })
      .populate({
        path: "proyectoId",
        select: "nombre",
      })
      .sort({ fecha: -1 });

    return res.status(200).json(gastos);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener gastos para reporte", error });
  }
};


module.exports = {
  createGasto,
  getGastosByUser,
  updateGasto,
  deleteGasto,
  getGastosParaReporte,
};
