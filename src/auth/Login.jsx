import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, User, ArrowRight, AlertCircle, Info, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

/**
 * Premium Login Component
 * Design Philosophy: Typography-driven, High-contrast, Responsive Transformation
 * Mobile: Overlapping floating card on gradient header
 * Desktop: 55/45 split screen with immersive left visuals
 */
export default function Login() {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Mock Login Logic
    if (username === 'student' && password === '123') {
      localStorage.setItem('userRole', 'student');
      navigate('/');
    } else if (username === 'teacher' && password === '123') {
      localStorage.setItem('userRole', 'teacher');
      navigate('/teacher');
    } else if (username === 'admin' && password === '123') {
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
    } else {
      setError('Username atau password tidak valid. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-900 transition-colors duration-500 overflow-x-hidden text-slate-900 dark:text-white">

      {/* --- VISUAL SECTION --- */}
      {/* Mobile: Top Header | Desktop: Left Column (55%) */}
      <div className="relative w-full lg:w-[55%] lg:min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-teal-500 flex flex-col justify-center items-center p-8 pt-20 pb-32 lg:p-16 overflow-hidden">

        {/* Dynamic CSS Glow Blobs for Depth */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center lg:text-left max-w-2xl w-full">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-semibold mb-6 tracking-wide uppercase">
            Platform Edukasi Terpadu
          </div>

          <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] mb-4 lg:mb-8 drop-shadow-2xl">
            Portal Latihan <span className="text-teal-300">TKA</span>
          </h1>

          <p className="text-xl lg:text-3xl font-medium text-white/80 leading-relaxed max-w-lg">
            Satu langkah lebih dekat menuju impianmu. <br className="hidden lg:block" />
            <span className="text-white font-bold italic underline decoration-teal-400 decoration-2 underline-offset-4">Siap Taklukkan Ujian!</span>
          </p>
        </div>

        {/* Floating element for Desktop view only */}
        <div className="hidden lg:flex absolute bottom-12 left-16 items-center gap-4 text-white/50 text-sm">
          <div className="w-12 h-[1px] bg-white/30"></div>
          <span>© 2027 Portal Latihan SD. All Rights Reserved.</span>
        </div>
      </div>

      {/* --- FORM SECTION --- */}
      {/* Mobile: Overlapping Card | Desktop: Right Column (45%) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-4 sm:px-8 pb-16 lg:pb-0 relative z-20">

        {/* Theme Toggle (Fixed position for accessibility) */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-6 right-6 lg:top-10 lg:right-10 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:rotate-12 active:scale-90 z-50 focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-indigo-600" />}
        </button>

        {/* Login Card Container */}
        <div className="w-full max-w-[440px] bg-white dark:bg-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-8 sm:p-12 -mt-20 lg:mt-0 lg:p-4 lg:bg-transparent lg:dark:bg-transparent lg:shadow-none relative">

          <div className="flex flex-col items-center mb-10">
            <img
              src="/logo-sd-1.svg"
              alt="Logo SD"
              className="h-20 w-auto mb-6 drop-shadow-md"
            />
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Selamat Datang 👋</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Buka pintu kesuksesanmu sekarang.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="username">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white text-base transition-all placeholder:text-slate-400"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Key size={18} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white text-base transition-all placeholder:text-slate-400"
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:scale-[1.02] transition-all active:scale-[0.98] mt-4 group"
            >
              Masuk Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Premium Demo Hint Box */}
          <div className="mt-10 p-5 rounded-2xl bg-indigo-50/50 dark:bg-slate-900/50 border border-indigo-100 dark:border-slate-700">
            <h3 className="text-[11px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Info className="w-3.5 h-3.5" /> Demo Access Credentials
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Siswa', creds: 'student / 123' },
                { label: 'Guru', creds: 'teacher / 123' },
                { label: 'Admin', creds: 'admin / 123' }
              ].map((role) => (
                <div key={role.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">{role.label}</span>
                  <span className="bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-indigo-100 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 font-mono font-bold shadow-sm">
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
