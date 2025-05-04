import 'dotenv/config'; // <-- ¡Esto carga las variables de entorno!
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import { connectDB, closeDb } from '../config/dbConfig.js';

// Definición de permisos
const initialPermissions = [
    // Permisos para Items
    { name: 'read:items', description: 'Puede ver items y sus detalles' },
    { name: 'create:items', description: 'Puede crear nuevos items' },
    { name: 'update:items', description: 'Puede modificar items existentes' },
    { name: 'delete:items', description: 'Puede eliminar items' },

    // Permisos para Métodos de Pago
    { name: 'read:paymentMethods', description: 'Puede ver métodos de pago' },
    { name: 'create:paymentMethods', description: 'Puede crear métodos de pago' },
    { name: 'update:paymentMethods', description: 'Puede modificar métodos de pago' },
    { name: 'delete:paymentMethods', description: 'Puede eliminar métodos de pago' },

    // Permisos para Pagos
    { name: 'create:payments', description: 'Puede realizar pagos' },

    // Permisos administrativos
    { name: 'manage:users', description: 'Puede gestionar usuarios' },
    { name: 'manage:roles', description: 'Puede gestionar roles' }
];

// Definición de roles con sus permisos
const initialRoles = [
    {
        name: 'client',
        description: 'Usuario normal',
        permissions: [
            'read:items',
            'read:paymentMethods',
            'create:payments'
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
            'read:paymentMethods',
            'create:payments'
        ]
    },
    {
        name: 'admin',
        description: 'Administrador del sistema',
        permissions: [
            'read:items',
            'create:items',
            'update:items',
            'delete:items',
            'read:paymentMethods',
            'create:paymentMethods',
            'update:paymentMethods',
            'delete:paymentMethods',
            'create:payments',
            'manage:users',
            'manage:roles'
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