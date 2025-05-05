import User from '../models/User.js';
import IUserRepository from './IRepositories/IUserRepository.js';

export default class UserRepository extends IUserRepository {
    async list() {
        return User.find().select('-password').populate('role');
    }

    async search(username) {
        return User
            .find({ username: { $regex: username, $options: 'i' } })
            .select('-password -__v')
            .populate({
                path: 'role',
                select: 'name permissions -_id',    // trae sólo nombre y array de permisos
                populate: {
                    path: 'permissions',
                    select: 'name description -_id'  // dentro del role, trae cada permiso con nombre y descripción
                }
            });
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
}