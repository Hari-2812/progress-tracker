import React, { useMemo } from 'react';
import { Target, Flag, CalendarRange, Clock } from 'lucide-react';
import { format } from 'date-fns';

const badgeNames = {
  first_task: 'First Task',
  streak_7: '7-Day Consistency',
  streak_30: '30-Day Warrior',
  streak_60: '60-Day Champion',
  champion_90: '90-Day Master',
  tasks_100: '100 Tasks',
  questions_500: '500 Questions'
};

export default function GoalMilestoneWidget({ todayData, achievements, stats }) {
  
  // Compute pending tasks for today
  const pendingTasks = useMemo(() => {
    if (!todayData?.tasks) return [];
    return todayData.tasks.filter(t => !t.completed);
  }, [todayData]);

  // Compute next milestone to unlock
  const nextMilestone = useMemo(() => {
    if (!achievements) return null;
    const pending = achievements.filter(a => !a.earned);
    // Sort milestones or pick the first pending one as next target
    return pending.length > 0 ? pending[0] : null;
  }, [achievements]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Today's Goal & Pending Tasks */}
      <div className="card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold tracking-wide text-slate-400 uppercase">Today's Goal</h3>
            <Target className="text-primary-500" size={18} />
          </div>
          
          <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-4 mb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300">Daily Target Questions</span>
              <span className="font-black text-slate-900 dark:text-white text-sm">
                {stats.totalQuestions} Practiced
              </span>
            </div>
          </div>

          <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">Pending Streak Tasks</h4>
          {pendingTasks.length > 0 ? (
            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
              {pendingTasks.map(t => (
                <div key={t.id} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{t.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {todayData?.total > 0 ? 'All tasks complete! Daily streak secured. 🎉' : 'No tasks assigned for today.'}
            </p>
          )}
        </div>
      </div>

      {/* Next Milestone & Activity Timeline */}
      <div className="card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold tracking-wide text-slate-400 uppercase">Next Milestone</h3>
            <Flag className="text-amber-500" size={18} />
          </div>

          {nextMilestone ? (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed dark:border-white/10 mb-4 bg-amber-50/20 dark:bg-amber-500/5">
              <div className="text-2xl">🎯</div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{badgeNames[nextMilestone.type]}</p>
                <p className="text-[10px] text-slate-400">Streak / Metric Target: {nextMilestone.threshold}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs font-bold text-slate-500 mb-4">All milestones unlocked! 👑</p>
          )}

          <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">Recent Timeline</h4>
          <div className="space-y-2">
            <div className="flex gap-2.5 items-start text-[11px]">
              <Clock size={12} className="text-slate-400 mt-0.5" />
              <div className="min-w-0">
                <p className="font-bold text-slate-600 dark:text-slate-300">Target goal: 90 Days Sprint</p>
                <p className="text-slate-400">Goal Start: {format(new Date(stats.lastCompletedDate || Date.now()), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
