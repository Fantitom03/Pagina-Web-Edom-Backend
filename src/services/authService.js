import bcrypt from 'bcryptjs';
import authRepository from '../repositories/AuthRepository.js';
import { generateToken } from '../utils/token.js';

class AuthService {
    constructor(repository) {
        this.repository = repository;
    }

    async register(userData) {
        // Validación de existencia en repositorio
        const existingUser = await authRepository.findUserByEmail(
            userData.email,
            userData.username
        );

        if (existingUser) {
            throw new Error(
                existingUser.email === userData.email
                    ? 'El correo ya está registrado'
                    : 'El nombre de usuario ya existe'
            );
        }

        // Lógica de negocio
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const clientRole = await authRepository.findRoleByName('client');

        if (!clientRole) {
            throw new Error('Rol por defecto no configurado');
        }

        // Creación mediante repositorio
        return authRepository.createUser({
            ...userData,
            password: hashedPassword,
            role: clientRole._id
        });
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