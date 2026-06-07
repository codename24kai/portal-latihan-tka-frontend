import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export default function YoutubeViewer({ title, youtubeId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fallback if youtubeId is not present
  if (!youtubeId) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-950 text-red-500 rounded-2xl flex items-center justify-center mb-4 border border-red-900/50">
          <AlertCircle size={32} />
        </div>
        <h4 className="text-lg font-black text-white uppercase tracking-tight italic">
          Link YouTube Tidak Valid
        </h4>
        <p className="text-xs font-bold text-slate-400 max-w-xs mt-2 uppercase tracking-widest leading-relaxed">
          Tautan YouTube tidak ditemukan atau tidak dikonfigurasi dengan benar.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-slate-900 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Loading Overlay */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">
            Menghubungkan ke YouTube...
          </p>
        </div>
      )}

      {/* iframe embed */}
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        title={title}
        className="w-full h-full border-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
