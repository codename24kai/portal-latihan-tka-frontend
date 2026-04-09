import React from 'react';
import { 
  User, 
  Settings, 
  Camera, 
  Mail, 
  IdCard,
  Phone,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Student Setting Page
 * Clean and focused profile management view.
 */
export default function StudentSetting() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Pengaturan Akun
        </h1>
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
          Kelola profil dan preferensi aplikasi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        
        {/* Left Col: Profile Visual & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
            
            {/* Avatar Section */}
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 border-4 border-white dark:border-slate-700 shadow-xl flex items-center justify-center text-white text-4xl font-black overflow-hidden">
                BS
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-700 rounded-xl shadow-lg border border-slate-100 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
                <Camera size={20} />
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-black tracking-tight">Budi Santoso</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Siswa • Kelas 6-A</p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/50">
             <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                <ShieldCheck size={20} />
                <span className="text-sm font-black uppercase tracking-widest">Akun Terverifikasi</span>
             </div>
             <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold opacity-80 leading-relaxed uppercase tracking-tight">
                Data Anda telah disinkronkan dengan Dapodik Sekolah.
             </p>
          </div>
        </div>

        {/* Right Col: Detailed Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Identity Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Informasi Pribadi</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm">
                  <User size={16} /> Budi Santoso
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NISN</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm">
                  <IdCard size={16} /> 0012345678
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 italic font-bold text-sm">
                  <Mail size={16} /> budi.example@student.id
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 italic font-bold text-sm">
                  <Phone size={16} /> +62 812 3456 XXXX
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <button className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
                    <Bell size={20} />
                  </div>
                  <span className="font-bold text-sm">Notifikasi</span>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
             </button>

             <button className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group text-red-600 dark:text-red-400" onClick={handleLogout}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <span className="font-bold text-sm">Keluar Akun</span>
                </div>
                <ChevronRight size={18} className="text-red-200 dark:text-red-800 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

        </div>
      </div>

    </div>
  );
}
