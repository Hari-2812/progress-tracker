import mongoose from 'mongoose';

const checklistTopicSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true, trim: true, index: true },
  name: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  custom: { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
}, { timestamps: true });

checklistTopicSchema.index({ user: 1, subject: 1 });
checklistTopicSchema.index({ user: 1, completed: 1 });

export default mongoose.model('ChecklistTopic', checklistTopicSchema);
