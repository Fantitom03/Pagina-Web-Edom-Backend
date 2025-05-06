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

        next();
    } catch (error) {
        // Si el token es inválido, devolvemos error 403 (Prohibido)
        return res.status(403).json({ message: 'Token inválido' });
    }
};



export const hasPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id)
                .populate({
                    path: 'role',
                    populate: { path: 'permissions' }
                });

            const hasAccess = user.role.permissions.some(perm => 
                perm.name === requiredPermission || 
                perm.name === 'manage:all'
            );

            if (!hasAccess) return res.status(403).json({ message: 'Acceso denegado' });
            
            next();
        } catch (error) {
            next(error);
        }
    };
};
