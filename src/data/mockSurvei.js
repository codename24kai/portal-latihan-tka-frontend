// Survey Definition — Completely separate from Exam/Tryout data
export const mockSurveyDefinitions = [
  {
    id: 'survey-karakter-1',
    type: 'survei_karakter',            // 'survei_karakter' | 'sulingjar'
    title: 'Survei Karakter — Gotong Royong & Empati',
    description: 'Bantu kami memahami sikapmu sehari-hari untuk menciptakan lingkungan belajar yang lebih baik.',
    icon: 'Heart',
    color: 'from-rose-400 to-pink-600',
    attached_to_tryout_id: 1,           // Links to Matematika Tryout (id: 1 in mockExams.js)
    questions: [
      {
        id: 'sk-1',
        text: 'Jika kamu melihat temanmu kesulitan membawa barang berat, apa yang kamu lakukan?',
        type: 'single_choice',
        options: [
          { label: 'A', text: 'Membantu membawakan sebagian barangnya' },
          { label: 'B', text: 'Menyemangati dari jauh' },
          { label: 'C', text: 'Melanjutkan aktivitasku' },
          { label: 'D', text: 'Meminta orang lain untuk membantu' },
        ]
      },
      {
        id: 'sk-2',
        text: 'Saat melakukan kerja kelompok, bagaimana caramu berbagi tugas dengan teman?',
        type: 'single_choice',
        options: [
          { label: 'A', text: 'Mengambil semua tugas yang sulit sendirian' },
          { label: 'B', text: 'Berdiskusi dan membagi tugas sesuai keahlian teman' },
          { label: 'C', text: 'Hanya mengerjakan tugas yang saya sukai' },
          { label: 'D', text: 'Menunggu ditunjuk oleh teman lain' },
        ]
      },
      {
        id: 'sk-3',
        text: 'Bagaimana perasaanmu jika ada teman yang memberikan saran untuk hasil kerjamu?',
        type: 'single_choice',
        options: [
          { label: 'A', text: 'Marah karena merasa dikritik' },
          { label: 'B', text: 'Menerima dan menjadikannya bahan perbaikan' },
          { label: 'C', text: 'Mengabaikan saran tersebut' },
          { label: 'D', text: 'Malu dan berhenti mengerjakan tugas' },
        ]
      }
    ]
  },
  {
    id: 'sulingjar-1',
    type: 'sulingjar',
    title: 'Survei Lingkungan Belajar (Sulingjar)',
    description: 'Bantu kami mengevaluasi suasana belajarmu di sekolah dan rumah agar kami bisa memberikan dukungan yang lebih baik.',
    icon: 'Globe',
    color: 'from-emerald-400 to-teal-600',
    attached_to_tryout_id: 2,           // Links to Bahasa Indonesia Tryout (id: 2 in mockExams.js)
    questions: [
      {
        id: 'sl-1',
        text: 'Apakah Bapak/Ibu guru memberikan kesempatan bertanya saat pelajaran di kelas?',
        type: 'single_choice',
        options: [
          { label: 'A', text: 'Sangat Sering' },
          { label: 'B', text: 'Sering' },
          { label: 'C', text: 'Jarang' },
          { label: 'D', text: 'Tidak Pernah' },
        ]
      },
      {
        id: 'sl-2',
        text: 'Bagaimana fasilitas perpustakaan di sekolahmu dalam mendukung kegiatan membaca?',
        type: 'single_choice',
        options: [
          { label: 'A', text: 'Sangat Lengkap & Nyaman' },
          { label: 'B', text: 'Lengkap' },
          { label: 'C', text: 'Kurang Lengkap' },
          { label: 'D', text: 'Tidak Ada' },
        ]
      }
    ]
  }
];

export default mockSurveyDefinitions;
