import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';

const AnswerDropdown = ({ question }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
          isOpen 
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
          : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/40'
        }`}
      >
        <span>Kunci: {question.correctAnswer}</span>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-56 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Pilihan Jawaban</p>
            <div className="space-y-1">
              {Object.entries(question.options).map(([key, val]) => (
                <div 
                  key={key} 
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                    question.correctAnswer === key 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shrink-0 ${
                    question.correctAnswer === key 
                    ? 'bg-emerald-500 text-white shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}>
                    {key}
                  </span>
                  <div className="text-[10px] font-bold truncate" title={val}>
                    <MathRenderer text={val} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnswerDropdown;
