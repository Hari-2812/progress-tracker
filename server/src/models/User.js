import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  challengeStartDate: { type: Date, default: Date.now },
  goalDays: { type: Number, default: 90, immutable: true },
}, { timestamps: true });

userSchema.pre('save', async function next() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.comparePassword = function (password) { return bcrypt.compare(password, this.password); };
userSchema.methods.toSafeObject = function () { return { id: this._id, name: this.name, email: this.email, challengeStartDate: this.challengeStartDate, goalDays: this.goalDays }; };
export default mongoose.model('User', userSchema);
