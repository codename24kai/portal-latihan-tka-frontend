import React from 'react';
import {
  TrendingUp,
  Clock,
  ArrowRight,
  BookOpen,
  Gamepad2,
  GraduationCap,
  Calendar,
  ChevronRight,
  Calculator,
  Globe,
  Heart,
  Book,
  Trees
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis
} from 'recharts';
import mockExams from '../../data/mockExams';
import MissionCard from '../components/MissionCard';
import { useDarkMode } from '../../hooks/useDarkMode';

/**
 * Enhanced Student Dashboard
 * Features:
 * 1. Profile Welcome Header
 * 2. Radial Chart Stats for Subjek
 * 3. Horizontal/Compact Overview Ujian
 * 4. Grid Overview Modul
 */

// Mock User Data
const userData = {
  name: 'Budi Santoso',
  school: 'SD Negeri 1 Merdeka',
  class: 'Kelas 6-A',
  avatar: 'BS'
};

// Mock Module Data (Simplified for Overview)
const recentModules = [
  { id: 1, title: 'Aljabar Dasar', subject: 'Matematika', icon: Calculator, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { id: 2, title: 'Kalimat Majemuk', subject: 'Bahasa Indonesia', icon: Book, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 4, title: 'Teks Prosedur', subject: 'B. Indonesia', icon: Book, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
];

export default function StudentDashboard() {
  const { isDark } = useDarkMode();

  // Transform mockExams for the Radial Chart
  // We'll take the score or 0 if not completed
  const chartData = mockExams.map(exam => {
    let displayName = exam.subject;
    let fill = '#6366f1'; // Default Indigo

    // Formatting Names & Colors per requirements
    if (exam.subject.includes('Matematika')) {
      displayName = 'MATEMATIKA';
      fill = '#6366f1';
    } else if (exam.subject.includes('Bahasa')) {
      displayName = 'B. INDONESIA';
      fill = '#3b82f6';
    } else if (exam.subject.includes('Lingkungan')) {
      displayName = 'SURVEI LINGKUNGAN';
      fill = '#10b981'; // Emerald/Green
    } else if (exam.subject.includes('Karakter')) {
      displayName = 'SURVEI KARAKTER';
      fill = '#f59e0b'; // Amber/Yellow
    }

    return {
      id: exam.id,
      name: displayName,
      value: exam.score || 0,
      fill: fill
    };
  });

  return (
    <div id="student-dashboard" className="space-y-8 animate-fade-in">

      {/* 1. PROFILE HEADER */}
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg border-2 border-white dark:border-slate-800">
            {userData.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
              Halo, {userData.name.split(' ')[0]}! 👋
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <GraduationCap size={14} className="text-slate-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {userData.school} • {userData.class}
              </p>
            </div>
          </div>
        </div>
        <button className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-slate-400 hover:text-indigo-600 transition-colors">
          <Calendar size={20} />
        </button>
      </section>

      {/* 2. STATS SECTION (Score Visualization) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8 text-slate-900 dark:text-white">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">Capaian Nilai</h3>
              <p className="text-xs font-bold text-slate-400 tracking-widest mt-0.5">Ringkasan Skor Target Literasi & Karakter</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-black italic">
              <TrendingUp size={14} /> +12%
            </div>
          </div>

          <div className="h-[280px] w-full min-h-[280px] min-w-0 flex items-center justify-center relative">
            <ResponsiveContainer width="99%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="90%"
                barSize={12}
                data={chartData}
                startAngle={90}
                endAngle={450}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  minAngle={15}
                  background={{ fill: isDark ? '#1e293b' : '#f1f5f9' }}
                  clockWise
                  dataKey="value"
                  cornerRadius={30}
                />
              </RadialBarChart>
            </ResponsiveContainer>

            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800 dark:text-white">85</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">Rata-rata</span>
            </div>
          </div>

          {/* Legend Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-6 border-t border-slate-50 dark:border-slate-700/50">
            {chartData.map((item) => (
              <div key={item.id} className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase truncate">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-800 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Streak / Summary Card */}
        <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
              <Gamepad2 size={24} />
            </div>
            <h4 className="text-2xl font-black leading-tight mb-2">Terus Pertahankan Semangatmu!</h4>
            <p className="text-indigo-100/70 text-sm font-medium">Kamu telah aktif selama 5 hari berturut-turut.</p>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-white/90">Minggu Ke-2</span>
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">75% Selesai</span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-[75%] shadow-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. OVERVIEW UJIAN/LATIHAN */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Overview Ujian</h3>
          <Link to="/test" className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 hover:underline">
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockExams.slice(0, 2).map((exam) => (
            <MissionCard key={exam.id} exam={exam} />
          ))}
        </div>
      </section>

      {/* 4. OVERVIEW MODUL */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Overview Modul</h3>
          <Link to="/modules" className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 hover:underline">
            Katalog Lengkap <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentModules.map((module) => (
            <Link
              to="/modules"
              key={module.id}
              className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${module.bg} ${module.color}`}>
                <module.icon size={24} />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-black text-slate-800 dark:text-white text-sm truncate">{module.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{module.subject}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
