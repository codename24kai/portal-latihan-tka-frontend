import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, MapPin, Edit, Key, Phone } from 'lucide-react';
import { getProfilAdmin } from '@/utilitas/apiAdmin';

export default function ProfilAdmin() {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        setLoading(true);
        const data = await getProfilAdmin();
        setProfil(data);
      } catch (error) {
        console.warn("Gagal memuat profil admin dari backend.");
        setProfil(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 animate-pulse">Memuat Profil...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen animate-in fade-in duration-500">
      
      {/* HEADER & COVER */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-slate-700 to-slate-900 relative">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="px-8 pb-8 relative">
          {/* Avatar */}
          <div className="flex justify-between items-end -mt-16 mb-6 relative z-10">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-slate-100 flex items-center justify-center shadow-lg overflow-hidden">
              <User size={64} className="text-slate-400" />
            </div>
            <div className="flex gap-3">
              <button className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white rounded-xl hover:bg-slate-200 transition-colors">
                <Key size={18} />
              </button>
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                <Edit size={16} /> Edit Profil
              </button>
            </div>
          </div>

          {/* Info Utama */}
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white">{profil?.nama_lengkap || '-'}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                <Shield size={14} /> {profil?.role || '-'}
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-widest">
                {profil?.status || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INFORMASI DETAIL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white mb-4">Informasi Kontak</h2>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{profil?.email || '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nomor Telepon</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{profil?.no_hp || '-'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white mb-4">Informasi Akun</h2>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bergabung Sejak</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{profil?.bergabung_sejak || '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lokasi Akses</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{profil?.lokasi || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
