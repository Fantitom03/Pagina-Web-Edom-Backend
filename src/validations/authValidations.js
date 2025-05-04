import { body } from 'express-validator';

export const registerValidation = [
    body('username')
        .notEmpty().withMessage('Nombre de usuario requerido')
        .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres'),

    body('email')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres')
];

export const loginValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida')
];