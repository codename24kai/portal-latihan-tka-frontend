import { Upload, Type, Image, Save } from 'lucide-react';

/**
 * Form for creating/editing an exam question.
 * Mockup with text area and image upload placeholder.
 */
export default function QuestionForm({ onClose }) {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-slide-up">
      {/* Form header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-dark">Buat Soal Baru</h3>
        {onClose && (
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">
            Batal
          </button>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* Subject selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Mata Pelajaran</label>
          <select className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
            <option>Matematika</option>
            <option>Bahasa Indonesia</option>
            <option>IPA (Sains)</option>
            <option>IPS</option>
            <option>Bahasa Inggris</option>
          </select>
        </div>

        {/* Question text */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            <Type size={14} className="inline mr-1.5 text-gray-400" />
            Teks Soal
          </label>
          <textarea
            placeholder="Tuliskan pertanyaan di sini..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            <Image size={14} className="inline mr-1.5 text-gray-400" />
            Gambar (Opsional)
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/40 hover:bg-primary-50/30 transition-all duration-200 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-primary-50 flex items-center justify-center mx-auto mb-3 transition-colors">
              <Upload size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Klik untuk upload gambar</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG hingga 2MB</p>
          </div>
        </div>

        {/* Answer options */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Pilihan Jawaban</label>
          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((label) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {label}
                </span>
                <input
                  type="text"
                  placeholder={`Jawaban ${label}`}
                  className="flex-1 h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  className="w-4 h-4 text-primary accent-primary"
                  title="Tandai sebagai jawaban benar"
                />
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-1">● Pilih radio button untuk jawaban yang benar</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button className="btn-primary flex items-center gap-2">
            <Save size={16} />
            Simpan Soal
          </button>
          <button className="btn-ghost">
            Simpan & Buat Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
