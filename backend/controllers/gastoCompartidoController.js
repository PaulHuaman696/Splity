const GastoCompartido = require("../models/GastoCompartido");

exports.createGastoCompartido = async (req, res) => {
  try {
    const gasto = new GastoCompartido(req.body);
    await gasto.save();
    res.status(201).json(gasto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGastosCompartidosByUser = async (req, res) => {
  try {
    const gastos = await GastoCompartido.find({
      $or: [{ userA: req.user.uid }, { userB: req.user.uid }],
    });
    res.json(gastos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
