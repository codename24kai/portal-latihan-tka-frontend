import React from 'react';

/**
 * ProgressBar: A horizontal indicator for completion and scores.
 * Replaces abstract donut charts with clear, linear progress visualization.
 */
const ProgressBar = ({ 
  progress = 0, 
  label = "", 
  color = "bg-teal-500", 
  height = "h-2.5",
  className = "" 
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {label && (
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
            {label}
          </span>
        )}
        <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tighter">
          {clampedProgress}%
        </span>
      </div>
      
      <div className={`w-full bg-slate-100 dark:bg-slate-700 rounded-full ${height} overflow-hidden`}>
        <div 
          className={`h-full ${color} transition-all duration-700 ease-out relative`}
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Subtle gleam effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
