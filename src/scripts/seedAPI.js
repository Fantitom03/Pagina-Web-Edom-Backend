import 'dotenv/config';
import axios from 'axios';
import { connectDB, closeDb } from '../config/dbConfig.js';
import Item from '../models/Item.js';
import Category from '../models/Category.js';

// 1. Configuración inicial
const API_BASE = 'https://dummyjson.com/products';
let totalProductsAdded = 0;
const ITEM_LIMIT = 20; // Limitar a 20 productos
const DELAY_BETWEEN_INSERTS = 1000; // 1 segundo entre inserciones

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
        // Obtener solo 20 productos
        const { data } = await axios.get(`${API_BASE}?limit=${ITEM_LIMIT}`);
        const products = data.products;

        console.log(`📦 Obtenidos ${products.length} productos de la API`);

        // Comprobar productos existentes de manera eficiente
        const productNames = products.map(p => p.title);
        const existingProducts = await Item.find({ name: { $in: productNames } }).select('name');
        const existingNames = new Set(existingProducts.map(p => p.name));

        // Preparar operaciones de inserción
        const productsToInsert = [];

        for (const product of products) {
            if (!existingNames.has(product.title)) {
                productsToInsert.push(mapProductToSchema(product, categoryMap));
            } else {
                console.log(`⚠️ Producto ya existe: ${product.title}`);
            }
        }

        // Insertar productos uno por uno con delay
        for (let i = 0; i < productsToInsert.length; i++) {
            const product = productsToInsert[i];
            await Item.create(product);
            totalProductsAdded++;
            console.log(`✅ [${i + 1}/${productsToInsert.length}] Producto agregado: ${product.name}`);

            // Añadir delay entre inserciones
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_INSERTS));
        }

    } catch (error) {
        console.error('❌ Error insertando productos:', error.message);
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