import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Users, TrendingUp, TrendingDown, ChevronDown, Plus, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../../../components/ui/Badge';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'active':
      return <Badge text="Sedang Berlangsung" variant="Success" className="text-[9px] bg-emerald-500 text-white border-none px-2" />;
    case 'completed':
      return <Badge text="Sudah Selesai" variant="Neutral" className="text-[9px] bg-slate-400 text-white border-none px-2" />;
    case 'waiting':
      return <Badge text="Belum Dilaksanakan" variant="Info" className="text-[9px] bg-blue-500 text-white border-none px-2" />;
    default:
      return null;
  }
};

export default function DashboardCalendar({ events }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = today.toLocaleDateString('id-ID', options);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500 overflow-hidden group/calendar relative">

      {/* Decorative background icon */}
      <CalendarIcon className="absolute -right-10 -bottom-10 w-64 h-64 text-slate-50 dark:text-slate-800/20 rotate-12 transition-transform duration-700 group-hover/calendar:scale-110 pointer-events-none opacity-50" />

      {/* HEADER / TOGGLE */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group/header relative z-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 dark:bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 transition-transform group-hover/header:rotate-12 group-hover/header:scale-110 duration-500">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic text-balance">
              Agenda dan Jadwal <span className="text-teal-600 font-black not-italic">Latihan</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dateString}</p>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                {events?.length || 0} Terjadwal
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 active:scale-95 z-20"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddModal(true);
            }}
          >
            <Plus size={14} />
            Atur Jadwal Baru
          </button>
          <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 transition-all duration-300 ${isExpanded ? 'rotate-180 bg-teal-50 dark:bg-teal-900/30 text-teal-600 border-teal-100' : ''}`}>
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* COLLAPSIBLE CONTENT */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 40 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
              {events?.length > 0 ? (
                events.map((event, index) => (
                  <div
                    key={index}
                    className="group/item relative p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-transparent hover:border-teal-100 dark:hover:border-teal-900/30 transition-all hover:shadow-xl hover:shadow-teal-500/5 flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <StatusBadge status={event.status} />
                      <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                        <Clock size={11} />
                        {event.time}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4
                        className="text-md font-black text-slate-800 dark:text-white leading-tight group-hover/item:text-teal-600 transition-colors cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.title}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500 mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    {/* Progress Stat */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Users size={11} /> {event.completed}/{event.total} Siswa
                        </span>
                        <span className="text-[10px] font-black text-teal-600">{Math.round((event.completed / event.total) * 100)}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${event.status === 'completed' ? 'bg-slate-400' : 'bg-teal-500'}`}
                          style={{ width: `${(event.completed / event.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Action */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin size={11} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">{event.location}</span>
                      </div>
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="text-[10px] font-black text-teal-600 uppercase hover:underline flex items-center gap-1 group/btn"
                      >
                        Detail <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 flex flex-col items-center justify-center opacity-30">
                  <CalendarIcon size={64} className="text-slate-300 mb-4" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Tidak Ada Agenda Mendatang</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      {(selectedEvent || showAddModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-2xl relative animate-in zoom-in duration-300">
            <button
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 transition-colors"
              onClick={() => { setSelectedEvent(null); setShowAddModal(false); }}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
              {showAddModal ? 'Buat Agenda Baru' : 'Detail Agenda'}
            </h3>
            <div className="p-8 border-2 border-dashed border-teal-100 dark:border-teal-900/30 rounded-3xl flex flex-col items-center justify-center text-center mt-6">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 mb-4">
                {showAddModal ? <CalendarIcon size={32} /> : <TrendingUp size={32} />}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Fitur Manajemen Agenda Berbasis Modal <br /> Sedang Dalam Proses Integrasi Data
              </p>
              <button
                className="mt-6 px-10 py-3 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-teal-500/20 active:scale-95"
                onClick={() => { setSelectedEvent(null); setShowAddModal(false); }}
              >
                Tutup Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
