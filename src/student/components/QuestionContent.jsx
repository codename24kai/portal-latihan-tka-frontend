import { ImageIcon } from 'lucide-react';

/**
 * Displays the question text and optional image.
 * Uses large typography for young students.
 */
export default function QuestionContent({ questionNumber, text, image }) {
  return (
    <div id="question-content" className="animate-fade-in">
      {/* Question number badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 text-primary text-sm font-semibold mb-4">
        Soal {questionNumber}
      </div>

      {/* Question text */}
      <p className="text-lg sm:text-xl leading-relaxed text-gray-800 font-medium mb-5">
        {text}
      </p>

      {/* Image placeholder (if question has image) */}
      {image && (
        <div className="relative mb-5 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center justify-center py-12 px-6 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-card flex items-center justify-center mb-3">
              <ImageIcon size={28} className="text-gray-300" />
            </div>
            <span className="text-sm font-medium text-gray-400">Gambar Soal</span>
            <span className="text-xs text-gray-300 mt-1">Ilustrasi akan ditampilkan di sini</span>
          </div>
        </div>
      )}
    </div>
  );
}
