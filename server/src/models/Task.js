import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  startDate: { type: Date, required: true },
  targetEndDate: { type: Date, default: null },
  dailyTarget: { type: Number, min: 0, max: 10000, default: null },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  archivedAt: { type: Date, default: null },
}, { timestamps: true });

taskSchema.index({ user: 1, startDate: 1, targetEndDate: 1 });
export default mongoose.model('Task', taskSchema);
