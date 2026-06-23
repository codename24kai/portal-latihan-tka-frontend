import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  Clock,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  AlertCircle,
  Settings,
  ShieldCheck,
  ChevronRight,
  Zap,
  Calculator,
  HelpCircle,
  Shuffle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SUBJECTS } from '@/konstanta/mataPelajaran';
import api from '@/utilitas/api';
import Dropdown from '@/komponen/ui/Dropdown';
import Badge from '@/komponen/ui/Badge';
import DataTable from '@/komponen/ui/TabelData';
import ConfirmDialog from '@/komponen/ui/DialogKonfirmasi';
import MathRenderer from '@/komponen/ui/RendererMatematika';
import GuruQuizBuilder from '@/komponen/guru/ManajemenModul/PembuatKuisGuru';
import GuruVisualMathEditor from '@/komponen/guru/EditorMatematikaVisualGuru';

export default function GuruAddQuiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const assignedClass = localStorage.getItem('assignedClass') ?? '6A';

  // 1. CONFIG STATE
  const [formData, setFormData] = useState({
    title: '',
    moduleId: '',
    subject: 'Matematika',
    duration: '45',
    startDate: '',
    endDate: '',
    questionCount: '15',
    selectionMethod: 'auto' // 'auto' | 'bank_manual' | 'manual'
  });

  // Confirmed config
  const [confirmedConfig, setConfirmedConfig] = useState({
    subject: 'Matematika',
    questionCount: 15,
    duration: 45,
    selectionMethod: 'auto'
  });

  // 2. QUIZ DATA (For Manual Mode)
  const [quizData, setQuizData] = useState({
    title: '',
    prerequisite: 'download',
    questions: []
  });

  // Math Editor State
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [mathTarget, setMathTarget] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [selectedBankQuestionIds, setSelectedBankQuestionIds] = useState([]);
  const [bankSearch, setBankSearch] = useState('');
  const [modules, setModules] = useState([]);

  const openMathEditor = (qIndex, type, oIndex = null) => {
    setMathTarget({ qIndex, type, oIndex });
    setIsMathOpen(true);
  };

  const handleInsertMath = (latex) => {
    if (!mathTarget) return;
    const formatted = `$${latex}$`;
    const { qIndex, type, oIndex } = mathTarget;

    const newQuestions = [...quizData.questions];
    if (type === 'text') {
      newQuestions[qIndex].text += formatted;
    } else if (type === 'option') {
      newQuestions[qIndex].options[oIndex].text += formatted;
    }
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleApplyConfig = () => {
    const qCount = parseInt(formData.questionCount) || 0;
    const dur = parseInt(formData.duration) || 0;

    if (qCount < 1) {
      toast.error('Jumlah soal minimal 1!');
      return;
    }
    if (dur < 5) {
      toast.error('Durasi minimal 5 menit!');
      return;
    }

    setConfirmedConfig({
      subject: formData.subject,
      questionCount: qCount,
      duration: dur,
      selectionMethod: formData.selectionMethod
    });

    // Reset selected questions on config change
    setSelectedBankQuestionIds([]);
    toast.success('Konfigurasi diterapkan!');
  };

  // Reset selection when confirmed subject or selection method changes
  useEffect(() => {
    setSelectedBankQuestionIds([]);
  }, [confirmedConfig.subject, confirmedConfig.selectionMethod]);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const res = await api.get('/guru/modul');
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setModules(list);
        setFormData(prev => ({
          ...prev,
          moduleId: prev.moduleId || String(list[0]?.id ?? '')
        }));
      } catch (err) {
        console.error('Gagal memuat modul guru', err);
      }
    };
    loadModules();
  }, []);

  const availableQuestions = useMemo(() => {
    return [];
  }, [confirmedConfig.subject]);

  const filteredBankQuestions = useMemo(() => {
    return availableQuestions.filter(q => {
      return (q.text ?? '').toLowerCase().includes(bankSearch.toLowerCase());
    });
  }, [availableQuestions, bankSearch]);

  // Auto Randomize Handler
  const handleAutoRandomize = () => {
    const targetCount = confirmedConfig.questionCount;
    if (!targetCount || targetCount <= 0) {
      toast.error('Terapkan konfigurasi terlebih dahulu!');
      return;
    }

    if (availableQuestions.length < targetCount) {
      toast.error(`Stok Bank Soal tidak mencukupi! Hanya tersedia ${availableQuestions.length} soal.`);
      return;
    }

    // Shuffle and pick targetCount questions
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, targetCount).map(q => q.id);
    setSelectedBankQuestionIds(selected);
    toast.success(`Berhasil mengacak ${targetCount} soal dari Bank Soal.`);
  };

  const currentTotalQuestions = useMemo(() => {
    if (confirmedConfig.selectionMethod === 'manual') {
      return quizData.questions.length;
    }
    return selectedBankQuestionIds.length;
  }, [confirmedConfig.selectionMethod, selectedBankQuestionIds, quizData.questions]);

  const targetCount = confirmedConfig.questionCount;
  const isValid = confirmedConfig.selectionMethod === 'manual' 
    ? quizData.questions.length > 0
    : currentTotalQuestions === targetCount;

  const isOver = confirmedConfig.selectionMethod !== 'manual' && currentTotalQuestions > targetCount;

  const handleSave = (status) => {
    if (!formData.title) return toast.error('Judul kuis harus diisi!');
    if (!isValid) {
      return toast.error('Jumlah soal belum sesuai dengan target!');
    }
    
    if (status === 'active') {
      setIsConfirmOpen(true);
      return;
    }
    executeSave('draft');
  };

  const buildQuizQuestions = async () => {
    if (confirmedConfig.selectionMethod === 'manual') {
      return quizData.questions.map(q => ({
        text: q.text,
        options: (q.options || []).map(opt => ({ text: typeof opt === 'string' ? opt : opt.text })),
        answer: q.answer ?? 0,
        weight: 10
      }));
    }

    const ids = selectedBankQuestionIds;
    if (!ids.length) return [];

    const details = await Promise.all(
      ids.map(async (questionId) => {
        const res = await api.get(`/soal/${questionId}`);
        const data = res.data?.data ?? res.data;
        return {
          text: data.isi_soal || data.text || '',
          options: (data.opsi_jawaban || data.options || []).map(opt => ({
            text: opt.teks_opsi || opt.text || opt.nama_opsi || ''
          })),
          answer: (data.opsi_jawaban || data.options || []).findIndex(opt => opt.is_benar || opt.benar || opt.correct) ?? 0,
          weight: 10
        };
      })
    );

    return details.filter(item => item.text);
  };

  const executeSave = async (status) => {
    try {
      if (!formData.moduleId) {
        toast.error('Pilih modul terlebih dahulu!');
        return;
      }

      const questions = await buildQuizQuestions();
      const payload = {
        modul_id: Number(formData.moduleId),
        judul: formData.title,
        nilai_minimum: 70,
        questions
      };

      if (isEdit) {
        await api.put(`/guru/kuis/${id}`, {
          judul: formData.title,
          nilai_minimum: 70
        });
      } else {
        await api.post('/guru/kuis', payload);
      }

      toast.success(`Kuis berhasil disimpan sebagai ${status === 'draft' ? 'Draft' : 'Rilisan'}`);
      setIsConfirmOpen(false);
      setTimeout(() => navigate('/guru/quizzes'), 1500);
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan kuis');
    }
  };

  const toggleBankQuestion = (id) => {
    setSelectedBankQuestionIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Get details of randomized questions
  const randomizedQuestionsList = useMemo(() => {
    return availableQuestions.filter(q => selectedBankQuestionIds.includes(q.id));
  }, [availableQuestions, selectedBankQuestionIds]);

  return (
    <div className="animate-fade-in space-y-8 pb-32 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/guru/quizzes')} className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-teal-600 shadow-sm transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
              {isEdit ? 'Edit' : 'Create'} <span className="text-teal-600">Class</span> Quiz
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {isEdit ? `Memperbarui kuis ID: #${id}` : `Latihan akademik khusus Kelas ${assignedClass}`}
            </p>
          </div>
        </div>
      </div>

      {/* VERTICAL FORM FLOW */}
      <div className="space-y-8">
        
        {/* STEP 1: INFORMASI DASAR */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Settings size={60} />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-teal-500 tracking-wider">Langkah 1 dari 3</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Informasi Dasar & Konfigurasi</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Kuis / Latihan</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Kuis Harian Matematika"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-teal-500/10 dark:text-white transition-all"
                />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modul Sumber</label>
              <Dropdown
                value={formData.moduleId}
                onChange={(val) => setFormData({ ...formData, moduleId: val })}
                options={modules.map(mod => ({ value: String(mod.id), label: mod.judul }))}
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mata Pelajaran</label>
              <Dropdown
                value={formData.subject}
                onChange={(val) => setFormData({ ...formData, subject: val })}
                options={SUBJECTS.filter(s => s.category === 'Akademik').map(s => ({ value: s.name, label: s.name }))}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Soal</label>
                <input
                  type="number"
                  value={formData.questionCount}
                  onChange={(e) => setFormData({ ...formData, questionCount: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black outline-none dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-400">Durasi (m)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Buka Akses</label>
              <input type="datetime-local" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold outline-none dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tutup Akses</label>
              <input type="datetime-local" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold outline-none dark:text-white" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleApplyConfig}
              className="py-4 px-8 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-teal-600/20 active:scale-95 group"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em]">Terapkan Konfigurasi</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* STEP 2: METODE PENGAMBILAN SOAL */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">Langkah 2 dari 3</span>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Metode Pengambilan Soal</h3>
              </div>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-start md:self-auto">
              {[
                { id: 'auto', label: 'Bank (Otomatis)' },
                { id: 'bank_manual', label: 'Bank (Manual)' },
                { id: 'manual', label: 'Buat Sendiri' }
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setFormData({ ...formData, selectionMethod: method.id })}
                  className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.selectionMethod === method.id
                    ? 'bg-teal-600 text-white shadow-xl shadow-teal-600/20'
                    : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 3: DETAIL / DAFTAR SOAL */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm min-h-[400px]">
          <div className="flex items-center gap-4 border-b border-slate-50 dark:border-slate-700/50 pb-6">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Langkah 3 dari 3</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Daftar & Pemilihan Soal</h3>
            </div>
          </div>

          {formData.selectionMethod === 'auto' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Pengacakan Soal Otomatis</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Sistem akan memilih secara acak dari total {availableQuestions.length} stok soal {confirmedConfig.subject}.</p>
                </div>
                <button
                  onClick={handleAutoRandomize}
                  className="px-6 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-teal-600/10 text-xs font-black uppercase tracking-wider"
                >
                  <Shuffle size={16} /> Acak Soal Otomatis
                </button>
              </div>

              {/* VALIDATION STATUS */}
              <div className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${isValid ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' :
                  isOver ? 'bg-rose-50/50 border-rose-100 text-rose-600' :
                    'bg-amber-50/50 border-amber-100 text-amber-600'
                }`}>
                <div className="flex items-center gap-4">
                  {isValid ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                  <span className="text-sm font-black uppercase tracking-tight">
                    {isValid ? 'Acak otomatis berhasil & jumlah sesuai!' :
                      isOver ? `Terlalu banyak (${currentTotalQuestions}/${targetCount})` :
                        `Soal belum diacak atau belum cukup (${currentTotalQuestions}/${targetCount})`}
                  </span>
                </div>
                <div className="text-[10px] font-black uppercase opacity-60 italic">Target: {targetCount} Butir</div>
              </div>

              {randomizedQuestionsList.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pratinjau Soal Hasil Acakan:</h5>
                  <DataTable
                    headers={[{ label: 'No', align: 'center' }, { label: 'Deskripsi Soal' }]}
                    data={randomizedQuestionsList}
                    rowsPerPage={5}
                    renderRow={(q, idx) => (
                      <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 text-center text-xs font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-4 text-xs font-bold text-slate-700"><MathRenderer latex={q.text} /></td>
                      </tr>
                    )}
                  />
                </div>
              )}
            </div>
          )}

          {formData.selectionMethod === 'bank_manual' && (
            <div className="space-y-6 animate-fade-in">
              <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${isValid ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' : 'bg-amber-50/50 border-amber-100 text-amber-600'
                }`}>
                <span className="text-xs font-black uppercase">Pilih Manual Soal ({selectedBankQuestionIds.length}/{targetCount})</span>
              </div>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="text" placeholder="Cari soal..." value={bankSearch} onChange={e => setBankSearch(e.target.value)} className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none" />
                </div>
              </div>

              <DataTable
                headers={[
                  { label: 'Pilih', align: 'center' },
                  { label: 'Deskripsi Soal' },
                  { label: 'Status Penggunaan', align: 'center' }
                ]}
                data={filteredBankQuestions}
                rowsPerPage={5}
                renderRow={q => {
                  const isSelected = selectedBankQuestionIds.includes(q.id);
                  return (
                    <tr key={q.id} onClick={() => toggleBankQuestion(q.id)} className={`cursor-pointer transition-colors ${isSelected ? 'bg-teal-50/30' : 'hover:bg-slate-50'}`}>
                      <td className="py-4 text-center">
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-200'}`}>
                          {isSelected && <CheckCircle2 size={12} />}
                        </div>
                      </td>
                      <td className="py-4 text-xs font-bold text-slate-700"><MathRenderer latex={q.text} /></td>
                      <td className="py-4 text-center">
                        <Badge 
                          text={q.usedIn ? 'Sudah Pernah Digunakan' : 'Belum Pernah Digunakan'} 
                          variant={q.usedIn ? 'Neutral' : 'Success'} 
                        />
                      </td>
                    </tr>
                  );
                }}
              />
            </div>
          )}

          {formData.selectionMethod === 'manual' && (
            <div className="animate-fade-in">
              <GuruQuizBuilder quizData={quizData} setQuizData={setQuizData} openMathEditor={openMathEditor} hideHeader={true} />
            </div>
          )}
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="w-full">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-t-4 border-teal-500 relative overflow-hidden">
          <div className="flex flex-wrap gap-12 relative z-10">
            <div>
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Total Soal</span>
              <div className="flex items-end gap-2 text-white">
                <span className="text-5xl font-black italic leading-none">{currentTotalQuestions}</span>
                <span className="text-[10px] font-black uppercase text-slate-500 mb-1">Butir</span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Mata Pelajaran</span>
              <Badge text={formData.subject} variant="Info" className="px-6 py-2" />
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Scope Kelas</span>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-teal-500" />
                <span className="text-sm font-black text-white italic">Kelas {assignedClass}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            <button onClick={() => navigate('/guru/quizzes')} className="text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest px-6 transition-all">Batal</button>
            <div className="flex gap-4 w-full md:w-auto">
              <button onClick={() => handleSave('draft')} className="flex-1 md:flex-none px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all border border-white/5">Draft</button>
              <button
                disabled={!isValid || !formData.moduleId}
                onClick={() => handleSave('active')}
                className={`flex-1 md:flex-none px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all ${isValid
                    ? 'bg-white text-slate-900 hover:bg-slate-50 active:scale-95'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                  }`}
              >
                {isEdit ? 'Perbarui Kuis' : 'Simpan & Rilis'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        variant="warning"
        title="Publikasikan Kuis?"
        message="Siswa di kelas Anda akan dapat mengerjakan kuis ini sesuai jadwal. Pastikan semua soal sudah benar."
        confirmLabel="Ya, Rilis Sekarang"
        cancelLabel="Cek Kembali"
        onConfirm={() => executeSave('active')}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <GuruVisualMathEditor isOpen={isMathOpen} onCancel={() => setIsMathOpen(false)} onInsert={handleInsertMath} />
    </div>
  );
}
