import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export default function PdfViewer({ title, contentUrl }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] bg-slate-100 dark:bg-slate-900 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner flex flex-col">
      {/* Loading Overlay */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 z-10">
          <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
          <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">
            Memuat Modul PDF...
          </p>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 text-center z-10">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-2xl flex items-center justify-center mb-4 border border-red-200 dark:border-red-800">
            <AlertCircle size={32} />
          </div>
          <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
            Gagal Memuat PDF
          </h4>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-xs mt-2 uppercase tracking-widest leading-relaxed">
            Maaf, file modul tidak dapat dibuka. Silakan unduh file menggunakan tombol unduh di bawah.
          </p>
        </div>
      )}

      {/* PDF Frame */}
      {!error && (
        <iframe
          src={`${contentUrl}#toolbar=1`}
          title={title}
          className="w-full h-full border-none"
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      )}
    </div>
  );
}