import User from '../models/User.js';
import IUserRepository from './IRepositories/IUserRepository.js';
import Role from '../models/Role.js';

export default class UserRepository extends IUserRepository {
    async list() {
        return User.find().select('-password').populate('role');
    }

    async search(username) {
        return User
            .find({ username: { $regex: username, $options: 'i' } })
            .select('-password -__v')
    }

    async update(id, data) {
        const user = await User.findByIdAndUpdate(id, data, { new: true })
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

    async getById(id) {
        const user = await User.findById(id)
            .select('-password')
            .populate('role');
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }
}