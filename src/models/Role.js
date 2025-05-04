import mongoose from 'mongoose';
const { Schema } = mongoose;

const roleSchema = new Schema({
  name:        { type: String, required: true, unique: true }, // 'client', 'seller', 'admin' :contentReference[oaicite:6]{index=6}
  description: { type: String },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);