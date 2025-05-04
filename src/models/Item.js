import mongoose from 'mongoose';
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: { // Nombre del electrodoméstico :contentReference[oaicite:0]{index=0}
    type: String, 
    required: true 
  },           
  
  quantity: { // Cantidad disponible :contentReference[oaicite:0]{index=0}
    type: Number, 
    required: true, 
    min: 0 },   
  
  description: { // Descripción detallada :contentReference[oaicite:1]{index=1}
    type: String, 
    required: true 
  },           
  
  price: { // Precio base :contentReference[oaicite:2]{index=2}
    type: Number, 
    required: true, 
    min: 0 
  },   
  
  discount: { // % de descuento (opcional) :contentReference[oaicite:3]{index=3}
    type: Number, 
    min: 0, 
    max: 100, 
    default: 0 
  }, 
  
  category: { // Categoría del electrodoméstico :contentReference[oaicite:4]{index=4}
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  }
}, { timestamps: true });

// Virtual para precio final con descuento
itemSchema.virtual('finalPrice').get(function() {
  return this.price * (1 - this.discount / 100);
});


export default mongoose.model('Item', itemSchema);