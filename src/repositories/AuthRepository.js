import User from '../models/User.js';
import Role from '../models/Role.js';
import IAuthRepository from './IRepositories/IAuthRepository.js';

class AuthRepository extends IAuthRepository {
    async findUserByEmail(email) {
        try {
            console.log('🔍 Buscando usuario:', email);
            const user = await User.findOne({ email})
                .populate({
                    path: 'role',
                    select: 'name permissions -_id',    // trae sólo nombre y array de permisos
                    populate: {
                        path: 'permissions',
                        select: 'name description -_id'  // dentro del role, trae cada permiso con nombre y descripción
                    }
                })
                .maxTimeMS(30000)
                .lean();
            if (!user) console.log('⚠️ Usuario no encontrado');
            return user;
            
        } catch (error) {
            console.error('🔥 Error en findUserByEmail:', error.message);
            throw new Error('Error de base de datos');
        }
    }

    async createUser(userData) {
        const user = new User(userData);
        return user.save();
    }

    async findRoleByName(roleName) {
        return Role.findOne({ name: roleName });
    }
}

export default new AuthRepository();