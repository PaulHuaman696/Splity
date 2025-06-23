const mongoose = require("mongoose");
const Gasto = require("../models/Gasto");
const Ingreso = require("../models/Ingreso"); // Asegúrate que existe este modelo
const Proyecto = require("../models/ProyectoGasto");
const Pago = require('../models/Pago');

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
  try {
    proyectoId = new mongoose.Types.ObjectId(proyectoIdStr);
  } catch (error) {
    return res.status(400).json({ mensaje: "ID de proyecto inválido" });
  }

  try {
    const proyecto = await Proyecto.findById(proyectoId).lean();
    if (!proyecto || !proyecto.participantes || proyecto.participantes.length === 0) {
      return res.status(404).json({ mensaje: "Proyecto o participantes no encontrados." });
    }

    // 1. Calcular el total y promedio de gastos compartidos
    const gastosAgregados = await Gasto.aggregate([
      { $match: { proyectoId: proyectoId, tipo: "compartido" } },
      { $group: { _id: "$usuarioUid", totalAporte: { $sum: "$monto" } } }
    ]);
    const sumaTotalGastos = gastosAgregados.reduce((acc, cur) => acc + cur.totalAporte, 0);
    const promedioGasto = sumaTotalGastos / proyecto.participantes.length;

    // 2. Obtener todos los pagos CONFIRMADOS de este proyecto
    const pagosConfirmados = await Pago.find({ proyecto: proyectoId, estado: 'confirmado' }).lean();

    // 3. Calcular el balance final para cada participante
    const saldos = proyecto.participantes.map(participante => {
      const uid = participante.uid;
      const aporte = gastosAgregados.find(g => g._id === uid)?.totalAporte || 0;
      
      // Sumar los pagos que este usuario ha HECHO a otros
      const totalPagosHechos = pagosConfirmados
        .filter(p => p.de_usuario === uid)
        .reduce((acc, p) => acc + p.monto, 0);
        
      // Sumar los pagos que este usuario ha RECIBIDO de otros
      const totalPagosRecibidos = pagosConfirmados
        .filter(p => p.a_usuario === uid)
        .reduce((acc, p) => acc + p.monto, 0);

      // El saldo ahora es: (lo que puse - el promedio) + (lo que me pagaron) - (lo que yo pagué)
      const saldoFinal = (aporte - promedioGasto) + totalPagosRecibidos - totalPagosHechos;
      
      return {
        usuarioUid: uid,
        nombre: participante.nombre,
        totalAporte: aporte,
        saldo: parseFloat(saldoFinal.toFixed(2)),
      };
    });

    res.json({
      promedio: promedioGasto,
      sumaTotal: sumaTotalGastos,
      participantes: proyecto.participantes.length,
      saldos,
    });
  } catch (error) {
    console.error("Error calculando balance compartido:", error);
    res.status(500).json({ mensaje: "Error calculando balance", error: error.message });
  }
};

// NUEVA FUNCIÓN 1: Obtener los últimos 5 gastos del usuario
/**
 * Obtiene los 5 gastos más recientes del usuario, incluyendo el nombre del ítem
 * y el nombre del proyecto asociado, usando un pipeline de agregación.
 */
const getGastosRecientes = async (req, res) => {
  try {
    const { uid } = req.user;

    const gastos = await Gasto.aggregate([
      // 1. Encontrar solo los gastos del usuario autenticado
      { $match: { usuarioUid: uid } },

      // 2. Ordenarlos por fecha para obtener los más recientes primero
      { $sort: { fecha: -1 } },

      // 3. Limitar el resultado a solo 5 documentos
      { $limit: 5 },

      // 4. (LA MAGIA) Unir con la colección 'items' para obtener el nombre del ítem
      {
        $lookup: {
          from: "items", // <-- El nombre de tu colección de items en MongoDB
          localField: "itemId", // El campo en la colección 'Gasto'
          foreignField: "_id", // El campo en la colección 'items'
          as: "infoItem", // El resultado se guardará en un nuevo array llamado 'infoItem'
        },
      },

      // 5. Unir con la colección de proyectos para obtener el nombre del proyecto
      {
        $lookup: {
          from: "proyectogastos", // <-- Revisa que este sea el nombre de tu colección de proyectos
          localField: "proyectoId",
          foreignField: "_id",
          as: "infoProyecto",
        },
      },

      // 6. "Descomprimir" los arrays creados por $lookup para acceder a los objetos
      { $unwind: { path: "$infoItem", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$infoProyecto", preserveNullAndEmptyArrays: true } },

      // 7. Formatear el resultado final para que coincida con lo que el frontend espera
      {
        $project: {
          _id: 1,
          monto: 1,
          fecha: 1,
          item: "$infoItem.nombre", // <-- ¡Aquí obtenemos el nombre!
          proyectoId: {
            _id: "$infoProyecto._id",
            nombre: "$infoProyecto.nombre",
          },
        },
      },
    ]);

    res.json(gastos);

  } catch (error) {
    console.error("Error detallado en getGastosRecientes:", error);
    res.status(500).json({ mensaje: 'Error al obtener gastos recientes', error: error.message });
  }
};

// NUEVA FUNCIÓN 2: Calcular el balance global del usuario en todos sus proyectos
const getSaldosGlobales = async (req, res) => {
  try {
    const { uid } = req.user;

    const proyectosCompartidos = await Proyecto.find({
      'participantes.uid': uid,
      'nombre': { $ne: 'Individual' }
    }).lean();

    let meDeben = 0;
    let yoDebo = 0;

    for (const proyecto of proyectosCompartidos) {
      // ✅ DEFENSA 1: Asegurarse de que el proyecto tenga participantes antes de continuar.
      // Esto previene el error si un proyecto tiene un array de participantes vacío o nulo.
      if (!proyecto.participantes || proyecto.participantes.length === 0) {
        console.log(`Proyecto "${proyecto.nombre}" saltado por no tener participantes.`);
        continue; // Salta a la siguiente iteración del bucle
      }

      const gastos = await Gasto.find({ proyectoId: proyecto._id, tipo: 'compartido' }).lean();

      if (gastos.length === 0) {
        continue; // No hay gastos compartidos en este proyecto, no hay saldo que calcular.
      }

      const sumaTotal = gastos.reduce((acc, g) => acc + (g.monto || 0), 0);
      const promedio = sumaTotal / proyecto.participantes.length;

      const miAporte = gastos
        .filter(g => g.usuarioUid === uid)
        .reduce((acc, g) => acc + (g.monto || 0), 0);

      const miSaldoEnProyecto = miAporte - promedio;

      if (miSaldoEnProyecto > 0) {
        meDeben += miSaldoEnProyecto;
      } else {
        yoDebo += Math.abs(miSaldoEnProyecto);
      }
    }

    res.json({ meDeben, yoDebo });

  } catch (error) {
    // ✅ DEFENSA 2: Mejoramos el log para ver el error exacto en la terminal del servidor.
    console.error("Error detallado en getSaldosGlobales:", error);
    res.status(500).json({ mensaje: 'Error al calcular saldos globales', error: error.message });
  }
};

/**
 * Calcula la suma total de gastos por categoría para el usuario autenticado.
 */
const getGastosPorCategoria = async (req, res) => {
  try {
    const { uid } = req.user;

    const gastosPorCategoria = await Gasto.aggregate([
      // 1. Encontrar los gastos del usuario
      { $match: { usuarioUid: uid } },

      // 2. Unir con la colección 'items' para obtener la categoría del gasto
      {
        $lookup: {
          from: 'items', // El nombre de tu colección de ítems
          localField: 'itemId',
          foreignField: '_id',
          as: 'itemInfo',
        },
      },
      { $unwind: '$itemInfo' },

      // 3. Unir con la colección 'categorias' para obtener el nombre de la categoría
      {
        $lookup: {
          from: 'categorias', // El nombre de tu colección de categorías
          localField: 'itemInfo.categoria',
          foreignField: '_id',
          as: 'categoriaInfo',
        },
      },
      { $unwind: '$categoriaInfo' },

      // 4. Agrupar por nombre de categoría y sumar los montos
      {
        $group: {
          _id: '$categoriaInfo.nombre', // Agrupar por el nombre de la categoría
          total: { $sum: '$monto' },    // Sumar el monto de cada gasto en esa categoría
        },
      },

      // 5. Formatear el resultado
      {
        $project: {
          _id: 0, // No necesitamos el campo _id
          categoria: '$_id', // Renombramos _id a 'categoria'
          total: 1,
        },
      },
    ]);

    res.json(gastosPorCategoria);

  } catch (error) {
    console.error("Error al obtener gastos por categoría:", error);
    res.status(500).json({ mensaje: 'Error al obtener datos para el gráfico', error: error.message });
  }
};

const getHistorialMensual = async (req, res) => {
  try {
    const { uid } = req.user;
    const labels = [];
    const datosIngresos = [];
    const datosGastos = [];

    const hoy = new Date();

    // Iteramos desde hace 5 meses hasta el mes actual (6 meses en total)
    for (let i = 5; i >= 0; i--) {
      // --- CÁLCULO DE FECHAS ESTRICTAMENTE EN UTC ---
      
      // 1. Obtenemos la fecha base para la iteración actual (ej. si hoy es junio, i=5 es enero)
      const fechaIteracion = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - i, 1));

      // 2. Generamos la etiqueta para el gráfico (ej. "Jun '25")
      const mes = fechaIteracion.toLocaleString('es-PE', { month: 'short', timeZone: 'UTC' });
      const anio = fechaIteracion.getUTCFullYear().toString().slice(-2);
      labels.push(`${mes.charAt(0).toUpperCase() + mes.slice(1)} '${anio}`);

      // 3. Calculamos el inicio de ese mes en UTC
      const inicioMes = new Date(Date.UTC(fechaIteracion.getUTCFullYear(), fechaIteracion.getUTCMonth(), 1));

      // 4. Creamos el filtro de fecha de forma condicional
      let matchFilter;

      if (i === 0) {
        // Para el MES ACTUAL (i=0), replicamos la lógica de ResumenMensual (solo fecha de inicio)
        matchFilter = { fecha: { $gte: inicioMes } };
      } else {
        // Para MESES ANTERIORES, definimos un rango estricto de inicio y fin en UTC
        const finMes = new Date(Date.UTC(fechaIteracion.getUTCFullYear(), fechaIteracion.getUTCMonth() + 1, 0));
        finMes.setUTCHours(23, 59, 59, 999); // Cubrimos todo el último día del mes
        matchFilter = { fecha: { $gte: inicioMes, $lte: finMes } };
      }
      
      // --- FIN DEL CÁLCULO DE FECHAS ---

      // Calcular total de ingresos para el mes usando el filtro dinámico
      const ingresosMes = await Ingreso.aggregate([
        { $match: { userId: uid, ...matchFilter } },
        { $group: { _id: null, total: { $sum: '$monto' } } }
      ]);
      datosIngresos.push(ingresosMes.length > 0 ? ingresosMes[0].total : 0);
      
      // Calcular total de gastos para el mes usando el filtro dinámico
      const gastosMes = await Gasto.aggregate([
        { $match: { usuarioUid: uid, ...matchFilter } },
        { $group: { _id: null, total: { $sum: '$monto' } } }
      ]);
      datosGastos.push(gastosMes.length > 0 ? gastosMes[0].total : 0);
    }

    // Formateamos y enviamos la respuesta
    const dataParaGrafico = {
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: datosIngresos,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Gastos',
          data: datosGastos,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };

    res.json(dataParaGrafico);

  } catch (error) {
    console.error("Error al obtener historial mensual:", error);
    res.status(500).json({ mensaje: 'Error al obtener datos para el gráfico de historial', error: error.message });
  }
};

const getTendenciaDiaria = async (req, res) => {
  try {
    const { uid } = req.user;

    // 1. Definir el rango de fechas de los últimos 30 días en UTC
    const hoy = new Date();
    const finRango = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate(), 23, 59, 59, 999));
    const inicioRango = new Date(finRango);
    inicioRango.setUTCDate(inicioRango.getUTCDate() - 29);
    inicioRango.setUTCHours(0, 0, 0, 0);

    // 2. Obtener los gastos agrupados por día desde la base de datos
    const gastosAgrupados = await Gasto.aggregate([
      { $match: { usuarioUid: uid, fecha: { $gte: inicioRango, $lte: finRango } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$fecha", timezone: "UTC" } },
          totalDiario: { $sum: "$monto" },
        },
      },
      { $sort: { _id: 1 } }, // Ordenar por fecha
    ]);

    // 3. Crear un mapa para un acceso rápido a los datos
    const datosPorFecha = new Map(
      gastosAgrupados.map(item => [item._id, item.totalDiario])
    );

    // 4. Rellenar los días sin gastos con 0 para asegurar un gráfico continuo
    const labels = [];
    const data = [];
    for (let i = 0; i < 30; i++) {
      const fechaActual = new Date(inicioRango);
      fechaActual.setUTCDate(inicioRango.getUTCDate() + i);
      
      const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const diaMes = fechaActual.toLocaleString('es-PE', { day: '2-digit', month: 'short', timeZone: 'UTC' });

      labels.push(diaMes);
      data.push(datosPorFecha.get(fechaFormateada) || 0);
    }
    
    res.json({ labels, data });

  } catch (error) {
    console.error("Error al obtener tendencia diaria:", error);
    res.status(500).json({ mensaje: 'Error al obtener datos para el gráfico de tendencia', error: error.message });
  }
};

const getTopGastos = async (req, res) => {
  try {
    const { uid } = req.user;

    // 1. Definir el rango del mes actual estrictamente en UTC
    const hoy = new Date();
    const inicioMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), 1));
    const finMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + 1, 0));
    finMes.setUTCHours(23, 59, 59, 999);

    const topGastos = await Gasto.aggregate([
      // 2. Filtrar por usuario y mes actual
      { $match: { usuarioUid: uid, fecha: { $gte: inicioMes, $lte: finMes } } },

      // 3. Ordenar por monto de forma DESCENDENTE para tener los más caros primero
      { $sort: { monto: -1 } },

      // 4. Limitar a solo los 5 primeros resultados
      { $limit: 5 },

      // 5. Unir con 'items' para obtener el nombre del gasto
      {
        $lookup: {
          from: 'items',
          localField: 'itemId',
          foreignField: '_id',
          as: 'infoItem',
        },
      },
      { $unwind: { path: '$infoItem', preserveNullAndEmptyArrays: true } },

      // 6. Formatear la salida
      {
        $project: {
          _id: 0,
          item: { $ifNull: [ '$infoItem.nombre', 'Gasto General' ] },
          monto: 1,
        },
      },
    ]);

    res.json(topGastos);

  } catch (error) {
    console.error("Error al obtener top de gastos:", error);
    res.status(500).json({ mensaje: 'Error al obtener datos para top de gastos', error: error.message });
  }
};

module.exports = {
  getIngresosGastosMensuales,
  getGastosPorProyecto,
  getBalanceCompartidoPorProyecto,
  getGastosRecientes,
  getSaldosGlobales,
  getGastosPorCategoria,
  getHistorialMensual,
  getTendenciaDiaria,
  getTopGastos,
};
