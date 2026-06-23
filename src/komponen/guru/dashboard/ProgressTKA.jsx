import React from 'react';

export default function ProgressTKA() {
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Progress Tryout Berjalan</h3>
        <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">0 Sesi Aktif</span>
      </div>
      <div className="relative h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-emerald-400 w-0 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.3)]" />
      </div>
      <div className="flex justify-between mt-4">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">0 / 0 Siswa Selesai</p>
        <p className="text-[11px] font-black text-teal-600 uppercase tracking-wider">0%</p>
      </div>
    </div>
  );
}
