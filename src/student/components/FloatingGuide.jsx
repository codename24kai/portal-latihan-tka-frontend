import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, CheckCircle2, Star } from 'lucide-react';
import { getGuideByPath } from '../utils/guideContent';

/**
 * FloatingGuide Component
 * Context-aware Floating Action Button (FAB) that displays a modal guide.
 */
export default function FloatingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const content = getGuideByPath(location.pathname);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 1. FLOATING ACTION BUTTON (FAB) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleModal}
        className="fixed bottom-24 right-4 md:bottom-10 md:right-10 z-[60] w-14 h-14 md:w-16 md:h-16 scale-90 md:scale-100 rounded-3xl bg-gradient-to-br from-orange-400 to-yellow-500 shadow-xl shadow-orange-500/30 flex items-center justify-center text-white transition-all overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <HelpCircle size={32} />
      </motion.button>

      {/* 2. DYNAMIC GUIDE MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden p-8 md:p-10 border border-slate-100 dark:border-slate-800"
            >
              {/* Decorative Header Star */}
              <div className="absolute top-0 right-0 p-8 text-orange-50 dark:text-orange-950/20 pointer-events-none">
                <Star size={100} fill="currentColor" />
              </div>

              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-3xl">
                  {content.emoji}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                    {content.title}
                  </h2>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {content.description}
                  </p>
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-4 mb-10">
                {content.steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="mt-1">
                      <CheckCircle2 size={18} className="text-teal-500" strokeWidth={3} />
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 font-bold leading-relaxed">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={toggleModal}
                className="w-full py-5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-3xl transition-all shadow-lg shadow-teal-600/20 active:scale-[0.98]"
              >
                Tutup Panduan
              </button>

              {/* Close Icon (Top Right) */}
              <button
                onClick={toggleModal}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
