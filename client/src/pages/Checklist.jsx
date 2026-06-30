import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Plus, Edit3, Trash2, Check, Loader2, Sparkles, AlertCircle, X, CheckSquare, Square } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Checklist() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // 'All' | 'Completed' | 'Pending'
  const [collapsed, setCollapsed] = useState({}); // Subject collapses
  
  // Custom Topic Form
  const [newTopic, setNewTopic] = useState({ name: '', subject: 'Quantitative Aptitude' });
  const [customSubject, setCustomSubject] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [busyAdd, setBusyAdd] = useState(false);

  // Edit Modal State
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [busyEdit, setBusyEdit] = useState(false);

  const fetchChecklist = useCallback(() => {
    setLoading(true);
    api.get('/checklist')
      .then(r => {
        setData(r.data);
        // Initially expand all subjects
        const initialCollapse = {};
        r.data.subjects.forEach(s => {
          initialCollapse[s.subject] = false;
        });
        setCollapsed(prev => ({ ...initialCollapse, ...prev }));
      })
      .catch(() => toast.error('Could not load study checklist'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  // Toggle Collapse
  const toggleCollapse = useCallback((subj) => {
    setCollapsed(prev => ({ ...prev, [subj]: !prev[subj] }));
  }, []);

  // Toggle Topic Status
  const handleToggle = useCallback(async (id, currentVal) => {
    try {
      const { data: next } = await api.patch(`/checklist/${id}`, { completed: !currentVal });
      setData(next);
      toast.success(!currentVal ? 'Topic completed! Keep going 🚀' : 'Topic marked incomplete');
    } catch {
      toast.error('Could not update checklist item');
    }
  }, []);

  // Add Custom Topic
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTopic.name.trim()) return;
    
    const subject = customSubject ? customSubjectName.trim() : newTopic.subject;
    if (!subject) return toast.error('Please specify a subject');

    setBusyAdd(true);
    try {
      const { data: next } = await api.post('/checklist', { name: newTopic.name, subject });
      setData(next);
      setNewTopic(prev => ({ ...prev, name: '' }));
      if (customSubject) {
        setCustomSubjectName('');
        setCustomSubject(false);
      }
      toast.success('Custom topic added');
    } catch {
      toast.error('Could not add topic');
    } finally {
      setBusyAdd(false);
    }
  };

  // Edit Topic Name
  const openEdit = (topic) => {
    setEditingTopic(topic);
    setEditingName(topic.name);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingName.trim()) return;
    setBusyEdit(true);
    try {
      const { data: next } = await api.patch(`/checklist/${editingTopic.id}`, { name: editingName });
      setData(next);
      setEditingTopic(null);
      toast.success('Topic renamed');
    } catch {
      toast.error('Could not update topic name');
    } finally {
      setBusyEdit(false);
    }
  };

  // Delete Topic
  const handleDelete = useCallback(async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const { data: next } = await api.delete(`/checklist/${id}`);
      setData(next);
      toast.success('Topic deleted');
    } catch {
      toast.error('Could not delete topic');
    }
  }, []);

  // Process subjects and topics with search & filters
  const filteredSubjects = useMemo(() => {
    if (!data) return [];
    
    return data.subjects.map(subj => {
      const filteredTopics = subj.topics.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = 
          filter === 'All' ? true :
          filter === 'Completed' ? t.completed : !t.completed;
        return matchesSearch && matchesFilter;
      });

      return {
        ...subj,
        topics: filteredTopics
      };
    }).filter(subj => subj.topics.length > 0 || search === ''); // Keep empty subjects only when not searching
  }, [data, search, filter]);

  // Extract all subjects list for dropdown selection
  const subjectList = useMemo(() => {
    if (!data) return [];
    return data.subjects.map(s => s.subject);
  }, [data]);

  if (loading && !data) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <Loader2 className="animate-spin text-primary-500" size={36} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-7 p-5 md:p-8 lg:p-10">
      
      {/* Header section */}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-bold text-violet-600 dark:bg-violet-500/10">
            <Sparkles size={13} /> Syllabus Checklist Tracker
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Syllabus Completion</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This module operates independently. Toggle topics to see your preparation progress.
          </p>
        </div>
      </section>

      {/* Progress Cards */}
      {data && (
        <section className="grid gap-6 md:grid-cols-[1fr_2.5fr] items-stretch">
          <div className="card p-6 flex flex-col justify-center text-center">
            <h3 className="text-sm font-bold text-slate-400">Overall Syllabus Progress</h3>
            <p className="mt-4 text-5xl font-black text-primary-600 dark:text-primary-400">{data.overallProgress}%</p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.overallProgress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500"
              />
            </div>
          </div>
          
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-400 mb-4">Subject-wise Completion</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.subjects.map(s => (
                <div key={s.subject} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="truncate max-w-[150px]">{s.subject}</span>
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
        </section>
      )}

      {/* Search, Filter and Add Custom Form */}
      <section className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr] items-start">
        
        {/* Topic lists accordion */}
        <div className="space-y-4">
          <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search study topics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="field pl-10 py-2.5 text-xs"
              />
            </div>
            
            {/* Filter buttons */}
            <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-white/5 rounded-xl w-full sm:w-auto justify-center">
              {['All', 'Completed', 'Pending'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    filter === f 
                      ? 'bg-white text-primary-600 shadow-sm dark:bg-white/10 dark:text-white' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredSubjects.length ? (
              filteredSubjects.map(subj => {
                const isCollapsed = collapsed[subj.subject];
                return (
                  <div key={subj.subject} className="card overflow-hidden">
                    {/* Subject Header */}
                    <div 
                      onClick={() => toggleCollapse(subj.subject)}
                      className="flex items-center justify-between p-5 bg-white/20 dark:bg-white/[.02] cursor-pointer hover:bg-white/30 dark:hover:bg-white/[.04] transition-colors select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-sm tracking-wide">{subj.subject}</span>
                        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-600 dark:bg-primary-500/10">
                          {subj.completed}/{subj.total}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400">
                        <span className="text-[10px] font-bold">{subj.percentage}% done</span>
                        {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                      </div>
                    </div>

                    {/* Topics List */}
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t dark:border-white/5 bg-white/40 dark:bg-transparent"
                        >
                          <div className="p-4 space-y-2">
                            {subj.topics.length ? (
                              subj.topics.map(t => (
                                <motion.div
                                  layout
                                  key={t.id}
                                  className={`flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-white/5 transition-all ${
                                    t.completed ? 'opacity-70' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <button
                                      onClick={() => handleToggle(t.id, t.completed)}
                                      className={`h-5 w-5 rounded shrink-0 flex items-center justify-center transition-all ${
                                        t.completed 
                                          ? 'bg-emerald-500 text-white' 
                                          : 'border-2 border-slate-300 dark:border-slate-700 text-transparent hover:border-emerald-400'
                                      }`}
                                    >
                                      {t.completed && <Check size={14} />}
                                    </button>
                                    <span className={`text-xs font-semibold truncate ${
                                      t.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                                    }`}>
                                      {t.name}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => openEdit(t)} 
                                      className="p-1 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                      aria-label="Edit Topic"
                                    >
                                      <Edit3 size={13} />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(t.id, t.name)}
                                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                      aria-label="Delete Topic"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <p className="text-center py-4 text-xs text-slate-400">No topics match current filters.</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="card p-10 text-center text-slate-400 space-y-2">
                <AlertCircle className="mx-auto text-slate-300" size={32} />
                <p className="font-bold text-sm">No topics found</p>
                <p className="text-xs">Adjust your search parameters or add a custom topic below.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add custom topic form */}
        <div className="card p-6 space-y-5 sticky top-24">
          <div>
            <h3 className="font-extrabold text-base">Add Study Topic</h3>
            <p className="text-[11px] text-slate-400 mt-1">Append custom areas to your preparation syllabus.</p>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <label className="block text-xs font-bold">
              Topic Name
              <input
                required
                type="text"
                placeholder="e.g. Percentage Problems"
                value={newTopic.name}
                onChange={e => setNewTopic({ ...newTopic, name: e.target.value })}
                className="field mt-2 py-3.5 text-xs"
              />
            </label>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Subject Group</span>
                <button
                  type="button"
                  onClick={() => setCustomSubject(!customSubject)}
                  className="text-primary-500 hover:underline text-[10px]"
                >
                  {customSubject ? 'Choose Existing' : 'Create New Subject'}
                </button>
              </div>

              {customSubject ? (
                <input
                  required
                  type="text"
                  placeholder="e.g. Current Affairs"
                  value={customSubjectName}
                  onChange={e => setCustomSubjectName(e.target.value)}
                  className="field py-3.5 text-xs"
                />
              ) : (
                <select
                  value={newTopic.subject}
                  onChange={e => setNewTopic({ ...newTopic, subject: e.target.value })}
                  className="field py-3.5 text-xs"
                >
                  {subjectList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  {subjectList.length === 0 && <option value="Quantitative Aptitude">Quantitative Aptitude</option>}
                </select>
              )}
            </div>

            <button
              type="submit"
              disabled={busyAdd}
              className="primary-btn w-full flex items-center justify-center gap-2 py-3 text-xs"
            >
              {busyAdd ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Add Topic
            </button>
          </form>
        </div>
      </section>

      {/* Edit Modal Dialog */}
      <AnimatePresence>
        {editingTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-xs"
          >
            <motion.form
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              onSubmit={handleEdit}
              className="card bg-white p-6 w-full max-w-md dark:bg-[#171b30] space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm">Rename Study Topic</h3>
                <button type="button" onClick={() => setEditingTopic(null)}>
                  <X size={16} />
                </button>
              </div>

              <input
                required
                type="text"
                value={editingName}
                onChange={e => setEditingName(e.target.value)}
                className="field text-xs py-3"
              />

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTopic(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyEdit}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-primary-500 text-white flex items-center gap-1.5"
                >
                  {busyEdit && <Loader2 size={13} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
