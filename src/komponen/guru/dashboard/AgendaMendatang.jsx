import React from 'react';
import { CalendarDays, ArrowRight } from 'lucide-react';

export default function UpcomingAgenda() {
  const agendaItems = [];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Agenda Terdekat</h3>
        <CalendarDays size={20} className="text-slate-400" />
      </div>
      <div className="p-8">
        {agendaItems.length > 0 ? (
          <div className="space-y-6">
            {agendaItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start relative">
                {idx !== agendaItems.length - 1 && <div className="absolute left-2.5 top-8 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-slate-700" />}
                <div className="w-5 h-5 rounded-full border-4 border-orange-500 bg-white z-10" />
                <div className="flex-1 -mt-1">
                  <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.title}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{item.time}</p>
                </div>
                <button className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-orange-600 transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Belum ada agenda dari backend
          </div>
        )}
      </div>
    </div>
  );
}
