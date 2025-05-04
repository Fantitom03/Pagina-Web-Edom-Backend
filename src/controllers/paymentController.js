/*Conceptos de controllers, listos para la versión 2.0*/

/*
import paymentService from '../services/paymentService.js';

export async function listPayments(req, res) {
    try {
        const payments = await paymentService.list();
        res.json(payments);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function getPayment(req, res) {
    try {
        const payment = await paymentService.getById(req.params.id);
        res.json(payment);
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
}

export async function createPayment(req, res) {
    try {
        const payment = await paymentService.create(req.body);
        res.status(201).json(payment);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

export async function updatePayment(req, res) {
    try {
        const payment = await paymentService.update(req.params.id, req.body);
        res.json(payment);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

export async function deletePayment(req, res) {
    try {
        await paymentService.delete(req.params.id);
        res.json({ message: 'Método de pago eliminado' });
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
}
*/