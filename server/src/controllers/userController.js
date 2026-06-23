import User from '../models/User.js';

export async function updateProfile(req, res, next) { try {
  const name = req.body.name?.trim(); if (!name || name.length < 2 || name.length > 60) return res.status(400).json({ message: 'Name must be between 2 and 60 characters' });
  req.user.name = name; await req.user.save(); res.json({ user: req.user.toSafeObject() });
} catch (e) { next(e); } }
export async function changePassword(req, res, next) { try {
  const { currentPassword, newPassword } = req.body; if (!newPassword || newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters' });
  const user = await User.findById(req.user._id).select('+password'); if (!(await user.comparePassword(currentPassword || ''))) return res.status(400).json({ message: 'Current password is incorrect' });
  user.password = newPassword; await user.save(); res.json({ message: 'Password updated successfully' });
} catch (e) { next(e); } }
