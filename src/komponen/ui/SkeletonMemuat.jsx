import React from 'react';

/**
 * LoadingSkeleton: A generic animated placeholder with shimmer effect.
 * Uses pulse and shimmer animations to signal content loading.
 */
const LoadingSkeleton = ({ className = "" }) => {
  return (
    <div 
      className={`
        animate-pulse 
        bg-slate-200 
        dark:bg-slate-700 
        rounded-lg 
        relative 
        overflow-hidden
        before:absolute 
        before:inset-0 
        before:-translate-x-full 
        before:animate-[shimmer_2s_infinite] 
        before:bg-gradient-to-r 
        before:from-transparent 
        before:via-white/20 
        before:to-transparent
        ${className}
      `}
    />
  );
};

export default LoadingSkeleton;
