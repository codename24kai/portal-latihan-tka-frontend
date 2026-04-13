import React, { useState } from 'react';
import { 
  Upload, 
  Type, 
  Image as ImageIcon, 
  Save, 
  Info, 
  Calculator, 
  X, 
  Link, 
  FileText, 
  HelpCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import { SUBJECT_CATEGORIES } from '../../constants/subjects';
import VisualMathEditor from './VisualMathEditor';

/**
 * Form for creating/editing an exam question.
 * Enhanced with Visual Math Editor integration and professional UX.
 */
export default function QuestionForm({ onClose, isModal = false }) {
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [activeField, setActiveField] = useState(null); 
  const [questionText, setQuestionText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState('Sedang');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  
  // Media handling state
  const [mediaTab, setMediaTab] = useState('url'); // 'url' | 'upload'
  const [mediaUrl, setMediaUrl] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  const openMathEditor = (field) => {
    setActiveField(field);
    setIsMathOpen(true);
  };

  const handleInsertMath = (latex) => {
    const formatted = `$${latex}$`;
    if (activeField === 'question') {
      setQuestionText(prev => prev + formatted);
    } else if (['A', 'B', 'C', 'D'].includes(activeField)) {
      setOptions(prev => ({ ...prev, [activeField]: prev[activeField] + formatted }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentImagePreview = mediaTab === 'url' ? mediaUrl : filePreview;

  const formContent = (
    <div className="space-y-6">
      {/* Primary Info: Subject & Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
            Mata Pelajaran <span className="text-rose-500">*</span>
          </label>
          <div className="relative group">
            <select className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white appearance-none cursor-pointer">
              <optgroup label={SUBJECT_CATEGORIES.AKADEMIK}>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Matematika">Matematika</option>
              </optgroup>
              <optgroup label={SUBJECT_CATEGORIES.NON_AKADEMIK}>
                <option value="Survei Lingkungan Belajar">Survei Lingkungan Belajar</option>
                <option value="Survei Karakter">Survei Karakter</option>
              </optgroup>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-600 transition-colors">
               <HelpCircle size={16} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
            Tingkat Kesulitan <span className="text-rose-500">*</span>
          </label>
          <select 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white cursor-pointer"
          >
            <option value="Mudah">Mudah</option>
            <option value="Sedang">Sedang</option>
            <option value="Sulit">Sulit</option>
          </select>
        </div>
      </div>

      {/* Question text */}
      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1">
                <Type size={12} className="text-indigo-500" />
                Teks Soal <span className="text-rose-500">*</span>
            </label>
            <button 
                type="button"
                onClick={() => openMathEditor('question')}
                className="flex items-center gap-2 text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-4 py-1.5 rounded-xl transition-all uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/40"
            >
                <Calculator size={12} strokeWidth={3} /> Sisipkan Rumus
            </button>
        </div>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Tuliskan pertanyaan tryout di sini..."
          rows={4}
          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white resize-none placeholder:text-slate-300"
        />
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl">
           <Info size={14} className="text-indigo-500" />
           <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
             Klik 'Sisipkan Rumus' untuk menambahkan simbol matematika dengan mudah.
           </p>
        </div>
      </div>

      {/* Media Handling Refactored */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
          <ImageIcon size={12} className="text-emerald-500" />
          Media Soal (Opsional)
        </label>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-[2rem] overflow-hidden">
           <div className="flex border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <button 
                type="button"
                onClick={() => setMediaTab('url')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${mediaTab === 'url' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                 <Link size={14} /> URL Gambar
              </button>
              <button 
                type="button"
                onClick={() => setMediaTab('upload')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${mediaTab === 'upload' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                 <Upload size={14} /> Upload File
              </button>
           </div>
           
           <div className="p-5 flex flex-col md:flex-row gap-5">
              <div className="flex-1 space-y-3">
                 {mediaTab === 'url' ? (
                    <input 
                      type="text" 
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="Tempel link gambar di sini (https://...)" 
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white"
                    />
                 ) : (
                    <div className="relative">
                       <input 
                         type="file" 
                         onChange={handleFileChange}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       />
                       <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-500/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                          <Upload size={20} className="mx-auto mb-2 text-slate-300" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Gambar Dari Komputer</p>
                       </div>
                    </div>
                 )}
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight italic">Rekomendasi: Format JPG/PNG, ukuran maks 2MB.</p>
              </div>

              {/* Real-time Preview */}
              <div className="w-full md:w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 group relative">
                 {currentImagePreview ? (
                   <>
                     <img src={currentImagePreview} alt="Preview" className="w-full h-full object-contain" />
                     <button 
                       onClick={() => { setMediaUrl(''); setFilePreview(null); }}
                       className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <X size={12} />
                     </button>
                   </>
                 ) : (
                   <Eye size={24} className="text-slate-200" />
                 )}
                 <div className="absolute inset-0 pointer-events-none border-4 border-white/20 rounded-2xl" />
              </div>
           </div>
        </div>
      </div>

      {/* Answer options */}
      <div className="space-y-4 pt-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
           <div className="h-px w-full bg-slate-50 dark:bg-slate-800" />
           Pilihan Jawaban
           <div className="h-px w-full bg-slate-50 dark:bg-slate-800" />
        </label>
        <div className="grid grid-cols-1 gap-4">
          {['A', 'B', 'C', 'D'].map((label) => (
            <div key={label} className="relative">
                <div className="flex items-center gap-3 p-1.5 pl-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-[1.25rem] focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all shadow-sm">
                    <span className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-600 dark:text-slate-300 border border-slate-50 dark:border-slate-700">
                        {label}
                    </span>
                    <input
                        type="text"
                        value={options[label]}
                        onChange={(e) => setOptions(prev => ({ ...prev, [label]: e.target.value }))}
                        placeholder={`Masukkan pilihan ${label}...`}
                        className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
                    />
                    <button 
                        type="button"
                        onClick={() => openMathEditor(label)}
                        className="p-2.5 text-indigo-400 hover:text-indigo-600 transition-colors"
                        title="Sisipkan Rumus"
                    >
                        <Calculator size={20} />
                    </button>
                    <div className="pr-4 flex items-center gap-3 ml-2 border-l border-slate-100 dark:border-slate-800 pl-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Benar</label>
                        <input
                           type="radio"
                           name="correctAnswer"
                           className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500/10 cursor-pointer accent-emerald-500"
                           title="Tandai sebagai kunci jawaban"
                        />
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Explanation */}
      <div className="space-y-2">
         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
            <FileText size={12} className="text-amber-500" />
            Pembahasan Jawaban (Opsional)
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Tuliskan alasan mengapa jawaban tersebut benar untuk membantu siswa belajar..."
            rows={2}
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-amber-500/10 outline-none transition-all dark:text-white resize-none"
          />
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-50 dark:border-slate-700">
        <button className="w-full sm:flex-1 flex items-center justify-center gap-3 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all outline-none">
          <Save size={20} />
          Simpan Data Soal
        </button>
        {!isModal && onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all outline-none"
          >
            Batal
          </button>
        )}
      </div>

      {/* Visual Math Editor Modal */}
      <VisualMathEditor 
        isOpen={isMathOpen}
        onCancel={() => setIsMathOpen(false)}
        onInsert={handleInsertMath}
      />
    </div>
  );

  if (isModal) {
    return <div className="px-8 pb-12 pt-4">{formContent}</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-transparent dark:border-slate-800 overflow-hidden animate-slide-up">
      <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Kreator Soal</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Buat standar akademik baru</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all hover:rotate-90">
            <X size={24} />
          </button>
        )}
      </div>
      <div className="p-10">{formContent}</div>
    </div>
  );
}
