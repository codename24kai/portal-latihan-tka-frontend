import React, { useState } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';

export default function VideoViewer({ title, contentUrl }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full aspect-video bg-slate-900 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Loading Overlay */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">
            Menyiapkan Video...
          </p>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center z-10">
          <div className="w-16 h-16 bg-red-950 text-red-500 rounded-2xl flex items-center justify-center mb-4 border border-red-900/50">
            <AlertCircle size={32} />
          </div>
          <h4 className="text-lg font-black text-white uppercase tracking-tight italic">
            Gagal Memuat Video
          </h4>
          <p className="text-xs font-bold text-slate-400 max-w-xs mt-2 uppercase tracking-widest leading-relaxed">
            Format video tidak didukung atau tautan tidak valid. Coba unduh materi secara langsung.
          </p>
        </div>
      )}

      {/* HTML5 Video Player */}
      {!error && (
        <video
          src={contentUrl}
          controls
          className="w-full h-full object-contain"
          onCanPlay={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          controlsList="nodownload" // Disable standard download button inside controls to let student use our dedicated download button
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
