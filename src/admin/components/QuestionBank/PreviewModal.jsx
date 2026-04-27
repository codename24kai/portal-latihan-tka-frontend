import React from 'react';
import { X, Eye, CheckCircle, HelpCircle } from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';

const PreviewModal = ({ question, onClose }) => {
  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
         <div className="px-10 py-6 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                  <Eye size={20} />
               </div>
               <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Pratinjau Soal</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">ID #{question.id} • {question.subject}</p>
               </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
               <X size={20} />
            </button>
         </div>
         <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pertanyaan</label>
               <div className="text-lg font-bold text-slate-800 dark:text-white leading-relaxed">
                  <MathRenderer text={question.text} />
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {Object.entries(question.options).map(([key, val]) => (
                 <div key={key} className={`p-4 rounded-2xl border flex items-center gap-4 ${question.correctAnswer === key ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700'}`}>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${question.correctAnswer === key ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>{key}</span>
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                       <MathRenderer text={val} />
                    </div>
                    {question.correctAnswer === key && <CheckCircle size={16} className="text-emerald-500 ml-auto" />}
                 </div>
               ))}
            </div>
            {question.explanation && (
              <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 space-y-2">
                 <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    <HelpCircle size={14} /> Pembahasan
                 </div>
                 <p className="text-xs font-medium text-slate-600 dark:text-slate-400 italic font-medium leading-relaxed">{question.explanation}</p>
              </div>
            )}
         </div>
         <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-700 flex justify-end">
            <button onClick={onClose} className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
               Tutup Panel
            </button>
         </div>
      </div>
    </div>
  );
};

export default PreviewModal;
