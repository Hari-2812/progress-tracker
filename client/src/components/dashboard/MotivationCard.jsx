import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCw } from 'lucide-react';
import { getDailyQuote, getRandomQuote } from '../../lib/quotes';

const categories = ['All', 'Discipline', 'Confidence', 'Consistency', 'Success', 'Focus', 'Mindset'];

export default function MotivationCard() {
  const [category, setCategory] = useState('All');
  const [quote, setQuote] = useState(() => getDailyQuote('All'));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);

  // Sync quote when category changes (select daily quote for that category)
  useEffect(() => {
    setQuote(getDailyQuote(category));
    setAnimateKey((prev) => prev + 1);
  }, [category]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Use timeout to let the refresh animation spin gracefully
    setTimeout(() => {
      const nextQuote = getRandomQuote(category);
      setQuote(nextQuote);
      setAnimateKey((prev) => prev + 1);
      setIsRefreshing(false);
    }, 400);
  }, [category]);

  return (
    <div className="card flex flex-col justify-between bg-gradient-to-br from-[#5262e4] to-[#8b54df] p-7 text-white shadow-xl overflow-hidden relative min-h-[300px]">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
      
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-white/80 tracking-wider uppercase">
          <Sparkles size={16} className="animate-pulse" />
          <span>Daily Mindset</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white/10 hover:bg-white/15 text-[10px] font-bold py-1 px-2 rounded-lg border-0 outline-none text-white cursor-pointer transition-colors"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="text-slate-900 bg-white">
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="New Quote"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-white disabled:opacity-50"
          >
            <RotateCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative my-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={animateKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <blockquote className="text-xl font-bold leading-relaxed tracking-wide">
              “{quote.text}”
            </blockquote>
            {quote.author && (
              <cite className="mt-4 block text-xs not-italic font-semibold text-white/70 tracking-wide text-right">
                — {quote.author}
              </cite>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative border-t border-white/10 pt-4 flex justify-between items-center text-[10px] text-white/60 font-semibold tracking-wider uppercase">
        <span>Category: {quote.category}</span>
        <span>Focus90 Sprint</span>
      </div>
    </div>
  );
}
