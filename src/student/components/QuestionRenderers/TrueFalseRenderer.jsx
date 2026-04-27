import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function TrueFalseRenderer({ payload, selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <button
        onClick={() => onSelect(true)}
        className={`group relative p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-6 ${
          selected === true 
            ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20 shadow-xl shadow-emerald-500/10' 
            : 'bg-white border-slate-100 text-slate-400 dark:bg-slate-800 dark:border-slate-700 hover:border-emerald-200'
        }`}
      >
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
          selected === true ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-200'
        }`}>
          <CheckCircle2 size={48} />
        </div>
        <span className="text-lg font-black uppercase tracking-[0.2em]">Benar</span>
      </button>

      <button
        onClick={() => onSelect(false)}
        className={`group relative p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-6 ${
          selected === false 
            ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-900/20 shadow-xl shadow-rose-500/10' 
            : 'bg-white border-slate-100 text-slate-400 dark:bg-slate-800 dark:border-slate-700 hover:border-rose-200'
        }`}
      >
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
          selected === false ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-200'
        }`}>
          <XCircle size={48} />
        </div>
        <span className="text-lg font-black uppercase tracking-[0.2em]">Salah</span>
      </button>
    </div>
  );
}
