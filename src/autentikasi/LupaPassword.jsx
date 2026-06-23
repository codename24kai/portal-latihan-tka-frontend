import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Key, CheckCircle2, AlertCircle, Calendar, Shield, Fingerprint, Lock, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/utilitas/api';

const MOCK_ACCOUNTS = [
  { username: 'student', name: 'Ahmad Fauzi', role: 'student', roleLabel: 'Siswa', lastLogin: '2026-04-01 08:30', resetPasswordTemplate: 'siswasd123' },
  { username: 'student1', name: 'Ahmad Rafiq', role: 'student', roleLabel: 'Siswa', lastLogin: '2026-03-28 10:15', resetPasswordTemplate: 'siswasd123' },
  { username: 'student2', name: 'Budi Santoso', role: 'student', roleLabel: 'Siswa', lastLogin: '2026-03-29 14:22', resetPasswordTemplate: 'siswasd123' },
  { username: 'student3', name: 'Citra Kirana', role: 'student', roleLabel: 'Siswa', lastLogin: '2026-03-31 09:45', resetPasswordTemplate: 'siswasd123' },
  { username: 'guru', name: 'Budi Pratama, S.Pd.', role: 'guru', roleLabel: 'Guru', lastLogin: '2026-03-31 16:50', resetPasswordTemplate: 'gurusd123' },
  { username: 'admin', name: 'Administrator', role: 'admin', roleLabel: 'Admin', lastLogin: '2026-04-01 07:12', resetPasswordTemplate: 'adminsd123' },
  { username: 'admin1', name: 'Dewi Lestari', role: 'admin', roleLabel: 'Admin', lastLogin: '2026-03-30 11:05', resetPasswordTemplate: 'adminsd123' },
];

export default function LupaPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [step, setStep] = useState(1); // 1: Check Username, 2: Info & Reset, 3: Success Reset
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/assets/profile/sdn-mcl-2-1.jpg',
    '/assets/profile/sdn-mcl-2-2.jpg',
    '/assets/profile/sdn-mcl-2-3.jpeg',
    '/assets/profile/sdn-mcl-2.jpg'
  ];

  // Image Slider Background Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleCheckUsername = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim().toLowerCase();
    try {
      const response = await api.post('/auth/forgot-password/check', { username: trimmedUsername });
      const user = response.data.data;
      setFoundUser(user);
      setStep(2);
      toast.success('Username ditemukan!', {
        duration: 3000,
        style: {
          borderRadius: '1rem',
          background: '#14b8a6',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Username tidak terdaftar di sistem. Silakan periksa kembali.');
      }
    }
  };

  const handleResetPassword = async () => {
    if (!foundUser) return;

    try {
      await api.post('/auth/forgot-password/reset', { username: foundUser.username });
      setStep(3);

      toast.success('Password berhasil direset!', {
        duration: 4000,
        icon: '🔐',
        style: {
          borderRadius: '1rem',
          background: '#f97316',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      });
    } catch (err) {
      toast.error('Gagal mereset password. Silakan coba lagi.');
    }
  };

  const handleCopyPassword = () => {
    if (!foundUser) return;
    navigator.clipboard.writeText(foundUser.resetPasswordTemplate);
    setIsCopied(true);
    toast.success('Password disalin ke clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-white transition-colors duration-500 overflow-x-hidden lg:overflow-hidden text-slate-900">
      
      {/* --- VISUAL SECTION (LIVE SLIDER) --- */}
      <div className="relative w-full lg:w-[55%] h-[40vh] lg:h-full flex flex-col justify-center items-center p-8 lg:p-12 overflow-hidden bg-slate-950">
        
        {/* Live Slider Background */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={images[currentImageIndex]}
                alt="School Environment"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 text-center lg:text-left max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold mb-4 tracking-wide uppercase"
          >
            Layanan Reset Akun Mandiri
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-2xl uppercase"
          >
            Lupa <span className="text-orange-300">Password?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm lg:text-base font-medium text-white/90 leading-relaxed max-w-md drop-shadow-lg"
          >
            Sistem Pemulihan Kredensial Guru & Murid Portal Latihan TKA UPTD SDN MUNCUL 02.
          </motion.p>
        </div>

        <div className="hidden lg:flex absolute bottom-8 left-12 items-center gap-4 text-white/70 text-xs font-bold z-10">
          <div className="w-12 h-[1.5px] bg-white/40"></div>
          <span>© 2027 Portal Latihan TKA | UPTD SDN MUNCUL 02</span>
        </div>
      </div>

      {/* --- FORM SECTION --- */}
      <div 
        className="w-full lg:w-[45%] h-auto lg:h-full flex flex-col justify-center items-center px-4 sm:px-8 py-10 lg:py-0 relative z-20" 
        style={{ backgroundImage: 'linear-gradient(135deg, #fef08a 0%, #fed7aa 35%, #bae6fd 70%, #86efac 100%)' }}
      >
        {/* Card Container */}
        <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 sm:p-8 -mt-10 lg:mt-0 relative">
          
          {/* Back Button */}
          {step < 3 && (
            <button
              onClick={() => {
                if (step === 2) {
                  setStep(1);
                  setFoundUser(null);
                } else {
                  navigate('/login');
                }
              }}
              className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={16} /> Kembali
            </button>
          )}

          {/* Heading */}
          <div className="flex flex-col items-center mb-6 mt-4">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src="/logo-sd.png"
              alt="Logo SD"
              className="h-14 w-auto mb-3 drop-shadow-sm"
            />
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-800 tracking-tight mb-1 uppercase">Reset Password</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {step === 1 && 'Periksa Ketersediaan Akun'}
                {step === 2 && 'Konfirmasi Informasi Akun'}
                {step === 3 && 'Kredensial Baru Berhasil Dibuat'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: INPUT USERNAME */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleCheckUsername}
                className="space-y-4"
              >
                {error && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="font-bold leading-normal">{error}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1" htmlFor="username">
                    Username Akun
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      id="username"
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-slate-900 text-sm font-bold transition-all placeholder:text-slate-400"
                      placeholder="Masukkan username anda"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-600/15 hover:scale-[1.02] transition-all active:scale-[0.98] mt-4"
                >
                  Cari Akun Saya
                </button>
              </motion.form>
            )}

            {/* STEP 2: SHOW ACCOUNT INFO & CONFIRM */}
            {step === 2 && foundUser && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Account Details Box */}
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-5 space-y-4">
                  <div className="flex items-center gap-4 border-b border-slate-200/60 pb-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-lg">
                      {foundUser.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</p>
                      <p className="text-sm font-black text-slate-800 truncate uppercase">{foundUser.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Shield size={10} className="text-orange-500" /> Peran Akun
                      </p>
                      <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{foundUser.roleLabel}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar size={10} className="text-teal-500" /> Login Terakhir
                      </p>
                      <p className="text-[10px] font-bold text-slate-600 font-mono">{foundUser.lastLogin}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
                    <AlertCircle size={14} className="text-amber-500 shrink-0" />
                    <p className="text-[9px] font-bold text-amber-700 uppercase leading-normal">
                      Menyetujui reset akan mengembalikan sandi ke setelan default sistem.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setStep(1);
                      setFoundUser(null);
                    }}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    Bukan Saya
                  </button>
                  <button
                    onClick={handleResetPassword}
                    className="flex-[2] py-4 bg-teal-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-colors active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Key size={14} /> Reset Sandi Sekarang
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SUCCESSFUL RESET SCREEN */}
            {step === 3 && foundUser && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 text-center"
              >
                <div className="flex justify-center mb-1">
                  <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-500 shadow-inner">
                    <CheckCircle2 size={44} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Sandi Telah Diubah</h3>
                  <p className="text-xs text-slate-400 font-bold max-w-xs mx-auto">
                    Sandi akun untuk username <span className="font-mono text-slate-700 font-black">{foundUser.username}</span> telah berhasil diubah menjadi sandi default berikut:
                  </p>
                </div>

                {/* Password Template Copy Box */}
                <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                      <Lock size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Password Baru</p>
                      <code className="text-sm font-black font-mono text-slate-800 tracking-wider">
                        {foundUser.resetPasswordTemplate}
                      </code>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyPassword}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isCopied 
                        ? 'bg-teal-50 border-teal-200 text-teal-600' 
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100 flex items-start gap-2.5 text-left">
                  <Fingerprint size={16} className="text-teal-600 shrink-0 mt-0.5" />
                  <p className="text-[9px] font-bold text-teal-700 uppercase leading-relaxed">
                    Demi keamanan akun, pastikan Anda segera masuk dan merubah password default ini dari menu pengaturan profil.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98] mt-3"
                >
                  Kembali ke Halaman Masuk
                </button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}
