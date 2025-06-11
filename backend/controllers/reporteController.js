const mongoose = require("mongoose");
const Gasto = require("../models/Gasto");
const Ingreso = require("../models/Ingreso"); // Asegúrate que existe este modelo
const Proyecto = require("../models/ProyectoGasto");

// 1. Listar ingresos y gastos mensuales + suma total
const getIngresosGastosMensuales = async (req, res) => {
  const usuarioId = req.user.uid;
  const now = new Date();
  const inicioMes = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
  );

  try {
    const totalGastos = await Gasto.aggregate([
      { $match: { usuarioUid: usuarioId, fecha: { $gte: inicioMes } } },
      { $group: { _id: null, total: { $sum: "$monto" } } },
    ]);

    const totalIngresos = await Ingreso.aggregate([
      { $match: { userId: usuarioId, fecha: { $gte: inicioMes } } },
      { $group: { _id: null, total: { $sum: "$monto" } } },
    ]);

    res.json({
      totalGastos: totalGastos[0]?.total || 0,
      totalIngresos: totalIngresos[0]?.total || 0,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error obteniendo ingresos y gastos", error });
  }
};

// 2. Detalle de gastos por proyecto con suma total por proyecto
const getGastosPorProyecto = async (req, res) => {
  const usuarioId = req.user.uid;
  // console.log("Usuario ID:", usuarioId);

  const proyectoIdStr = req.params.proyectoId;
  // console.log("ID recibido del proyecto:", proyectoIdStr);

  let proyectoId;
  try {
    proyectoId = new mongoose.Types.ObjectId(proyectoIdStr);
    // console.log("ID de proyecto convertido a ObjectId:", proyectoId);
  } catch (error) {
    // console.error("Error convirtiendo ID de proyecto:", error);
    return res.status(400).json({ mensaje: "ID de proyecto inválido" });
  }

  try {
    // console.log("Ejecutando agregación para gastos...");
    const proyecto = await Proyecto.findById(proyectoId).lean();
    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    const gastosPorProyecto = await Gasto.aggregate([
      { $match: { proyectoId } },
      {
        $lookup: {
          from: "items",
          localField: "itemId",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categorias",
          localField: "item.categoria",
          foreignField: "_id",
          as: "categoria",
        },
      },
      { $unwind: { path: "$categoria", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$proyectoId",
          totalGasto: { $sum: "$monto" },
          detalles: {
            $push: {
              itemId: "$item._id",
              categoria: "$categoria.nombre",
              item: "$item.nombre",
              monto: "$monto",
              fecha: "$fecha",
              tipo: "$tipo",
              usuarioUid: "$usuarioUid",
            },
          },
        },
      },
    ]);

    // console.log("Resultado de la agregación:", gastosPorProyecto);

    if (!gastosPorProyecto.length) {
      // console.log("No se encontraron gastos para el proyecto:", proyectoId);
      return res
        .status(404)
        .json({ mensaje: "No se encontraron gastos para este proyecto" });
    }

    // Añadir los participantes al resultado
    const resultadoFinal = {
      ...gastosPorProyecto[0],
      participantes: proyecto.participantes || [],
    };

    // Verificar datos antes de enviar al frontend
    // console.log("Resultado final (con participantes):", resultadoFinal);

    res.json(resultadoFinal);
  } catch (error) {
    console.error("Error obteniendo gastos por proyecto:", error);
    res
      .status(500)
      .json({ mensaje: "Error obteniendo gastos por proyecto", error });
  }
};

// 3. Calcular aporte promedio y saldo por usuario en gastos tipo compartido (por proyecto)
// Aquí asumimos que "tipo" === "compartido" para identificar esos gastos.
const getBalanceCompartidoPorProyecto = async (req, res) => {
  const proyectoIdStr = req.params.proyectoId;
  let proyectoId;

  // 1. (CORRECCIÓN) Convertir el string a ObjectId
  try {
    proyectoId = new mongoose.Types.ObjectId(proyectoIdStr);
  } catch (error) {
    return res.status(400).json({ mensaje: "ID de proyecto inválido" });
  }

  try {
    // 2. (MEJORA) Obtener los datos del proyecto para acceder a los participantes
    const proyecto = await Proyecto.findById(proyectoId).lean();
    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    // Crear un mapa de participantes para un acceso fácil (uid -> nombre)
    const participantesMap = new Map(
      proyecto.participantes.map(p => [p.uid, p.nombre])
    );

    const gastosCompartidos = await Gasto.aggregate([
      // Ahora el $match funcionará
      { $match: { proyectoId, tipo: "compartido" } },
      {
        $group: {
          _id: "$usuarioUid",
          totalAporte: { $sum: "$monto" },
        },
      },
    ]);

    if (gastosCompartidos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No hay gastos de tipo 'compartido' para este proyecto" });
    }

    const sumaTotal = gastosCompartidos.reduce((acc, cur) => acc + cur.totalAporte, 0);
    const promedio = sumaTotal / participantesMap.size; // Usar el número total de participantes del proyecto para el promedio

    // 3. (MEJORA) Enriquecer los saldos con el nombre del usuario
    const saldos = gastosCompartidos.map((gasto) => ({
      usuarioUid: gasto._id,
      nombre: participantesMap.get(gasto._id) || "Usuario desconocido", // Añadimos el nombre
      totalAporte: gasto.totalAporte,
      saldo: parseFloat((gasto.totalAporte - promedio).toFixed(2)),
    }));

    res.json({
      promedio,
      sumaTotal,
      participantes: participantesMap.size,
      saldos, // Los saldos ahora incluyen el nombre
    });
  } catch (error) {
    console.error("Error calculando balance compartido", error);
    res
      .status(500)
      .json({ mensaje: "Error calculando balance compartido", error });
  }
};

module.exports = {
  getIngresosGastosMensuales,
  getGastosPorProyecto,
  getBalanceCompartidoPorProyecto,
};
