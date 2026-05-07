import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, User, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Login Component
 * Refactored with Live Slider Background and Clean UI
 */
export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/assets/profile/sdn-mcl-2-1.jpg',
    '/assets/profile/sdn-mcl-2-2.jpg',
    '/assets/profile/sdn-mcl-2-3.jpeg',
    '/assets/profile/sdn-mcl-2.jpg'
  ];

  // Image Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Mock Login Logic
    if (username === 'student' && password === '123') {
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('assignedClass', '6A');
      navigate('/');
    } else if (username === 'guru' && password === '123') {
      localStorage.setItem('userRole', 'guru');
      localStorage.setItem('assignedClass', '6A');
      navigate('/guru');
    } else if (username === 'admin' && password === '123') {
      localStorage.setItem('userRole', 'admin');
      localStorage.removeItem('assignedClass');
      navigate('/admin');
    } else {
      setError('Username atau password tidak valid. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white transition-colors duration-500 overflow-x-hidden text-slate-900">

      {/* --- VISUAL SECTION (LIVE SLIDER) --- */}
      <div className="relative w-full lg:w-[55%] lg:min-h-screen flex flex-col justify-center items-center p-8 pt-20 pb-32 lg:p-16 overflow-hidden bg-slate-950">

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
              {/* Overlay for readability - slightly darker for the 'dark' theme */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 text-center lg:text-left max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-6 tracking-wide uppercase"
          >
            Platform Edukasi UPTD SDN MUNCUL 02
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] mb-4 lg:mb-8 drop-shadow-2xl"
          >
            Portal Latihan <span className="text-orange-300">TKA</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl lg:text-3xl font-medium text-white leading-relaxed max-w-lg drop-shadow-lg"
          >
            Satu langkah lebih dekat menuju impianmu. <br className="hidden lg:block" />
            <span className="text-white font-black italic underline decoration-orange-400 decoration-4 underline-offset-8">Siap Taklukkan Ujian!</span>
          </motion.p>
        </div>

        {/* Floating element for Desktop view only */}
        <div className="hidden lg:flex absolute bottom-12 left-16 items-center gap-4 text-white/70 text-sm font-bold z-10">
          <div className="w-12 h-[1.5px] bg-white/40"></div>
          <span>© 2027 Portal Latihan TKA | UPTD SDN MUNCUL 02. All Rights Reserved</span>
        </div>
      </div>

      {/* --- FORM SECTION --- */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-4 sm:px-8 pb-16 lg:pb-0 relative z-20 bg-gradient-to-br from-yellow-200 via-orange-200 to-emerald-200" style={{ backgroundImage: 'linear-gradient(135deg, #fef08a 0%, #fed7aa 35%, #bae6fd 70%, #86efac 100%)' }}>

        {/* Login Card Container */}
        <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-8 sm:p-12 -mt-20 lg:mt-0 relative">

          <div className="flex flex-col items-center mb-10">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src="/logo-sd-1.svg"
              alt="Logo SD"
              className="h-20 w-auto mb-6 drop-shadow-md"
            />
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Selamat Datang 👋</h2>
              <p className="text-slate-500 font-medium">Buka pintu kesuksesanmu sekarang.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">{error}</p>
              </motion.div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1" htmlFor="username">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 text-base transition-all placeholder:text-slate-400"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
                    <Key size={18} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 text-base transition-all placeholder:text-slate-400"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-100 hover:scale-[1.02] transition-all active:scale-[0.98] mt-4 group"
            >
              Masuk Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Premium Demo Hint Box */}
          <div className="mt-10 p-5 rounded-2xl bg-orange-50/50 border border-orange-100">
            <h3 className="text-[11px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Info className="w-3.5 h-3.5" /> Demo Access Credentials
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Siswa', creds: 'student / 123' },
                { label: 'Guru', creds: 'guru / 123' },
                { label: 'Admin', creds: 'admin / 123' }
              ].map((role) => (
                <div key={role.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">{role.label}</span>
                  <span className="bg-white px-3 py-1 rounded-lg border border-orange-100 text-orange-700 font-mono font-bold shadow-sm">
                    {role.creds}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
