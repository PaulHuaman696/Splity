const Item = require("../models/Item");
const Categoria = require("../models/Categoria");

const createItem = async (req, res) => {
  const { nombre, categoriaId } = req.body;
  const usuarioId = req.user.uid; // Suponiendo que el token contiene el ID del usuario

  try {
    const categoria = await Categoria.findById(categoriaId);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    const nuevoItem = new Item({
      nombre,
      categoria: categoria._id,
      usuarioId,
    });

    await nuevoItem.save();
    return res.status(201).json(nuevoItem);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al crear el item", error });
  }
};

const searchItems = async (req, res) => {
  let { query } = req.query;
  const usuarioId = req.user.uid;

  // Asegurar que query sea string
  if (typeof query !== 'string') {
    query = "";
  }

  try {
    const items = await Item.find({
      nombre: { $regex: query, $options: "i" },
      usuarioId,
    }).populate("categoria");

    return res.status(200).json(items);
  } catch (error) {
    console.error("Error en searchItems:", error);
    return res.status(500).json({ mensaje: "Error al buscar los items", error });
  }
};


module.exports = { createItem, searchItems };
