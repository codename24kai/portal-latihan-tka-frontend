import React from 'react';
import { ImageIcon, Calculator, X, CheckCircle2 } from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';

export default function SingleChoiceEditor({ payload, onChange, onOpenMath }) {
  const options = payload.options || [
    { key: 'A', text: '', image: null },
    { key: 'B', text: '', image: null },
    { key: 'C', text: '', image: null },
    { key: 'D', text: '', image: null }
  ];
  const correctKey = payload.correct_keys?.[0] || 'A';

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange({ ...payload, options: newOptions });
  };

  const handleCorrectChange = (key) => {
    onChange({ ...payload, correct_keys: [key] });
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
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pilihan Jawaban (Single Choice)</span>
        <div className="h-px flex-1 bg-slate-50 dark:bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => (
          <div key={option.key} className="relative group">
            <div className={`flex items-center gap-4 p-2 pl-5 bg-slate-50 dark:bg-slate-900/50 border rounded-[1.5rem] transition-all ${
              correctKey === option.key ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-slate-100 dark:border-slate-700'
            }`}>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                correctKey === option.key ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
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

              {option.text?.includes('$') && (
                <div className="absolute left-14 -bottom-10 z-10 px-4 py-2 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-800 rounded-xl shadow-xl animate-in slide-in-from-top-1">
                  <MathRenderer text={option.text} className="text-[11px]" />
                </div>
              )}

              <div className="flex items-center gap-2 pr-4 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
                <button onClick={() => onOpenMath(option.key)} className="text-slate-300 hover:text-indigo-600 transition-colors"><Calculator size={16} /></button>
                <div className="flex flex-col items-center ml-2">
                  <input 
                    type="radio" 
                    name="ans" 
                    checked={correctKey === option.key}
                    onChange={() => handleCorrectChange(option.key)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[7px] font-black text-slate-400 uppercase mt-0.5">Kunci</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
