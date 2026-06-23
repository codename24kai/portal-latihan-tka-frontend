import { QUESTION_TYPES } from '@/konstanta/soal';

export const mockLatihanMandiriData = [
  {
    id: 11,
    subject: 'Matematika Pecahan',
    title: 'Latihan Mandiri: Penjumlahan Pecahan Campuran',
    duration: 3600, // 60 minutes
    totalQuestions: 3,
    questions: [
      {
        id: 1101,
        question_type: QUESTION_TYPES.SINGLE_CHOICE,
        category: 'latihan',
        subject: 'Matematika Pecahan',
        difficulty: 'easy',
        cognitive_level: 'C2',
        payload: {
          stem: 'Hasil dari 1 1/2 + 2 1/3 adalah ...',
          stem_image: null,
          options: [
            { key: 'A', text: '3 5/6', image: null },
            { key: 'B', text: '3 2/5', image: null },
            { key: 'C', text: '3 1/6', image: null },
            { key: 'D', text: '3 5/5', image: null }
          ],
          correct_keys: ['A']
        },
        explanation: 'Langkah penyelesaian:\n1. Ubah pecahan campuran menjadi pecahan biasa: 1 1/2 = 3/2 dan 2 1/3 = 7/3.\n2. Samakan penyebut dengan mencari KPK dari 2 dan 3, yaitu 6.\n3. Ubah pecahan: 3/2 = 9/6 dan 7/3 = 14/6.\n4. Jumlahkan: 9/6 + 14/6 = 23/6 = 3 5/6.\n\nJawaban yang benar adalah **A (3 5/6)**. Pilihan B salah karena menjumlahkan langsung penyebut dan pembilang secara terpisah (kesalahan fatal umum). Pilihan C salah karena salah menghitung pembilang.',
        max_points: 10
      },
      {
        id: 1102,
        question_type: QUESTION_TYPES.MULTI_CHOICE,
        category: 'latihan',
        subject: 'Matematika Pecahan',
        difficulty: 'medium',
        cognitive_level: 'C3',
        payload: {
          stem: 'Manakah dari pecahan berikut yang senilai dengan 2/5?',
          stem_image: null,
          options: [
            { key: 'A', text: '4/10', image: null },
            { key: 'B', text: '6/15', image: null },
            { key: 'C', text: '8/20', image: null },
            { key: 'D', text: '10/30', image: null }
          ],
          correct_keys: ['A', 'B', 'C']
        },
        explanation: 'Pecahan senilai diperoleh dengan mengalikan atau membagi pembilang dan penyebut dengan angka yang sama:\n- 2/5 * 2/2 = 4/10 (A senilai)\n- 2/5 * 3/3 = 6/15 (B senilai)\n- 2/5 * 4/4 = 8/20 (C senilai)\n- 2/5 * 5/5 = 10/25 (D tidak senilai, karena tertulis 10/30)\n\nJawaban yang tepat adalah **A, B, dan C**.',
        max_points: 10
      },
      {
        id: 1103,
        question_type: QUESTION_TYPES.TRUE_FALSE,
        category: 'latihan',
        subject: 'Matematika Pecahan',
        difficulty: 'easy',
        cognitive_level: 'C2',
        payload: {
          stem: 'Tentukan Benar atau Salah untuk pernyataan berikut.',
          stem_image: null,
          statements: [
            { id: 's1', text: 'Mengalikan pembilang dan penyebut dengan angka yang sama menghasilkan pecahan senilai.', correct_answer: true },
            { id: 's2', text: 'Pecahan desimal dari 1/4 adalah 0.4', correct_answer: false }
          ]
        },
        explanation: '1. Pernyataan pertama BENAR karena merupakan aturan dasar penentuan pecahan senilai.\n2. Pernyataan kedua SALAH karena 1/4 = 0,25. Sedangkan 0,4 setara dengan 4/10 atau 2/5.',
        max_points: 10
      }
    ]
  },
  {
    id: 12,
    subject: 'IPA Gaya',
    title: 'Latihan Mandiri: Jenis-Jenis Gaya',
    duration: 3000,
    totalQuestions: 2,
    questions: [
      {
        id: 1201,
        question_type: QUESTION_TYPES.SINGLE_CHOICE,
        category: 'latihan',
        subject: 'IPA Gaya',
        difficulty: 'easy',
        cognitive_level: 'C1',
        payload: {
          stem: 'Gaya yang timbul akibat gesekan antara dua permukaan benda yang saling bersentuhan adalah ...',
          stem_image: null,
          options: [
            { key: 'A', text: 'Gaya Magnet', image: null },
            { key: 'B', text: 'Gaya Gesek', image: null },
            { key: 'C', text: 'Gaya Gravitasi', image: null },
            { key: 'D', text: 'Gaya Pegas', image: null }
          ],
          correct_keys: ['B']
        },
        explanation: 'Gaya Gesek dihantarkan oleh gesekan permukaan dua benda. Gaya magnet bekerja jarak jauh melalui kutub magnet. Gaya gravitasi menarik benda ke pusat bumi. Gaya pegas timbul karena kelenturan/elastisitas benda renggang. Jawaban yang tepat adalah **B**.',
        max_points: 10
      },
      {
        id: 1202,
        question_type: QUESTION_TYPES.ESSAY,
        category: 'latihan',
        subject: 'IPA Gaya',
        difficulty: 'medium',
        cognitive_level: 'C2',
        payload: {
          stem: 'Berikan dua contoh pemanfaatan gaya gesek yang menguntungkan dalam kehidupan sehari-hari!',
          stem_image: null,
          word_limit: 150
        },
        explanation: 'Pemanfaatan gaya gesek yang menguntungkan antara lain:\n1. Penggunaan rem sepeda atau mobil untuk menghentikan laju kendaraan.\n2. Pembuatan alur bergelombang pada permukaan ban kendaraan atau alas sepatu agar tidak tergelincir saat berjalan di permukaan licin.\n3. Gesekan korek api kayu untuk menghasilkan api.',
        max_points: 15
      }
    ]
  }
];

export default mockLatihanMandiriData;
