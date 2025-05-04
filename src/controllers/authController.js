import authService from '../services/authService.js';

import authService from '../services/authService.js';

export const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        const status = error.message.includes('ya está') ? 409 : 400;
        res.status(status).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
