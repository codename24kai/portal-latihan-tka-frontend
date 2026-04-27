export const mockQuestionBank = [
  { 
    id: 1, 
    subject: 'Matematika', 
    category: 'Akademik', 
    text: 'Hasil dari 2.456 + 3.789 − 1.234 adalah …', 
    options: { A: '5.011', B: '5.111', C: '5.211', D: '5.311' }, 
    explanation: 'Hitung penjumlahan terlebih dahulu baru pengurangan.', 
    correctAnswer: 'A', 
    difficulty: 'Mudah', 
    usedIn: 'Tryout Mandiri 1', 
    createdAt: '2026-03-20' 
  },
  { 
    id: 2, 
    subject: 'Bahasa Indonesia', 
    category: 'Akademik', 
    text: 'Ide pokok dari paragraf di atas adalah…', 
    options: { A: 'Kegemukan pada anak', B: 'Pentingnya sayuran', C: 'Olahraga rutin', D: 'Pola tidur sehat' }, 
    explanation: 'Ide pokok biasanya terletak di awal paragraf (deduktif).', 
    correctAnswer: 'B', 
    difficulty: 'Sedang', 
    usedIn: null, 
    createdAt: '2026-03-21' 
  },
  { 
    id: 3, 
    subject: 'Survei Lingkungan Belajar', 
    category: 'Non-Akademik', 
    text: 'Bagaimana kondisi fasilitas belajar di rumah Anda?', 
    options: { A: 'Sangat Memadai', B: 'Memadai', C: 'Kurang Memadai', D: 'Tidak Ada' }, 
    explanation: 'Ini adalah soal survei, tidak ada jawaban benar/salah secara mutlak.', 
    correctAnswer: 'A', 
    difficulty: 'Mudah', 
    usedIn: 'Survei Akhir 2025', 
    createdAt: '2026-03-22' 
  },
  { 
    id: 4, 
    subject: 'Survei Karakter', 
    category: 'Non-Akademik', 
    text: 'Bagaimana sikap Anda jika melihat teman sedang diejek?', 
    options: { A: 'Ikut mengejek', B: 'Diam saja', C: 'Melaporkan ke guru', D: 'Membela teman tersebut' }, 
    explanation: 'Menunjukkan sikap empati dan tanggung jawab sosial.', 
    correctAnswer: 'D', 
    difficulty: 'Sedang', 
    usedIn: null, 
    createdAt: '2026-03-22' 
  },
  { 
    id: 5, 
    subject: 'Matematika', 
    category: 'Akademik', 
    text: 'Nilai dari 3/4 + 2/5 adalah …', 
    options: { A: '1 3/20', B: '1 4/20', C: '1 5/20', D: '1 6/20' }, 
    explanation: 'Samakan penyebut menjadi 20.', 
    correctAnswer: 'A', 
    difficulty: 'Sulit', 
    usedIn: 'Tryout Mandiri 2', 
    createdAt: '2026-03-22' 
  },
  { 
    id: 6, 
    subject: 'Bahasa Indonesia', 
    category: 'Akademik', 
    text: 'Sinonim dari kata "Cerdik" adalah...', 
    options: { A: 'Pintar', B: 'Licik', C: 'Malas', D: 'Lambat' }, 
    explanation: 'Cerdik berarti tajam pikiran atau pandai.', 
    correctAnswer: 'A', 
    difficulty: 'Mudah', 
    usedIn: null, 
    createdAt: '2026-03-23' 
  },
  { 
    id: 7, 
    subject: 'Matematika', 
    category: 'Akademik', 
    text: 'Berapa luas lingkaran dengan jari-jari 7cm?', 
    options: { A: '154', B: '44', C: '49', D: '22' }, 
    explanation: 'Gunakan rumus L = π × r² dengan π = 22/7.', 
    correctAnswer: 'A', 
    difficulty: 'Sedang', 
    usedIn: null, 
    createdAt: '2026-03-23' 
  },
];
export default mockQuestionBank;
