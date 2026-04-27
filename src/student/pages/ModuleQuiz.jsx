import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import MathRenderer from '../../components/ui/MathRenderer';
import OptionCard from '../components/OptionCard';
import QuizResult from '../components/QuizResult';
import QuizGuideModal from '../components/QuizGuideModal';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ExamFallback from '../components/ExamFallback';

/**
 * ModuleQuiz Page — Distraction-Free Focus Mode
 * Enhanced with instant feedback animations and detailed question review.
 */
export default function ModuleQuiz() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [showGuide, setShowGuide] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({}); // { [index]: selectedOptionIndex }
  const [showResults, setShowResults] = useState(false);
  const [isFeedbackActive, setIsFeedbackActive] = useState(false);

  const handleStartQuiz = () => {
    setShowGuide(false);
    setStartTime(Date.now());
  };

  // Mock Question Data
  const questions = useMemo(() => {
    const allQuestions = {
      'in-1': [
        { text: 'Apa fungsi utama dari ide pokok dalam sebuah paragraf?', options: ['Menjelaskan detail', 'Menjadi inti pembahasan', 'Sebagai pelengkap', 'Penghias kalimat'], correctIndex: 1 },
        { text: 'Manakah yang termasuk kata baku?', options: ['Apotik', 'Apotek', 'Nasehat', 'Cuman'], correctIndex: 1 },
        { text: 'Antonim dari kata "Pintar" adalah...', options: ['Cerdas', 'Bodoh', 'Rajin', 'Malas'], correctIndex: 1 }
      ],
      'ma-1': [
        {
          text: 'Berapakah hasil dari $12 \\times 12$?',
          options: ['124', '140', '144', '154'],
          correctIndex: 2
        },
        {
          text: 'Jika $2x = 10$, maka nilai $x$ adalah...',
          options: ['2', '5', '8', '10'],
          correctIndex: 1
        },
        {
          text: 'Perhatikan gambar bangun datar di atas! Jika panjang sisi adalah 5cm, hitunglah luasnya.',
          imageUrl: 'https://placehold.co/600x300?text=Persegi+Sisi+5cm',
          options: ['$10 cm^2$', '$20 cm^2$', '$25 cm^2$', '$50 cm^2$'],
          correctIndex: 2
        }
      ],
      'default': [
        { text: 'Siapakah presiden pertama Indonesia?', options: ['Soeharto', 'B.J. Habibie', 'Soekarno', 'Gus Dur'], correctIndex: 2 },
        { text: 'Ibukota negara Indonesia adalah...', options: ['Bandung', 'Surabaya', 'Jakarta', 'Medan'], correctIndex: 2 }
      ]
    };
    if (moduleId === '1' || moduleId === '4') return allQuestions['in-1'];
    if (moduleId === '2' || moduleId === '5') return allQuestions['ma-1'];
    return allQuestions['default'];
  }, [moduleId]);

  const currentQuestion = questions?.[currentIndex];
  const selectedOption = answersMap?.[currentIndex] ?? null;

  const handleOptionSelect = (optionIndex) => {
    if (isFeedbackActive) return;

    setAnswersMap(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));

    // Trigger feedback pause
    setIsFeedbackActive(true);
    setTimeout(() => {
      setIsFeedbackActive(false);
      // Auto-advance if correct, or let them stay if wrong to review? 
      // User requested "Pause for 1-2 seconds", let's keep it manual navigation to review.
    }, 1500);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const scoreData = useMemo(() => {
    let correct = 0;
    const history = questions?.map((q, idx) => {
      const selected = answersMap?.[idx];
      const opts = Array.isArray(q?.options) ? q.options : Object.values(q?.options || {});
      const selectedText = (selected !== undefined && selected !== null) ? (opts[selected] || 'Pilihan tidak valid') : 'Tidak dijawab';
      const correctText = opts[q?.correctIndex] || 'Jawaban tidak diset';
      const isCorrect = selected === q?.correctIndex;
      if (isCorrect) correct++;
      return {
        questionText: q.text,
        questionImage: q.image || q.imageUrl,
        studentAnswer: selectedText,
        studentAnswerImage: opts[selected]?.image || opts[selected]?.imageUrl,
        correctAnswer: correctText,
        correctAnswerImage: opts[q?.correctIndex]?.image || opts[q?.correctIndex]?.imageUrl,
        isCorrect
      };
    });
    return { correct, total: questions.length, history };
  }, [questions, answersMap]);

  const percentage = Math.round((scoreData.correct / scoreData.total) * 100);

  if (showResults) {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // in seconds
    return (
      <QuizResult
        percentage={percentage}
        score={scoreData.correct}
        total={scoreData.total}
        history={scoreData.history}
        timeTaken={timeTaken}
        onBack={() => navigate('/modules')}
      />
    );
  }

  if (showGuide) {
    return <QuizGuideModal onStart={handleStartQuiz} />;
  }

  // Safety Gate: Loading or No questions
  if (!questions || questions.length === 0) {
    return <ExamFallback message="Belum ada soal tersedia untuk modul ini. Silakan hubungi admin untuk pembaruan materi." />;
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <header className="h-20 bg-white/80 dark:bg-slate-800/80 p-8 border-b" />
        <main className="flex-1 p-8 md:p-14 max-w-5xl mx-auto w-full">
          <LoadingSkeleton className="h-64 w-full rounded-[4rem]" />
        </main>
      </div>
    );
  }

  // Normalize options: Handles both array ["text"] and object {A: "text"}
  const normalizedOptions = Array.isArray(currentQuestion?.options) 
    ? currentQuestion.options.map((opt, idx) => {
        const label = ["A", "B", "C", "D"][idx];
        return typeof opt === 'object' ? { label, ...opt, index: idx } : { label, text: opt, index: idx };
      })
    : Object.entries(currentQuestion?.options || {}).map(([label, opt], idx) => {
        return typeof opt === 'object' ? { label, ...opt, index: idx } : { label, text: opt, index: idx };
      });

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col animate-fade-in relative overflow-hidden">
      {/* 1. FOCUS MODE HEADER */}
      <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700 px-6 md:px-12 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Kuis Modul</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">Materi #{moduleId}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/modules')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all group"
        >
          <X size={16} className="group-hover:rotate-90 transition-transform" />
          Keluar Kuis
        </button>
      </header>

      <main className="flex-1 overflow-y-auto w-full px-4 md:px-8 py-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <div className="max-w-4xl mx-auto w-full pb-10">
          <div className="space-y-8">
            {/* Progress Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Kemajuan Belajarmu</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white">
                    Soal {currentIndex + 1} <span className="text-slate-300 dark:text-slate-600 text-lg font-bold ml-1">/ {questions.length}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600 italic">
                    {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Branded Progress Bar */}
              <div className="h-4 w-full bg-white dark:bg-slate-800 rounded-full p-1 border border-slate-100 dark:border-slate-700 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-orange-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(20,184,166,0.3)] relative group"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col gap-8">
              <div className={`grid grid-cols-1 ${currentQuestion.imageUrl ? 'lg:grid-cols-2' : ''} gap-8 items-center`}>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    <Star fill="currentColor" size={12} className="animate-spin-slow" />
                    Poin Menunggumu!
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
                    <MathRenderer text={currentQuestion.text} />
                  </h3>
                </div>

                {currentQuestion.imageUrl && (
                  <div className="rounded-[1.5rem] overflow-hidden border-4 border-slate-50 dark:border-slate-700 shadow-xl mx-auto">
                    <img
                      src={currentQuestion.imageUrl}
                      alt="Soal"
                      className="w-full h-auto max-h-40 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {normalizedOptions?.map((option) => (
                  <OptionCard
                    key={option?.index}
                    label={option?.label}
                    text={option?.text}
                    image={option?.image || option?.imageUrl}
                    isSelected={selectedOption === option?.index}
                    onSelect={() => handleOptionSelect(option?.index)}
                    disabled={selectedOption !== null}
                    isCorrect={selectedOption !== null && option?.index === currentQuestion?.correctIndex}
                    isWrong={selectedOption === option?.index && option?.index !== currentQuestion?.correctIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 2. NAVIGATION FOOTER - FIXED */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 p-4 md:p-6 shrink-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            disabled={currentIndex === 0}
            onClick={handlePrevious}
            className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${currentIndex === 0
                ? 'text-slate-200 dark:text-slate-800 cursor-not-allowed'
                : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
          >
            <ArrowLeft size={20} />
            Kembali
          </button>

          <button
            disabled={selectedOption === null}
            onClick={handleNext}
            className={`flex items-center justify-center gap-3 px-12 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95 min-w-[280px] ${selectedOption === null
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30'
              }`}
          >
            {currentIndex === questions.length - 1 ? 'Selesaikan Kuis' : 'Lanjut ke Soal Berikutnya'}
            <ArrowRight size={20} />
          </button>
        </div>
      </footer>

      {/* Decorative Floating Star */}
      <div className="fixed bottom-10 right-10 w-32 h-32 bg-teal-400/10 dark:bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-20 left-10 w-48 h-48 bg-orange-400/10 dark:bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

// Add CSS module or simple Tailwind additions for extra flair
const Star = ({ size = 20, fill = "none", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
