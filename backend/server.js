// backend/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const incomeRoutes = require('./routes/ingresoRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const itemRoutes = require('./routes/itemRoutes');
const sharedExpenseRoutes = require('./routes/gastoCompartidoRoutes');
const connectDB = require('./config/db');
const admin = require('./config/firebaseAdminConfig');

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
app.use('/api/income', incomeRoutes);
app.use('/api/expense', gastoRoutes);
app.use('/api/shared-expense', sharedExpenseRoutes);
app.use("/api/categories", categoriaRoutes);
app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
