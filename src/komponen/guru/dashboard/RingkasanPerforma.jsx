import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PerformanceSummary({ classStudents }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Ringkasan Performa</h3>
        <button onClick={() => navigate('/guru/laporan')} className="text-[10px] font-black text-orange-600 uppercase hover:underline">
          Lihat Laporan
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {[...classStudents]
            .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''))
            .slice(0, 5)
            .map((student) => (
              <div key={student?.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between group hover:bg-teal-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 dark:border-slate-700 uppercase">
                    {student?.avatar ?? student?.name?.charAt(0)}
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">{student?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${(student?.avgScore ?? 0) >= 80 ? 'bg-teal-500' : (student?.avgScore ?? 0) >= 60 ? 'bg-amber-400' : 'bg-rose-500'}`} />
                  <p className="text-xs font-black text-slate-600 dark:text-slate-400">{student?.avgScore}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
