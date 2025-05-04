export default class IItemRepository {

    async list(page, limit) {
        throw new Error("Método list no implementado");
    }

    async getById(id) {
        throw new Error("Método getById no implementado");
    }

    async create(data) {
        throw new Error("Método create no implementado");
    }

    async update(id, data) {
        throw new Error("Método update no implementado");
    }

    async delete(id) {
        throw new Error("Método delete no implementado");
    }

    async search(filters = {}){
        throw new Error("Método search no implementado");
    }
}