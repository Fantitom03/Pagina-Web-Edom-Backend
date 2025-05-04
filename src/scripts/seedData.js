import mongoose from 'mongoose';
import Item from '../models/Item.js';
import Category from '../models/Category.js'; // Asegúrate de importar el modelo Category
import 'dotenv/config';

// Datos de categorías a insertar
const categoriesData = [
    {
        name: "Electrodomésticos",
        description: "Grandes electrodomésticos para el hogar"
    },
    {
        name: "Electrónica",
        description: "Dispositivos electrónicos y gadgets"
    },
    {
        name: "Linea Blanca",
        description: "Aparatos para la cocina y limpieza"
    }
];

// Datos de los items actualizados con referencias a categorías
const itemsData = [
    {
        name: "Refrigerador Samsung Side by Side",
        quantity: 15,
        description: "Refrigerador de 22 pies cúbicos con dispensador de agua y hielo, tecnología Twin Cooling Plus y diseño elegante en acero inoxidable.",
        price: 1299.99,
        discount: 10,
        category: null // Se actualizará con ID real
    },
    {
        name: "Lavadora LG Carga Frontal",
        quantity: 20,
        description: "Lavadora inteligente de 4.5 pies cúbicos con tecnología AI DD, motor Inverter Direct Drive y conexión Wi-Fi para control remoto.",
        price: 799.99,
        discount: 5,
        category: null // Se actualizará con ID real
    },
    {
        name: "Horno Microondas Panasonic",
        quantity: 30,
        description: "Microondas de 1.2 pies cúbicos con función inverter, 10 niveles de potencia y diseño compacto para espacios reducidos.",
        price: 149.99,
        discount: 0,
        category: null // Se actualizará con ID real
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000
        });
        console.log('✅ Conectado a MongoDB');

        // Limpiar colecciones
        await Category.deleteMany({});
        console.log('🗑️ Categorías antiguas eliminadas');
        await Item.deleteMany({});
        console.log('🗑️ Items antiguos eliminados');

        // Insertar categorías
        const createdCategories = await Category.insertMany(categoriesData);
        console.log('📦 Categorías insertadas:', createdCategories.map(c => c.name));

        // Mapear nombres de categoría a IDs
        const categoryMap = createdCategories.reduce((acc, category) => {
            acc[category.name] = category._id;
            return acc;
        }, {});

        // Asignar IDs de categoría a los items
        itemsData[0].category = categoryMap['Electrodomésticos'];
        itemsData[1].category = categoryMap['Linea Blanca'];
        itemsData[2].category = categoryMap['Electrónica'];

        // Insertar items con referencias a categorías
        const createdItems = await Item.insertMany(itemsData);
        console.log('📦 Items insertados:', createdItems.map(i => i.name));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedDB();