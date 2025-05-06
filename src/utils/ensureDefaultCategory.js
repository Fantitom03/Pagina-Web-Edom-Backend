import Category from '../models/Category.js';

export async function ensureDefaultCategory() {
    const exists = await Category.findOne({ name: 'Sin categoría' });
    if (!exists) {
        await Category.create({
            name: 'Sin categoría',
            description: 'Categoría por defecto para productos huérfanos'
        });
        console.log('✅ Categoria “Sin categoría” creada');
    }
}