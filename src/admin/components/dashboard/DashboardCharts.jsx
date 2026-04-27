import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useDarkMode } from '@/hooks/useDarkMode';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
        <p className="font-black text-slate-800 dark:text-white mb-2 text-xs uppercase tracking-widest">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-500 dark:text-slate-400 font-medium">{entry.name}:</span>
              <span className="font-black text-slate-800 dark:text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function PerformanceTrendChart({ data }) {
  const { isDark } = useDarkMode();
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const tickColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Tren Performa Siswa</h2>
        <p className="text-xs font-bold text-teal-600 mt-1 uppercase tracking-widest">6 Bulan Terakhir</p>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: tickColor, fontWeight: 'bold' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: tickColor, fontWeight: 'bold' }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#14B8A6', strokeWidth: 2, strokeDasharray: '5 5' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Rata-rata Nilai"
              stroke="#14B8A6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorTrend)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ClassComparisonChart({ data }) {
  const { isDark } = useDarkMode();
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const tickColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Perbandingan Kelas</h2>
        <p className="text-xs font-bold text-orange-600 mt-1 uppercase tracking-widest">Berdasarkan Mata Pelajaran</p>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={12}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.5} />
            <XAxis 
              dataKey="subject" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: tickColor, fontWeight: 'bold' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: tickColor, fontWeight: 'bold' }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar 
              dataKey="classA" 
              name="Kelas 6A" 
              fill="#14B8A6" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={40} 
              animationDuration={1500}
            />
            <Bar 
              dataKey="classB" 
              name="Kelas 6B" 
              fill="#F59E0B" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={40} 
              animationDuration={1500}
              animationBegin={500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
