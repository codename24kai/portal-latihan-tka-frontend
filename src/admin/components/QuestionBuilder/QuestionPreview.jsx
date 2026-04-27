import React from 'react';
import { Eye } from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';
import { QUESTION_TYPES } from '@/constants/questions';

export default function QuestionPreview({ data }) {
  const { payload, explanation, question_type } = data;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
          <Eye size={20} />
        </div>
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Live Preview</h3>
      </div>

      <div className="space-y-6">
        {/* Question Content */}
        <div className="space-y-4">
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
            <MathRenderer text={payload.stem || 'Belum ada pertanyaan...'} />
          </div>
          {payload.stem_image && (
            <img src={payload.stem_image} alt="Preview" className="w-full max-w-md h-auto rounded-2xl border border-slate-100 dark:border-slate-700" />
          )}
        </div>

        {/* Options Preview */}
        <div className="space-y-3">
          {question_type === QUESTION_TYPES.SINGLE_CHOICE || question_type === QUESTION_TYPES.MULTI_CHOICE ? (
            <div className="grid grid-cols-1 gap-3">
              {(payload.options || []).map((opt) => (
                <div key={opt.key} className={`flex items-center gap-3 p-4 rounded-2xl border ${
                  payload.correct_keys?.includes(opt.key) 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-800' 
                    : 'bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-900/50 dark:border-slate-700'
                }`}>
                  <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">{opt.key}</span>
                  <div className="flex-1 text-xs font-bold">
                    <MathRenderer text={opt.text || '...'} />
                  </div>
                  {opt.image && <img src={opt.image} alt="Opt" className="h-10 w-10 object-contain rounded-md" />}
                </div>
              ))}
            </div>
          ) : question_type === QUESTION_TYPES.TRUE_FALSE ? (
            <div className="grid grid-cols-2 gap-4">
               <div className={`p-4 rounded-2xl border text-center font-black uppercase tracking-widest text-[10px] ${payload.correct_value === true ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>Benar</div>
               <div className={`p-4 rounded-2xl border text-center font-black uppercase tracking-widest text-[10px] ${payload.correct_value === false ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>Salah</div>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl text-center">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Input Esai Siswa</span>
            </div>
          )}
        </div>

        {/* Explanation Preview */}
        {explanation && (
          <div className="pt-6 border-t border-slate-50 dark:border-slate-700">
             <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-2">Pembahasan:</span>
             <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic leading-relaxed">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
