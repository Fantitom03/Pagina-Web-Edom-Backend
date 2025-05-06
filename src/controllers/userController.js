import userService from '../services/userService.js';

export async function listUsers(req, res) {
    try {
        const users = await userService.list();
        res.json(users);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function searchUsers(req, res) {
    try {
        const { username } = req.query;
        const users = await userService.search(username);
        res.json(users);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

export async function userID(req, res) {
    try {
        const user = await userService.userID(req.params.id);
        res.json(user);
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
}

export async function createUser(req, res) {
    try {
        const data = req.body;
        const user = await userService.create(data);
        res.status(201).json(user);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        const user = await userService.update(id, data);
        res.json(user);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

export async function deleteUser(req, res) {
    try {
        await userService.delete(req.params.id);
        res.json({ message: 'Usuario eliminado' });
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
}

export async function getRoles(req, res) {
    try {
        const roles = await userService.getRoles();
        res.json(roles);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}