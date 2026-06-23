import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['first_task', 'streak_7', 'streak_30', 'streak_60', 'champion_90', 'tasks_100', 'questions_500'], required: true },
  unlockedAt: { type: Date, default: Date.now },
}, { timestamps: true });
achievementSchema.index({ user: 1, type: 1 }, { unique: true });
export default mongoose.model('Achievement', achievementSchema);
