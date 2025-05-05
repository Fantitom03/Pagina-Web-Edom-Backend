import itemService from '../services/itemService.js';

export async function listItems(req, res) {
    try {
        const items = await itemService.list(req.query.page, req.query.limit);
        res.json(items);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function getItem(req, res) {
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

export async function updateItem(req, res) {
    try {
        const item = await itemService.update(req.params.id, req.body);
        res.json(item);

    } catch (e) {
        res.status(400).json({ message: e.message });
    }

}

export async function deleteItem(req, res) {
    try {
        await itemService.delete(req.params.id);
        res.json({ message: 'Item eliminado' });

    } catch (e) {
        res.status(404).json({ message: e.message });
    }
}
export async function searchItems(req, res) {
    try {
        // 1) Extraemos todos los parámetros de query
        const { q, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        // 2) Mapeamos q → name, y convertimos page/limit a números
        const filters = {
            name: q || undefined,
            category,
            minPrice,
            maxPrice,
        };
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;

        // 3) Delegamos al service
        const { items, pagination } = await itemService.search(filters, pageNum, limitNum);

        // 4) Devolvemos el mismo shape que listItems
        res.json({ items, pagination });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}