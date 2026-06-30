import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Calendar from 'react-calendar';
import { format, isAfter } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function CalendarSection({ dailyStatuses, totalTasksCompleted, todayTotal, selected, setSelected }) {
  const [dayDetails, setDayDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedKey = useMemo(() => {
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, [selected]);

  // Load details for selected day
  useEffect(() => {
    setLoading(true);
    api.get(`/tasks/day/${selectedKey}`)
      .then((r) => {
        setDayDetails(r.data);
      })
      .catch(() => {
        toast.error('Could not load details for the selected day');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedKey, totalTasksCompleted, todayTotal]);

  // Convert dailyStatuses into a fast-lookup map
  const statusMap = useMemo(() => {
    const map = new Map();
    if (dailyStatuses) {
      for (let i = 0; i < dailyStatuses.length; i++) {
        const item = dailyStatuses[i];
        map.set(item.date, item.status);
      }
    }
    return map;
  }, [dailyStatuses]);

  // Fast formatter avoiding date-fns formatting inside loops
  const getTileKey = useCallback((date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const tileClass = useCallback(({ date, view }) => {
    if (view !== 'month') return '';
    const key = getTileKey(date);
    const status = statusMap.get(key);
    return status && status !== 'none' ? `calendar-status calendar-${status}` : '';
  }, [statusMap, getTileKey]);

  const formattedSelectedDate = useMemo(() => {
    return format(selected, 'EEEE, MMMM d, yyyy');
  }, [selected]);

  const maxCalendarDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }, []);

  return (
    <div className="card p-6 md:p-7">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-lg font-extrabold">Study calendar</p>
          <p className="mt-1 text-xs text-slate-400">Select a date to inspect every task.</p>
        </div>
        <div className="flex gap-2 text-[9px] font-bold">
          <span className="text-emerald-500">● ALL</span>
          <span className="text-amber-500">● SOME</span>
          <span className="text-red-400">● NONE</span>
        </div>
      </div>

      <Calendar
        value={selected}
        onChange={setSelected}
        tileClassName={tileClass}
        maxDate={maxCalendarDate}
      />

      <div className="mt-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold">{formattedSelectedDate}</p>
            <p className="text-[10px] text-slate-400">
              {loading 
                ? 'Loading tasks…' 
                : dayDetails 
                  ? `${dayDetails.completed}/${dayDetails.total} completed · ${dayDetails.percentage}%` 
                  : 'No tasks scheduled'}
            </p>
          </div>
          {dayDetails && !loading && (
            <span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase status-${dayDetails.status}`}>
              {dayDetails.status === 'none' 
                ? (isAfter(selected, new Date()) ? 'Future' : 'No tasks') 
                : dayDetails.status}
            </span>
          )}
        </div>

        {dayDetails?.tasks?.length > 0 && !loading && (
          <div className="mt-3 space-y-2 border-t border-slate-100 dark:border-white/5 pt-3">
            {dayDetails.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 text-xs">
                {task.completed ? (
                  <CheckCircle2 size={15} className="text-emerald-500" />
                ) : (
                  <Circle size={15} className="text-slate-300 dark:text-slate-700" />
                )}
                <span className={task.completed ? 'text-slate-400 line-through' : ''}>
                  {task.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(CalendarSection);
