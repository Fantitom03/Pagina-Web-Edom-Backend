import express from 'express';
const router = express.Router();
import {
    listUsers,
    createUser,
    searchUsers,
    userID,
    updateUser,
    deleteUser,
    getRoles
} from '../controllers/userController.js';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.js';

// GET /api/users (Listar todos los usuarios)
router.get('/',
    authenticateToken,
    hasPermission('read:users'),
    listUsers
);

//GET /api/users/roles
router.get('/roles',
    authenticateToken,
    hasPermission('read:users'), 
    getRoles
);

// GET /api/users/search?username=... (Buscar usuarios por nombre)
router.get('/search',
    authenticateToken,
    hasPermission('read:users'),
    searchUsers
);

// GET /api/users/:id (Obtener un usuario por ID)
router.get('/:id',
    authenticateToken,
    hasPermission('read:users'),
    userID
);

//POST /api/users (Crear un nuevo usuario)
router.post('/',
    authenticateToken,
    hasPermission('create:users'),
    creteUser
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