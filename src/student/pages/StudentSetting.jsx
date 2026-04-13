import React, { useState } from 'react';
import { 
  User, 
  IdCard,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Lock,
  Key,
  CheckCircle2,
  History,
  UserCircle,
  Save,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mockExams from '../../data/mockExams';

/**
 * Student Setting Page - Overhauled with Modal Pattern
 * Features:
 * 1. Simple Gender-based Avatar
 * 2. Identity Refactor (Nama & NISN Only)
 * 3. Riwayat Belajar Section (Completed Exams)
 * 4. Ganti Password (Modal Feature)
 */
export default function StudentSetting() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock User Data
  const userData = {
    name: 'Budi Kialang',
    school: 'SD Negeri Muncul 02',
    class: 'Kelas 6-A',
    gender: 'Laki-laki',
    nisn: '0012345678'
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Filter completed exams for "Riwayat Belajar"
  const historyExams = mockExams.filter(exam => exam.status === 'completed');
  const isMale = userData.gender === 'Laki-laki';

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-white pb-10">
      
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Pengaturan Akun
        </h1>
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
          Kelola profil dan pantau progres belajar Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Profile Visual & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
            
            {/* Gender-based Avatar */}
            <div className="relative mb-6">
              <div className={`w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-700 shadow-xl flex items-center justify-center text-white overflow-hidden ${
                isMale 
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                  : 'bg-gradient-to-br from-pink-500 to-rose-600'
              }`}>
                <UserCircle size={80} className="text-white/90" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-md border border-slate-100 dark:border-slate-600 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">
                {userData.gender}
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-black tracking-tight">{userData.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                {userData.school} • {userData.class}
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/50">
             <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                <ShieldCheck size={20} />
                <span className="text-sm font-black uppercase tracking-widest">Akun Terverifikasi</span>
             </div>
             <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold opacity-80 leading-relaxed tracking-tight">
                Data Anda telah disinkronkan dengan Dapodik Sekolah.
             </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. IDENTITY SECTION */}
          <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <User size={16} /> Informasi Identitas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm">
                   {userData.name}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NISN</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm">
                   {userData.nisn}
                </div>
              </div>
            </div>
          </section>

          {/* 2. RIWAYAT BELAJAR SECTION */}
          <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <History size={16} /> Riwayat Belajar
            </h3>
            
            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mata Pelajaran</th>
                    <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Selesai</th>
                    <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {historyExams.length > 0 ? (
                    historyExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{exam.subject}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{exam.deadline || 'Selesai'}</span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black">
                            {exam.score}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-5 py-10 text-center">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Belum ada riwayat ujian.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. GANTI PASSWORD ACTION (Trigger for Modal) */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-indigo-500/50 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/30"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-[0.2em]">Keamanan & Password</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ganti kata sandi secara berkala</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 4. LOGOUT SECTION - Mobile Only */}
          <button 
            onClick={handleLogout}
            className="md:hidden w-full flex items-center justify-between p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group text-red-600 dark:text-red-400"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
                <LogOut size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Keluar Akun</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Akhiri sesi belajar Anda</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-red-200 dark:text-red-800 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </div>

      {/* ==========================================
          MODAL: CHANGE PASSWORD
          ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-700 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Ganti Password</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
                id="close-password-modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Lama</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Key size={18} />
                    </span>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold text-sm text-slate-700 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Lock size={18} />
                    </span>
                    <input 
                      type="password" 
                      placeholder="Minimal 8 karakter"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold text-sm text-slate-700 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Password Baru</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <CheckCircle2 size={18} />
                    </span>
                    <input 
                      type="password" 
                      placeholder="Ulangi password baru"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold text-sm text-slate-700 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                    <Save size={18} /> Simpan Perubahan
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
