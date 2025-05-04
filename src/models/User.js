import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: Schema.Types.ObjectId, ref: 'Role', required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);