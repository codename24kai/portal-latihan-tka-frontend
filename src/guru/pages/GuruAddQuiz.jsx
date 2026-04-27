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
  Calculator
} from 'lucide-react';
import toast from 'react-hot-toast';
import { mockQuestionBank } from '@/data/mockQuestions';
import { SUBJECTS } from '@/constants/subjects';
import Dropdown from '@/components/ui/Dropdown';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import MathRenderer from '@/components/ui/MathRenderer';
import GuruQuizBuilder from '../components/ModuleManagement/GuruQuizBuilder';
import GuruVisualMathEditor from '../components/GuruVisualMathEditor';

export default function GuruAddQuiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const assignedClass = localStorage.getItem('assignedClass') ?? '6A';

  // 1. CONFIG STATE
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Matematika',
    duration: '45',
    startDate: '',
    endDate: '',
    questionCount: '15',
    selectionMethod: 'manual' // 'auto' (Bank) | 'manual' (Create Own)
  });

  // 2. QUIZ DATA (For Manual Mode)
  const [quizData, setQuizData] = useState({
    title: '',
    prerequisite: 'download',
    questions: []
  });

  // 3. AUTO DISTRIBUTION (For Auto Mode)
  const [autoDistribution, setAutoDistribution] = useState({
    Mudah: '5',
    Sedang: '5',
    Sulit: '5'
  });

  // Math Editor State
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [mathTarget, setMathTarget] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  const currentTotalQuestions = useMemo(() => {
    if (formData.selectionMethod === 'auto') {
      return Object.values(autoDistribution).reduce((a, b) => a + (parseInt(b) || 0), 0);
    }
    return quizData.questions.length;
  }, [formData.selectionMethod, autoDistribution, quizData.questions]);

  const targetCount = parseInt(formData.questionCount) || 0;
  const isValid = currentTotalQuestions === targetCount && targetCount > 0;
  const isOver = currentTotalQuestions > targetCount;

  const handleSave = (status) => {
    if (!formData.title) return toast.error('Judul kuis harus diisi!');
    if (!isValid && formData.selectionMethod === 'auto') return toast.error('Jumlah soal belum sesuai dengan target!');
    if (formData.selectionMethod === 'manual' && quizData.questions.length === 0) return toast.error('Buat setidaknya satu pertanyaan!');
    
    if (status === 'active') {
      setIsConfirmOpen(true);
      return;
    }
    executeSave('draft');
  };

  const executeSave = (status) => {
    toast.success(`Kuis berhasil disimpan sebagai ${status === 'draft' ? 'Draft' : 'Rilisan'}`);
    setIsConfirmOpen(false);
    setTimeout(() => navigate('/guru/quizzes'), 1500);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-32">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL: CONFIGURATION */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Settings size={60} />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600">
                <Layers size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Informasi Dasar</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
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

              {/* DATE FIELDS */}
              <div className="pt-6 border-t border-slate-50 dark:border-slate-700/50 space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Buka Akses</label>
                    <input type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold outline-none dark:text-white" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tutup Akses</label>
                    <input type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold outline-none dark:text-white" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: QUESTION BUILDER OR AUTO SELECT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-10 min-h-[700px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Pengaturan Soal</h3>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                {['auto', 'manual'].map(method => (
                  <button
                    key={method}
                    onClick={() => setFormData({ ...formData, selectionMethod: method })}
                    className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.selectionMethod === method
                      ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20'
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {method === 'auto' ? 'Bank Soal' : 'Buat Sendiri'}
                  </button>
                ))}
              </div>
            </div>

            {formData.selectionMethod === 'auto' ? (
              <div className="flex-1 space-y-10">
                <div className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${
                  isValid ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' : 
                  isOver ? 'bg-rose-50/50 border-rose-100 text-rose-600' : 
                  'bg-amber-50/50 border-amber-100 text-amber-600'
                }`}>
                   <div className="flex items-center gap-4">
                      {isValid ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                      <span className="text-sm font-black uppercase tracking-tight">
                         {isValid ? 'Distribusi soal sudah sesuai!' : 
                          isOver ? `Terlalu banyak (${currentTotalQuestions}/${targetCount})` : 
                          `Belum cukup (${currentTotalQuestions}/${targetCount})`}
                      </span>
                   </div>
                   <div className="text-[10px] font-black uppercase opacity-60 italic">Target: {targetCount} Butir</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Mudah', 'Sedang', 'Sulit'].map(level => (
                    <div key={level} className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6 group hover:border-orange-200 transition-all">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{level}</span>
                       <input
                         type="number"
                         value={autoDistribution[level]}
                         onChange={e => setAutoDistribution({...autoDistribution, [level]: e.target.value})}
                         className="w-full bg-transparent text-4xl font-black text-slate-800 dark:text-white outline-none italic"
                       />
                       <p className="text-[9px] font-bold text-slate-400 uppercase italic">Assign dari bank</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
                <div className="flex-1">
                   <GuruQuizBuilder quizData={quizData} setQuizData={setQuizData} openMathEditor={openMathEditor} hideHeader={true} />
                </div>
            )}
          </div>
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
                   onClick={() => handleSave('active')} 
                   className="flex-1 md:flex-none px-12 py-5 bg-white text-slate-900 hover:bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95"
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
