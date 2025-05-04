import bcrypt from 'bcryptjs';
import authRepository from '../repositories/authRepository.js';
import { generateToken } from '../utils/token.js';

class AuthService {
    constructor(repository) {
        this.repository = repository;
    }

    async register(userData) {
        const existingUser = await this.repository.findUserByEmail(userData.email);
        if (existingUser) throw new Error('Usuario o email ya existe');

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const defaultRole = await this.repository.findRoleByName('client');
        if (!defaultRole) throw new Error('Rol por defecto no encontrado');

        const newUser = await this.repository.createUser({
            ...userData,
            password: hashedPassword,
            role: defaultRole._id
        });

        return this._formatUserResponse(newUser);
    }

    async login(credentials) {
        const user = await this.repository.findUserByEmail(credentials.email);
        if (!user) throw new Error('Usuario no encontrado');

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error('Credenciales inválidas');

        return {
            user: this._formatUserResponse(user),
            token: generateToken({ id: user._id, role: user.role })
        };
    }

    _formatUserResponse(user) {
        const userObj = typeof user.toObject === 'function' ? user.toObject() : user;
        delete userObj.password;
        return userObj;
    }
}

export default new AuthService(authRepository);