import Achievement from '../models/Achievement.js';
import Task from '../models/Task.js';
import TaskCompletion from '../models/TaskCompletion.js';
import { addDays, dateToKey, daysBetween, localDateKey } from '../utils/dates.js';

const milestones = [
  { type: 'first_task', threshold: 1, metric: 'tasks' },
  { type: 'streak_7', threshold: 7, metric: 'streak' },
  { type: 'streak_30', threshold: 30, metric: 'streak' },
  { type: 'streak_60', threshold: 60, metric: 'streak' },
  { type: 'champion_90', threshold: 90, metric: 'successfulDays' },
  { type: 'tasks_100', threshold: 100, metric: 'tasks' },
  { type: 'questions_500', threshold: 500, metric: 'questions' },
];

const activeOn = (task, key) => {
  const start = dateToKey(task.startDate);
  const end = task.targetEndDate ? dateToKey(task.targetEndDate) : null;
  const archived = task.archivedAt ? localDateKey(task.archivedAt) : null;
  return start <= key && (!end || end >= key) && (!archived || archived > key);
};

export function calculateStreak(keys) {
  const set = new Set(keys); const today = localDateKey(); let cursor = set.has(today) ? today : addDays(today, -1); let streak = 0;
  while (set.has(cursor)) { streak += 1; cursor = addDays(cursor, -1); }
  return streak;
}

export function calculateLongestStreak(keys) {
  const sorted = [...new Set(keys)].sort(); let longest = 0; let current = 0; let previous = null;
  for (const key of sorted) { current = previous && daysBetween(previous, key) === 1 ? current + 1 : 1; longest = Math.max(longest, current); previous = key; }
  return longest;
}

function createDay(key, tasks, completionMap, today) {
  const active = tasks.filter((task) => activeOn(task, key));
  const items = active.map((task) => {
    const completion = completionMap.get(`${task._id}:${key}`);
    return { id: task._id, name: task.name, description: task.description, priority: task.priority, dailyTarget: task.dailyTarget, completed: Boolean(completion?.completed), questionsPracticed: completion?.questionsPracticed || 0 };
  });
  const completed = items.filter((item) => item.completed).length;
  let status = 'none';
  if (items.length && completed === items.length) status = 'completed';
  else if (completed > 0) status = 'partial';
  else if (items.length && key < today) status = 'missed';
  return { date: key, status, total: items.length, completed, percentage: items.length ? Math.round((completed / items.length) * 100) : 0, tasks: items };
}

export async function buildDashboard(user) {
  const [tasks, completions] = await Promise.all([
    Task.find({ user: user._id }).sort({ createdAt: 1 }).lean(),
    TaskCompletion.find({ user: user._id, completed: true }).sort({ date: 1 }).lean(),
  ]);
  const today = localDateKey();
  const completionMap = new Map(completions.map((row) => [`${row.task}:${dateToKey(row.date)}`, row]));
  const earliestTask = tasks.length ? tasks.map((task) => dateToKey(task.startDate)).sort()[0] : today;
  const rangeStart = earliestTask > addDays(today, -89) ? earliestTask : addDays(today, -89);
  const days = []; for (let key = rangeStart; key <= today; key = addDays(key, 1)) days.push(createDay(key, tasks, completionMap, today));
  const successfulKeys = days.filter((day) => day.status === 'completed').map((day) => day.date);
  const currentStreak = calculateStreak(successfulKeys); const longestStreak = calculateLongestStreak(successfulKeys);
  const scheduledDays = days.filter((day) => day.total > 0); const successfulDays = successfulKeys.length;
  const totalCompleted = completions.length; const totalQuestions = completions.reduce((sum, row) => sum + (row.questionsPracticed || 0), 0);
  const assignedCount = scheduledDays.reduce((sum, day) => sum + day.total, 0);
  const metrics = { streak: currentStreak, successfulDays, tasks: totalCompleted, questions: totalQuestions };
  await Promise.all(milestones.filter((item) => metrics[item.metric] >= item.threshold).map((item) => Achievement.updateOne({ user: user._id, type: item.type }, { $setOnInsert: { unlockedAt: new Date() } }, { upsert: true })));
  const earned = await Achievement.find({ user: user._id }).lean(); const earnedMap = new Map(earned.map((item) => [item.type, item]));
  const weekly = Array.from({ length: 7 }, (_, i) => { const key = addDays(today, i - 6); const day = createDay(key, tasks, completionMap, today); return { day: new Intl.DateTimeFormat('en', { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${key}T00:00:00Z`)), date: key, percentage: day.percentage }; });
  const monthly = Array.from({ length: 4 }, (_, i) => { const end = addDays(today, -(3 - i) * 7); const start = addDays(end, -6); const chunk = days.filter((day) => day.date >= start && day.date <= end && day.total); return { week: `W${i + 1}`, percentage: chunk.length ? Math.round(chunk.reduce((sum, day) => sum + day.percentage, 0) / chunk.length) : 0 }; });
  let running = 0; const growth = days.slice(-30).map((day) => { running = day.status === 'completed' ? running + 1 : 0; return { date: day.date.slice(5), streak: running }; });
  const trend = days.slice(-14).map((day) => ({ date: day.date.slice(5), completed: day.completed, total: day.total }));
  const todayData = createDay(today, tasks, completionMap, today);
  return {
    stats: {
      currentStreak, longestStreak, successfulDays, completedDays: successfulDays, remainingDays: Math.max(0, user.goalDays - successfulDays),
      progressPercentage: Number(((successfulDays / user.goalDays) * 100).toFixed(1)), consistencyPercentage: scheduledDays.length ? Math.round((successfulDays / scheduledDays.length) * 100) : 0,
      lastCompletedDate: successfulKeys.at(-1) || null, totalTasksCreated: tasks.length, totalTasksCompleted: totalCompleted,
      averageDailyCompletionRate: assignedCount ? Math.round((totalCompleted / assignedCount) * 100) : 0, totalQuestions,
    },
    today: todayData,
    startDate: user.challengeStartDate,
    dailyStatuses: days.map(({ date, status, total, completed, percentage }) => ({ date, status, total, completed, percentage })),
    analytics: { weekly, monthly, growth, trend },
    achievements: milestones.map((item) => ({ type: item.type, threshold: item.threshold, earned: earnedMap.has(item.type), unlockedAt: earnedMap.get(item.type)?.unlockedAt || null })),
  };
}

export async function getDayDetails(userId, key) {
  const [tasks, completions] = await Promise.all([Task.find({ user: userId }).lean(), TaskCompletion.find({ user: userId, date: new Date(`${key}T00:00:00.000Z`) }).lean()]);
  const map = new Map(completions.map((row) => [`${row.task}:${key}`, row]));
  return createDay(key, tasks, map, localDateKey());
}
