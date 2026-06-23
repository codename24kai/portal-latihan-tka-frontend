import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Send, HelpCircle, Heart, Star } from 'lucide-react';
import SurveyHeader from '@/komponen/siswa/Survei/HeaderSurvei';
import ConfirmDialog from '@/komponen/ui/DialogKonfirmasi';

export default function EksekusiSurveiSiswa() {
  const { surveiId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fromSimulasiId = location.state?.fromSimulasiId || null;

  const survey = useMemo(() => {
    return null;
  }, [surveiId]);

  const questions = survey?.questions || [];
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: value }
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  const handleNext = () => {
    if (isLast) {
      setShowSubmitDialog(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSelect = (val) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  const handleReflectiveChange = (e) => {
    const val = e.target.value;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  const handleConfirmSubmit = () => {
    // Save to localStorage so HasilSimulasiTka knows it has been completed
    localStorage.setItem(`survey_completed_${surveiId}`, 'true');
    setShowSubmitDialog(false);
    navigate(`/siswa/survei/${surveiId}/selesai`, { state: { fromSimulasiId } });
  };

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold">Survei tidak ditemukan.</p>
          <button onClick={() => navigate('/beranda')} className="mt-4 text-indigo-650 font-bold">Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  const isAnswered = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== '';

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <SurveyHeader
        title={survey.title}
        currentQuestion={currentIndex + 1}
        totalQuestions={totalQuestions}
      />

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto w-full space-y-8">
          
          {/* Question Indicator */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest italic">
              Pertanyaan {currentIndex + 1}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight italic">
              "{currentQuestion.text}"
            </h2>
          </div>

          {/* Render Options based on type */}
          <div className="mt-6">
            
            {/* LIKERT TYPE */}
            {currentQuestion.type === 'likert' && (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`p-5 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between group active:scale-98 ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:border-indigo-300'
                      }`}
                    >
                      <span>{opt.text}</span>
                      <Star size={18} className={isSelected ? 'text-white' : 'text-slate-300 group-hover:text-indigo-400'} fill={isSelected ? 'currentColor' : 'none'} />
                    </button>
                  );
                })}
              </div>
            )}

            {/* SINGLE CHOICE MC TYPE */}
            {currentQuestion.type === 'single_choice' && (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelect(opt.label)}
                      className={`p-5 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center gap-4 group active:scale-98 ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:border-indigo-300'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {opt.label}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* REFLECTIVE TEXT TYPE */}
            {currentQuestion.type === 'reflective' && (
              <div className="space-y-2">
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={handleReflectiveChange}
                  placeholder={currentQuestion.placeholder}
                  className="w-full h-48 p-5 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-400 dark:placeholder-slate-600"
                />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">
                  Tuliskan jawaban yang jujur dari hatimu sendiri 😊
                </p>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer Nav */}
      <footer className="h-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center shrink-0 shadow-2xl">
        <div className="max-w-3xl mx-auto w-full px-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirst}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              isFirst 
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ChevronLeft size={18} />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              !isAnswered
                ? 'bg-slate-150 text-slate-400 cursor-not-allowed shadow-none dark:bg-slate-800'
                : isLast
                  ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-orange-500/25'
                  : 'bg-indigo-650 text-white shadow-indigo-600/20'
            }`}
          >
            <span>{isLast ? 'Kirim Jawaban' : 'Selanjutnya'}</span>
            {isLast ? <Send size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </footer>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSubmitDialog}
        title="Kirim Jawaban Survei?"
        message="Terima kasih banyak atas ketulusanmu mengisi survei ini. Jawabanmu akan membantumu membuka menu dashboard kembali."
        confirmLabel="Ya, Kirim Sekarang"
        cancelLabel="Kembali Memeriksa"
        variant="success"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitDialog(false)}
      />
    </div>
  );
}
