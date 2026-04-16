import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  ArrowRight, 
  RotateCcw,
  BookOpen,
  MessageCircle,
  Award
} from 'lucide-react';
import MathText from '../../components/MathText';

/**
 * ModuleQuizModal Component
 * A gamified, interactive quiz experience for students.
 */
export default function ModuleQuizModal({ isOpen, onClose, moduleTitle, subjectName, questions = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); // Array to track incorrect answers for correction list

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setSelectedOption(null);
      setFeedback(null);
      setScore(0);
      setShowResults(false);
      setUserAnswers([]);
    }
  }, [isOpen]);

  if (!isOpen || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (optionIndex) => {
    if (selectedOption !== null) return; // Prevent spam-clicking

    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Record answer for correction list (only if wrong)
    setUserAnswers(prev => [
      ...prev,
      {
        questionIndex: currentIndex,
        selectedOption: optionIndex,
        isCorrect
      }
    ]);

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const percentage = Math.round((score / questions.length) * 100);

  const getReactionMessage = () => {
    if (percentage === 100) return "Kamu Hebat! Pertahankan terus prestasimu!";
    if (percentage >= 80) return "Luar biasa! Sedikit lagi menuju sempurna!";
    if (percentage >= 60) return "Bagus! Kamu mengerti materinya dengan baik.";
    return `Jangan menyerah! Terus semangat belajar ${subjectName}, kamu pasti bisa!`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl transition-all" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        
        {/* Header */}
        <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="font-black text-slate-800 dark:text-white leading-tight">{moduleTitle}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subjectName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12">
          {!showResults ? (
            <div className="max-w-2xl mx-auto space-y-10">
              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-tighter">
                  <span>Pertanyaan {currentIndex + 1} dari {questions.length}</span>
                  <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                <MathText text={currentQuestion.text} />
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  
                  let cardStyle = "border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/40 bg-white dark:bg-slate-800 shadow-sm";
                  let icon = null;

                  if (feedback && isSelected) {
                    if (isCorrect) {
                      cardStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 animate-bounce";
                      icon = <CheckCircle size={20} className="shrink-0" />;
                    } else {
                      cardStyle = "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 animate-shake";
                      icon = <XCircle size={20} className="shrink-0" />;
                    }
                  } else if (feedback && isCorrect && !isSelected) {
                    // Show correct answer even if not selected
                    cardStyle = "border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-500/5 text-emerald-600/70 dark:text-emerald-400/50";
                  }

                  return (
                    <button
                      key={index}
                      disabled={feedback !== null}
                      onClick={() => handleOptionClick(index)}
                      className={`group w-full p-6 sm:p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between text-left ${cardStyle} ${feedback === null ? 'hover:-translate-y-1 active:scale-95' : ''}`}
                    >
                      <span className="text-lg font-bold"><MathText text={option} /></span>
                      {icon}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="max-w-2xl mx-auto space-y-12 text-center animate-fade-in">
              <div className="space-y-6">
                <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-amber-200 dark:shadow-none animate-float">
                  {percentage === 100 ? <Award size={48} /> : <Trophy size={48} />}
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Quiz Selesai!</h3>
                  <p className="text-slate-500 font-bold">{getReactionMessage()}</p>
                </div>
              </div>

              {/* Stats Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Skor Akhir</span>
                  <span className="text-3xl font-black text-indigo-600">{percentage}%</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Benar</span>
                  <span className="text-3xl font-black text-emerald-500">{score}/{questions.length}</span>
                </div>
              </div>

              {/* Correction List */}
              {userAnswers.some(ans => !ans.isCorrect) && (
                <div className="text-left space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
                    <MessageCircle size={16} /> Butuh Perbaikan
                  </h4>
                  <div className="space-y-3">
                    {userAnswers.filter(ans => !ans.isCorrect).map((ans, i) => {
                      const q = questions[ans.questionIndex];
                      return (
                        <div key={i} className="p-5 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl space-y-2">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300"><MathText text={q.text} /></p>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                            <span className="text-rose-500">Pilihanmu: <MathText text={q.options[ans.selectedOption]} /></span>
                            <span className="text-slate-300">|</span>
                            <span className="text-emerald-500">Jawaban Benar: <MathText text={q.options[q.correctIndex]} /></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Back Button */}
              <button
                onClick={onClose}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 translate-y-2"
              >
                Kembali ke Modul
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
