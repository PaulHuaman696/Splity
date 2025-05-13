const Gasto = require("../models/Gasto");

const createGasto = async (req, res) => {
  const { nombre, monto, fecha, categoriaId } = req.body;
  const usuarioId = req.user.uid; // El usuario se obtiene del middleware

  try {
    const nuevoGasto = new Gasto({
      nombre,
      monto,
      fecha,
      categoria: categoriaId,
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

