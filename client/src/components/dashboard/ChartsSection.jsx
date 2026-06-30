import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import MotivationCard from './MotivationCard';

const TrendChart = React.memo(({ data }) => (
  <div className="card p-6">
    <div className="mb-5">
      <p className="text-lg font-extrabold">Task completion trend</p>
      <p className="text-xs text-slate-400">Completed versus scheduled tasks over 14 days</p>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid vertical={false} stroke="#94a3b822" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={24} tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ borderRadius: 14, border: 0 }} />
          <Legend />
          <Area type="monotone" dataKey="total" name="Scheduled" stroke="#c4b5fd" fill="#c4b5fd22" />
          <Area type="monotone" dataKey="completed" name="Completed" stroke="#5667e9" strokeWidth={3} fill="#5667e933" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
));

TrendChart.displayName = 'TrendChart';

const WeeklyChart = React.memo(({ data }) => (
  <div className="card p-6">
    <p className="font-extrabold">Weekly consistency</p>
    <p className="text-xs text-slate-400">Daily task completion %</p>
    <div className="mt-4 h-44">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ borderRadius: 14, border: 0 }} />
          <Bar dataKey="percentage" fill="#5667e9" radius={[7, 7, 2, 2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
));

WeeklyChart.displayName = 'WeeklyChart';

const MonthlyChart = React.memo(({ data }) => (
  <div className="card p-6">
    <p className="font-extrabold">Monthly progress</p>
    <p className="text-xs text-slate-400">Average completion by week</p>
    <div className="mt-4 h-44">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ borderRadius: 14, border: 0 }} />
          <Bar dataKey="percentage" fill="#8b5cf6" radius={[7, 7, 2, 2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
));

MonthlyChart.displayName = 'MonthlyChart';

const GrowthChart = React.memo(({ data }) => (
  <div className="card p-6">
    <p className="font-extrabold">Streak growth</p>
    <p className="text-xs text-slate-400">Consecutive successful days</p>
    <div className="mt-4 h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="date" axisLine={false} tickLine={false} minTickGap={24} tick={{ fontSize: 9, fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ borderRadius: 14, border: 0 }} />
          <Area type="monotone" dataKey="streak" stroke="#f59e0b" strokeWidth={3} fill="#f59e0b22" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
));

GrowthChart.displayName = 'GrowthChart';

function ChartsSection({ analytics }) {
  if (!analytics) return null;

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.35fr_.65fr] items-stretch">
        <TrendChart data={analytics.trend} />
        <MotivationCard />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <WeeklyChart data={analytics.weekly} />
        <MonthlyChart data={analytics.monthly} />
        <GrowthChart data={analytics.growth} />
      </section>
    </>
  );
}

export default React.memo(ChartsSection);
