import { X } from 'lucide-react';

export default function QuestionNavigator({
  isOpen,
  onClose,
  totalQuestions,
  currentQuestion,
  answers,
  flaggedQuestions,
  onGoToQuestion,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100 dark:border-slate-800">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Navigasi Soal</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pilih nomor untuk melompat ke soal</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Legend */}
        <div className="px-8 py-4 flex flex-wrap gap-4 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
          {[
            { label: 'Aktif', color: 'bg-indigo-600' },
            { label: 'Terjawab', color: 'bg-teal-500' },
            { label: 'Kosong', color: 'bg-slate-200 dark:bg-slate-700' },
            { label: 'Ditandai', color: 'bg-orange-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Grid Soal */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {Array.from({ length: totalQuestions }, (_, i) => {
              const num = i + 1;
              const isAnswered = answers[num] !== undefined;
              const isCurrent = num === currentQuestion;
              const isFlagged = flaggedQuestions?.has(num);

              return (
                <button
                  key={num}
                  onClick={() => {
                    onGoToQuestion(num);
                    onClose();
                  }}
                  className={`
                    relative w-full aspect-square rounded-xl text-sm font-black transition-all duration-200
                    flex items-center justify-center border-2
                    ${isCurrent
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                      : isAnswered
                        ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/20 dark:border-teal-900 dark:text-teal-400'
                        : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                    }
                  `}
                >
                  {num}
                  {isFlagged && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:opacity-90 transition-all"
          >
            Tutup Navigasi
          </button>
        </div>
      </div>
    </div>
  );
}