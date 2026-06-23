export const mockSurveiKarakterSulingjarData = [
  {
    id: 'survei-karakter-sd6',
    type: 'survei_karakter',
    title: 'Survei Karakter Kelas 6 SD',
    description: 'Survei ini bertujuan untuk mengukur karakter gotong royong, kemandirian, dan kebinekaan global kamu sehari-hari.',
    icon: 'Heart',
    color: 'from-rose-400 to-pink-600',
    questions: [
      {
        id: 'sk_likert_1',
        text: 'Saya merasa senang saat bisa membantu teman sekelas yang mengalami kesulitan memahami pelajaran Matematika.',
        type: 'likert', // Likert Scale
        options: [
          { value: 5, text: 'Sangat Setuju' },
          { value: 4, text: 'Setuju' },
          { value: 3, text: 'Ragu-ragu / Netral' },
          { value: 2, text: 'Tidak Setuju' },
          { value: 1, text: 'Sangat Tidak Setuju' }
        ]
      },
      {
        id: 'sk_mc_1',
        text: 'Apabila terjadi perbedaan pendapat saat berdiskusi kelompok menentukan ketua kelas, tindakan terbaik adalah...',
        type: 'single_choice',
        options: [
          { label: 'A', text: 'Marah dan meninggalkan ruang diskusi kelompok' },
          { label: 'B', text: 'Mendengarkan pendapat orang lain dan berdiskusi mencari jalan tengah secara damai' },
          { label: 'C', text: 'Memaksa semua anggota kelompok mengikuti pendapat saya saja' },
          { label: 'D', text: 'Diam saja dan tidak mau berpartisipasi lagi' }
        ]
      },
      {
        id: 'sk_reflektif_1',
        text: 'Tuliskan satu contoh perbuatan gotong royong yang pernah kamu lakukan bersama teman di sekolah!',
        type: 'reflective', // Simple reflective text question
        placeholder: 'Tuliskan ceritamu di sini...'
      }
    ]
  },
  {
    id: 'sulingjar-sd6',
    type: 'sulingjar',
    title: 'Survei Lingkungan Belajar (Sulingjar) - SD',
    description: 'Evaluasi suasana belajar, kenyamanan sarana sekolah, serta dukungan guru di sekolah untuk mendukung proses belajarmu.',
    icon: 'Globe',
    color: 'from-emerald-400 to-teal-600',
    questions: [
      {
        id: 'sl_likert_1',
        text: 'Fasilitas perpustakaan dan laboratorium komputer di sekolah saya membantu saya belajar dengan nyaman.',
        type: 'likert',
        options: [
          { value: 5, text: 'Sangat Setuju' },
          { value: 4, text: 'Setuju' },
          { value: 3, text: 'Ragu-ragu' },
          { value: 2, text: 'Tidak Setuju' },
          { value: 1, text: 'Sangat Tidak Setuju' }
        ]
      },
      {
        id: 'sl_mc_1',
        text: 'Seberapa sering bapak/ibu guru memberikan pujian atau kata-kata penyemangat saat kamu berhasil mengerjakan soal sulit?',
        type: 'single_choice',
        options: [
          { label: 'A', text: 'Sangat Sering' },
          { label: 'B', text: 'Cukup Sering' },
          { label: 'C', text: 'Jarang' },
          { label: 'D', text: 'Tidak Pernah' }
        ]
      },
      {
        id: 'sl_reflektif_1',
        text: 'Bagaimanakah suasana belajar di dalam kelas yang paling kamu sukai? Jelaskan secara singkat.',
        type: 'reflective',
        placeholder: 'Tuliskan pendapatmu di sini...'
      }
    ]
  }
];

export default mockSurveiKarakterSulingjarData;
