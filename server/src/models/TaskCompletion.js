import mongoose from 'mongoose';

const taskCompletionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: true },
  completedAt: { type: Date, default: Date.now },
  questionsPracticed: { type: Number, min: 0, default: 0 },
}, { timestamps: true });

taskCompletionSchema.index({ user: 1, task: 1, date: 1 }, { unique: true });
export default mongoose.model('TaskCompletion', taskCompletionSchema);
