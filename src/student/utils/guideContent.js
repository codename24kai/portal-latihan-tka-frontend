/**
 * Content dictionary for the student guide.
 * Mapped by route paths.
 */
export const guideContent = {
  '/': {
    title: "Halaman Utama",
    description: "Selamat datang di beranda belajarmu!",
    steps: [
      "Lihat ringkasan nilaimu di atas.",
      "Cek kuis terbaru yang muncul.",
      "Pilih 'Mulai Belajar' untuk lanjut!"
    ],
    emoji: "🏠"
  },
  '/test': {
    title: "Cara Ikut Latihan",
    description: "Siapkan dirimu untuk ujian yang seru!",
    steps: [
      "Pilih pelajaran yang ingin diuji.",
      "Klik tombol 'Mulai Latihan'.",
      "Kerjakan semua soal sampai selesai."
    ],
    emoji: "📝"
  },
  '/modules': {
    title: "Membaca Materi",
    description: "Yuk, pelajari hal baru hari ini!",
    steps: [
      "Cari modul yang kamu suka.",
      "Baca penjelasannya pelan-pelan.",
      "Kerjakan kuis cepat untuk tes dirimu."
    ],
    emoji: "📚"
  },
  '/settings': {
    title: "Ubah Pengaturan",
    description: "Sesuaikan portal belajarmu.",
    steps: [
      "Ubah foto profil sesukamu.",
      "Ganti mode layar (Terang/Gelap).",
      "Jangan lupa simpan perubahan!"
    ],
    emoji: "⚙️"
  },
  'quiz': {
    title: "Cara Mengerjakan Kuis",
    description: "Kuis ini memberimu masukan instan supaya kamu makin pintar!",
    steps: [
      "Pilih satu jawaban yang menurutmu paling benar.",
      "Lihat hasilnya! Sistem akan langsung memberi tahu jika jawabanmu Benar (✅) atau Salah (❌).",
      "Pelajari jawaban yang benar, lalu klik 'Lanjut'.",
      "Selesaikan semua soal untuk melihat nilaimu."
    ],
    emoji: "🎯"
  },
  'tryout': {
    title: "Cara Mengerjakan Simulasi Ujian",
    description: "Berlatihlah seperti sedang ujian sungguhan!",
    steps: [
      "Kerjakan dengan tenang. Pilih jawaban A, B, C, atau D.",
      "Kamu bebas maju, mundur, atau mengganti jawaban selama waktu masih ada.",
      "Gunakan fitur 'Tandai Soal' 🚩 untuk menandai soal yang menurutmu masih ragu.",
      "Perhatikan sisa waktumu di bagian atas layar.",
      "Jika sudah yakin semua terisi, klik tombol 'Kumpulkan' di akhir ujian."
    ],
    emoji: "🚩"
  },
  'prepare': {
    title: "Langkah Persiapan",
    description: "Pastikan semua siap sebelum mulai ujian!",
    steps: [
      "Baca informasi ujian dengan teliti.",
      "Selesaikan semua daftar periksa persiapan.",
      "Klik 'Masuk Simulasi' jika sudah siap!"
    ],
    emoji: "🏁"
  },
  'default': {
    title: "Panduan Portal TKA",
    description: "Kami siap membantumu belajar!",
    steps: [
      "Gunakan menu di samping untuk pindah halaman.",
      "Klik ikon ini kapanpun kamu bingung.",
      "Selamat belajar dan raih mimpimu!"
    ],
    emoji: "💡"
  }
};

/**
 * Utility to get guide content based on current path.
 * Uses .includes() to handle dynamic IDs safely.
 */
export const getGuideByPath = (path) => {
  const normalizedPath = path.toLowerCase();
  
  if (normalizedPath.includes('/quiz') || normalizedPath.includes('/kuis')) {
    return guideContent['quiz'];
  }
  
  if (normalizedPath.includes('/exam/') && normalizedPath.includes('/prepare')) {
    return guideContent['prepare'];
  }
  
  if (normalizedPath.includes('/exam') || normalizedPath.includes('/tryout') || normalizedPath.includes('/latihan')) {
    return guideContent['tryout'];
  }

  return guideContent[path] || guideContent['default'];
};
