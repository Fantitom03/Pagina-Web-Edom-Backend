import UserRepository from '../repositories/UserRepository.js';

class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    async list() {
        return this.repository.list();
    }

    async search(username) {
        return this.repository.search(username);
    }

    async getById(id) {
        return this.repository.getById(id);
    }

    async update(id, data) {
        // Aquí sólo delegamos al repositorio; toda la lógica de consulta va allí.
        return this.repository.update(id, data);
    }

    async delete(id) {
        return this.repository.delete(id);
    }

    async getRoles() {
        return this.repository.getRoles();
    }
}

export default new UserService(new UserRepository());