import itemService from '../services/itemService.js';

export async function listItems(req, res) {
    try {
        const items = await itemService.list(req.query.page, req.query.limit);
        res.json(items);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function getItem (req, res) {
    try {
        const item = await itemService.getById(req.params.id);
        res.json(item);
    
    } 
    catch (e) { 
        res.status(404).json({ message: e.message }); 
    }
}

export async function createItem(req, res) {
    try {
        const item = await itemService.create(req.body);
        res.status(201).json(item);

    } catch (e) { 
        res.status(400).json({ message: e.message }); 
    }
}

export async function updateItem (req, res) {
    try {
        const item = await itemService.update(req.params.id, req.body);
        res.json(item);

    } catch (e) { 
        res.status(400).json({ message: e.message }); 
    }

}

export async function deleteItem (req, res) {
    try {
        await itemService.delete(req.params.id);
        res.json({ message: 'Item eliminado' });

    } catch (e) { 
        res.status(404).json({ message: e.message }); 
    }
}

export async function searchItems (req, res) {
    try {
        const filters = req.query;
        const items = await itemService.search(filters);
        res.json(items);

    } catch (e) { 
        res.status(400).json({ message: e.message }); 
    }
}