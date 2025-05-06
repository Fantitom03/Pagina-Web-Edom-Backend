import User from '../models/User.js';
import Role from '../models/Role.js';
import mongoose from 'mongoose';
import IUserRepository from './IRepositories/IUserRepository.js';

export default class UserRepository extends IUserRepository {
    async list() {
        return User.find().select('-password').populate('role');
    }

    async search(username) {
        return User
            .find({ username: { $regex: username, $options: 'i' } })
            .select('-password -__v')
            .populate('role');
    }

    async getById(id) {
        const user = await User.findById(id)
            .select('-password')
            .populate('role');
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    async update(id, data) {
        // 1️⃣ Validar/transformar role: si llegan nombre en vez de _id
        if (data.role && !mongoose.Types.ObjectId.isValid(data.role)) {
            const roleDoc = await Role.findOne({ name: data.role });
            if (!roleDoc) throw new Error('Rol no encontrado');
            data.role = roleDoc._id;
        }

        // 2️⃣ Filtrar sólo campos permitidos
        const allowed = ['username', 'email', 'role'];
        const toUpdate = {};
        for (const key of allowed) {
            if (data[key] !== undefined) toUpdate[key] = data[key];
        }

        // 3️⃣ Hacer el update
        const user = await User.findByIdAndUpdate(id, toUpdate, { new: true })
            .select('-password')
            .populate('role');

        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    async delete(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    async getRoles() {
        return Role.find().select('-__v');
    }
}