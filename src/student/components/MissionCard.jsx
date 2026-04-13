import { useNavigate } from 'react-router-dom';
/**
 * Mission/Exam card for the student dashboard.
 * Shows subject info, duration, question count, and action button.
 */
import {
  Clock,
  Play,
  CheckCircle2,
  Trophy,
  Book,
  Calculator,
  Globe,
  Heart,
  Lock,
  Star,
  RotateCcw
} from 'lucide-react';
import { formatDuration } from '../../utils/formatTime';

/**
 * Gamified Mission/Exam card for students.
 * Features large icons, status rewards, and clear action calls.
 */
export default function MissionCard({ exam, onStart, isPractice = false }) {
  const navigate = useNavigate();
  const isCompleted = exam.status === 'completed';
  const isLocked = exam.status === 'locked';

  // Icon mapping with larger default
  const getIcon = (iconName) => {
    const size = 36;
    switch (iconName) {
      case 'Calculator': return <Calculator size={size} />;
      case 'Book': return <Book size={size} />;
      case 'Globe': return <Globe size={size} />;
      case 'Heart': return <Heart size={size} />;
      default: return <Book size={size} />;
    }
  };

  return (
    <div
      id={`mission-card-${exam.id}`}
      className={`relative bg-white dark:bg-dark-surface rounded-[2.5rem] shadow-card dark:shadow-black/40 border-2 overflow-hidden transition-all duration-300 group ${isLocked
          ? 'opacity-70 border-slate-100 grayscale-[0.5]'
          : isCompleted
            ? 'border-teal-100 dark:border-teal-900/30'
            : 'border-white dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2'
        } animate-slide-up`}
      style={{ animationDelay: `${exam.id * 80}ms` }}
    >
      {/* Top color accent bar */}
      <div className={`h-2 bg-gradient-to-r ${exam.color}`} />

      {/* Gamification Badge: Star */}
      {!isCompleted && !isLocked && (
        <div className="absolute top-4 right-6 flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
          <Star size={12} fill="currentColor" />
          Bintang Emas
        </div>
      )}

      <div className="p-8">
        {/* Header row: Icon + Subject + Status */}
        <div className="flex items-center gap-6 mb-8">
          {/* Subject icon - Enlarged and Styled */}
          <div className={`w-20 h-20 rounded-3xl ${exam.bgLight} dark:bg-white/5 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500`}>
            <span className={`${exam.textColor} dark:text-white`}>
              {getIcon(exam.icon)}
            </span>
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white text-xl tracking-tight leading-tight uppercase">
              {isPractice ? `BAB ${exam.id}: ${exam.subject}` : exam.subject}
            </h3>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">
              {exam.type === 'tryout' ? 'Simulasi Resmi TKA' : 'Latihan Mandiri • Topik Utama'}
            </p>
          </div>
        </div>

        {/* Info Area */}
        <div className="flex flex-wrap items-center gap-6 mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <Clock size={16} className="text-slate-400" />
            <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{formatDuration(exam.duration)}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <Book size={16} className="text-slate-400" />
            <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{exam.totalQuestions} Soal</span>
          </div>
        </div>

        {/* Action area */}
        {isLocked ? (
          <button disabled className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl cursor-not-allowed">
            <Lock size={18} />
            <span>Belum Waktunya</span>
          </button>
        ) : isCompleted ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full p-4 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy size={20} className="text-teal-600" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Skor Terakhirmu</span>
              </div>
              <span className="text-2xl font-black text-teal-600">{exam.score}</span>
            </div>
            <button
              onClick={() => onStart ? onStart(exam) : navigate(`/exam/${exam.id}`)}
              className="flex items-center justify-center gap-2 h-14 px-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all shrink-0"
            >
              <RotateCcw size={16} /> Kerjakan Ulang
            </button>
          </div>
        ) : (
          <button
            id={`btn-start-exam-${exam.id}`}
            onClick={() => onStart ? onStart(exam) : navigate(`/exam/${exam.id}`)}
            className={`w-full h-16 flex items-center justify-center gap-3 py-4 bg-gradient-to-r ${exam.color} text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all duration-300 hover:scale-[1.02] active:scale-95`}
          >
            <Play size={20} fill="white" />
            <span>Mulai Sekarang</span>
          </button>
        )}
      </div>
    </div>
  );
}
