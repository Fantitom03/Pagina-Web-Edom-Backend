import express from 'express';
const router = express.Router();
import Item from '../models/Item.js';
import { listItems, getItem, createItem, updateItem, deleteItem, searchItems  } from '../controllers/itemController.js';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.js';


// GET /api/items
router.get('/', authenticateToken, hasPermission('read:items'), listItems);

// GET /api/items/search
router.get('/search', authenticateToken, hasPermission('read:items'), searchItems);

// POST /api/items
router.post('/', authenticateToken, hasPermission('create:items'), createItem);

// GET /api/items/category/:category
router.get('/category/:category', authenticateToken, hasPermission('read:items'), async (req, res) => {
  const items = await Item.find({ category: req.params.category });
  res.json(items);
});

// GET /api/items/:id
router.get('/:id', authenticateToken, hasPermission('read:items'), getItem);

// PUT /api/items/:id
router.put('/:id', authenticateToken, hasPermission('update:items'), updateItem);

// DELETE /api/items/:id
router.delete('/:id', authenticateToken, hasPermission('delete:items'), deleteItem);


export default router;