import React from 'react';
import { FileText, Info } from 'lucide-react';

export default function ExplanationPanel({ value, onChange }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
          <FileText size={20} />
        </div>
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Pembahasan</h3>
      </div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange('explanation', e.target.value)}
        placeholder="Tuliskan kunci jawaban dan pembahasan untuk membantu siswa..."
        rows={4}
        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white resize-none"
      />
      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight leading-relaxed">
          <Info size={12} className="inline mr-1 text-indigo-500" />
          Pembahasan ini akan tampil setelah siswa menyelesaikan ujian.
        </p>
      </div>
    </div>
  );
}
