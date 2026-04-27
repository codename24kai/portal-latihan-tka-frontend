import React from 'react';
import { Users, ClipboardCheck, TrendingUp, BookOpen, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="w-16 h-6 bg-slate-100 dark:bg-slate-800 rounded-full" />
    </div>
    <div className="w-24 h-4 bg-slate-100 dark:bg-slate-800 rounded mb-2" />
    <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
  </div>
);

const StatCard = ({ icon: Icon, label, value, trend, color, isLoading }) => {
  if (isLoading) return <CardSkeleton />;

  const isPositive = trend > 0;
  
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  };

  return (
    <div className="group bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 ${colorClasses[color] || colorClasses.teal} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{value}</h3>
    </div>
  );
};

export default function StatCards({ data, isLoading }) {
  const stats = [
    { 
        icon: Users, 
        label: 'Total Siswa Aktif', 
        value: data?.totalSiswa || '0', 
        trend: data?.trends?.siswa || 12, 
        color: 'teal' 
    },
    { 
        icon: ClipboardCheck, 
        label: 'Tryout Aktif', 
        value: data?.activeTryouts || '0', 
        trend: data?.trends?.tryouts || 5, 
        color: 'orange' 
    },
    { 
        icon: TrendingUp, 
        label: 'Rata-rata Nilai', 
        value: data?.avgScore || '0.0', 
        trend: data?.trends?.score || -2, 
        color: 'indigo' 
    },
    { 
        icon: BookOpen, 
        label: 'Total Soal', 
        value: data?.totalQuestions || '0', 
        trend: data?.trends?.questions || 8, 
        color: 'amber' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} isLoading={isLoading} />
      ))}
    </div>
  );
}
