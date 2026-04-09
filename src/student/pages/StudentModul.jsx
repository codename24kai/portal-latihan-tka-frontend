import React from 'react';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Download, 
  ChevronRight,
  Calculator,
  Globe,
  Heart,
  Book,
  PenTool
} from 'lucide-react';

/**
 * Student Modul Page
 * Displays a catalog of learning materials in a grid-responsive layout.
 */
export default function StudentModul() {
  
  // Mock Modules Data
  const modules = [
    { 
      id: 1, 
      title: 'Modul Bahasa Indonesia Kelas 6', 
      subject: 'Bahasa Indonesia', 
      pages: 45, 
      size: '2.4 MB', 
      icon: Book, 
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
    },
    { 
      id: 2, 
      title: 'Ringkasan Materi Matematika Dasar', 
      subject: 'Matematika', 
      pages: 32, 
      size: '1.8 MB', 
      icon: Calculator, 
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
    },
    { 
      id: 3, 
      title: 'Panduan Survei Karakter & Lingkungan', 
      subject: 'Umum', 
      pages: 20, 
      size: '1.2 MB', 
      icon: Heart, 
      color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
    },
    { 
      id: 4, 
      title: 'Latihan Soal Literasi Membaca', 
      subject: 'Bahasa Indonesia', 
      pages: 28, 
      size: '1.5 MB', 
      icon: PenTool, 
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
    },
    { 
      id: 5, 
      title: 'Geografi & Ekosistem Alam', 
      subject: 'IPA/IPS', 
      pages: 50, 
      size: '3.1 MB', 
      icon: Globe, 
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' 
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Katalog Modul Belajar
          </h1>
          <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
            Perluas wawasanmu dengan materi berkualitas
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari modul belajar..." 
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div 
            key={mod.id} 
            className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${mod.color}`}>
                <mod.icon size={28} />
              </div>
              <h3 className="text-lg font-black leading-tight mb-2 pr-4">{mod.title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{mod.subject}</p>
              
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-8 lowercase tracking-tight">
                <span className="flex items-center gap-1.5"><FileText size={14} className="text-slate-300" /> {mod.pages} halaman</span>
                <span className="flex items-center gap-1.5"><Download size={14} className="text-slate-300" /> {mod.size}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
                Baca Sekarang
              </button>
              <button className="p-3.5 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95">
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Explore More Card */}
        <button className="border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors group">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-400 transition-colors">
            <BookOpen size={30} />
          </div>
          <div>
            <span className="block font-black text-slate-400 dark:text-slate-500 text-sm uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">Telusuri Lainnya</span>
            <p className="text-xs text-slate-300 dark:text-slate-600 font-bold tracking-tight">Katalog modul akan selalu diperbarui secara berkala</p>
          </div>
        </button>
      </div>

    </div>
  );
}
