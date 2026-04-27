import React from 'react';
import { Type, Calculator, ImageIcon, X } from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';

export default function QuestionStemEditor({ stem, image, onChange, onOpenMath }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
            <Type size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Pertanyaan</h3>
        </div>
        <button 
          type="button"
          onClick={() => onOpenMath('stem')}
          className="flex items-center gap-2 text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl transition-all uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/40"
        >
          <Calculator size={14} strokeWidth={3} /> Sisipkan Rumus
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <textarea
            value={stem || ''}
            onChange={(e) => onChange('stem', e.target.value)}
            placeholder="Tuliskan pertanyaan di sini..."
            rows={6}
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white resize-none"
          />
          <label className="absolute right-6 bottom-4 cursor-pointer text-slate-300 hover:text-indigo-600 transition-colors">
            <ImageIcon size={20} />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => onChange('stem_image', reader.result);
                  reader.readAsDataURL(file);
                }
              }} 
            />
          </label>
        </div>

        {image && (
          <div className="relative w-full max-w-lg rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 group/qimg shadow-sm">
            <img src={image} alt="Question" className="w-full h-auto object-contain bg-white" />
            <button 
              onClick={() => onChange('stem_image', null)}
              className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover/qimg:opacity-100 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {stem?.includes('$') && (
          <div className="p-6 bg-indigo-50/30 dark:bg-indigo-900/10 border border-dashed border-indigo-200 dark:border-indigo-800 rounded-3xl animate-in fade-in zoom-in-95">
            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-3">Pratinjau Rumus</p>
            <MathRenderer text={stem} className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed" />
          </div>
        )}
      </div>
    </div>
  );
}
