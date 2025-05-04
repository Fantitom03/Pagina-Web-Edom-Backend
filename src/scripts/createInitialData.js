import 'dotenv/config'; // <-- ¡Esto carga las variables de entorno!
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import { connectDB, closeDb } from '../config/dbConfig.js';

const initialPermissions = [
    // Permisos para Items
    { name: 'read:items', description: 'Ver productos' },
    { name: 'create:items', description: 'Crear productos' },
    { name: 'update:items', description: 'Modificar productos' },
    { name: 'delete:items', description: 'Eliminar productos' },

    // Permisos para Categorías (nuevos)
    { name: 'read:categories', description: 'Ver categorías' },
    { name: 'create:categories', description: 'Crear categorías' },
    { name: 'update:categories', description: 'Modificar categorías' },
    { name: 'delete:categories', description: 'Eliminar categorías' },

    // Permisos para Usuarios
    { name: 'read:users', description: 'Ver usuarios' },
    { name: 'update:users', description: 'Modificar usuarios' },
    { name: 'delete:users', description: 'Eliminar usuarios' },

    // Permisos administrativos globales
    { name: 'manage:all', description: 'Acceso completo al sistema' }
];

// 👥 Roles actualizados con nueva estructura
const initialRoles = [
    {
        name: 'client',
        description: 'Usuario comprador',
        permissions: [
            'read:items',
            'read:categories'
        ]
    },
    {
        name: 'seller',
        description: 'Usuario vendedor',
        permissions: [
            'read:items',
            'create:items',
            'update:items',
            'delete:items',
            'read:categories'
        ]
    },
    {
        name: 'admin',
        description: 'Administrador total',
        permissions: [
            'manage:all', // Permiso maestro que cubre todo
            'read:users',
            'update:users',
            'delete:users',
            'read:categories',
            'create:categories',
            'update:categories',
            'delete:categories'
        ]
    }
];

async function initializeData() {
    try {
        await connectDB();
        console.log('✅ Conectado a MongoDB');

        // Limpiar datos existentes
        await Permission.deleteMany({});
        await Role.deleteMany({});
        console.log('🧹 Datos antiguos eliminados');

        // Crear permisos
        const createdPermissions = await Permission.insertMany(initialPermissions);
        console.log('🔑 Permisos creados exitosamente');

        // Mapear permisos para relaciones
        const permissionMap = createdPermissions.reduce((acc, perm) => {
            acc[perm.name] = perm._id;
            return acc;
        }, {});

        // Crear roles con referencias a permisos
        const rolesToCreate = initialRoles.map(role => ({
            ...role,
            permissions: role.permissions.map(permName => permissionMap[permName])
        }));

        await Role.insertMany(rolesToCreate);
        console.log('👥 Roles creados exitosamente');

        // Mostrar resultados
        console.log('\n📝 Resumen de permisos creados:');
        createdPermissions.forEach(perm => {
            console.log(`- ${perm.name}: ${perm.description}`);
        });

        console.log('\n👤 Resumen de roles creados:');
        const roles = await Role.find().populate('permissions');
        roles.forEach(role => {
            console.log(`\n${role.name.toUpperCase()} (${role.description})`);
            role.permissions.forEach(perm => {
                console.log(`  → ${perm.name}`);
            });
        });

    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
        process.exit(1);
    } finally {
        await closeDb();
        console.log('\n🔌 Conexión a MongoDB cerrada');
    }
}

// Ejecutar el script
initializeData();