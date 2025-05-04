import authService from '../services/authService.js';

export const register = async (req, res) => {
    try {
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: existingUser.email === req.body.email
                    ? "El correo electrónico ya está registrado"
                    : "El nombre de usuario ya está en uso"
            });
        }
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            message: "Error en los datos de registro: " + error.message
        });
    };
}

export const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
