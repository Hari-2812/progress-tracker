import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, Check, Trash2, BookOpenCheck } from 'lucide-react';

const priorityStyle = {
  low: 'bg-slate-100 text-slate-500 dark:bg-white/10',
  medium: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10',
  high: 'bg-rose-100 text-rose-600 dark:bg-rose-500/10'
};

const TaskItem = React.memo(({ task, onToggle, onArchive, busyId }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`group flex items-center gap-3 rounded-2xl border p-4 transition-all duration-300 ${
        task.completed 
          ? 'border-emerald-200 bg-emerald-50/60 dark:bg-emerald-500/5 dark:border-emerald-500/10' 
          : 'border-slate-100 hover:border-primary-200 dark:border-white/5 dark:hover:border-primary-500/30'
      }`}
    >
      <button
        disabled={busyId === task.id}
        onClick={() => onToggle(task)}
        aria-label={`Mark ${task.name} ${task.completed ? 'incomplete' : 'complete'}`}
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-all duration-200 ${
          task.completed 
            ? 'bg-emerald-500 text-white' 
            : 'border-2 border-slate-300 text-transparent hover:border-primary-400 dark:border-slate-700'
        }`}
      >
        {busyId === task.id ? (
          <Loader2 size={15} className="animate-spin text-primary-500" />
        ) : (
          <Check size={16} className={task.completed ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`truncate text-sm font-bold transition-all duration-200 ${task.completed ? 'text-slate-400 line-through dark:text-slate-500' : ''}`}>
            {task.name}
          </p>
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${priorityStyle[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        {(task.description || task.dailyTarget) && (
          <p className="mt-1 truncate text-[11px] text-slate-400 dark:text-slate-500">
            {task.description || `${task.dailyTarget} questions daily`}
          </p>
        )}
      </div>

      <button
        onClick={() => onArchive(task)}
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 group-hover:opacity-100"
        aria-label={`Archive ${task.name}`}
      >
        <Trash2 size={15} />
      </button>
    </motion.div>
  );
});

TaskItem.displayName = 'TaskItem';

function TodayTasks({ day, onToggle, onArchive, onAdd, busyId }) {
  return (
    <section className="card p-6 md:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">Today’s tasks</h2>
          <p className="mt-1 text-xs text-slate-400">Complete every task to keep your streak alive.</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-2.5 text-xs font-bold text-primary-600 transition hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20"
        >
          <Plus size={16} /> Add task
        </button>
      </div>

      {day.tasks && day.tasks.length ? (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {day.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onArchive={onArchive}
                busyId={busyId}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center">
          <div>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-500 dark:bg-primary-500/10">
              <BookOpenCheck />
            </div>
            <p className="mt-4 text-sm font-bold">Your study plan is waiting</p>
            <p className="mt-1 text-xs text-slate-400">Add your first recurring task to begin.</p>
            <button onClick={onAdd} className="mt-4 text-xs font-bold text-primary-600 hover:underline">
              Create first task →
            </button>
          </div>
        </div>
      )}

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-bold">
          <span>Today’s progress</span>
          <span>
            {day.completed}/{day.total} tasks
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${day.percentage}%` }}
            transition={{ duration: 0.4 }}
            className={`h-full rounded-full ${day.percentage === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary-500 to-violet-500'}`}
          />
        </div>
      </div>
    </section>
  );
}

export default React.memo(TodayTasks);
