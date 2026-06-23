import React from 'react';
import { Megaphone } from 'lucide-react';

export default function HeroSection({ assignedClass, onOpenAnnounceModal }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
          Beranda Wali Kelas {assignedClass}
        </h1>
        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest italic">
          Dashboard monitoring dan interaksi kelas
        </p>
      </div>
      <button
        onClick={onOpenAnnounceModal}
        className="flex items-center gap-3 px-6 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all hover:scale-105 active:scale-95"
      >
        <Megaphone size={18} /> Kirim Pengumuman Kelas
      </button>
    </div>
  );
}
