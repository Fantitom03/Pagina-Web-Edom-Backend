/*Rutas sin implementar, listas para la versión 2.0*/

/*
import express from 'express';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.js';
import PaymentMethod from '../models/PaymentMethod.js';

const router = express.Router();


import PaymentMethod from '../models/PaymentMethod.js';

router.get('/',  authenticateToken, hasPermission('read:paymentMethods'), async (req, res) => {
  res.json(await PaymentMethod.find());
});

router.get('/:id', authenticateToken, hasPermission('read:paymentMethods'), async (req, res) => {
  const pm = await PaymentMethod.findById(req.params.id);
  if (!pm) return res.status(404).json({ message: 'Método de pago no encontrado' });
  res.json(pm);
});

router.post('/', authenticateToken, hasPermission('create:paymentMethods'), async (req, res) => {
  const pm = new PaymentMethod(req.body);
  await pm.save();
  res.status(201).json(pm);
});

router.put('/:id', authenticateToken, hasPermission('update:paymentMethods'), async (req, res) => {
  const pm = await PaymentMethod.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(pm);
});

router.delete('/:id', authenticateToken, hasPermission('delete:paymentMethods'), async (req, res) => {
  await PaymentMethod.findByIdAndDelete(req.params.id);
  res.json({ message: 'Método de pago eliminado' });
});

export default router;
*/