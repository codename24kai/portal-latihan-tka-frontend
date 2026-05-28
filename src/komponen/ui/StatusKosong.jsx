import React from 'react';
import { PackageOpen } from 'lucide-react';

/**
 * EmptyState: Friendly UI used when lists/tables have no data.
 * Adheres to the soft aesthetic with clear action signals.
 */
const EmptyState = ({ 
  icon: Icon = PackageOpen, 
  title = "Data Kosong", 
  description = "Belum ada informasi yang tersedia saat ini.", 
  actionButton = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in group">
      <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] flex items-center justify-center text-slate-200 dark:text-slate-600 mb-6 group-hover:scale-105 transition-all duration-500">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      
      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
        {title}
      </h3>
      <p className="max-w-xs text-sm font-bold text-slate-400 dark:text-slate-500 leading-relaxed italic mb-8">
        {description}
      </p>

      {actionButton && (
        <div className="animate-bounce-subtle">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
