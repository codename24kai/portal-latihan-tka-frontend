import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Info, Layers, FileText, Settings, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utilitas/api';

// Constants
import { QUESTION_TYPES } from '@/konstanta/soal';
import { SUBJECTS } from '@/konstanta/mataPelajaran';

// Sub Components
import QuestionStemEditor from '@/komponen/admin/PembuatSoal/EditorBatangSoal';
import QuestionMetaPanel from '@/komponen/admin/PembuatSoal/PanelMetaSoal';
import ExplanationPanel from '@/komponen/admin/PembuatSoal/PanelPenjelasan';
import QuestionPreview from '@/komponen/admin/PembuatSoal/PratinjauSoal';
import VisualMathEditor from '@/komponen/admin/EditorMatematikaVisual';
import Badge from '@/komponen/ui/Badge';
import { previewSoalPdfAdmin, createSoalAdmin } from '@/utilitas/apiAdmin';

// Strategies
import SingleChoiceEditor from '@/komponen/admin/PembuatSoal/strategi/EditorPilihanTunggal';
import MultiChoiceEditor from '@/komponen/admin/PembuatSoal/strategi/EditorPilihanGanda';
import TrueFalseEditor from '@/komponen/admin/PembuatSoal/strategi/EditorBenarSalah';

// Mock Data
import mockQuestionBankV2 from '@/data/mockSoalV2';

const STRATEGY_MAP = {
  [QUESTION_TYPES.SINGLE_CHOICE]: SingleChoiceEditor,
  [QUESTION_TYPES.MULTI_CHOICE]: MultiChoiceEditor,
  [QUESTION_TYPES.TRUE_FALSE]: TrueFalseEditor,
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
  const [pdfFile, setPdfFile] = useState(null);
  const [mapelOptions, setMapelOptions] = useState([]);

  // Load data if edit mode
  useEffect(() => {
    api.get('/mata-pelajaran')
      .then((res) => {
        const list = (res.data.data || []).map((item) => ({
          id: item.id_mapel || item.id,
          name: item.nama_mapel || item.nama || item.judul || 'Mata Pelajaran'
        }));
        setMapelOptions(list);
        if (!isEdit && list.length) {
          setFormData(prev => ({ ...prev, subject: list[0].name }));
        }
      })
      .catch(() => {});

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
    const selectedMapel = mapelOptions.find((m) => m.name === formData.subject) || mapelOptions[0];
    const opsi = formData.question_type === QUESTION_TYPES.TRUE_FALSE
      ? (formData.payload.statements || []).map((stmt, idx) => ({
          label: String.fromCharCode(65 + idx),
          teks_opsi: stmt.text,
          is_benar: !!stmt.correct_answer,
          urutan: idx + 1
        }))
      : (formData.payload.options || []).map((opt, idx) => ({
          label: opt.key || String.fromCharCode(65 + idx),
          teks_opsi: opt.text,
          is_benar: (formData.payload.correct_keys || []).includes(opt.key),
          urutan: idx + 1
        }));

    const payload = {
      mapel_id: selectedMapel?.id,
      jenis_soal: formData.question_type === QUESTION_TYPES.TRUE_FALSE
        ? 'benar_salah'
        : formData.question_type === QUESTION_TYPES.MULTI_CHOICE
          ? 'pilihan_ganda_kompleks'
          : 'pilihan_ganda',
      isi_soal: formData.payload.stem,
      pembahasan_text: formData.explanation,
      status: 'aktif',
      batas_penggunaan_simulasi: Math.max(1, Math.min(5, formData.max_points || 1)),
      opsi_jawaban: opsi,
    };

    createSoalAdmin(payload)
      .then(() => {
        toast.success(isEdit ? 'Soal berhasil diperbarui' : 'Soal berhasil ditambahkan ke Bank Soal');
        setTimeout(() => navigate('/admin/bank-soal'), 1200);
      })
      .catch(() => {
        toast.error('Gagal menyimpan soal');
      });
  };

  const handleImportPdf = async () => {
    if (!pdfFile) {
      toast.error('Pilih file PDF terlebih dahulu');
      return;
    }
    try {
      const result = await previewSoalPdfAdmin(pdfFile);
      const question = result?.data?.questions?.[0];
      if (!question) {
        toast.error('Tidak ada soal yang berhasil dibaca dari PDF');
        return;
      }

      const mappedType = question.detected_type === 'true_false'
        ? QUESTION_TYPES.TRUE_FALSE
        : question.detected_type === 'multi_choice'
          ? QUESTION_TYPES.MULTI_CHOICE
          : QUESTION_TYPES.SINGLE_CHOICE;

      setFormData(prev => {
        if (mappedType === QUESTION_TYPES.TRUE_FALSE) {
          return {
            ...prev,
            question_type: mappedType,
            payload: {
              stem: question.stem || prev.payload.stem,
              stem_image: prev.payload.stem_image,
              statements: [
                {
                  id: 's1',
                  text: question.stem || prev.payload.stem || '',
                  correct_answer: (question.detected_answers || []).length > 0
                }
              ]
            }
          };
        }

        const importedOptions = (question.options || []).length > 0
          ? question.options.map((opt, idx) => ({
              key: opt.key || String.fromCharCode(65 + idx),
              text: opt.text || '',
              image: null
            }))
          : [
              { key: 'A', text: '', image: null },
              { key: 'B', text: '', image: null },
              { key: 'C', text: '', image: null },
              { key: 'D', text: '', image: null }
            ];

        return {
          ...prev,
          question_type: mappedType,
          payload: {
            stem: question.stem || prev.payload.stem,
            stem_image: prev.payload.stem_image,
            options: importedOptions,
            correct_keys: (question.detected_answers || []).length > 0
              ? question.detected_answers
              : ['A']
          }
        };
      });

      toast.success(`PDF terbaca, ${result?.data?.count || 0} soal terdeteksi`);
    } catch (error) {
      toast.error('Gagal membaca PDF');
    }
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
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-rose-500 tracking-wider">Import PDF</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Deteksi Soal Otomatis</h3>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
            />
            <button
              onClick={handleImportPdf}
              className="px-5 py-3 rounded-2xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest"
            >
              Preview PDF
            </button>
          </div>
        </div>

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
