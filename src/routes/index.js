import express from 'express';
import itemRouter from './itemRoutes.js';
import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';

const router = express.Router();

router.use('/items', itemRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter); 

export default router;