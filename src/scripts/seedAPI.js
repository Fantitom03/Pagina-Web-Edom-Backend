import 'dotenv/config';
import axios from 'axios';
import { connectDB, closeDb } from '../config/dbConfig.js';
import Item from '../models/Item.js';
import Category from '../models/Category.js';

// 1. Configuración inicial
const API_BASE = 'https://dummyjson.com/products';
const BATCH_SIZE = 50; // Para evitar sobrecargar la API y la DB
let totalProductsAdded = 0;

// 2. Función para mapear los datos de la API a tu esquema
const mapProductToSchema = (apiProduct, categoryMap) => {
    return {
        name: apiProduct.title,
        description: apiProduct.description,
        price: apiProduct.price * 1.15, // Ejemplo: agregar IVA
        discount: apiProduct.discountPercentage,
        quantity: apiProduct.stock,
        category: categoryMap[apiProduct.category],
        image: apiProduct.thumbnail || apiProduct.images[0]
    };
};

// 3. Obtener y procesar categorías
async function processCategories() {
    try {
        const { data: categories } = await axios.get(`${API_BASE}/category-list`);
        const categoryMap = {};

        // Crear categorías que no existan
        for (const categoryName of categories) {
            const existingCategory = await Category.findOne({ name: categoryName });
            
            if (!existingCategory) {
                const newCategory = await Category.create({ 
                    name: categoryName,
                    description: `Productos de ${categoryName}`
                });
                categoryMap[categoryName] = newCategory._id;
                console.log(`✅ Categoría creada: ${categoryName}`);
            } else {
                categoryMap[categoryName] = existingCategory._id;
            }
        }
        
        return categoryMap;
    } catch (error) {
        console.error('❌ Error procesando categorías:', error.message);
        throw error;
    }
}

// 4. Poblar productos
async function seedProducts(categoryMap) {
    try {
        const { data } = await axios.get(`${API_BASE}?limit=0`);
        const products = data.products;
        
        // Insertar en lotes
        for (let i = 0; i < products.length; i += BATCH_SIZE) {
            const batch = products.slice(i, i + BATCH_SIZE);
            const itemsToInsert = batch.map(product => 
                mapProductToSchema(product, categoryMap)
            );
            
            await Item.insertMany(itemsToInsert, { ordered: false });
            totalProductsAdded += itemsToInsert.length;
            console.log(`📦 Lote ${i/BATCH_SIZE + 1} procesado (${itemsToInsert.length} productos)`);
        }
        
    } catch (error) {
        console.error('❌ Error insertando productos:', error.message);
        if (error.code === 11000) {
            console.log('⚠️ Algunos productos duplicados fueron omitidos');
        }
    }
}

// 5. Ejecución principal
async function main() {
    try {
        await connectDB();
        console.log('⚡ Conexión a MongoDB establecida');

        // Paso 1: Procesar categorías
        console.log('\n🔍 Obteniendo categorías de DummyJSON...');
        const categoryMap = await processCategories();
        
        // Paso 2: Poblar productos
        console.log('\n🚀 Importando productos desde DummyJSON...');
        await seedProducts(categoryMap);
        
        // Resultados finales
        console.log('\n🎉 Población completada con éxito!');
        console.log(`📊 Total productos insertados: ${totalProductsAdded}`);
        console.log(`🗂️  Total categorías existentes: ${Object.keys(categoryMap).length}`);

    } catch (error) {
        console.error('🔥 Error crítico:', error.message);
    } finally {
        await closeDb();
        console.log('\n🔌 Conexión a MongoDB cerrada');
    }
}

// Ejecutar
main();