import React from 'react';
import { ClipboardList, MoreVertical, Circle } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

export default function TryoutStatus({ data }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Status Tryout</h2>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">Sesi Berlangsung</p>
        </div>
        <button className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {data?.length > 0 ? (
          data.map((item, index) => (
            <div 
              key={index} 
              className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all border border-transparent hover:border-teal-100 dark:hover:border-teal-900/30"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm transition-transform group-hover:scale-110">
                  <ClipboardList size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{item.category}</span>
                    <Circle size={4} className="fill-slate-300 dark:fill-slate-700 stroke-none" />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{item.participants} Peserta</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge 
                  text={item.status} 
                  variant={item.status === 'Berlangsung' ? 'Success' : 'Warning'} 
                  className="text-[8px] px-2.5 py-0.5 border-none font-black uppercase" 
                />
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{item.timeLeft} Tersisa</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 opacity-50 grayscale dark:opacity-30">
            <ClipboardList size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Tidak Ada Tryout Aktif</p>
          </div>
        )}
      </div>

      <button className="mt-8 w-full py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-teal-600 hover:border-teal-200 dark:hover:text-teal-400 dark:hover:border-teal-900 transition-all active:scale-[0.98]">
        Kelola Semua Tryout
      </button>
    </div>
  );
}
