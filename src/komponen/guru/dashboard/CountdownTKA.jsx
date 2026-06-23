import React from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTKA() {
  return (
    <div className="bg-gradient-to-r from-orange-600 to-teal-600 rounded-[2rem] p-6 text-white shadow-xl shadow-orange-600/10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
          <Clock size={32} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight leading-none">Countdown Menuju TKA</h2>
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Sisa Waktu Persiapan Siswa</p>
        </div>
      </div>
      <div className="flex gap-4">
        {[
          { label: 'Hari', val: '14' },
          { label: 'Jam', val: '08' },
          { label: 'Menit', val: '45' }
        ].map((unit, i) => (
          <div key={i} className="text-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl min-w-[70px] border border-white/20">
            <p className="text-2xl font-black leading-none">{unit.val}</p>
            <p className="text-[10px] font-bold uppercase tracking-tighter mt-1">{unit.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
