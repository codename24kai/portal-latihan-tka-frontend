import { Upload, Type, Image, Save } from 'lucide-react';
import { SUBJECT_CATEGORIES } from '../../constants/subjects';

/**
 * Form for creating/editing an exam question.
 * Mockup with text area and image upload placeholder.
 */
export default function QuestionForm({ onClose }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card dark:shadow-none border border-transparent dark:border-slate-800 overflow-hidden animate-slide-up">
      {/* Form header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-bold text-dark dark:text-white">Buat Soal Baru</h3>
        {onClose && (
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            Batal
          </button>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* Subject selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Mata Pelajaran</label>
          <select className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-indigo-900/50 focus:border-primary transition-all cursor-pointer">
            <optgroup label={SUBJECT_CATEGORIES.AKADEMIK}>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Matematika">Matematika</option>
            </optgroup>
            <optgroup label={SUBJECT_CATEGORIES.NON_AKADEMIK}>
              <option value="Survei Lingkungan Belajar">Survei Lingkungan Belajar</option>
              <option value="Survei Karakter">Survei Karakter</option>
            </optgroup>
          </select>
        </div>

        {/* Question text */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
            <Type size={14} className="inline mr-1.5 text-slate-400 dark:text-slate-500" />
            Teks Soal
          </label>
          <textarea
            placeholder="Tuliskan pertanyaan di sini..."
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-dark dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-indigo-900/50 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
            <Image size={14} className="inline mr-1.5 text-slate-400 dark:text-slate-500" />
            Gambar (Opsional)
          </label>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center hover:border-primary/40 dark:hover:border-indigo-500/40 hover:bg-primary-50/30 dark:hover:bg-indigo-500/5 transition-all duration-200 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-50 dark:group-hover:bg-indigo-500/10 flex items-center justify-center mx-auto mb-3 transition-colors">
              <Upload size={20} className="text-slate-400 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Klik untuk upload gambar</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PNG, JPG hingga 2MB</p>
          </div>
        </div>

        {/* Answer options */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Pilihan Jawaban</label>
          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((label) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0">
                  {label}
                </span>
                <input
                  type="text"
                  placeholder={`Jawaban ${label}`}
                  className="flex-1 h-10 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-dark dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-indigo-900/50 focus:border-primary transition-all"
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  className="w-4 h-4 text-primary accent-primary dark:accent-indigo-500"
                  title="Tandai sebagai jawaban benar"
                />
              </div>
            ))}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">● Pilih radio button untuk jawaban yang benar</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-all">
            <Save size={16} />
            Simpan Soal
          </button>
          <button className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all">
            Simpan & Buat Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
