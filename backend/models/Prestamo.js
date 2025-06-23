const mongoose = require("mongoose");

const prestamoSchema = new mongoose.Schema(
  {
    monto: {
      type: Number,
      required: [true, "El monto del préstamo es obligatorio."],
      min: [0.01, "El monto debe ser mayor que cero."]
    },
    // Quién da el dinero
    prestamista: {
      type: String, // UID del que presta
      required: true,
    },
    // Quién recibe el dinero
    prestatario: {
      type: String, // UID del que pide prestado
      required: true,
    },
    // Para que el prestamista pueda añadir una nota o razón
    descripcion: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    // Estados del ciclo de vida de un préstamo
    estado: {
      type: String,
      enum: ['pendiente_aprobacion', 'activo', 'rechazado', 'devuelto'],
      default: 'pendiente_aprobacion',
    },
    // Fecha en que el prestatario devuelve el dinero
    fechaDevolucion: {
        type: Date,
    }
  },
  {
    // `createdAt` será la fecha en que se registró el préstamo.
    timestamps: true,
  }
);

module.exports = mongoose.model("Prestamo", prestamoSchema);