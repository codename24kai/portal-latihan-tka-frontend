import React from 'react';
import { ImageIcon, Calculator, X, CheckSquare, Plus, Trash2 } from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';

export default function MultiChoiceEditor({ payload, onChange, onOpenMath }) {
  const options = payload.options || [
    { key: 'A', text: '', image: null },
    { key: 'B', text: '', image: null },
    { key: 'C', text: '', image: null },
    { key: 'D', text: '', image: null }
  ];
  const correctKeys = payload.correct_keys || [];
  const penaltyForWrong = payload.penalty_for_wrong || false;

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange({ ...payload, options: newOptions });
  };

  const handleCorrectToggle = (key) => {
    const newCorrect = correctKeys.includes(key)
      ? correctKeys.filter(k => k !== key)
      : [...correctKeys, key];
    onChange({ ...payload, correct_keys: newCorrect });
  };

  const addOption = () => {
    const nextKey = String.fromCharCode(65 + options.length);
    const newOptions = [...options, { key: nextKey, text: '', image: null }];
    onChange({ ...payload, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index).map((opt, i) => ({
      ...opt,
      key: String.fromCharCode(65 + i)
    }));
    const newCorrect = correctKeys.filter(k => newOptions.some(o => o.key === k));
    onChange({ ...payload, options: newOptions, correct_keys: newCorrect });
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleOptionChange(index, 'image', reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pilihan Ganda Kompleks (Multi Choice)</span>
        <div className="flex items-center gap-3">
           <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={penaltyForWrong} 
                onChange={e => onChange({ ...payload, penalty_for_wrong: e.target.checked })}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="text-[9px] font-black text-slate-400 uppercase">Gunakan Penalti</span>
           </label>
           <button onClick={addOption} className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all">
              <Plus size={16} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => (
          <div key={option.key} className="relative group">
            <div className={`flex items-center gap-4 p-2 pl-5 bg-slate-50 dark:bg-slate-900/50 border rounded-[1.5rem] transition-all ${
              correctKeys.includes(option.key) ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-slate-100 dark:border-slate-700'
            }`}>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                correctKeys.includes(option.key) ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>{option.key}</span>
              
              <div className="flex-1 flex flex-col gap-2">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                    placeholder={`Ketik isi pilihan ${option.key}...`}
                    className="flex-1 bg-transparent border-none outline-none font-bold text-xs text-slate-800 dark:text-white"
                  />
                  <label className="p-2 text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer">
                    <ImageIcon size={16} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, idx)} 
                    />
                  </label>
                </div>
                
                {option.image && (
                  <div className="relative w-full max-w-[200px] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 group/optimg shadow-sm bg-white dark:bg-slate-900">
                    <img src={option.image} alt={`Option ${option.key}`} className="w-full h-auto object-contain p-2" />
                    <button 
                      onClick={() => handleOptionChange(idx, 'image', null)}
                      className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-md opacity-0 group-hover/optimg:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pr-4 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
                <button onClick={() => onOpenMath(option.key)} className="text-slate-300 hover:text-indigo-600 transition-colors"><Calculator size={16} /></button>
                <div className="flex flex-col items-center">
                  <input 
                    type="checkbox" 
                    checked={correctKeys.includes(option.key)}
                    onChange={() => handleCorrectToggle(option.key)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[7px] font-black text-slate-400 uppercase mt-0.5">Kunci</span>
                </div>
                {options.length > 2 && (
                  <button onClick={() => removeOption(idx)} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
