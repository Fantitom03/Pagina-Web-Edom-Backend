import CategoryRepository from '../repositories/CategoryRepository.js';

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
        return this.repository.delete(id);
    }
}

export default new CategoryService(new CategoryRepository());