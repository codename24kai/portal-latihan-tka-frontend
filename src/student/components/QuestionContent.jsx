import { ImageIcon } from 'lucide-react';
import MathText from '../../components/MathText';

/**
 * Displays the question text and optional image.
 * Uses large typography for young students.
 * Audited for deep Dark Mode support.
 */
export default function QuestionContent({ questionNumber, text, image, imageUrl }) {
  const actualImage = imageUrl || image;

  return (
    <div id="question-content" className="animate-fade-in relative">
      {/* Question number badge: Subtle accent in dark mode */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-indigo-900/40 text-primary dark:text-indigo-100 text-sm font-bold mb-6 transition-colors">
        Soal {questionNumber}
      </div>

      {/* Question text: High contrast in both modes */}
      <div className="text-xl sm:text-2xl leading-relaxed text-slate-800 dark:text-slate-100 font-semibold mb-8 transition-colors">
        <MathText text={text} />
      </div>

      {/* Image box: Dark mode border and background adjustment */}
      {actualImage && (
        <div className="relative mb-8 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-300 shadow-sm">
          {typeof actualImage === 'string' && actualImage !== '' ? (
            <div className="flex justify-center p-4">
              <img 
                src={actualImage} 
                alt={`Soal ${questionNumber}`} 
                className="max-h-80 w-full object-contain rounded-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400?text=Gambar+tidak+ditemukan';
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-slate-400 dark:text-slate-500">
              {/* Visual placeholder for student-friendly appearance */}
              <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none flex items-center justify-center mb-4 transition-colors">
                <ImageIcon size={32} className="text-slate-300 dark:text-slate-600" />
              </div>
              <span className="text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Gambar Soal
              </span>
              <span className="text-sm text-slate-400 dark:text-slate-500 mt-2 text-center max-w-xs leading-snug">
                Ilustrasi visual untuk pembantu jawaban akan ditampilkan di sini.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
