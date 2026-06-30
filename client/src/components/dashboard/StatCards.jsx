import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, CalendarDays, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const gradients = [
  'from-orange-400 to-rose-500',
  'from-emerald-400 to-teal-500',
  'from-sky-400 to-indigo-500',
  'from-violet-400 to-fuchsia-500'
];

const StatCard = React.memo(({ label, value, suffix, icon: Icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-5 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-extrabold tracking-tight">
            {value ?? '—'}
            <span className="ml-1 text-xs font-semibold text-slate-400">{suffix}</span>
          </p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${gradients[index]} text-white shadow-lg`}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

function StatCards({ stats }) {
  const lastCompletedStr = React.useMemo(() => {
    if (!stats.lastCompletedDate) return '—';
    try {
      return format(new Date(`${stats.lastCompletedDate}T00:00:00`), 'MMM d');
    } catch {
      return '—';
    }
  }, [stats.lastCompletedDate]);

  return (
    <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard label="Current streak" value={stats.currentStreak} suffix="days" icon={Flame} index={0} />
      <StatCard label="Longest streak" value={stats.longestStreak} suffix="days" icon={Trophy} index={1} />
      <StatCard label="Last completed" value={lastCompletedStr} suffix="" icon={CalendarDays} index={2} />
      <StatCard label="Consistency" value={stats.consistencyPercentage} suffix="%" icon={TrendingUp} index={3} />
    </section>
  );
}

export default React.memo(StatCards);
