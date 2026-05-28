import React from 'react';
import { AlertTriangle, ChevronRight, User } from 'lucide-react';

export default function SiswaPerhatianTable({ data }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Siswa Perlu Perhatian</h2>
          <p className="text-[10px] font-black text-rose-500 mt-1 uppercase tracking-widest italic">Di bawah Standar Kelulusan</p>
        </div>
        <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
          <AlertTriangle size={20} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-50 dark:border-slate-800">
              <th className="text-left pb-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Siswa</th>
              <th className="text-center pb-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kelas</th>
              <th className="text-center pb-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rata-rata</th>
              <th className="text-right pb-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {data?.length > 0 ? (
              data.map((siswa, index) => (
                <tr key={index} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <User size={14} />
                      </div>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-teal-600 transition-colors">{siswa.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 lowercase">{siswa.class}</span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black">
                      {siswa.score}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-teal-600 hover:border-teal-200 dark:hover:text-teal-400 dark:hover:border-teal-900 transition-all active:scale-90">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-12 text-center text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                  Semua siswa terpantau stabil
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="mt-8 py-3.5 bg-rose-50 dark:bg-rose-500/5 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-all italic border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30">
        Lihat Laporan Detail Peringatan
      </button>
    </div>
  );
}
