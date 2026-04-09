import { useNavigate } from 'react-router-dom';
import { Clock, Play, CheckCircle2, Trophy, Book, Calculator, Globe, Heart } from 'lucide-react';
import { formatDuration } from '../../utils/formatTime';

/**
 * Mission/Exam card for the student dashboard.
 * Shows subject info, duration, question count, and action button.
 */
export default function MissionCard({ exam }) {
  const navigate = useNavigate();
  const isCompleted = exam.status === 'completed';

  // Icon mapping
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Calculator': return <Calculator size={24} />;
      case 'Book': return <Book size={24} />;
      case 'Globe': return <Globe size={24} />;
      case 'Heart': return <Heart size={24} />;
      default: return <Book size={24} />;
    }
  };

  return (
    <div
      id={`mission-card-${exam.id}`}
      className="bg-white dark:bg-dark-surface rounded-2xl shadow-card dark:shadow-black/40 dark:border dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-card-hover dark:hover:shadow-none dark:hover:bg-slate-800 hover:-translate-y-1 animate-slide-up"
      style={{ animationDelay: `${exam.id * 80}ms` }}
    >
      {/* Top color accent bar */}
      <div className={`h-1.5 bg-gradient-to-r ${exam.color}`} />

      <div className="p-5">
        {/* Header row: Icon + Subject + Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Subject icon */}
            <div className={`w-12 h-12 rounded-xl ${exam.bgLight} dark:bg-white/10 flex items-center justify-center text-xl`}>
              {getIcon(exam.icon)}
            </div>
            <div>
              <h3 className="font-bold text-dark dark:text-white text-base">{exam.subject}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">Tryout Minggu Ini</p>
            </div>
          </div>

          {/* Status badge */}
          {isCompleted && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-correct/10 text-correct rounded-lg text-xs font-semibold">
              <CheckCircle2 size={12} />
              Selesai
            </div>
          )}
        </div>

        {/* Info row: Duration + Questions */}
        <div className="flex items-center gap-4 mb-4 text-sm text-slate-400 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{formatDuration(exam.duration)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>{exam.totalQuestions} soal</span>
          </div>
        </div>

        {/* Action area */}
        {isCompleted ? (
          <div className="flex items-center justify-between">
            {/* Score display */}
            <div className="flex items-center gap-2">
              <Trophy size={16} className={exam.score >= 80 ? 'text-correct' : exam.score >= 60 ? 'text-warning' : 'text-incorrect'} />
              <span className="text-sm font-medium text-slate-500 dark:text-slate-300">Skor:</span>
              <span className={`text-lg font-bold ${exam.score >= 80 ? 'text-correct' : exam.score >= 60 ? 'text-warning' : 'text-incorrect'}`}>
                {exam.score}
              </span>
            </div>
            <button
              onClick={() => navigate(`/exam/${exam.id}`)}
              className="btn-ghost dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 text-sm px-4 min-h-[40px] transition-colors duration-200"
            >
              Ulangi
            </button>
          </div>
        ) : (
          <button
            id={`btn-start-exam-${exam.id}`}
            onClick={() => navigate(`/exam/${exam.id}`)}
            className={`btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r ${exam.color} dark:bg-none dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 shadow-lg dark:shadow-black/20 transition-all duration-200`}
          >
            <Play size={18} fill="white" />
            <span>Mulai Ujian</span>
          </button>
        )}
      </div>
    </div>
  );
}
