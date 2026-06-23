import Task from '../models/Task.js';
import TaskCompletion from '../models/TaskCompletion.js';
import { buildDashboard, getDayDetails } from '../services/progressService.js';
import { keyToDate, localDateKey } from '../utils/dates.js';

const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '');

export async function createTask(req, res, next) { try {
  const { name, description = '', startDate, targetEndDate, dailyTarget, priority = 'medium' } = req.body;
  if (!name?.trim() || !validDate(startDate)) return res.status(400).json({ message: 'Task name and a valid start date are required' });
  if (targetEndDate && (!validDate(targetEndDate) || targetEndDate < startDate)) return res.status(400).json({ message: 'End date must be on or after the start date' });
  await Task.create({ user: req.user._id, name: name.trim(), description: description.trim(), startDate: keyToDate(startDate), targetEndDate: targetEndDate ? keyToDate(targetEndDate) : null, dailyTarget: dailyTarget === '' || dailyTarget == null ? null : Number(dailyTarget), priority });
  res.status(201).json(await buildDashboard(req.user));
} catch (error) { next(error); } }

export async function updateTask(req, res, next) { try {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id, archivedAt: null });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const allowed = ['name', 'description', 'priority', 'dailyTarget']; for (const key of allowed) if (req.body[key] !== undefined) task[key] = req.body[key] === '' && key === 'dailyTarget' ? null : req.body[key];
  await task.save(); res.json(await buildDashboard(req.user));
} catch (error) { next(error); } }

export async function archiveTask(req, res, next) { try {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id, archivedAt: null }, { archivedAt: new Date() });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(await buildDashboard(req.user));
} catch (error) { next(error); } }

export async function setCompletion(req, res, next) { try {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id }); if (!task) return res.status(404).json({ message: 'Task not found' });
  const dateKey = req.body.date || localDateKey(); if (!validDate(dateKey) || dateKey > localDateKey()) return res.status(400).json({ message: 'Invalid completion date' });
  const startKey = task.startDate.toISOString().slice(0, 10); const endKey = task.targetEndDate?.toISOString().slice(0, 10);
  if (dateKey < startKey || (endKey && dateKey > endKey)) return res.status(400).json({ message: 'This task is not active on the selected date' });
  if (req.body.completed === false) await TaskCompletion.deleteOne({ user: req.user._id, task: task._id, date: keyToDate(dateKey) });
  else await TaskCompletion.updateOne({ user: req.user._id, task: task._id, date: keyToDate(dateKey) }, { $set: { completed: true, completedAt: new Date(), questionsPracticed: Number(req.body.questionsPracticed ?? task.dailyTarget ?? 0) } }, { upsert: true });
  res.json(await buildDashboard(req.user));
} catch (error) { next(error); } }

export async function dayDetails(req, res, next) { try {
  if (!validDate(req.params.date)) return res.status(400).json({ message: 'Invalid date' });
  res.json(await getDayDetails(req.user._id, req.params.date));
} catch (error) { next(error); } }
