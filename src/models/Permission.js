import mongoose from 'mongoose';
const { Schema } = mongoose;

const permissionSchema = new Schema({
  name:        { type: String, required: true, unique: true }, // e.g. 'create:items' :contentReference[oaicite:5]{index=5}
  description: { type: String }
});

export default mongoose.model('Permission', permissionSchema);