import Category from '../models/Category.js';
import ICategoryRepository from './IRepositories/ICategoryRepository.js';

export default class CategoryRepository extends ICategoryRepository {
  async list() {
    return Category.find();
  }

  async getById(id) {
    return Category.findById(id);
  }

  async create(data) {
    const category = new Category(data);
    return category.save();
  }

  async update(id, data) {
    return Category.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Category.findByIdAndDelete(id);
  }
}