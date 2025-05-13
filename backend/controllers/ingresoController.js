const Ingreso = require("../models/Ingreso");

exports.createIngreso = async (req, res) => {
  try {
    const ingreso = new Ingreso({ ...req.body, userId: req.user.uid });
    await ingreso.save();
    res.status(201).json(ingreso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getIngresosByUser = async (req, res) => {
  try {
    const ingresos = await Ingreso.find({ userId: req.user.uid });
    res.json(ingresos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
