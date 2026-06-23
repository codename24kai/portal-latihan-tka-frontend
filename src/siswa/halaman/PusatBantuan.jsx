import React, { useState } from 'react';
import {
  BookOpen,
  Target,
  User,
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { kirimPesanBantuan } from '@/utilitas/apiSiswa';
import toast from 'react-hot-toast';

/**
 * Help Center Page — Interactive FAQ for Students
 * Designed for 6th-grade kids with smooth animations and simple UX.
 */
export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [expandedId, setExpandedId] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [pesan, setPesan] = useState('');
  const [judulPesan, setJudulPesan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKirimPesan = async (e) => {
    e.preventDefault();
    if (!judulPesan || !pesan) return toast.error('Harap isi judul dan pesan!');
    
    try {
      setIsSubmitting(true);
      await kirimPesanBantuan({ judul: judulPesan, isi_pesan: pesan });
      toast.success('Pesan berhasil dikirim ke Admin!');
      setIsMessageModalOpen(false);
      setJudulPesan('');
      setPesan('');
    } catch (error) {
      toast.error('Gagal mengirim pesan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQ Data - Tailored for child-friendly logic
  const faqData = [
    {
      id: 1,
      category: 'Materi',
      question: 'Bolehkah aku mengulang kuis yang sudah selesai? 🔄',
      answer: "Tentu saja boleh! Kamu bisa mengulang kuis kapan saja untuk melatih ingatanmu biar makin pintar. Klik saja tombol 'Kerjakan Ulang' di halaman modul.",
      icon: <BookOpen className="text-teal-500" size={20} />
    },
    {
      id: 2,
      category: 'Tryout',
      question: 'Gimana kalau internetku mati saat lagi ujian? 🔌',
      answer: "Tetap tenang ya! Hubungkan kembali internetmu, lalu buka lagi halamannya. Jawaban yang sudah kamu pilih tadi akan tersimpan otomatis kok.",
      icon: <Target className="text-orange-500" size={20} />
    },
    {
      id: 3,
      category: 'Tryout',
      question: 'Apakah aku bisa mengganti jawaban jika masih ragu? 🤔',
      answer: "Bisa banget! Selama waktu ujian belum habis, kamu bebas mengganti jawaban. Jangan lupa periksa lagi soal-soal yang kamu tandai 'Ragu-ragu' ya.",
      icon: <Target className="text-orange-500" size={20} />
    },
    {
      id: 4,
      category: 'Tryout',
      question: 'Kapan hasil simulasi tka aku akan keluar? 📈',
      answer: "Biasanya nilaimu akan muncul setelah semua teman-temanmu selesai mengerjakan ujian. Kamu bisa cek di tab 'Riwayat' nanti ya!",
      icon: <Target className="text-orange-500" size={20} />
    }
  ];

  const categories = ['Semua', 'Materi', 'Tryout', 'Akun'];

  // Filtering Logic
  const filteredFaqs = activeCategory === 'Semua'
    ? faqData
    : faqData?.filter(faq => faq.category === activeCategory);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in">

      {/* 1. HERO HEADER */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          <Sparkles size={14} fill="currentColor" /> Pusat Bantuan Siswa
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight italic">
          Ada yang Bisa Kami <span className="text-teal-600">Bantu?</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold max-w-lg mx-auto leading-relaxed">
          Hai pahlawan cerdas! Jika kamu bingung cara pakai aplikasi ini, cari jawabannya di bawah ya.
        </p>
      </section>

      {/* 2. CATEGORY FILTERS */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setExpandedId(null);
            }}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeCategory === cat
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20 scale-105'
              : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-100 dark:border-slate-700'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. FAQ ACCORDION LIST */}
      <div className="space-y-4">
        {filteredFaqs?.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`overflow-hidden rounded-3xl border transition-all ${expandedId === faq.id
              ? 'bg-white dark:bg-slate-800 border-teal-200 dark:border-teal-900/50 shadow-xl shadow-slate-200/50 dark:shadow-none'
              : 'bg-white/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
              }`}
          >
            <button
              onClick={() => toggleAccordion(faq.id)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${expandedId === faq.id ? 'bg-teal-50 dark:bg-teal-900/30' : 'bg-slate-50 dark:bg-slate-900'
                  }`}>
                  {faq.icon}
                </div>
                <span className={`font-black text-sm md:text-base tracking-tight transition-colors ${expandedId === faq.id ? 'text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                  {faq.question}
                </span>
              </div>
              <ChevronDown
                size={20}
                className={`text-slate-300 transition-transform duration-300 ${expandedId === faq.id ? 'rotate-180 text-teal-500' : 'group-hover:text-slate-400'}`}
              />
            </button>

            <AnimatePresence>
              {expandedId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 pt-2 ml-14">
                    <div className="h-px bg-slate-50 dark:bg-slate-700 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed text-sm md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 4. FAB TANYA ADMIN */}
      <button
        onClick={() => setIsMessageModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-40"
      >
        <MessageSquare size={24} />
      </button>

      {/* MODAL: KIRIM PESAN */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMessageModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Tanya Admin</h3>
              <button onClick={() => setIsMessageModalOpen(false)} className="text-slate-400 hover:text-red-500">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleKirimPesan} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topik Pertanyaan</label>
                <input
                  type="text"
                  value={judulPesan}
                  onChange={(e) => setJudulPesan(e.target.value)}
                  placeholder="Misal: Lupa Password"
                  className="w-full mt-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pesan Lengkap</label>
                <textarea
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  placeholder="Ceritakan kesulitanmu..."
                  rows={4}
                  className="w-full mt-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Send size={18} /> {isSubmitting ? 'Mengirim...' : 'Kirim Sekarang'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
