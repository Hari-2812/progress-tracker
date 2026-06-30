import React from 'react';
import { motion } from 'framer-motion';
import { Award, Check } from 'lucide-react';

const badgeIcons = {
  first_task: '🏅',
  streak_7: '🔥',
  streak_30: '⭐',
  streak_60: '🚀',
  champion_90: '👑',
  tasks_100: '🎯',
  questions_500: '📚'
};

const badgeNames = {
  first_task: 'First Task',
  streak_7: '7-Day Consistency',
  streak_30: '30-Day Warrior',
  streak_60: '60-Day Champion',
  champion_90: '90-Day Master',
  tasks_100: '100 Tasks',
  questions_500: '500 Questions'
};

const BadgeCard = React.memo(({ b }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl border p-4 text-center transition-all duration-300 ${
        b.earned
          ? 'border-amber-200 bg-gradient-to-b from-amber-50 to-white dark:from-amber-500/10 dark:to-transparent dark:border-amber-500/20'
          : 'grayscale opacity-40 border-slate-100 dark:border-white/5'
      }`}
    >
      <div className="text-3xl">{badgeIcons[b.type]}</div>
      <p className="mt-3 text-[11px] font-extrabold">{badgeNames[b.type]}</p>
      <p className="mt-1 text-[9px] text-slate-400">{b.earned ? 'Unlocked' : `Goal: ${b.threshold}`}</p>
      {b.earned && (
        <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white shadow-sm">
          <Check size={12} />
        </span>
      )}
    </motion.div>
  );
});

BadgeCard.displayName = 'BadgeCard';

function AchievementsSection({ achievements }) {
  if (!achievements) return null;

  return (
    <section className="card p-6 md:p-7">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-lg font-extrabold">Achievement path</p>
          <p className="mt-1 text-xs text-slate-400">Milestones earned through real study work</p>
        </div>
        <Award className="text-amber-500" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {achievements.map((b) => (
          <BadgeCard key={b.type} b={b} />
        ))}
      </div>
    </section>
  );
}

export default React.memo(AchievementsSection);
