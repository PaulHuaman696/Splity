const Gasto = require("../models/Gasto");

const createGasto = async (req, res) => {
  const { itemId, categoriaId, monto, descripcion, fecha } = req.body;
  const usuarioId = req.user.uid; // obtenido del middleware con Firebase Admin

  try {
    const nuevoGasto = new Gasto({
      item: itemId,
      categoria: categoriaId,
      monto,
      descripcion,
      fecha,
      usuarioId,
    });

    await nuevoGasto.save();
    return res.status(201).json(nuevoGasto);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al crear el gasto", error });
  }
};

const getGastosByUser = async (req, res) => {
  const usuarioId = req.usuarioId;

  try {
    const gastos = await Gasto.find({ usuarioId }).populate("categoria");
    return res.status(200).json(gastos);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener los gastos", error });
  }
};

module.exports = { createGasto, getGastosByUser };

