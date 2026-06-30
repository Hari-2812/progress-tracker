import React, { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

// Import split modular components
import SkeletonLoader from '../components/dashboard/SkeletonLoader';
import StatCards from '../components/dashboard/StatCards';
import TodayTasks from '../components/dashboard/TodayTasks';
import CalendarSection from '../components/dashboard/CalendarSection';
import ChartsSection from '../components/dashboard/ChartsSection';
import AchievementsSection from '../components/dashboard/AchievementsSection';
import TaskModal from '../components/dashboard/TaskModal';
import ChecklistProgressWidget from '../components/dashboard/ChecklistProgressWidget';
import GoalMilestoneWidget from '../components/dashboard/GoalMilestoneWidget';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(() => new Date());
  const [modal, setModal] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // Core API call to load dashboard stats and data
  const load = useCallback(() => {
    api.get('/progress/dashboard')
      .then((r) => setData(r.data))
      .catch(() => toast.error('Could not load your progress data'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback(async (task) => {
    setBusyId(task.id);
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const { data: next } = await api.patch(`/tasks/${task.id}/completion`, {
        date: todayKey,
        completed: !task.completed
      });
      setData(next);
      toast.success(
        task.completed 
          ? 'Task marked incomplete' 
          : next.today.status === 'completed'
            ? 'All tasks done — streak secured! 🎉'
            : 'Task complete! Keep it up.'
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update task status');
    } finally {
      setBusyId(null);
    }
  }, []);

  const archive = useCallback(async (task) => {
    if (!window.confirm(`Archive “${task.name}”? Its history will be preserved.`)) return;
    try {
      const { data: next } = await api.delete(`/tasks/${task.id}`);
      setData(next);
      toast.success('Task archived successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not archive task');
    }
  }, []);

  const handleCreated = useCallback((nextData) => {
    setData(nextData);
  }, []);

  const handleOpenModal = useCallback(() => {
    setModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModal(false);
  }, []);

  if (!data) {
    return <SkeletonLoader />;
  }

  const s = data.stats;
  const motivation = s.currentStreak > 60
    ? "You're on track to complete the challenge. Stay focused!"
    : s.currentStreak > 30
      ? "Excellent consistency! You're building a winning habit."
      : 'Keep going! Every day counts.';

  return (
    <div className="mx-auto max-w-[1500px] space-y-7 p-5 md:p-8 lg:p-10">
      <TaskModal open={modal} onClose={handleCloseModal} onCreated={handleCreated} />
      
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Your preparation is active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-2 text-sm text-slate-500">{motivation}</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="primary-btn flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={18} /> Create study task
        </button>
      </section>

      {/* Render modularized panels */}
      <StatCards stats={s} />

      {/* Checklist Progress and Goal Milestone Panels */}
      <ChecklistProgressWidget />
      
      <GoalMilestoneWidget todayData={data.today} achievements={data.achievements} stats={s} />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <TodayTasks
          day={data.today}
          onToggle={toggle}
          onArchive={archive}
          onAdd={handleOpenModal}
          busyId={busyId}
        />
        <CalendarSection
          dailyStatuses={data.dailyStatuses}
          totalTasksCompleted={s.totalTasksCompleted}
          todayTotal={data.today.total}
          selected={selected}
          setSelected={setSelected}
        />
      </section>

      {/* Additional Stats Panel */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          [s.totalTasksCreated, 'Tasks created'],
          [s.totalTasksCompleted, 'Tasks completed'],
          [`${s.averageDailyCompletionRate}%`, 'Avg. daily completion'],
          [s.totalQuestions, 'Questions practiced']
        ].map(([value, label]) => (
          <div key={label} className="card p-5 hover:shadow-md transition-shadow duration-300">
            <p className="text-2xl font-extrabold">{value}</p>
            <p className="mt-1 text-[11px] text-slate-400 font-semibold">{label}</p>
          </div>
        ))}
      </section>

      <ChartsSection analytics={data.analytics} />

      <AchievementsSection achievements={data.achievements} />
    </div>
  );
}
