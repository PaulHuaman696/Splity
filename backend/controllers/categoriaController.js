const Categoria = require("../models/Categoria");

const createCategoria = async (req, res) => {
  const { nombre } = req.body;
  const userId = req.user.uid;

  console.log("Usuario autenticado:", userId);

  try {
    const nuevaCategoria = new Categoria({
      nombre,
      userId,
    });

    await nuevaCategoria.save();
    return res.status(201).json(nuevaCategoria);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ mensaje: "Ya tienes una categoría con ese nombre." });
    }
    return res
      .status(500)
      .json({ mensaje: "Error al crear la categoría", error });
  }
};

const getCategoriasByUser = async (req, res) => {
  const userId = req.user.uid; // El usuario se obtiene del middleware

  try {
    const categorias = await Categoria.find({ userId });
    return res.status(200).json(categorias);
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener las categorías", error });
  }
};

module.exports = { createCategoria, getCategoriasByUser };
