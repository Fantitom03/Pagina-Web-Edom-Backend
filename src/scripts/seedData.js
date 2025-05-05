import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from '../models/Item.js';
import Category from '../models/Category.js';
import { v4 as uuid } from 'uuid';  // para generar sufijo único

dotenv.config();

const CATEGORIES = [
    { name: "Electrodomésticos", description: "Grandes electrodomésticos para el hogar" },
    { name: "Electrónica", description: "Dispositivos electrónicos y gadgets" },
    { name: "Línea Blanca", description: "Aparatos para la cocina y limpieza" }
];

async function pause(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');

    // 1) Limpiar
    await Category.deleteMany({});
    await Item.deleteMany({});
    console.log('🗑️ Colecciones limpiadas');

    // 2) Insertar categorías
    const createdCats = await Category.insertMany(CATEGORIES);
    console.log('📂 Categorías creadas:', createdCats.map(c => c.name));

    // 3) Generar 50 items
    const items = [];
    for (let i = 0; i < 50; i++) {
        const cat = createdCats[i % createdCats.length]; // rotar categorías
        const uniqueSuffix = uuid().slice(0, 8);
        items.push({
            name: `${cat.name} Modelo ${uniqueSuffix}`,
            quantity: Math.floor(Math.random() * 100),
            description: `Descripción para ${cat.name} modelo ${uniqueSuffix}`,
            price: Number((Math.random() * 2000 + 50).toFixed(2)),
            discount: Math.floor(Math.random() * 30),          // 0–29%
            category: cat._id,
            image: `https://picsum.photos/seed/${uniqueSuffix}/400/300`
        });
    }

    // 4) Insertar en batches de 10 con delay
    for (let i = 0; i < items.length; i += 10) {
        const batch = items.slice(i, i + 10);
        await Item.insertMany(batch, { ordered: false });
        console.log(`📝 Insertados items ${i + 1}–${i + batch.length}`);
        await pause(300);  // 300ms de pausa
    }

    console.log('🎉 Seed completado con 50 items únicos.');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
});