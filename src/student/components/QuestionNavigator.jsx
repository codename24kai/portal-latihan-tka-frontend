import { X } from 'lucide-react';

/**
 * Full-screen question navigator overlay.
 * Shows a grid of numbered buttons, colored by answer state.
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
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl
                      max-h-[75vh] overflow-y-auto animate-slide-up safe-bottom">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-dark">Navigasi Soal</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Ketuk nomor untuk berpindah soal
            </p>
          </div>
          <button
            id="btn-close-navigator"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200
                       flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 py-3 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary" />
            Sedang dikerjakan
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            Sudah dijawab
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-200" />
            Belum dijawab
          </div>
        </div>

        {/* Question Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5 p-5 pt-2">
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
                className={`w-full aspect-square rounded-xl text-sm font-bold
                           flex items-center justify-center
                           transition-all duration-200 active:scale-90
                           ${
                             isCurrent
                               ? 'bg-primary text-white shadow-glow scale-105'
                               : isAnswered
                               ? 'bg-secondary/15 text-secondary border-2 border-secondary/30'
                               : 'bg-gray-50 text-gray-400 border-2 border-gray-100 hover:border-gray-200'
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
