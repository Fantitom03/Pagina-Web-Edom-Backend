import 'dotenv/config'; // 👈 ¡Añade esto al inicio!
import mongoose from 'mongoose';

export async function connectDB() {
  try {
    // Verifica que las variables están cargadas
    console.log("🔑 Verificación ENV:", {
      URI: process.env.MONGODB_URI ? "OK" : "FALTA",
      JWT: process.env.JWT_SECRET ? "OK" : "FALTA"
    });

    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    // Verificación EXTRA
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log("👥 Usuarios en DB:", userCount);

    return conn;
    
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    process.exit(1);
  }
}


export async function closeDb() {
  try {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
  } catch (error) {
    console.error("Error cerrando conexión:", error);
  }
}