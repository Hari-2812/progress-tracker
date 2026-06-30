import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-7 p-5 md:p-8 lg:p-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="space-y-3">
          <div className="h-5 w-44 rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="h-9 w-72 rounded-xl bg-slate-200 dark:bg-white/10" />
          <div className="h-4 w-80 rounded-lg bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="h-12 w-44 rounded-2xl bg-slate-200 dark:bg-white/10" />
      </div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5 flex justify-between items-center h-24">
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-6 w-16 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-white/10" />
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <div className="card p-6 md:p-7 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-5 w-32 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-3 w-48 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-slate-200/50 dark:bg-white/5" />
            ))}
          </div>
        </div>
        <div className="card p-6 md:p-7 space-y-4">
          <div className="h-5 w-36 rounded bg-slate-200 dark:bg-white/10" />
          <div className="h-64 rounded-2xl bg-slate-200/50 dark:bg-white/5" />
        </div>
      </div>
    </div>
  );
}
