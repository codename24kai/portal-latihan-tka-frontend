import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#0d9488', '#ea580c', '#3b82f6'];

export default function QuestionBankSummary({ data }) {
  const navigate = useNavigate();

  const chartData = React.useMemo(() => {
    return (data || []).map(item => ({
      name: item.subject,
      value: item.total
    }));
  }, [data]);

  const totalQuestions = React.useMemo(() => {
    return (data || []).reduce((acc, curr) => acc + curr.total, 0);
  }, [data]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-5 sm:p-6 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col transition-colors duration-300">

      {/* Header - Ditambahkan shrink-0 agar tidak tertekan */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Ringkasan Bank Soal</h2>
          <p className="text-[10px] font-black text-teal-600 mt-1 uppercase tracking-widest">Distribusi per Mata Pelajaran</p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
          <BookOpen size={20} />
        </div>
      </div>

      {/* Area Grafik - Tetap menggunakan flex-1 agar mengisi ruang kosong */}
      <div className="flex-1 min-h-[180px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 px-3 py-2 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg text-[11px] font-bold">
                      <p className="text-slate-500 dark:text-slate-400">{payload[0].name}</p>
                      <p className="text-indigo-600 dark:text-indigo-400 font-black mt-0.5">{payload[0].value} Soal</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', paddingBlock: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Wrapper Bawah - Ditambahkan mt-auto dan shrink-0 untuk mengunci posisi di dasar card */}
      <div className="mt-auto shrink-0 pt-4">
        {/* mt-4 dihapus dari div ini karena sudah digantikan oleh pt-4 di wrapper atasnya */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Total Soal</span>
          <span className="text-lg font-black text-slate-800 dark:text-white">
            {totalQuestions.toLocaleString('id-ID')} Soal
          </span>
        </div>

        {/* mt-4 juga dihapus di sini */}
        <button
          onClick={() => navigate('/admin/bank-soal')}
          className="w-full py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-200 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Kelola Bank Soal <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}