import 'dotenv/config'; // <-- ¡Esto carga las variables de entorno!
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { connectDB, closeDb } from '../config/dbConfig.js';

// Usuarios de prueba
const testUsers = [
    {
        username: 'admin_user',
        email: 'admin@edom.com',
        password: 'Admin123!',
        roleName: 'admin'
    },
    {
        username: 'seller_user',
        email: 'seller@edom.com',
        password: 'Seller123!',
        roleName: 'seller'
    },
    {
        username: 'client_user',
        email: 'client@edom.com',
        password: 'Client123!',
        roleName: 'client'
    }
];

async function createTestUsers() {
    try {
        await connectDB();
        console.log('✅ Conectado a MongoDB');

        // Limpiar solo usuarios de prueba existentes
        await User.deleteMany({
            email: { $in: testUsers.map(u => u.email) }
        });
        console.log('🧹 Usuarios de prueba antiguos eliminados');

        // Hashear contraseñas
        const usersWithHash = await Promise.all(
            testUsers.map(async user => ({
                ...user,
                password: await bcrypt.hash(user.password, 10)
            }))
        );

        // Buscar roles
        const roles = await Role.find({
            name: { $in: ['admin', 'seller', 'client'] }
        });

        const roleMap = roles.reduce((acc, role) => {
            acc[role.name] = role._id;
            return acc;
        }, {});

        // Crear usuarios
        const usersToCreate = usersWithHash.map(user => ({
            username: user.username,
            email: user.email,
            password: user.password,
            role: roleMap[user.roleName]
        }));

        const createdUsers = await User.insertMany(usersToCreate);
        console.log('👤 Usuarios creados exitosamente');

        // Mostrar resultados
        console.log('\n📝 Resumen de usuarios creados:');
        createdUsers.forEach(user => {
            console.log(`
            Username: ${user.username}
            Email: ${user.email}
            Rol: ${testUsers.find(u => u.email === user.email).roleName}
            Contraseña: ${testUsers.find(u => u.email === user.email).password} (sin hashear)
            `);
        });

    } catch (error) {
        console.error('❌ Error creando usuarios:', error);
        process.exit(1);
    } finally {
        await closeDb();
        console.log('\n🔌 Conexión a MongoDB cerrada');
    }
}

// Ejecutar el script
createTestUsers();