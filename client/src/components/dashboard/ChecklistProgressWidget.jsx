import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, ListChecks } from 'lucide-react';
import api from '../../lib/api';

export default function ChecklistProgressWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/checklist')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card p-6 animate-pulse space-y-4">
        <div className="h-5 w-32 rounded bg-slate-200 dark:bg-white/10" />
        <div className="h-10 w-full rounded bg-slate-200 dark:bg-white/10" />
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="h-3 w-full rounded bg-slate-100 dark:bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_1.8fr] items-stretch">
      {/* Overall Progress */}
      <div className="card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold tracking-wide text-slate-400 uppercase">Syllabus Completion</h3>
            <ListChecks className="text-violet-500" size={18} />
          </div>
          <div className="mt-6 text-center">
            <span className="text-5xl font-black text-violet-600 dark:text-violet-400">{data.overallProgress}%</span>
            <p className="text-[10px] font-semibold text-slate-400 mt-2">Overall Syllabus Completed</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.overallProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Per-Subject Progress */}
      <div className="card p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-extrabold tracking-wide text-slate-400 uppercase mb-4">Subject Milestones</h3>
          <div className="space-y-4">
            {data.subjects.slice(0, 4).map(s => (
              <div key={s.subject} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="truncate max-w-[170px]">{s.subject}</span>
                  <span>{s.percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                  <div
                    style={{ width: `${s.percentage}%` }}
                    className="h-full rounded-full bg-primary-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Completed Syllabus Topics */}
        {data.recentlyCompleted && data.recentlyCompleted.length > 0 && (
          <div className="border-t border-slate-100 dark:border-white/5 pt-4 mt-4">
            <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">Recently Completed Topics</h4>
            <div className="space-y-1.5">
              {data.recentlyCompleted.slice(0, 2).map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-500 shrink-0" size={12} />
                    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{item.name}</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400">{item.subject}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
