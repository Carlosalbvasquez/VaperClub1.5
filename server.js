// =========================================================
// IMPORTACIONES
// =========================================================
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// =========================================================
// CONFIGURACIÓN INICIAL
// =========================================================
dotenv.config();

// Conectar a MongoDB
connectDB();

// Crear app Express
const app = express();

// =========================================================
// MIDDLEWARES
// =========================================================
app.use(cors()); // 🔥 Permite peticiones desde frontend (React)
app.use(express.json()); // Para leer JSON en body
app.use(express.urlencoded({ extended: true }));

// =========================================================
// RUTAS PRINCIPALES
// =========================================================
app.get('/', (req, res) => {
  res.send('✅ API de VaperClub funcionando correctamente');
});

// Rutas API
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// =========================================================
// ARCHIVOS ESTÁTICOS (uploads y frontend futuro)
// =========================================================
const __dirname_custom = path.resolve();
app.use('/uploads', express.static(path.join(__dirname_custom, '/uploads')));

// =========================================================
// MIDDLEWARES DE ERROR
// =========================================================
app.use(notFound);
app.use(errorHandler);

// =========================================================
// SERVIDOR
// =========================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en modo ${process.env.NODE_ENV || 'development'} en el puerto ${PORT}`);
});
