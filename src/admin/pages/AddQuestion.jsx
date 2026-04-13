import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Type,
  ImageIcon,
  Save,
  Calculator,
  X,
  Link,
  Upload,
  Eye,
  FileText,
  HelpCircle,
  Info,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SUBJECTS, SUBJECT_CATEGORIES } from '../../constants/subjects';
import Dropdown from '../../components/ui/Dropdown';
import Badge from '../../components/ui/Badge';
import VisualMathEditor from '../../admin/components/VisualMathEditor';

/**
 * AddQuestion Page
 * Refactored from QuestionForm modal to a dedicated creation page.
 */
export default function AddQuestion() {
  const navigate = useNavigate();

  // 1. Form States
  const [formData, setFormData] = useState({
    subject: SUBJECTS[0].name,
    difficulty: 'Sedang',
    questionText: '',
    explanation: '',
    correctAnswer: 'A',
    options: { A: '', B: '', C: '', D: '' }
  });

  // 2. Media Handling State
  const [mediaTab, setMediaTab] = useState('url'); // 'url' | 'upload'
  const [mediaUrl, setMediaUrl] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  // 3. UI States
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [activeField, setActiveField] = useState(null); 

  const openMathEditor = (field) => {
    setActiveField(field);
    setIsMathOpen(true);
  };

  const handleInsertMath = (latex) => {
    const formatted = `$${latex}$`;
    if (activeField === 'question') {
      setFormData(prev => ({ ...prev, questionText: prev.questionText + formatted }));
    } else if (['A', 'B', 'C', 'D'].includes(activeField)) {
      setFormData(prev => ({
        ...prev,
        options: { ...prev.options, [activeField]: prev.options[activeField] + formatted }
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        toast.success('Gambar berhasil dipilih');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.questionText) {
      toast.error('Teks soal harus diisi!');
      return;
    }
    toast.success('Soal berhasil ditambahkan ke Bank Soal');
    setTimeout(() => navigate('/admin/question-bank'), 1500);
  };

  const currentImagePreview = mediaTab === 'url' ? mediaUrl : filePreview;

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
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Kreator Bank Soal</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tambahkan butir soal standar kompetensi baru</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: QUESTION CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                  <Type size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Konten Soal</h3>
              </div>
              <button 
                type="button"
                onClick={() => openMathEditor('question')}
                className="flex items-center gap-2 text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl transition-all uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/40"
              >
                <Calculator size={14} strokeWidth={3} /> Sisipkan Rumus
              </button>
            </div>

            <div className="space-y-6">
              <textarea
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                placeholder="Tuliskan pertanyaan tryout di sini..."
                rows={6}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white resize-none"
              />

              {/* Media Section */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] overflow-hidden p-6 space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Media Visual</span>
                  </div>
                  <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {['url', 'upload'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setMediaTab(tab)}
                        className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                          mediaTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        {tab === 'url' ? 'Link URL' : 'Upload File'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                   <div className="flex-1 space-y-4">
                      {mediaTab === 'url' ? (
                        <div className="relative">
                          <Link size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input 
                            type="text" 
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            placeholder="https://link-gambar.com/soal.png" 
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold outline-none"
                          />
                        </div>
                      ) : (
                        <div className="relative group">
                          <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[1.5rem] p-6 text-center group-hover:bg-indigo-50/10 transition-colors">
                              <Upload size={20} className="mx-auto text-slate-300 mb-2" />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih File Gambar</p>
                          </div>
                        </div>
                      )}
                      <p className="text-[8px] font-bold text-slate-400 italic">Gambar akan tampil tepat di bawah teks pertanyaan.</p>
                   </div>
                   
                   <div className="w-full md:w-32 h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden relative shadow-inner">
                      {currentImagePreview ? (
                        <img src={currentImagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Eye size={24} className="text-slate-100 dark:text-slate-800" />
                      )}
                   </div>
                </div>
              </div>

              {/* Options Selection */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pilihan Jawaban</span>
                    <div className="h-px flex-1 bg-slate-50 dark:bg-slate-800" />
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    {['A', 'B', 'C', 'D'].map(label => (
                      <div key={label} className="relative group">
                         <div className={`flex items-center gap-4 p-2 pl-5 bg-slate-50 dark:bg-slate-900/50 border rounded-[1.5rem] transition-all ${
                           formData.correctAnswer === label ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-slate-100 dark:border-slate-700'
                         }`}>
                           <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                             formData.correctAnswer === label ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                           }`}>{label}</span>
                           <input
                            type="text"
                            value={formData.options[label]}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              options: { ...formData.options, [label]: e.target.value } 
                            })}
                            placeholder={`Ketik isi pilihan ${label}...`}
                            className="flex-1 bg-transparent border-none outline-none font-bold text-xs text-slate-800 dark:text-white"
                           />
                           <div className="flex items-center gap-2 pr-4 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
                              <button onClick={() => openMathEditor(label)} className="text-slate-300 hover:text-indigo-600 transition-colors"><Calculator size={16} /></button>
                              <div className="flex flex-col items-center ml-2">
                                <input 
                                  type="radio" 
                                  name="ans" 
                                  checked={formData.correctAnswer === label}
                                  onChange={() => setFormData({ ...formData, correctAnswer: label })}
                                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                                />
                                <span className="text-[7px] font-black text-slate-400 uppercase mt-0.5">Kunci</span>
                              </div>
                           </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: METADATA & EXPLANATION */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
                  <HelpCircle size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Klasifikasi</h3>
              </div>

              <div className="space-y-6">
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tingkat Kesulitan</label>
                  <Dropdown
                    value={formData.difficulty}
                    onChange={(val) => setFormData({ ...formData, difficulty: val })}
                    options={[
                      { value: 'Mudah', label: 'Mudah' },
                      { value: 'Sedang', label: 'Sedang' },
                      { value: 'Sulit', label: 'Sulit' }
                    ]}
                    fullWidth
                  />
                </div>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-6 shadow-sm">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                    <FileText size={20} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Pembahasan</h3>
              </div>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Tuliskan kunci jawaban dan pembahasan untuk membantu siswa..."
                rows={4}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white resize-none"
              />
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                 <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight leading-relaxed">
                   <Info size={12} className="inline mr-1 text-indigo-500" />
                   Review kembali semua field sebelum menyimpan data soal ke sistem bank soal.
                 </p>
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
                     <span className="text-xl font-black text-white italic tracking-tighter leading-none uppercase">Bank Soal</span>
                  </div>
               </div>

               <div className="hidden sm:flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Mata Pelajaran</span>
                  <Badge text={formData.subject} variant="Info" className="px-5 py-1" />
               </div>

               <div className="hidden lg:flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Kualitas Soal</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-black italic tracking-wide ${formData.questionText.length > 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {formData.questionText.length > 50 ? 'Standar Baik' : 'Butuh Detail'}
                    </span>
                    <Badge text={formData.difficulty} variant={formData.difficulty === 'Mudah' ? 'Success' : formData.difficulty === 'Sedang' ? 'Warning' : 'Danger'} />
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
                  Simpan ke Bank Soal
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
