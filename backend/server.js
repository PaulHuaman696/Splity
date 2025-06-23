// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const ingresoRoutes = require('./routes/ingresoRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const itemRoutes = require('./routes/itemRoutes');
const proyectoGastoRoutes = require('./routes/proyectoGastoRoutes');
const connectDB = require('./config/db');
const invitacionRoutes = require("./routes/invitacionRoutes");
const admin = require('./config/firebaseAdminConfig');
const reporteRoutes = require("./routes/reporteRoutes");
const pagoRoutes = require('./routes/pagoRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Ruta pública
app.get('/', (req, res) => {
  res.send('API de Splity funcionando 🎉');
});

// Rutas protegidas
app.use('/api/user', userRoutes);
app.use('/api/income', ingresoRoutes);
app.use('/api/expense', gastoRoutes);
app.use('/api/projects', proyectoGastoRoutes);
app.use("/api/categories", categoriaRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/invitaciones", invitacionRoutes);
app.use("/api/reportes", reporteRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/prestamos', prestamoRoutes);

const PORT = process.env.PORT || 4000;
const IP = process.env.IP;
app.listen(PORT, () => {
  console.log(`Servidor backend corrriendo en: http://${IP}:${PORT}`);
});
