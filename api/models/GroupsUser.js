import mongoose from 'mongoose';

const GroupsUserSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Referencia al modelo User
    required: true 
  },
  groupId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group', // Referencia al modelo Group
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.GroupsUser || mongoose.model('GroupsUser', GroupsUserSchema);
