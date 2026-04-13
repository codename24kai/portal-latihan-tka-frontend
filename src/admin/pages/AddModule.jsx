import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Layers,
  Video,
  FileText,
  Type,
  Plus,
  Trash2,
  Save,
  Send,
  Link,
  Upload,
  MessageSquare,
  Calculator,
  ChevronRight,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SUBJECTS, SUBJECT_CATEGORIES } from '../../constants/subjects';
import Dropdown from '../../components/ui/Dropdown';
import Badge from '../../components/ui/Badge';
import VisualMathEditor from '../../admin/components/VisualMathEditor';

/**
 * AddModule Page
 * Refactored from modal wizard to a dedicated structured page.
 */
export default function AddModule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // 1. Core Module Data
  const [formData, setFormData] = useState({
    title: '',
    category: SUBJECT_CATEGORIES.AKADEMIK,
    subject: SUBJECTS[0].name,
    type: 'video',
    url: '',
    description: '',
    status: 'draft',
    hasQuiz: false
  });

  // 2. Quiz Data
  const [quizData, setQuizData] = useState({ 
    title: '', 
    prerequisite: 'download', 
    questions: [] 
  });

  // 3. UI States
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [mathTarget, setMathTarget] = useState(null);
  const [uploadMode, setUploadMode] = useState('url'); // 'url' | 'file'
  const [selectedFile, setSelectedFile] = useState(null);

  // Logic: Quiz Builders
  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { id: Date.now(), text: '', options: ['', '', '', ''], answer: 0 }]
    }));
  };

  const removeQuestion = (id) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const openMathEditor = (qIndex, type, oIndex = null) => {
    setMathTarget({ qIndex, type, oIndex });
    setIsMathOpen(true);
  };

  const handleInsertMath = (latex) => {
    if (!mathTarget) return;
    const formatted = `$${latex}$`;
    const { qIndex, type, oIndex } = mathTarget;

    if (type === 'text') {
      updateQuestion(qIndex, 'text', quizData.questions[qIndex].text + formatted);
    } else if (type === 'option') {
      updateOption(qIndex, oIndex, quizData.questions[qIndex].options[oIndex] + formatted);
    }
  };

  const handleSave = (status) => {
    if (!formData.title) {
      toast.error('Judul materi harus diisi!');
      return;
    }
    toast.success(isEdit ? 'Materi berhasil diperbarui' : `Materi berhasil disimpan sebagai ${status === 'draft' ? 'Draft' : 'Rilisan'}`);
    setTimeout(() => navigate('/admin/modules'), 1500);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-32">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/modules')}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {isEdit ? 'Edit Materi Belajar' : 'Tambah Materi Belajar'}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {isEdit ? `Memperbarui konten modul ID: #${id}` : 'Buat modul baru untuk pembelajaran siswa'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: BASIC INFO */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                <Layers size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Informasi Dasar</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Materi</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="E.g. Pengenalan Aljabar Dasar"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mata Pelajaran</label>
                <Dropdown
                  value={formData.subject}
                  onChange={(val) => setFormData({ ...formData, subject: val })}
                  options={SUBJECTS.map(s => ({ value: s.name, label: s.name }))}
                  fullWidth
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                <Dropdown
                  value={formData.category}
                  onChange={(val) => setFormData({ ...formData, category: val })}
                  options={Object.values(SUBJECT_CATEGORIES).map(c => ({ value: c, label: c }))}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CONTENT & DESCRIPTION */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                  <Video size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Konten Materi</h3>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                {['video', 'pdf'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, type })}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      formData.type === type 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setUploadMode('url')}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    uploadMode === 'url'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                    : 'bg-transparent text-slate-400 border-slate-100 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Link URL
                </button>
                <button
                  onClick={() => setUploadMode('file')}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    uploadMode === 'file'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20'
                    : 'bg-transparent text-slate-400 border-slate-100 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {uploadMode === 'url' ? (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {formData.type === 'video' ? 'Link Video YouTube' : 'URL File PDF / Materi'}
                  </label>
                  <div className="relative">
                     <Link size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                     <input
                      type="text"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://..."
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Upload {formData.type === 'video' ? 'Video' : 'PDF'}
                  </label>
                  <div 
                    className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all hover:border-emerald-500 hover:bg-emerald-50/10 group cursor-pointer"
                    onClick={() => document.getElementById('fileUpload').click()}
                  >
                    <input 
                      id="fileUpload"
                      type="file" 
                      className="hidden" 
                      accept={formData.type === 'video' ? 'video/*' : '.pdf'}
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                      <Upload size={32} />
                    </div>
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="text-sm font-black text-slate-800 dark:text-white">{selectedFile.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-black text-slate-400 dark:text-slate-500">Klik atau seret file ke sini</p>
                        <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase mt-1">
                          {formData.type === 'video' ? 'MP4, MOV Max 100MB' : 'PDF Max 50MB'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi & Ringkasan</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tuliskan ringkasan materi atau instruksi untuk siswa..."
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white resize-none"
                />
              </div>
            </div>
          </div>

          {/* EVALUATION QUIZ SECTION */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.hasQuiz ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Kuis Evaluasi</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Wajibkan evaluasi setelah materi selesai</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.hasQuiz} onChange={() => setFormData({ ...formData, hasQuiz: !formData.hasQuiz })} />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {formData.hasQuiz && (
              <div className="space-y-8 pt-4 animate-in slide-in-from-top-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Syarat Akses Kuis</label>
                    <Dropdown
                      value={quizData.prerequisite}
                      onChange={(val) => setQuizData({ ...quizData, prerequisite: val })}
                      options={[
                        { value: 'download', label: 'Selesaikan Materi / Download' },
                        { value: 'video', label: 'Tonton Video Sampai Selesai' }
                      ]}
                      fullWidth
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Kuis</label>
                    <input
                      type="text"
                      value={quizData.title}
                      onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                      placeholder="E.g. Kuis Pemahaman Materi"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-bold outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* Quiz Builder (Mini version of Question Bank) */}
                <div className="space-y-6">
                  {quizData.questions.map((q, qIndex) => (
                    <div key={q.id} className="p-8 bg-slate-50 dark:bg-slate-900/30 rounded-[2rem] border border-slate-100 dark:border-slate-700 relative group animate-in zoom-in-95">
                      <div className="flex items-start gap-4 mb-6">
                         <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-600/20 shrink-0">{qIndex + 1}</span>
                         <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pertanyaan {qIndex + 1}</label>
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => openMathEditor(qIndex, 'text')}
                                  className="flex items-center gap-1.5 text-[8px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg uppercase tracking-widest transition-all hover:scale-105"
                                >
                                  <Calculator size={10} /> Rumus
                                </button>
                                <button
                                  onClick={() => removeQuestion(q.id)}
                                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                  title="Hapus Pertanyaan"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={q.text}
                              onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                              placeholder="Ketik pertanyaan kuis..."
                              className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none font-bold text-sm text-slate-800 dark:text-white pb-1"
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="relative">
                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black ${q.answer === oIndex ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                              {String.fromCharCode(65 + oIndex)}
                            </div>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Opsi ${String.fromCharCode(65 + oIndex)}`}
                              className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[11px] font-bold focus:border-emerald-500 outline-none"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                               <button onClick={() => openMathEditor(qIndex, 'option', oIndex)} className="text-slate-300 hover:text-indigo-500 transition-colors"><Calculator size={14} /></button>
                               <input type="radio" checked={q.answer === oIndex} onChange={() => updateQuestion(qIndex, 'answer', oIndex)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addQuestion}
                    className="w-full py-6 border-4 border-dashed border-slate-50 dark:border-slate-800 rounded-[2.5rem] flex items-center justify-center gap-3 text-slate-300 hover:text-indigo-600 hover:border-indigo-100 transition-all font-black text-[10px] uppercase tracking-widest"
                  >
                    <Plus size={20} /> Tambah Pertanyaan Kuis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="mt-12 w-full">
         <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-xl border-t-4 border-indigo-500 rounded-[2.5rem] px-8 md:px-12 py-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-14">
               <div className="flex flex-col items-center md:items-start min-w-[100px]">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 shadow-sm">Status Materi</span>
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${formData.status === 'draft' ? 'bg-amber-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                     <span className="text-xl font-black text-white italic tracking-tighter leading-none uppercase">{formData.status}</span>
                  </div>
               </div>

               <div className="hidden sm:flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Mata Pelajaran</span>
                  <Badge text={formData.subject} variant="Info" className="px-5 py-1" />
               </div>

               <div className="hidden lg:flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Kuis Evaluasi</span>
                  <span className={`text-sm font-black uppercase italic tracking-wide ${formData.hasQuiz ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {formData.hasQuiz ? `Aktif (${quizData.questions.length} Soal)` : 'Nonaktif'}
                  </span>
               </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
                <button 
                  onClick={() => navigate('/admin/modules')}
                  className="px-6 py-4 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors mr-2 md:mr-6"
                >
                  Batal
                </button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleSave('draft')}
                    className="px-8 py-4 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 border border-white/5"
                  >
                    Draft
                  </button>
                  <button 
                    onClick={() => handleSave('published')}
                    className="bg-white text-slate-900 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10"
                  >
                    {isEdit ? 'Perbarui & Publish' : 'Simpan & Publish'}
                  </button>
                </div>
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
