import { QUESTION_TYPES } from '@/konstanta/soal';

export const mockSimulasiTkaData = [
  {
    id: 1,
    subject: 'Matematika TKA',
    title: 'Simulasi Matematika TKA - Paket Utama',
    duration: 5400, // 90 minutes
    totalQuestions: 4,
    questions: [
      {
        id: 101,
        question_type: QUESTION_TYPES.SINGLE_CHOICE,
        category: 'akademik',
        subject: 'Matematika TKA',
        difficulty: 'medium',
        cognitive_level: 'C2',
        payload: {
          stem: 'Hasil dari 4.567 + 2.891 - 3.125 adalah ...',
          stem_image: null,
          options: [
            { key: 'A', text: '4.333', image: null },
            { key: 'B', text: '4.233', image: null },
            { key: 'C', text: '4.433', image: null },
            { key: 'D', text: '4.133', image: null }
          ],
          correct_keys: ['A']
        },
        explanation: 'Untuk menyelesaikan soal ini, lakukan penjumlahan terlebih dahulu secara berurutan dari kiri ke kanan. Kesalahan umum terjadi saat salah menjumlahkan simpanan angka puluhan (misal menghasilkan 4.233 atau 4.433), atau salah melakukan pengurangan pinjaman pada digit ratusan (sehingga mendapatkan 4.133). Pastikan penjumlahan dan pengurangan bersusun dilakukan dengan teliti.',
        max_points: 5
      },
      {
        id: 102,
        question_type: QUESTION_TYPES.MULTI_CHOICE,
        category: 'akademik',
        subject: 'Matematika TKA',
        difficulty: 'hard',
        cognitive_level: 'C3',
        payload: {
          stem: 'Manakah dari bangun datar berikut yang memiliki sifat simetri lipat sebanyak 4 atau lebih?',
          stem_image: null,
          options: [
            { key: 'A', text: 'Persegi', image: null },
            { key: 'B', text: 'Persegi Panjang', image: null },
            { key: 'C', text: 'Lingkaran', image: null },
            { key: 'D', text: 'Segitiga Sama Sisi', image: null }
          ],
          correct_keys: ['A', 'C']
        },
        explanation: 'Persegi memiliki tepat 4 simetri lipat. Lingkaran memiliki simetri lipat yang tidak terbatas (tak terhingga), yang jelas lebih dari 4. Memilih Persegi Panjang kurang tepat karena persegi panjang hanya memiliki 2 simetri lipat. Memilih Segitiga Sama Sisi juga kurang tepat karena ia hanya memiliki 3 simetri lipat.',
        max_points: 5
      },
      {
        id: 103,
        question_type: QUESTION_TYPES.TRUE_FALSE,
        category: 'akademik',
        subject: 'Matematika TKA',
        difficulty: 'medium',
        cognitive_level: 'C2',
        payload: {
          stem: 'Tentukan Benar atau Salah untuk pernyataan mengenai pecahan berikut.',
          stem_image: null,
          statements: [
            { id: 's1', text: 'Nilai dari 1/2 lebih besar daripada 1/3', correct_answer: true },
            { id: 's2', text: 'Pecahan 2/4 senilai dengan pecahan 3/6', correct_answer: true },
            { id: 's3', text: 'Nilai dari 3/5 lebih kecil daripada 2/10', correct_answer: false }
          ]
        },
        explanation: 'Pernyataan pertama benar karena semakin kecil penyebut dengan pembilang yang sama, nilainya semakin besar. Pernyataan kedua benar karena kedua pecahan jika disederhanakan bernilai 1/2. Pernyataan ketiga salah karena 3/5 setara dengan 6/10, yang jelas lebih besar dari 2/10; kesalahan dalam membandingkan ini biasanya terjadi karena terbalik menyamakan penyebut.',
        max_points: 5
      },
    ]
  },
  {
    id: 2,
    subject: 'IPA TKA',
    title: 'Simulasi IPA TKA - Paket Utama',
    duration: 4500, // 75 minutes
    totalQuestions: 2,
    questions: [
      {
        id: 201,
        question_type: QUESTION_TYPES.SINGLE_CHOICE,
        category: 'akademik',
        subject: 'IPA TKA',
        difficulty: 'easy',
        cognitive_level: 'C1',
        payload: {
          stem: 'Bagian tumbuhan yang berfungsi untuk menyerap air dan garam mineral dari dalam tanah adalah ...',
          stem_image: null,
          options: [
            { key: 'A', text: 'Akar', image: null },
            { key: 'B', text: 'Batang', image: null },
            { key: 'C', text: 'Daun', image: null },
            { key: 'D', text: 'Bunga', image: null }
          ],
          correct_keys: ['A']
        },
        explanation: 'Akar menembus ke dalam tanah untuk menyerap air dan hara tumbuhan. Memilih Batang kurang tepat karena fungsi utamanya menyalurkan zat makanan dan menopang tumbuhan. Memilih Daun kurang tepat karena fungsinya tempat fotosintesis. Memilih Bunga kurang tepat karena fungsinya alat perkembangbiakan.',
        max_points: 5
      },
      {
        id: 202,
        question_type: QUESTION_TYPES.TRUE_FALSE,
        category: 'akademik',
        subject: 'IPA TKA',
        difficulty: 'medium',
        cognitive_level: 'C2',
        payload: {
          stem: 'Tentukan Benar atau Salah untuk pernyataan tentang siklus air berikut.',
          stem_image: null,
          statements: [
            { id: 's1', text: 'Evaporasi adalah proses penguapan air permukaan akibat panas matahari', correct_answer: true },
            { id: 's2', text: 'Kondensasi adalah proses jatuhnya air dari awan ke bumi', correct_answer: false },
            { id: 's3', text: 'Transpirasi adalah proses penguapan air yang berasal dari jaringan makhluk hidup', correct_answer: true }
          ]
        },
        explanation: 'Evaporasi adalah penguapan air permukaan, sedangkan Transpirasi adalah penguapan dari makhluk hidup seperti tumbuhan. Pernyataan kedua salah karena proses jatuhnya air disebut presipitasi (hujan), sedangkan kondensasi adalah pengembunan uap air menjadi awan.',
        max_points: 5
      }
    ]
  }
];

export default mockSimulasiTkaData;
