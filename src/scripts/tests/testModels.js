import mongoose from 'mongoose';
import User from '../../models/User.js';
import { connectDB } from '../../config/dbConfig.js';

async function test() {
    try {
        // 1. Conectar manualmente
        await connectDB();

        /*
        // 2. Resetear base de datos
        await mongoose.connection.dropDatabase();
        console.log("🔄 Base de datos reiniciada");

        // 3. Crear datos de prueba
        const testRole = await mongoose.connection.db.collection('roles').insertOne({
            name: 'test-role',
            description: 'Rol temporal para pruebas'
        });

        const testUser = new User({
            username: "test-user",
            email: "test@test.com",
            password: "123456",
            role: testRole.insertedId
        });

        // 4. Guardar y verificar
        await testUser.save();
        console.log("✅ Usuario creado:", testUser);
        */

        // 5. Consulta directa a la colección
        const users = await mongoose.connection.db.collection('users').find().toArray();
        console.log("📦 Usuarios en DB:", users);

    } catch (error) {
        console.error("🔥 Error en test:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

test();