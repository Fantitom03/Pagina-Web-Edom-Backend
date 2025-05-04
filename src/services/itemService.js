import ItemRepository from '../repositories/ItemRepository.js';

class ItemService {
    constructor(repository) {
        this.repository = repository;
    }

    async list(page, limit) {
        return this.repository.list(page, limit);
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

    async search(filters) {
        return this.repository.search(filters);
    }
}

// Inyección de dependencia
export default new ItemService(new ItemRepository());