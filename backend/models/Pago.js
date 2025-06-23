const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema(
  {
    monto: {
      type: Number,
      required: [true, "El monto del pago es obligatorio."],
      min: [0.01, "El monto debe ser mayor que cero."]
    },
    // Quién realiza el pago
    de_usuario: {
      type: String, // Almacenamos el UID de Firebase
      required: true,
    },
    // Quién recibe el pago
    a_usuario: {
      type: String, // Almacenamos el UID de Firebase
      required: true,
    },
    // A qué proyecto pertenece la deuda que se está pagando
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProyectoGasto', // Referencia directa a tu modelo de Proyectos
      required: false,
    },

    prestamo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prestamo',
      required: false,
    },
    // Estado para el flujo de confirmación
    estado: {
      type: String,
      enum: ['pendiente', 'confirmado', 'rechazado'], // Solo puede tener uno de estos 3 valores
      default: 'pendiente', // Por defecto, un pago siempre empieza como pendiente
    },
    // Fecha en que el receptor confirma el pago
    fechaConfirmacion: {
      type: Date,
    }
  },
  {
    // `timestamps: true` añade automáticamente los campos `createdAt` y `updatedAt`.
    // `createdAt` nos servirá como la fecha en que se registró el pago.
    timestamps: true,
  }
);

module.exports = mongoose.model("Pago", pagoSchema);