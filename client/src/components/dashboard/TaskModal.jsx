import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function TaskModal({ open, onClose, onCreated }) {
  const initial = {
    name: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    targetEndDate: '',
    dailyTarget: '',
    priority: 'medium'
  };
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post('/tasks', form);
      onCreated(data);
      setForm(initial);
      onClose();
      toast.success('Task added to your study plan');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create task');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            onSubmit={submit}
            className="card max-h-[92vh] w-full max-w-xl overflow-y-auto bg-white p-6 dark:bg-[#171b30] md:p-7"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-extrabold">Create a study task</h2>
                <p className="mt-1 text-xs text-slate-400">This task repeats daily across its active date range.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-bold">
                Task name
                <input
                  autoFocus
                  required
                  maxLength={100}
                  className="field mt-2"
                  placeholder="e.g. Quantitative Aptitude Practice"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block text-xs font-bold">
                Description <span className="font-normal text-slate-400">(optional)</span>
                <textarea
                  rows="3"
                  maxLength={500}
                  className="field mt-2 resize-none"
                  placeholder="What will you focus on?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold">
                  Start date
                  <input
                    required
                    type="date"
                    className="field mt-2"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </label>
                <label className="text-xs font-bold">
                  Target end date <span className="font-normal text-slate-400">(optional)</span>
                  <input
                    type="date"
                    min={form.startDate}
                    className="field mt-2"
                    value={form.targetEndDate}
                    onChange={(e) => setForm({ ...form, targetEndDate: e.target.value })}
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold">
                  Daily target <span className="font-normal text-slate-400">(questions)</span>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    className="field mt-2"
                    placeholder="e.g. 50"
                    value={form.dailyTarget}
                    onChange={(e) => setForm({ ...form, dailyTarget: e.target.value })}
                  />
                </label>
                <label className="text-xs font-bold">
                  Priority
                  <select
                    className="field mt-2"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>
            </div>
            <button
              disabled={busy}
              className="primary-btn mt-6 flex w-full items-center justify-center gap-2"
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Add to study plan
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default React.memo(TaskModal);
