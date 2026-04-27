import React from 'react';
import { AlertCircle, ArrowRight, X } from 'lucide-react';

export default function AlertSection({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <div 
          key={index}
          className={`relative overflow-hidden group p-5 rounded-[1.5rem] border flex items-center justify-between gap-4 transition-all duration-300 ${
            alert.type === 'error' 
              ? 'bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' 
              : 'bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20'
          }`}
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-current opacity-[0.03] rounded-full group-hover:scale-110 transition-transform duration-500" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              alert.type === 'error' 
                ? 'bg-white text-rose-500 dark:bg-slate-900' 
                : 'bg-white text-amber-500 dark:bg-slate-900'
            }`}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className={`text-sm font-black uppercase tracking-tight ${
                alert.type === 'error' ? 'text-rose-800 dark:text-rose-400' : 'text-amber-800 dark:text-amber-400'
              }`}>
                {alert.title}
              </h4>
              <p className={`text-xs font-bold mt-1 ${
                alert.type === 'error' ? 'text-rose-700/70 dark:text-rose-300/60' : 'text-amber-700/70 dark:text-amber-300/60'
              }`}>
                {alert.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            {alert.action && (
              <button 
                onClick={alert.onAction}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-sm ${
                  alert.type === 'error'
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                {alert.actionText}
                <ArrowRight size={14} />
              </button>
            )}
            <button 
              onClick={() => onDismiss?.(index)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
