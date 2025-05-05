import ItemRepository from '../repositories/itemRepository.js';

class ItemService {
    constructor(repository) {
        this.repo = repository;
    }

    async list(page, limit) {
        return this.repo.list(page, limit);
    }

    async getById(id) {
        return this.repo.getById(id);
    }

    async create(data) {
        return this.repo.create(data);
    }

    async update(id, data) {
        return this.repo.update(id, data);
    }

    async delete(id) {
        return this.repo.delete(id);
    }

    async search(filters, page, limit) {
        return this.repo.search(filters, page, limit);
    }
}

export default new ItemService(new ItemRepository());