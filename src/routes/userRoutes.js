import express from 'express';
const router = express.Router();
import {
    listUsers,
    searchUsers,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

// GET /api/users (Listar todos los usuarios)
router.get('/',
    authenticateToken,
    authorize('admin'),
    listUsers
);

// GET /api/users/search?username=... (Buscar usuarios por nombre)
router.get('/search',
    authenticateToken,
    authorize('admin'),
    searchUsers
);

// PUT /api/users/:id (Actualizar usuario)
router.put('/:id',
    authenticateToken,
    authorize('admin'),
    updateUser
);

// DELETE /api/users/:id (Eliminar usuario)
router.delete('/:id',
    authenticateToken,
    authorize('admin'),
    deleteUser
);

export default router;