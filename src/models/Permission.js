import mongoose from 'mongoose';
const { Schema } = mongoose;

const permissionSchema = new Schema({
  name:        { type: String, required: true, unique: true },
  description: { type: String }
});

export default mongoose.model('Permission', permissionSchema);