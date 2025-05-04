export default class IUserRepository {
    async list() {
        throw new Error("Método list no implementado");
    }

    async search(username) {
        throw new Error("Método search no implementado");
    }

    async update(id, data) {
        throw new Error("Método update no implementado");
    }

    async delete(id) {
        throw new Error("Método delete no implementado");
    }
}