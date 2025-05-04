export default class IAuthRepository {
    async findUserByEmail(email) {
        throw new Error("Método findUserByEmail no implementado");
    }

    async createUser(userData) {
        throw new Error("Método createUser no implementado");
    }

    async findRoleByName(roleName) {
        throw new Error("Método findRoleByName no implementado");
    }

    async updateUserRole(userId, roleId) {
        throw new Error("Método updateUserRole no implementado");
    }

    async checkConnection() {
        throw new Error("Método checkConnection no implementado");
    }
}