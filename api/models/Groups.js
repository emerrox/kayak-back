import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cal_id: { type: String, required: true },
});

export default mongoose.models.Group || mongoose.model('Group', GroupSchema);
