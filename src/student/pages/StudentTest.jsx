import React, { useState } from 'react';
import { 
  ClipboardList, 
  Dumbbell, 
  Search, 
  Calendar, 
  ArrowRight,
  Calculator,
  Book,
  Globe,
  Heart
} from 'lucide-react';
import mockExams from '../../data/mockExams';
import MissionCard from '../components/MissionCard';

/**
 * Student Test Page
 * Features a tabbed layout to separate "Ujian" (Exams) and "Latihan" (Practice).
 */
export default function StudentTest() {
  const [activeTab, setActiveTab] = useState('ujian'); // 'ujian' or 'latihan'

  // Filter exams for "Ujian" (Mock: current exams in mockExams)
  const exams = mockExams;

  // Mock data for "Latihan" (Practice)
  const practices = [
    { 
      id: 101, 
      subject: 'Latihan TKA Matematika', 
      icon: 'Calculator', 
      color: 'from-indigo-500 to-indigo-600', 
      bgLight: 'bg-indigo-50', 
      duration: 3600, 
      totalQuestions: 20, 
      status: 'available' 
    },
    { 
      id: 102, 
      subject: 'Latihan Bahasa Indonesia', 
      icon: 'Book', 
      color: 'from-blue-500 to-blue-600', 
      bgLight: 'bg-blue-50', 
      duration: 3000, 
      totalQuestions: 15, 
      status: 'available' 
    },
    { 
      id: 103, 
      subject: 'Simulasi Survei Karakter', 
      icon: 'Heart', 
      color: 'from-rose-500 to-rose-600', 
      bgLight: 'bg-rose-50', 
      duration: 1800, 
      totalQuestions: 10, 
      status: 'completed',
      score: 90
    },
  ];

  const currentItems = activeTab === 'ujian' ? exams : practices;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Pusat Ujian & Latihan
          </h1>
          <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
            Persiapkan dirimu untuk hasil terbaik
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari ujian atau latihan..." 
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm dark:text-white"
          />
        </div>
      </div>

      {/* Tabs System */}
      <div className="flex p-1.5 bg-slate-200/50 dark:bg-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('ujian')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${
            activeTab === 'ujian' 
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <ClipboardList size={18} />
          UJIAN RESMI
        </button>
        <button
          onClick={() => setActiveTab('latihan')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${
            activeTab === 'latihan' 
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Dumbbell size={18} />
          LATIHAN MANDIRI
        </button>
      </div>

      {/* Info Alert */}
      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
          <Calendar size={20} />
        </div>
        <div>
          <h4 className="font-black text-indigo-900 dark:text-indigo-100 text-sm">Jadwal Tryout Terdekat</h4>
          <p className="text-xs text-indigo-700 dark:text-indigo-300 font-bold opacity-80 uppercase tracking-wider">
            Senin, 14 April 2026 • 08:00 WIB
          </p>
        </div>
        <button className="ml-auto p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-all decoration-indigo-600 decoration-2 underline-offset-4 font-bold text-xs uppercase tracking-widest">
          Detail
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {currentItems.map((item) => (
          <MissionCard key={item.id} exam={item} />
        ))}
        
        {/* Empty State Mock */}
        {currentItems.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <ClipboardList size={40} />
            </div>
            <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">Belum ada item tersedia</p>
          </div>
        )}
      </div>

    </div>
  );
}
