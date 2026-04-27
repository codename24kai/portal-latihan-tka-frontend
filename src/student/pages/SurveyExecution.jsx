import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, HelpCircle } from 'lucide-react';
import mockSurveyDefinitions from '../../data/mockSurveys';
import SurveyHeader from '../components/Survey/SurveyHeader';
import SurveyOptionCard from '../components/Survey/SurveyOptionCard';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function SurveyExecution() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  
  // Find survey definition
  const survey = useMemo(() => 
    mockSurveyDefinitions.find(s => s.id === surveyId),
  [surveyId]);

  const questions = survey?.questions || [];
  const totalQuestions = questions.length;

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // Handlers
  const handleNext = () => {
    if (isLast) {
      setShowSubmitDialog(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleSelect = (label) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: label
    }));
    // Auto next after 300ms for better UX if desired, or manual
    // setTimeout(() => { if (!isLast) handleNext(); }, 300);
  };

  const handleConfirmSubmit = () => {
    // In a real app, send to API here
    console.log('Survey submitted:', answers);
    navigate(`/survey/${surveyId}/complete`);
  };

  if (!survey) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 font-bold">Survei tidak ditemukan.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-teal-600 font-bold">Kembali ke Beranda</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <SurveyHeader 
        title={survey.title} 
        currentQuestion={currentIndex + 1} 
        totalQuestions={totalQuestions} 
      />

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Question Header */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg text-[10px] font-black uppercase tracking-widest italic">
                  Pertanyaan {currentIndex + 1}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight italic">
                  "{currentQuestion.text}"
                </h2>
              </div>

              {/* Options List */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => (
                  <SurveyOptionCard
                    key={option.label}
                    label={option.label}
                    text={option.text}
                    isSelected={answers[currentQuestion.id] === option.label}
                    onSelect={() => handleSelect(option.label)}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="h-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center shrink-0 shadow-2xl">
        <div className="max-w-3xl mx-auto w-full px-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirst}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              isFirst 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-500 hover:text-teal-600 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ChevronLeft size={18} />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              !answers[currentQuestion.id]
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : isLast
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-teal-500/25'
                  : 'bg-teal-600 text-white shadow-teal-600/20'
            }`}
          >
            <span>{isLast ? 'Kirim Jawaban' : 'Selanjutnya'}</span>
            {isLast ? <Send size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </footer>

      {/* Submission Dialog */}
      <ConfirmDialog
        isOpen={showSubmitDialog}
        title="Kirim Jawaban Survei?"
        message="Terima kasih sudah memberikan jawaban yang jujur. Jawabanmu sangat berharga bagi kami."
        confirmLabel="Ya, Kirim Sekarang"
        cancelLabel="Cek Kembali"
        variant="success"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitDialog(false)}
      />
    </div>
  );
}
