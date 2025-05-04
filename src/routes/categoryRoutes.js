import express from 'express';
const router = express.Router();
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.js';

// GET /api/categories
router.get('/', authenticateToken, hasPermission('read:categories'), listCategories);

// POST /api/categories
router.post('/', authenticateToken, hasPermission('create:categories'), createCategory);

// GET /api/categories/:id
router.get('/:id', authenticateToken, hasPermission('read:categories'), getCategory);

// PUT /api/categories/:id
router.put('/:id', authenticateToken, hasPermission('update:categories'), updateCategory);

// DELETE /api/categories/:id
router.delete('/:id', authenticateToken, hasPermission('delete:categories'), deleteCategory);

export default router;