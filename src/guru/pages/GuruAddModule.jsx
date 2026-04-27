import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Layers,
  Video,
  Save,
  Link,
  Upload,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

// UI Components
import Dropdown from '../../components/ui/Dropdown';
import Badge from '../../components/ui/Badge';
import GuruVisualMathEditor from '../components/GuruVisualMathEditor';

// Sub Components
import GuruQuizBuilder from '../components/ModuleManagement/GuruQuizBuilder';
import FilePreviewUpload from '../../components/ui/FilePreviewUpload';

// Constants
import { SUBJECTS, SUBJECT_CATEGORIES } from '../../constants/subjects';

export default function GuruAddModule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const assignedClass = localStorage.getItem('assignedClass') ?? '';

  const [formData, setFormData] = useState({
    title: '',
    category: SUBJECT_CATEGORIES.AKADEMIK,
    subject: SUBJECTS[0].name,
    type: 'video',
    url: '',
    description: '',
    status: 'draft',
    hasQuiz: false,
    target_class: assignedClass // Scoped to Guru's class
  });

  const [quizData, setQuizData] = useState({ 
    title: '', 
    prerequisite: 'download', 
    questions: [] 
  });

  const [isMathOpen, setIsMathOpen] = useState(false);
  const [mathTarget, setMathTarget] = useState(null);
  const [uploadMode, setUploadMode] = useState('url'); 
  const [mediaFiles, setMediaFiles] = useState([]);

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
      newQuestions[qIndex].options[oIndex] += formatted;
    }
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleRemoveFile = useCallback((id) => {
    setMediaFiles(prev => {
      const target = prev.find(p => p.id === id);
      if (target && target.url) URL.revokeObjectURL(target.url);
      return prev.filter(p => p.id !== id);
    });
  }, []);

  // Memory Management
  useEffect(() => {
    return () => {
      mediaFiles.forEach(p => {
        if (p.url) URL.revokeObjectURL(p.url);
      });
    };
  }, []);

  const handleSave = (status) => {
    if (!formData.title) {
      toast.error('Judul materi harus diisi!');
      return;
    }
    toast.success(isEdit ? 'Materi berhasil diperbarui' : `Materi berhasil disimpan sebagai ${status === 'draft' ? 'Draft' : 'Rilisan'}`);
    setTimeout(() => navigate('/guru/modules'), 1500);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/guru/modules')}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-orange-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">
            {isEdit ? 'Edit Materi Belajar' : 'Tambah Materi Baru'}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <span>Khusus Kelas {assignedClass}</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span>{isEdit ? `Materi ID: #${id}` : 'Siapkan materi harian untuk siswa'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/30 rounded-xl flex items-center justify-center text-orange-600">
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
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-orange-500/10 transition-all dark:text-white"
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

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600">
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
                      ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setUploadMode('url')}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    uploadMode === 'url' ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/20' : 'bg-transparent text-slate-400 border-slate-100 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Link URL
                </button>
                <button
                  onClick={() => setUploadMode('file')}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    uploadMode === 'file' ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/20' : 'bg-transparent text-slate-400 border-slate-100 dark:border-slate-700 hover:bg-slate-50'
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
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-orange-500/10 transition-all dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <FilePreviewUpload 
                    files={mediaFiles}
                    onAdd={setMediaFiles}
                    onRemove={handleRemoveFile}
                    multiple={false}
                    accept={formData.type === 'video' ? 'video/*' : '.pdf'}
                    maxSizeMB={formData.type === 'video' ? 100 : 50}
                    label={`Unggah File ${formData.type.toUpperCase()}`}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi & Ringkasan</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tuliskan ringkasan materi atau instruksi untuk siswa..."
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-orange-500/10 transition-all dark:text-white resize-none"
                />
              </div>
            </div>
          </div>

          {/* KUIS EVALUASI */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.hasQuiz ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Kuis Evaluasi</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Wajibkan kuis setelah materi selesai</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.hasQuiz} onChange={() => setFormData({ ...formData, hasQuiz: !formData.hasQuiz })} />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {formData.hasQuiz && (
              <GuruQuizBuilder quizData={quizData} setQuizData={setQuizData} openMathEditor={openMathEditor} />
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="mt-12 w-full">
         <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-xl border-t-4 border-orange-500 rounded-[2.5rem] px-8 md:px-12 py-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-14">
               <div className="flex flex-col items-center md:items-start min-w-[100px]">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 shadow-sm">Status Materi</span>
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${formData.status === 'draft' ? 'bg-amber-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                     <span className="text-xl font-black text-white italic tracking-tighter leading-none uppercase">{formData.status}</span>
                  </div>
               </div>
               <div className="hidden sm:flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Pelajaran</span>
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
                <button onClick={() => navigate('/guru/modules')} className="px-6 py-4 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors mr-2 md:mr-6">Batal</button>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleSave('draft')} className="px-8 py-4 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 border border-white/5">Simpan Draft</button>
                  <button onClick={() => handleSave('published')} className="bg-white text-slate-900 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10">{isEdit ? 'Perbarui & Publish' : 'Simpan & Publish'}</button>
                </div>
            </div>
         </div>
      </div>

      <GuruVisualMathEditor isOpen={isMathOpen} onCancel={() => setIsMathOpen(false)} onInsert={handleInsertMath} />
    </div>
  );
}
