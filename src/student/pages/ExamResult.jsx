import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Target, ArrowLeft, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import mockQuestions from '../../data/mockQuestions';

/**
 * Post-exam result summary page.
 * Shows score, stats, and a breakdown indicator.
 */
export default function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const { answers = {}, totalQuestions = 40, timeUp = false } = location.state || {};

  // Calculate score based on mock correct answers
  const { correctCount, wrongCount, unanswered, score } = useMemo(() => {
    let correct = 0;
    let wrong = 0;

    mockQuestions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;
      if (userAnswer === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    return {
      correctCount: correct,
      wrongCount: wrong,
      unanswered: totalQuestions - correct - wrong,
      score: Math.round((correct / totalQuestions) * 100),
    };
  }, [answers, totalQuestions]);

  // Score color based on performance
  const getScoreColor = () => {
    if (score >= 80) return 'text-correct';
    if (score >= 60) return 'text-warning';
    return 'text-incorrect';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Luar Biasa! 🎉';
    if (score >= 60) return 'Bagus! 👍';
    if (score >= 40) return 'Terus Berlatih! 💪';
    return 'Jangan Menyerah! 🌟';
  };

  return (
    <div id="exam-result" className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-primary-light pt-8 pb-20 px-4 text-center text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

        {timeUp && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-200 rounded-lg text-xs font-medium mb-4">
            ⏰ Waktu Habis
          </div>
        )}

        <div className="animate-bounce-in">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Trophy size={36} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1">Ujian Selesai!</h1>
        <p className="text-white/70 text-sm">Matematika — Tryout Minggu ke-1</p>
      </div>

      {/* Score Card (overlapping header) */}
      <div className="px-4 -mt-14 mb-6 max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-card p-6 text-center animate-slide-up">
          <p className="text-sm text-gray-400 font-medium mb-2">Skor Kamu</p>
          <p className={`text-6xl font-extrabold ${getScoreColor()} mb-1`}>
            {score}
          </p>
          <p className="text-sm text-gray-400 mb-3">dari 100</p>
          <p className="text-lg font-semibold text-dark">{getScoreLabel()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mb-6 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {/* Correct */}
          <div className="bg-white rounded-2xl shadow-card p-4 text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="w-10 h-10 rounded-xl bg-correct/10 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={20} className="text-correct" />
            </div>
            <p className="text-2xl font-bold text-correct">{correctCount}</p>
            <p className="text-xs text-gray-400 mt-1">Benar</p>
          </div>

          {/* Wrong */}
          <div className="bg-white rounded-2xl shadow-card p-4 text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="w-10 h-10 rounded-xl bg-incorrect/10 flex items-center justify-center mx-auto mb-2">
              <XCircle size={20} className="text-incorrect" />
            </div>
            <p className="text-2xl font-bold text-incorrect">{wrongCount}</p>
            <p className="text-xs text-gray-400 mt-1">Salah</p>
          </div>

          {/* Unanswered */}
          <div className="bg-white rounded-2xl shadow-card p-4 text-center animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <Target size={20} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-500">{unanswered}</p>
            <p className="text-xs text-gray-400 mt-1">Kosong</p>
          </div>
        </div>
      </div>

      {/* Progress Ring Visual */}
      <div className="px-4 mb-6 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-card p-5 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Ringkasan</h3>
          <div className="space-y-3">
            {/* Correct bar */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500">Benar</span>
                <span className="font-semibold text-correct">{correctCount}/{totalQuestions}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-correct to-secondary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(correctCount / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Wrong bar */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500">Salah</span>
                <span className="font-semibold text-incorrect">{wrongCount}/{totalQuestions}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-incorrect to-accent rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(wrongCount / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Unanswered bar */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500">Tidak Dijawab</span>
                <span className="font-semibold text-gray-400">{unanswered}/{totalQuestions}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-300 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(unanswered / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-8 max-w-md mx-auto flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <button
          id="btn-back-dashboard"
          onClick={() => navigate('/')}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Kembali ke Dashboard
        </button>
        <button
          id="btn-retry"
          onClick={() => navigate(`/exam/1`)}
          className="btn-ghost w-full flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
