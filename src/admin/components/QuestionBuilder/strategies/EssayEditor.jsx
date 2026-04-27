import React from 'react';
import { ListChecks, Plus, Trash2, AlignLeft } from 'lucide-react';

export default function EssayEditor({ payload, onChange }) {
  const rubric = payload.rubric || [{ criterion: '', max_points: '' }];
  const wordLimit = payload.word_limit || 500;

  const handleRubricChange = (index, field, value) => {
    const newRubric = [...rubric];
    newRubric[index] = { ...newRubric[index], [field]: value };
    onChange({ ...payload, rubric: newRubric });
  };

  const addRubric = () => {
    onChange({ ...payload, rubric: [...rubric, { criterion: '', max_points: '' }] });
  };

  const removeRubric = (index) => {
    onChange({ ...payload, rubric: rubric.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Konfigurasi Esai (Essay)</span>
        <div className="h-px flex-1 mx-4 bg-slate-50 dark:bg-slate-800" />
      </div>

      <div className="space-y-6">
        {/* Word Limit */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
           <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
              <AlignLeft size={24} />
           </div>
           <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batas Kata (Word Limit)</label>
              <input 
                type="number" 
                value={wordLimit}
                onChange={e => onChange({ ...payload, word_limit: parseInt(e.target.value) || 0 })}
                className="w-full bg-transparent text-xl font-black text-slate-800 dark:text-white outline-none italic"
              />
           </div>
        </div>

        {/* Rubric Section */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <ListChecks size={18} className="text-emerald-500" />
                 <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Rubrik Penilaian</h4>
              </div>
              <button onClick={addRubric} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all">
                 <Plus size={16} />
              </button>
           </div>

           <div className="space-y-3">
              {rubric.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start animate-in slide-in-from-right-2">
                   <div className="flex-1 relative">
                      <input 
                        type="text"
                        value={item.criterion}
                        onChange={e => handleRubricChange(idx, 'criterion', e.target.value)}
                        placeholder="Kriteria penilaian..."
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none"
                      />
                   </div>
                   <div className="w-24 relative">
                      <input 
                        type="number"
                        step="0.1"
                        value={item.max_points}
                        onChange={e => handleRubricChange(idx, 'max_points', e.target.value)}
                        placeholder="Skor"
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black text-center outline-none text-emerald-600"
                      />
                   </div>
                   {rubric.length > 1 && (
                     <button onClick={() => removeRubric(idx)} className="p-4 text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={20} />
                     </button>
                   )}
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
