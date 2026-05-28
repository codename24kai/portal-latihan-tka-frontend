import React from 'react';

/**
 * Badge: A styled chip for status and labels.
 * Uses a soft color system for Success, Warning, Danger, Info, and Neutral.
 */
const Badge = ({ 
  text, 
  variant = "Neutral", 
  className = "" 
}) => {
  const variants = {
    Success: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 border-teal-100 dark:border-teal-500/20",
    Warning: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
    Danger: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20",
    Info: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20",
    Blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    Green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
    Neutral: "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-100 dark:border-slate-700"
  };

  const style = variants[variant] || variants.Neutral;

  return (
    <span className={`
      inline-flex items-center 
      px-3 py-1 
      rounded-full 
      text-[9px] font-black uppercase tracking-widest 
      border
      transition-colors
      ${style}
      ${className}
    `}>
      {text}
    </span>
  );
};

export default Badge;
