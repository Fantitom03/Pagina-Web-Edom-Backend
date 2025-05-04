/*Concepto de servicios, listo para la versión 2.0*/

/*
import PaymentMethod from '../models/PaymentMethod.js';

class PaymentService {
    async list() {
        return await PaymentMethod.find();
    }

    async getById(id) {
        const pm = await PaymentMethod.findById(id);
        if (!pm) throw new Error('Método de pago no encontrado');
        
        return pm;
    }

    async create(data) {
        const pm = new PaymentMethod(data);
        await pm.save();

        return pm;
    }

    async update(id, data) {
        const pm = await PaymentMethod.findByIdAndUpdate(id, data, { new: true });
        if (!pm) throw new Error('Método de pago no encontrado');

        return pm;
    }

    async delete(id) {
        const pm = await PaymentMethod.findByIdAndDelete(id);
        if (!pm) throw new Error('Método de pago no encontrado');

        return pm;
    }
}

export default new PaymentService();
*/