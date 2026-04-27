import React from 'react';
import { Activity, Clock, User, CheckCircle, HelpCircle } from 'lucide-react';

const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'finish': return <CheckCircle size={14} className="text-emerald-500" />;
    case 'start': return <Activity size={14} className="text-blue-500" />;
    case 'login': return <User size={14} className="text-indigo-500" />;
    default: return <HelpCircle size={14} className="text-slate-400" />;
  }
};

export default function ActivityLog({ activities }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Log Aktivitas Terbaru</h2>
          <p className="text-[10px] font-black text-teal-600 mt-1 uppercase tracking-[0.2em]">Real-time Tracker</p>
        </div>
        <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-sm active:scale-95">
          Lihat Semua
        </button>
      </div>

      <div className="flex-1 space-y-6">
        {activities?.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="flex gap-4 relative group">
              {/* Timeline Connector */}
              {index !== activities.length - 1 && (
                <div className="absolute top-10 left-5 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800 -mb-6" />
              )}
              
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 z-10 transition-transform group-hover:scale-110">
                <ActivityIcon type={activity.type} />
              </div>
              
              <div className="flex-1 pb-6 border-b border-slate-50 dark:border-slate-800/50 last:border-none">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-teal-600 transition-colors">
                      {activity.user} <span className="font-bold text-slate-400 dark:text-slate-500 text-xs">— {activity.description}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-teal-600 uppercase tracking-tighter">{activity.subject}</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{activity.class}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-600 text-[10px] font-black uppercase tracking-tighter">
                    <Clock size={10} />
                    {activity.time}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 opacity-50 grayscale dark:opacity-30">
            <Activity size={40} className="text-slate-400 mb-4" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Belum Ada Aktivitas</p>
          </div>
        )}
      </div>
    </div>
  );
}
