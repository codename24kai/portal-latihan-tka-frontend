import React from 'react';
import { motion } from 'framer-motion';

export default function SurveyOptionCard({ label, text, isSelected, onSelect }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 text-left transition-all group ${
        isSelected
          ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-500 shadow-lg shadow-teal-500/10'
          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-900/50'
      }`}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
        isSelected
          ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
          : 'bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 group-hover:text-teal-600'
      }`}>
        {label}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold transition-colors ${
          isSelected ? 'text-teal-900 dark:text-teal-100' : 'text-slate-600 dark:text-slate-400'
        }`}>
          {text}
        </p>
      </div>
      
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
        isSelected ? 'bg-teal-500 border-teal-500' : 'border-slate-200 dark:border-slate-700'
      }`}>
        {isSelected && (
          <div className="w-2 h-2 bg-white rounded-full" />
        )}
      </div>
    </motion.button>
  );
}
