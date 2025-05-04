import { categoryService } from '../services/categoryService.js';

export async function listCategories(req, res) {
    try {
        const categories = await categoryService.list();
        res.json(categories);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function getCategory(req, res) {
    try {
        const category = await categoryService.getById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(category);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function createCategory(req, res) {
    try {
        const category = await categoryService.create(req.body);
        res.status(201).json(category);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function updateCategory(req, res) {
    try {
        const category = await categoryService.update(req.params.id, req.body);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(category);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function deleteCategory(req, res) {
    try {
        const category = await categoryService.delete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}


