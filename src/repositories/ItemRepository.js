import Item from '../models/Item.js';
import Category from '../models/Category.js';
import IItemRepository from './IRepositories/IItemRepository.js';
import mongoose from 'mongoose';

export default class ItemRepository extends IItemRepository {
    async list(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const items = await Item.find().skip(skip).limit(limit);
        const total = await Item.countDocuments();
        return { items, pagination: { page, totalPages: Math.ceil(total / limit), total, limit } };
    }

    async getById(id) {
        const item = await Item.findById(id)
            .select('-__v')
            .populate('category', 'name');
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

    async search(filters = {}, page = 1, limit = 10) {
        const query = {};

        // name
        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' };
        }

        // price range
        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
            if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
        }

        // category
        if (filters.category) {
            if (mongoose.Types.ObjectId.isValid(filters.category)) {
                query.category = filters.category;
            } else {
                const cat = await Category.findOne({ name: filters.category });
                if (cat) query.category = cat._id;
            }
        }

        // pagination
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            Item.find(query)
                .skip(skip)
                .limit(limit)
                .populate('category', 'name'),
            Item.countDocuments(query)
        ]);

        const pagination = {
            page,
            totalPages: Math.ceil(total / limit),
            total,
            limit
        };

        return { items, pagination };
    }
}