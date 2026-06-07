import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, ShieldCheck, Info, Layers, FileText, Settings, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

// Constants
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/konstanta/soal';
import { SUBJECTS } from '@/konstanta/mataPelajaran';

// Sub Components
import QuestionStemEditor from '@/komponen/admin/PembuatSoal/EditorBatangSoal';
import QuestionMetaPanel from '@/komponen/admin/PembuatSoal/PanelMetaSoal';
import ExplanationPanel from '@/komponen/admin/PembuatSoal/PanelPenjelasan';
import QuestionPreview from '@/komponen/admin/PembuatSoal/PratinjauSoal';
import VisualMathEditor from '@/komponen/admin/EditorMatematikaVisual';
import Badge from '@/komponen/ui/Badge';

// Strategies
import SingleChoiceEditor from '@/komponen/admin/PembuatSoal/strategi/EditorPilihanTunggal';
import MultiChoiceEditor from '@/komponen/admin/PembuatSoal/strategi/EditorPilihanGanda';
import TrueFalseEditor from '@/komponen/admin/PembuatSoal/strategi/EditorBenarSalah';
import EssayEditor from '@/komponen/admin/PembuatSoal/strategi/EditorEsai';

// Mock Data
import mockQuestionBankV2 from '@/data/mockSoalV2';

const STRATEGY_MAP = {
  [QUESTION_TYPES.SINGLE_CHOICE]: SingleChoiceEditor,
  [QUESTION_TYPES.MULTI_CHOICE]: MultiChoiceEditor,
  [QUESTION_TYPES.TRUE_FALSE]: TrueFalseEditor,
  [QUESTION_TYPES.ESSAY]: EssayEditor,
};

/**
 * Universal Question Editor V2
 * Dispatcher for multiple question types using Strategy Pattern.
 * Refactored to stack panels vertically.
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
        navigate('/admin/bank-soal');
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
            statements: [
              { id: 's1', text: '', correct_answer: true },
              { id: 's2', text: '', correct_answer: false },
            ]
          };
          newData.max_points = 2;
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
    setTimeout(() => navigate('/admin/bank-soal'), 1500);
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
    <div className="animate-fade-in space-y-8 pb-32 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/bank-soal')}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
            {isEdit ? 'Update' : 'Buat'} <span className="text-indigo-600">Butir Soal</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Universal Builder: {formData.question_type.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* VERTICAL FORM FLOW */}
      <div className="space-y-8">

        {/* CARD 1: METADATA PANEL */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-indigo-500 tracking-wider">Langkah 1 dari 4</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Metadata Soal</h3>
            </div>
          </div>

          <QuestionMetaPanel data={formData} onChange={handleMetaChange} />

          {/* Max Points in Meta Panel */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-indigo-500" />
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Skor Maksimal</h4>
            </div>
            <div className="flex items-center gap-4 max-w-md">
              <input
                type="number"
                step="0.1"
                value={formData.max_points}
                onChange={e => handleFieldChange('max_points', parseFloat(e.target.value) || 0)}
                className="w-32 px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xl font-black text-indigo-600 outline-none"
              />
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-tight">
                Poin dasar untuk soal ini yang digunakan sebagai bobot penilaian.
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: KONTEN & INPUT SOAL */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">Langkah 2 dari 4</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Batang Soal & Opsi Jawaban</h3>
            </div>
          </div>

          <QuestionStemEditor
            stem={formData.payload.stem}
            image={formData.payload.stem_image}
            onChange={(field, val) => handlePayloadChange({ ...formData.payload, [field]: val })}
            onOpenMath={openMathEditor}
          />

          {StrategyEditor && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50">
              <StrategyEditor
                payload={formData.payload}
                onChange={handlePayloadChange}
                onOpenMath={openMathEditor}
              />
            </div>
          )}
        </div>

        {/* CARD 3: PENJELASAN SOAL */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Langkah 3 dari 4</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Penjelasan & Pembahasan</h3>
            </div>
          </div>

          <ExplanationPanel
            value={formData.explanation}
            onChange={handleFieldChange}
          />
        </div>

        {/* CARD 4: PRATINJAU SOAL */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-purple-500 tracking-wider">Langkah 4 dari 4</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Pratinjau Hasil Akhir</h3>
            </div>
          </div>

          <QuestionPreview data={formData} />
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="w-full">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-t-4 border-indigo-500 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-14">
            <div className="flex flex-col items-center md:items-start min-w-[100px]">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 shadow-sm">Target Simpan</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-xl font-black text-white italic tracking-tighter leading-none uppercase">Bank Soal</span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Mata Pelajaran</span>
              <Badge text={formData.subject} variant="Info" className="px-5 py-1" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
            <button
              onClick={() => navigate('/admin/bank-soal')}
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
