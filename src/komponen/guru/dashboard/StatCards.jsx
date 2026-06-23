import React from 'react';
import { Users, ClipboardList, BookOpen } from 'lucide-react';

export default function StatCards({ metrics, isLoading }) {
  const statCards = [
    { label: 'Total Siswa', value: metrics.totalSiswa, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Rata-rata Matematika', value: metrics.avgMath, icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Rata-rata B. Indonesia', value: metrics.avgIndo, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Partisipasi Tryout', value: metrics.participation, icon: ClipboardList, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  {card.label}
                </p>
                <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">
                  {isLoading ? '...' : card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
