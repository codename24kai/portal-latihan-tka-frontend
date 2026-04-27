import React from 'react';
import { AlignLeft } from 'lucide-react';

export default function EssayRenderer({ payload, selected, onSelect }) {
  const wordCount = (selected || '').trim().split(/\s+/).filter(Boolean).length;
  const limit = payload.word_limit || 500;

  return (
    <div className="space-y-6">
      <div className="relative group">
        <textarea
          value={selected || ''}
          onChange={(e) => onSelect(e.target.value)}
          placeholder="Tuliskan jawaban Anda di sini..."
          rows={12}
          className="w-full px-8 py-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[3rem] text-sm font-medium focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all dark:text-white resize-none shadow-sm"
        />
        <div className="absolute right-8 bottom-8 flex items-center gap-3">
           <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
             wordCount > limit ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'
           }`}>
             <AlignLeft size={14} />
             {wordCount} / {limit} Kata
           </div>
        </div>
      </div>
      
      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
           Jawaban Anda akan disimpan secara otomatis. Pastikan penjelasan Anda runtut dan sesuai dengan rubrik yang diminta.
         </p>
      </div>
    </div>
  );
}
