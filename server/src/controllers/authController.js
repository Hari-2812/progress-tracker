import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(req, res, next) { try {
  const { name, email, password, confirmPassword } = req.body;
  if (!name?.trim() || !validEmail.test(email || '') || !password) return res.status(400).json({ message: 'Please provide valid account details' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
  if (confirmPassword !== undefined && password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
  if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account already exists with this email' });
  const user = await User.create({ name: name.trim(), email, password });
  res.status(201).json({ token: sign(user._id), user: user.toSafeObject() });
} catch (e) { next(e); } }
export async function login(req, res, next) { try {
  const { email, password } = req.body; const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password || ''))) return res.status(401).json({ message: 'Incorrect email or password' });
  res.json({ token: sign(user._id), user: user.toSafeObject() });
} catch (e) { next(e); } }
export const me = (req, res) => res.json({ user: req.user.toSafeObject() });
