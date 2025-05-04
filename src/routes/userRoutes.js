import express from 'express';
const router = express.Router();
import {
    listUsers,
    searchUsers,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.js';

// GET /api/users (Listar todos los usuarios)
router.get('/',
    authenticateToken,
    hasPermission('read:users'),
    listUsers
);

// GET /api/users/search?username=... (Buscar usuarios por nombre)
router.get('/search',
    authenticateToken,
    hasPermission('read:users'),
    searchUsers
);

// PUT /api/users/:id (Actualizar usuario)
router.put('/:id',
    authenticateToken,
    hasPermission('update:users'),
    updateUser
);

// DELETE /api/users/:id (Eliminar usuario)
router.delete('/:id',
    authenticateToken,
    hasPermission('delete:users'),
    deleteUser
);


export default router;