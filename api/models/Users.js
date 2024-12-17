import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
