import { X } from 'lucide-react';

/**
 * Full-screen question navigator overlay.
 * Shows a grid of numbered buttons, colored by answer state.
 * Audited for deep Dark Mode support and responsive tablet layout.
 */
export default function QuestionNavigator({
  isOpen,
  onClose,
  totalQuestions,
  currentQuestion,
  answers,
  onGoToQuestion,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in transition-all duration-300">
      {/* Backdrop: Darker in both modes for focus */}
      <div
        className="absolute inset-0 bg-dark/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Drawer Panel: Centered for larger screens, Bottom sheet on mobile */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-surface rounded-t-[2.5rem] shadow-2xl
                      max-h-[85vh] overflow-y-auto animate-slide-up safe-bottom border-t border-slate-100 dark:border-dark-border transition-colors duration-300 mx-auto max-w-4xl">
        
        {/* Decorative Handle Indicator */}
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-dark-border rounded-full mx-auto mt-4 mb-2" />

        {/* Header Section */}
        <div className="sticky top-0 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm z-10 flex items-center justify-between px-6 py-5 border-b border-slate-50 dark:border-dark-border transition-colors">
          <div>
            <h2 className="text-xl font-extrabold text-dark dark:text-white uppercase tracking-tight">Navigasi Soal</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Ketuk nomor untuk berpindah soal dengan cepat
            </p>
          </div>
          <button
            id="btn-close-navigator"
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-dark-bg hover:bg-slate-200 dark:hover:bg-dark text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all shadow-sm active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Dashboard Legend: Explains states to the student */}
        <div className="flex flex-wrap items-center gap-6 px-6 py-5 text-sm font-bold text-slate-500 dark:text-slate-400 border-b border-dashed border-slate-100 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-primary shadow-glow shadow-primary/30" />
            <span className="dark:text-primary-light">Sedang Dikerjakan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-secondary shadow-md shadow-secondary/10" />
            <span className="text-secondary dark:text-secondary-light">Sudah Dijawab</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-dark-border" />
            <span className="text-slate-400/80">Belum Dijawab</span>
          </div>
        </div>

        {/* Question Grid: Responsive column counts */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3.5 p-6 pt-6">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const num = i + 1;
            const isAnswered = answers[num] !== undefined;
            const isCurrent = num === currentQuestion;

            return (
              <button
                key={num}
                onClick={() => {
                  onGoToQuestion(num);
                  onClose();
                }}
                className={`w-full aspect-square rounded-2xl text-base font-extrabold
                           flex items-center justify-center
                           transition-all duration-300 active:scale-75
                           ${
                             isCurrent
                               ? 'bg-primary text-white shadow-glow scale-110 ring-4 ring-primary/10'
                               : isAnswered
                               ? 'bg-secondary/10 dark:bg-secondary/20 text-secondary border-2 border-secondary/30 dark:border-secondary/40'
                               : 'bg-slate-50 dark:bg-dark-bg text-slate-400 dark:text-slate-600 border-2 border-slate-100 dark:border-dark-border hover:border-slate-200 dark:hover:border-slate-600'
                           }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
