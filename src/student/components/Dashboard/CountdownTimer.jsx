import React from 'react';
import { Timer, ChevronRight } from 'lucide-react';

const CountdownTimer = ({ daysLeft }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-[2rem] p-6 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
       <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
       
       <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
         <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
           <Timer size={32} className="text-white" />
         </div>
         <div>
           <h3 className="font-black text-xl tracking-tight">Persiapan Ujian TKA</h3>
           <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] mt-1">Fokus dan raih nilai terbaik!</p>
         </div>
       </div>
       <div className="flex items-center gap-4 bg-black/10 backdrop-blur-sm self-stretch sm:self-auto px-6 py-3 rounded-2xl border border-white/10">
         <div className="text-right">
           <div className="text-3xl font-black leading-none">{daysLeft}</div>
           <div className="text-[10px] font-black uppercase tracking-widest text-white/70 mt-1">Hari Lagi</div>
         </div>
         <ChevronRight size={20} className="text-white/40" />
       </div>
    </div>
  );
};

export default CountdownTimer;
