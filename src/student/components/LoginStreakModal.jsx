import React from 'react';
import { X, Star, Calendar, Flame } from 'lucide-react';

export default function LoginStreakModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Real-time calendar logic
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  const daysInMonthCount = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

  // Get first day of month. Native getDay() gives Sunday=0, Monday=1, ...
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // Map Native 0 (Sun) -> 6, 1 (Mon) -> 0, ..., 6 (Sat) -> 5
  const offset = (firstDay + 6) % 7;
  const emptySlots = Array.from({ length: offset }, (_, i) => i);

  // Mock logged in days up to today to show an impressive streak
  const loggedInDays = Array.from({ length: currentDate }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 sm:absolute sm:inset-auto sm:top-full sm:right-0 sm:mt-4 z-[100] flex items-center justify-center sm:block p-4 sm:p-0">
      {/* Backdrop: Fixed on mobile, invisible fixed layer on desktop for outside clicks */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none z-[-1]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[340px] sm:max-w-none sm:w-80 bg-white dark:bg-slate-800 rounded-[2.5rem] sm:rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 sm:zoom-in-100 sm:slide-in-from-top-4 duration-300">

        {/* Header background pattern */}
        <div className="absolute top-0 left-0 w-full h-28 sm:h-24 bg-gradient-to-br from-orange-400 to-orange-600" />
        <div className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-white/20 rounded-full blur-[30px]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/20 transition-colors"
        >
          <X size={18} className="sm:w-3.5 sm:h-3.5" />
        </button>

        <div className="relative z-10 pt-8 sm:pt-6 px-6 sm:px-6 pb-8 sm:pb-6 flex flex-col items-center text-center">

          <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-white dark:bg-slate-800 shadow-xl border-4 border-orange-100 dark:border-slate-700 flex items-center justify-center mb-4 sm:mb-4 translate-y-[-20%] text-orange-500">
            <Flame size={40} className="animate-pulse sm:w-8 sm:h-8" />
          </div>

          <div className="-mt-4 sm:-mt-1 ">
            <h2 className="text-xl sm:text-lg font-black text-slate-800 dark:text-white mb-2 mt-4  sm:mb-2 leading-tight tracking-tight px-2">Daily Streak Kamu !</h2>

            <div className="inline-flex items-center gap-2 px-5 py-2 sm:px-4 sm:py-1.5 bg-orange-50 dark:bg-orange-500/10 rounded-full border border-orange-100 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 mt-1">
              <span className="text-3xl sm:text-2xl font-black">{loggedInDays.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest leading-tight text-left">Hari<br />Berturut-turut</span>
            </div>
          </div>

          <div className="w-full mt-8 sm:mt-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] sm:rounded-2xl p-6 sm:p-4 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Kalender Bulan Ini
              </h3>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-1.5">
              {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, i) => (
                <div key={i} className="text-center text-[10px] font-black text-slate-400 mb-1">{day}</div>
              ))}
              {/* Fill some empty slots for offset */}
              {emptySlots.map(slot => <div key={`empty-${slot}`} />)}
              {daysInMonth.map(day => {
                const isActive = loggedInDays.includes(day);
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center relative ${isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/40'
                      : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'
                      }`}
                  >
                    {isActive ? (
                      <Star size={14} className="sm:w-3 sm:h-3 fill-current text-yellow-300" />
                    ) : (
                      <span className="text-[10px] font-bold">{day}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-8 sm:mt-6 w-full py-4 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl sm:rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-teal-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Oke, Semangat!
          </button>
        </div>
      </div>
    </div>
  );
}
