import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, ShieldCheck, Info } from 'lucide-react';
import toast from 'react-hot-toast';

// Constants
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/constants/questions';
import { SUBJECTS } from '@/constants/subjects';

// Sub Components
import QuestionStemEditor from '../components/QuestionBuilder/QuestionStemEditor';
import QuestionMetaPanel from '../components/QuestionBuilder/QuestionMetaPanel';
import ExplanationPanel from '../components/QuestionBuilder/ExplanationPanel';
import QuestionPreview from '../components/QuestionBuilder/QuestionPreview';
import VisualMathEditor from '@/admin/components/VisualMathEditor';
import Badge from '@/components/ui/Badge';

// Strategies
import SingleChoiceEditor from '../components/QuestionBuilder/strategies/SingleChoiceEditor';
import MultiChoiceEditor from '../components/QuestionBuilder/strategies/MultiChoiceEditor';
import TrueFalseEditor from '../components/QuestionBuilder/strategies/TrueFalseEditor';
import EssayEditor from '../components/QuestionBuilder/strategies/EssayEditor';

// Mock Data
import mockQuestionBankV2 from '@/data/mockQuestionsV2';

const STRATEGY_MAP = {
  [QUESTION_TYPES.SINGLE_CHOICE]: SingleChoiceEditor,
  [QUESTION_TYPES.MULTI_CHOICE]:  MultiChoiceEditor,
  [QUESTION_TYPES.TRUE_FALSE]:    TrueFalseEditor,
  [QUESTION_TYPES.ESSAY]:         EssayEditor,
};

/**
 * Universal Question Editor V2
 * Dispatcher for multiple question types using Strategy Pattern.
 */
export default function AddQuestion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    question_type: QUESTION_TYPES.SINGLE_CHOICE,
    category: 'akademik',
    subject: SUBJECTS[0].name,
    difficulty: 'medium',
    cognitive_level: 'C1',
    payload: {
      stem: '',
      stem_image: null,
      options: [
        { key: 'A', text: '', image: null },
        { key: 'B', text: '', image: null },
        { key: 'C', text: '', image: null },
        { key: 'D', text: '', image: null }
      ],
      correct_keys: ['A']
    },
    explanation: '',
    max_points: 1,
    tags: []
  });

  // Math Editor States
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // Load data if edit mode
  useEffect(() => {
    if (isEdit) {
      const question = mockQuestionBankV2.find(q => q.id === parseInt(id));
      if (question) {
        setFormData({ ...question });
      } else {
        toast.error('Data soal tidak ditemukan');
        navigate('/admin/question-bank');
      }
    }
  }, [id, isEdit, navigate]);

  // Handle changes
  const handleMetaChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset payload structure when type changes
      if (field === 'question_type') {
        if (value === QUESTION_TYPES.MULTI_CHOICE) {
          newData.payload = { 
            stem: prev.payload.stem, 
            stem_image: prev.payload.stem_image,
            options: prev.payload.options || [], 
            correct_keys: [],
            penalty_for_wrong: false 
          };
          newData.max_points = 3;
        } else if (value === QUESTION_TYPES.TRUE_FALSE) {
          newData.payload = { 
            stem: prev.payload.stem, 
            stem_image: prev.payload.stem_image,
            correct_value: true 
          };
          newData.max_points = 1;
        } else if (value === QUESTION_TYPES.ESSAY) {
          newData.payload = { 
            stem: prev.payload.stem, 
            stem_image: prev.payload.stem_image,
            word_limit: 500,
            rubric: [{ criterion: '', max_points: '' }] 
          };
          newData.max_points = 5;
        } else {
          newData.payload = { 
            stem: prev.payload.stem, 
            stem_image: prev.payload.stem_image,
            options: [
              { key: 'A', text: '', image: null },
              { key: 'B', text: '', image: null },
              { key: 'C', text: '', image: null },
              { key: 'D', text: '', image: null }
            ], 
            correct_keys: ['A'] 
          };
          newData.max_points = 1;
        }
      }
      return newData;
    });
  };

  const handlePayloadChange = (newPayload) => {
    setFormData(prev => ({ ...prev, payload: newPayload }));
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.payload.stem) {
      toast.error('Teks pertanyaan harus diisi!');
      return;
    }
    toast.success(isEdit ? 'Soal berhasil diperbarui' : 'Soal berhasil ditambahkan ke Bank Soal');
    setTimeout(() => navigate('/admin/question-bank'), 1500);
  };

  const openMathEditor = (field) => {
    setActiveField(field);
    setIsMathOpen(true);
  };

  const handleInsertMath = (latex) => {
    const formatted = `$${latex}$`;
    if (activeField === 'stem') {
      handlePayloadChange({ ...formData.payload, stem: (formData.payload.stem || '') + formatted });
    } else {
      // Find option and update
      const newOptions = [...(formData.payload.options || [])];
      const optIdx = newOptions.findIndex(o => o.key === activeField);
      if (optIdx !== -1) {
        newOptions[optIdx].text = (newOptions[optIdx].text || '') + formatted;
        handlePayloadChange({ ...formData.payload, options: newOptions });
      }
    }
  };

  const StrategyEditor = STRATEGY_MAP[formData.question_type];

  return (
    <div className="animate-fade-in space-y-8 pb-32">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/question-bank')}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {isEdit ? 'Update Butir Soal' : 'Kreator Bank Soal V2'}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Universal Builder: {formData.question_type.replace('_', ' ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: CONTENT & TYPE-SPECIFIC EDITOR */}
        <div className="lg:col-span-2 space-y-8">
          <QuestionStemEditor 
            stem={formData.payload.stem} 
            image={formData.payload.stem_image} 
            onChange={(field, val) => handlePayloadChange({ ...formData.payload, [field]: val })}
            onOpenMath={openMathEditor}
          />

          {StrategyEditor && (
            <StrategyEditor 
              payload={formData.payload} 
              onChange={handlePayloadChange} 
              onOpenMath={openMathEditor}
            />
          )}

          <QuestionPreview data={formData} />
        </div>

        {/* RIGHT: METADATA & EXPLANATION */}
        <div className="lg:col-span-1 space-y-8">
          <QuestionMetaPanel data={formData} onChange={handleMetaChange} />
          <ExplanationPanel 
            value={formData.explanation} 
            onChange={handleFieldChange} 
          />
          
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 space-y-4 shadow-sm">
             <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-indigo-500" />
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Skor Maksimal</h4>
             </div>
             <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.max_points}
                  onChange={e => handleFieldChange('max_points', parseFloat(e.target.value) || 0)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xl font-black text-indigo-600 outline-none"
                />
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-tight w-24">
                  Point dasar untuk soal ini
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="mt-12 w-full">
         <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-xl border-t-4 border-indigo-500 rounded-[2.5rem] px-8 md:px-12 py-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-14">
               <div className="flex flex-col items-center md:items-start min-w-[100px]">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 shadow-sm">Target Simpan</span>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                     <span className="text-xl font-black text-white italic tracking-tighter leading-none uppercase">Bank Soal V2</span>
                  </div>
               </div>

               <div className="hidden sm:flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Mata Pelajaran</span>
                  <Badge text={formData.subject} variant="Info" className="px-5 py-1" />
               </div>

               <div className="hidden lg:flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Kualitas</span>
                  <div className="flex items-center gap-2">
                    <Badge text={formData.difficulty} variant={DIFFICULTY_LEVELS.find(d => d.value === formData.difficulty)?.variant || 'Neutral'} />
                    <Badge text={formData.cognitive_level} variant="Neutral" />
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
                <button 
                  onClick={() => navigate('/admin/question-bank')}
                  className="px-6 py-4 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors mr-2 md:mr-6"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-white text-slate-900 px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10"
                >
                  {isEdit ? 'Perbarui Soal' : 'Simpan ke Bank V2'}
                </button>
            </div>
         </div>
      </div>

      <VisualMathEditor
        isOpen={isMathOpen}
        onCancel={() => setIsMathOpen(false)}
        onInsert={handleInsertMath}
      />
    </div>
  );
}
