import React from 'react';
import MathRenderer from '@/components/ui/MathRenderer';

export default function SingleChoiceRenderer({ payload, selected, onSelect }) {
  const options = payload.options || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onSelect(option.key)}
          className={`flex items-start gap-4 p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${
            selected === option.key
              ? 'bg-indigo-50 border-indigo-500 shadow-lg shadow-indigo-500/10 dark:bg-indigo-900/20'
              : 'bg-white border-slate-100 hover:border-indigo-200 dark:bg-slate-800 dark:border-slate-700'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm transition-all ${
            selected === option.key ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
          }`}>
            {option.key}
          </div>
          <div className="flex-1 space-y-3">
             <div className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
               <MathRenderer text={option.text} />
             </div>
             {option.image && (
               <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-white">
                 <img src={option.image} alt="Option" className="w-full h-auto object-contain p-1" />
               </div>
             )}
          </div>
          {selected === option.key && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
