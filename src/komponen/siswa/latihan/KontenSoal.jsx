import { ImageIcon } from 'lucide-react';
import MathRenderer from '@/komponen/ui/RendererMatematika';

/**
 * Enhanced QuestionContent Component
 * Optimized for readability, structured layout, and adaptive visuals.
 */
export default function QuestionContent({ questionNumber, text, image, imageUrl }) {
  const actualImage = imageUrl || image;

  return (
    <div id="question-content" className="animate-fade-in flex flex-col gap-6">

      {/* 1. Header Area: Soal Number Badge */}
      <div className="flex items-center">
        <div className="flex items-center gap-2.5 px-5 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 transition-colors">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Soal {questionNumber}</span>
        </div>
      </div>

      {/* 2. Content Area: Question Text */}
      <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
        <div className="text-lg sm:text-2xl leading-[1.6] text-slate-800 dark:text-slate-100 font-medium tracking-tight">
          <MathRenderer text={text} />
        </div>
      </div>

      {/* 3. Image Area: Adaptif & Modern */}
      {actualImage && (
        <div className="w-full">
          {typeof actualImage === 'string' && actualImage !== '' ? (
            <div className="relative group w-full max-w-xl mx-auto rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl transition-all">
              <img
                src={actualImage}
                alt={`Ilustrasi Soal ${questionNumber}`}
                className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/800x500?text=Gambar+tidak+ditemukan';
                }}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ) : (
            /* Placeholder state (cleaner look) */
            <div className="w-full max-w-xl mx-auto py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/30">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <ImageIcon size={24} className="text-slate-400" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Gambar tidak tersedia</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}