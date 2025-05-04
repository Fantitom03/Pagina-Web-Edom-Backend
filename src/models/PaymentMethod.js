import mongoose from 'mongoose';
const { Schema } = mongoose;

const paymentMethodSchema = new Schema({
  name:        { type: String, required: true, unique: true }, // Ej.: 'Credit Card', 'PayPal' :contentReference[oaicite:4]{index=4}
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('PaymentMethod', paymentMethodSchema);