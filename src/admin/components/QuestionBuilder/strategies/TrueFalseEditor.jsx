import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function TrueFalseEditor({ payload, onChange }) {
  const correctValue = payload.correct_value !== undefined ? payload.correct_value : true;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Benar / Salah (True False)</span>
        <div className="h-px flex-1 bg-slate-50 dark:bg-slate-800" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => onChange({ ...payload, correct_value: true })}
          className={`group relative p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
            correctValue === true 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20' 
              : 'bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-900/50 dark:border-slate-700'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            correctValue === true ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-200'
          }`}>
            <CheckCircle2 size={32} />
          </div>
          <span className="text-sm font-black uppercase tracking-widest">Benar</span>
          {correctValue === true && <div className="absolute top-4 right-4 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-800" />}
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...payload, correct_value: false })}
          className={`group relative p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
            correctValue === false 
              ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-900/20' 
              : 'bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-900/50 dark:border-slate-700'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            correctValue === false ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white dark:bg-slate-800 text-slate-200'
          }`}>
            <XCircle size={32} />
          </div>
          <span className="text-sm font-black uppercase tracking-widest">Salah</span>
          {correctValue === false && <div className="absolute top-4 right-4 w-4 h-4 bg-rose-500 rounded-full border-4 border-white dark:border-slate-800" />}
        </button>
      </div>
    </div>
  );
}
