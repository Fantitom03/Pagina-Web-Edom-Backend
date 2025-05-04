import mongoose from 'mongoose';
import 'dotenv/config';

async function testConnection() {
  try {
    console.log("URI:", process.env.MONGODB_URI); // Agrégalo antes de mongoose.connect()
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 segundos
      connectTimeoutMS: 30000, // 30 segundos
      socketTimeoutMS: 45000 // 45 segundos
    });
    
    const user = await mongoose.connection.db.collection('users').findOne({});
    console.log('✅ Usuario encontrado:', user);
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

testConnection();