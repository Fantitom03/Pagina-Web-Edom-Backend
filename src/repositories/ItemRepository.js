import Item from '../models/Item.js';
import Category from '../models/Category.js'; 
import IItemRepository from './IRepositories/IItemRepository.js';

export default class ItemRepository extends IItemRepository {
    async list(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const items = await Item.find().skip(skip).limit(limit);
        const total = await Item.countDocuments();
        return { items, pagination: { page, totalPages: Math.ceil(total / limit), total } };
    }

    async getById(id) {
        const item = await Item.findById(id);
        if (!item) throw new Error('Item no encontrado');
        return item;
    }

    async create(data) {
        const item = new Item(data);
        await item.save();
        return item;
    }

    async update(id, data) {
        const item = await Item.findByIdAndUpdate(id, data, { new: true });
        if (!item) throw new Error('Item no encontrado');
        return item;
    }

    async delete(id) {
        const item = await Item.findByIdAndDelete(id);
        if (!item) throw new Error('Item no encontrado');
        return item;
    }

    async search(filters = {}) {
        const query = {};

        // Filtro por nombre (búsqueda parcial insensible a mayúsculas)
        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' };
        }

        // Filtro por rango de precio
        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
            if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
        }

        // Filtro por categoría (ID o nombre)
        if (filters.category) {
            if (mongoose.Types.ObjectId.isValid(filters.category)) {
                query.category = filters.category;
            } else {
                const category = await Category.findOne({ name: filters.category });
                if (category) query.category = category._id;
            }
        }

        // Otros filtros (ej.: stock mínimo)
        if (filters.minStock) {
            query.quantity = { $gte: Number(filters.minStock) };
        }

        return Item.find(query).populate('category'); // Incluye datos completos de la categoría
    }
}