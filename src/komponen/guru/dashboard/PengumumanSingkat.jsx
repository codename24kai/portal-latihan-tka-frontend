import React from 'react';
import { Megaphone } from 'lucide-react';

export default function QuickAnnouncementBanner({ assignedClass, onOpenAnnounceModal }) {
  return (
    <div
      className="bg-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-600/10 flex flex-col justify-center group cursor-pointer"
      onClick={onOpenAnnounceModal}
    >
      <Megaphone size={40} className="mb-4 opacity-40 group-hover:rotate-12 transition-transform" />
      <h4 className="text-xl font-black uppercase tracking-tight leading-none mb-2">
        Belum ada pengumuman hari ini.
      </h4>
      <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-6">
        Klik tombol di atas untuk mengirimkan info ke seluruh siswa di Kelas {assignedClass}.
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenAnnounceModal();
        }}
        className="w-full py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/30 transition-all"
      >
        Kelola Pengumuman
      </button>
    </div>
  );
}
