import React from 'react';
import { BookOpen } from 'lucide-react';

export default function QuestionBankSummary({ data }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Ringkasan Bank Soal</h2>
          <p className="text-[10px] font-black text-orange-600 mt-1 uppercase tracking-widest">Distribusi Kesulitan</p>
        </div>
        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600">
          <BookOpen size={20} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left pb-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mapel</th>
              <th className="text-center pb-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest">Mudah</th>
              <th className="text-center pb-4 text-[10px] font-black text-amber-500 uppercase tracking-widest">Sedang</th>
              <th className="text-center pb-4 text-[10px] font-black text-rose-500 uppercase tracking-widest">Sulit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {data?.map((item, index) => (
              <tr key={index} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-4">
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-teal-600 transition-colors">{item.subject}</span>
                </td>
                <td className="py-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200">{item.easy}</span>
                    <div className="w-8 h-1 bg-emerald-100 dark:bg-emerald-500/20 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(item.easy / item.total) * 100}%` }} />
                    </div>
                  </div>
                </td>
                <td className="py-4 text-center">
                   <div className="inline-flex flex-col items-center">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200">{item.medium}</span>
                    <div className="w-8 h-1 bg-amber-100 dark:bg-amber-500/20 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(item.medium / item.total) * 100}%` }} />
                    </div>
                  </div>
                </td>
                <td className="py-4 text-center">
                   <div className="inline-flex flex-col items-center">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200">{item.hard}</span>
                    <div className="w-8 h-1 bg-rose-100 dark:bg-rose-500/20 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(item.hard / item.total) * 100}%` }} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Total Soal Keseluruhan</span>
            <span className="text-lg font-black text-slate-800 dark:text-white">
                {data?.reduce((acc, curr) => acc + curr.total, 0) || 0}
            </span>
        </div>
      </div>
    </div>
  );
}
