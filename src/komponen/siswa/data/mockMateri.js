export const mockMateri = [
  {
    id: 1,
    title: 'Teks Narasi & Deskripsi',
    subject: 'Bahasa Indonesia',
    type: 'pdf',
    description: 'Modul ini membahas tentang definisi, struktur, ciri-ciri, serta perbedaan antara teks narasi dan teks deskripsi. Sangat penting untuk melatih kemampuan literasi dan pemahaman bacaan untuk siswa kelas 6 SD.',
    author: 'Ibu Sri Wahyuni, S.Pd.',
    publishedAt: '12 Mei 2026',
    estimasiWaktu: '± 25 menit',
    pages: 45,
    size: '2.4 MB',
    contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Public dummy PDF for preview
    progressStatus: 'sedang',
    downloadable: true
  },
  {
    id: 2,
    title: 'Bilangan Bulat & Operasi',
    subject: 'Matematika',
    type: 'video',
    description: 'Video pembelajaran interaktif yang menjelaskan tentang konsep bilangan bulat positif dan negatif, serta cara melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian dengan mudah.',
    author: 'Bapak Budi Santoso, M.Pd.',
    publishedAt: '18 Mei 2026',
    estimasiWaktu: '± 30 menit',
    size: '15.8 MB',
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Public dummy MP4 video
    progressStatus: 'belum',
    downloadable: true
  },
  {
    id: 3,
    title: 'Panduan Survei Karakter',
    subject: 'Umum',
    type: 'youtube',
    description: 'Penjelasan interaktif mengenai Survei Karakter kelas 6 SD. Video ini membantu siswa memahami sikap-sikap apa saja yang dinilai dan bagaimana cara menjawab pertanyaan survei dengan jujur.',
    author: 'Kemendikbudristek RI',
    publishedAt: '05 Juni 2026',
    estimasiWaktu: '± 15 menit',
    youtubeId: 'Oq5P1-J3nsw', // Sample YouTube video ID
    contentUrl: 'https://www.youtube.com/watch?v=Oq5P1-J3nsw',
    progressStatus: 'selesai',
    downloadable: false
  },
  {
    id: 4,
    title: 'Puisi & Karya Sastra',
    subject: 'Bahasa Indonesia',
    type: 'pdf',
    description: 'Pelajari keindahan bahasa Indonesia melalui apresiasi puisi dan karya sastra. Modul ini mengajarkan cara membaca puisi dengan artikulasi dan ekspresi yang tepat, serta memahami makna di balik bait-bait puisi.',
    author: 'Ibu Sri Wahyuni, S.Pd.',
    publishedAt: '01 Juni 2026',
    estimasiWaktu: '± 20 menit',
    pages: 28,
    size: '1.5 MB',
    contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    progressStatus: 'selesai',
    downloadable: true
  },
  {
    id: 5,
    title: 'Bangun Datar & Ruang',
    subject: 'Matematika',
    type: 'video',
    description: 'Memahami perbedaan bangun datar dan bangun ruang dengan contoh benda-benda di sekitar kita. Dilengkapi dengan rumus luas, keliling, volume, dan luas permukaan yang dijelaskan secara bertahap.',
    author: 'Bapak Budi Santoso, M.Pd.',
    publishedAt: '04 Juni 2026',
    estimasiWaktu: '± 40 menit',
    size: '22.4 MB',
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    progressStatus: 'belum',
    downloadable: true
  }
];

export const getMateriById = (id) => {
  return new Promise((resolve) => {
    // Simulasi delay API
    setTimeout(() => {
      const materi = mockMateri.find(m => m.id === parseInt(id));
      resolve(materi || null);
    }, 300);
  });
};
