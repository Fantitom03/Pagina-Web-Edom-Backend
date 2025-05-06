import mongoose from 'mongoose';
const { Schema } = mongoose;

const paymentMethodSchema = new Schema({
  name:        { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('PaymentMethod', paymentMethodSchema);