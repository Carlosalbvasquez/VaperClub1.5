// =========================================================
// config/db.js
// =========================================================
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definido en el archivo .env');
    }

    // Conexión limpia sin opciones deprecadas
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  El servidor continuará sin conexión a la base de datos.');
  }
};

module.exports = connectDB;
