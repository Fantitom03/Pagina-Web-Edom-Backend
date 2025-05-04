import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const authenticateToken = (req, res, next) => {

    // Obtenemos el header de autorización
    const authHeader = req.headers['authorization'];
    // Extraemos el token del header (formato: "Bearer <token>")
    const token = authHeader && authHeader.split(' ')[1];

    // Si no hay token, devolvemos error 401 (No autorizado)
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }


    try {
        // Verificamos el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Guardamos la información del usuario decodificada en el objeto request
        req.user = decoded;
        // Continuamos con la siguiente función middleware
        next();
    } catch (error) {
        // Si el token es inválido, devolvemos error 403 (Prohibido)
        return res.status(403).json({ message: 'Token inválido' });
    }
};



export const hasPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'No autenticado' });
            }

            // Obtener usuario con rol y permisos populados
            const user = await User.findById(req.user.id)
                .populate({
                    path: 'role',
                    populate: {
                        path: 'permissions'
                    }
                });


            const hasPermission = user.role.permissions.some(
                permission => permission.name === requiredPermission
            );

            if (!hasPermission) {
                return res.status(403).json({
                    message: 'No tienes permiso para realizar esta acción'
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

// Middleware de autorización por rol
export const authorize = (roleName) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).populate('role');
            if (user.role.name !== roleName) {
                return res.status(403).json({ message: "Acceso no autorizado" });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: "Error del servidor" });
        }
    };
};
