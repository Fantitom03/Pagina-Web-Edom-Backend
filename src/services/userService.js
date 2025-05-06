import UserRepository from '../repositories/UserRepository.js';
import Role from '../models/Role.js';
import mongoose from 'mongoose';
import authRepository from '../repositories/AuthRepository.js';

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

    async update(id, data) {
        // Si se envía un nombre de rol, buscar su ID
        if (data.role && !mongoose.Types.ObjectId.isValid(data.role)) {
            const role = await Role.findOne({ name: data.role });
            if (!role) throw new Error('Rol no encontrado');
            data.role = role._id;
        }

        // Filtra campos permitidos (username, email, role)
        const allowedFields = ['username', 'email', 'role'];
        const filteredData = Object.keys(data)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});

        return this.repository.update(id, filteredData);
    }

    async delete(id) {
        return this.repository.delete(id);
    }

    async getRoles() {
        return this.repository.getRoles();
    }

    async userID(id) {
        const user = await this.repository.getById(id);
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }
}

export default new UserService(new UserRepository());