import React from 'react';
import MathRenderer from '@/komponen/ui/RendererMatematika';
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
      {/* S7 Info Banner */}
      <div className="sm:col-span-2 p-4 bg-teal-50/80 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-900/50 rounded-2xl flex items-center gap-3 text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase tracking-widest animate-pulse shadow-sm">
        <span className="text-sm">💡</span>
        <span>Pilihan Ganda Kompleks: Kamu dapat memilih LEBIH DARI SATU jawaban yang menurutmu benar!</span>
      </div>

      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => handleToggle(option.key)}
          className={`flex items-start justify-between gap-4 p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${
            selected.includes(option.key)
              ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/10 dark:bg-emerald-900/20'
              : 'bg-white border-slate-100 hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm transition-all ${
              selected.includes(option.key) ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
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
          </div>

          {/* S7 Checkbox Indicator */}
          <div className="shrink-0 pt-2">
            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
              selected.includes(option.key)
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                : 'border-slate-300 dark:border-slate-650 bg-slate-50 dark:bg-slate-900'
            }`}>
              {selected.includes(option.key) && <Check size={12} strokeWidth={4} />}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
