import React from 'react';
import MathRenderer from '@/components/ui/MathRenderer';
import { Check } from 'lucide-react';

export default function MultiChoiceRenderer({ payload, selected = [], onSelect }) {
  const options = payload.options || [];

  const handleToggle = (key) => {
    const newSelected = selected.includes(key)
      ? selected.filter(k => k !== key)
      : [...selected, key];
    onSelect(newSelected);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => handleToggle(option.key)}
          className={`flex items-start gap-4 p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${
            selected.includes(option.key)
              ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/10 dark:bg-emerald-900/20'
              : 'bg-white border-slate-100 hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm transition-all ${
            selected.includes(option.key) ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
          }`}>
            {selected.includes(option.key) ? <Check size={20} strokeWidth={3} /> : option.key}
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
        </button>
      ))}
    </div>
  );
}
