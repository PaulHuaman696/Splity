const Usuario = require("../models/Usuario");

exports.createOrUpdateUser = async (req, res) => {
  const userId = req.user.uid;

  try {
    const updatedUser = await Usuario.findOneAndUpdate(
      { uid: userId },
      { ...req.body, uid: userId },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar usuario", error });
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
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ message: "Error al obtener los datos del usuario" });
  }
};

