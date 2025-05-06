import CategoryRepository from '../repositories/CategoryRepository.js';
import Item from '../models/Item.js';
import Category from '../models/Category.js';

class CategoryService {
    constructor(repository) {
        this.repository = repository;
    }

    async list() {
        return this.repository.list();
    }

    async getById(id) {
        return this.repository.getById(id);
    }

    async create(data) {
        return this.repository.create(data);
    }

    async update(id, data) {
        return this.repository.update(id, data);
    }

    async delete(id) {
        // 1️⃣ Encontrar o crear la categoría "Sin categoría"
        let defaultCat = await Category.findOne({ name: 'Sin categoría' });
        if (!defaultCat) {
            defaultCat = await Category.create({
                name: 'Sin categoría',
                description: 'Productos sin categoría asignada'
            });
        }

        // 2️⃣ Reasignar todos los Items que apuntan a la categoría que vamos a borrar
        await Item.updateMany(
            { category: id },
            { category: defaultCat._id }
        );

        // 3️⃣ Borrar la categoría en sí
        return this.repository.delete(id);
    }
}

export default new CategoryService(new CategoryRepository());