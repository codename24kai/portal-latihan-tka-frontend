// Lokasi file: src/data/mockMateri.js

export const mockMateriData = [
    {
        id: "1", // ID disesuaikan dengan ID yang ada di StudentModul
        title: "Teks Narasi & Deskripsi",
        subject: "Bahasa Indonesia",
        author: "Ibu Yulva, S.Pd.",
        publishedAt: "01 Jun 2026",
        estimasiWaktu: "± 25 menit",
        type: "pdf",
        // Menggunakan file PDF publik yang aman untuk testing
        contentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        description: "Materi ini membahas secara mendalam tentang perbedaan antara teks narasi (bercerita) dan teks deskripsi (menggambarkan). Terdapat contoh cerita pendek dan latihan menemukan ide pokok paragraf yang sangat cocok untuk persiapan ujian sekolah kelas 6.",
        downloadable: true,
        size: "2.4 MB",
        progressStatus: "belum",
        hasQuiz: true
    },
    {
        id: "2",
        title: "Bilangan Bulat & Operasi Hitung",
        subject: "Matematika",
        author: "Pak Budi Santoso",
        publishedAt: "03 Jun 2026",
        estimasiWaktu: "± 30 menit",
        type: "video",
        // Menggunakan file video publik berformat mp4 untuk testing
        contentUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
        description: "Video pembelajaran interaktif yang menjelaskan konsep dasar bilangan bulat positif dan negatif. Menampilkan animasi visual menggunakan garis bilangan agar mudah dipahami, dilanjutkan dengan cara menjumlahkan dan mengurangkan bilangan bulat.",
        downloadable: true,
        size: "15 MB",
        progressStatus: "belum",
        hasQuiz: true
    },
    {
        id: "4",
        title: "Puisi & Karya Sastra",
        subject: "Bahasa Indonesia",
        author: "Ibu Yulva, S.Pd.",
        publishedAt: "04 Jun 2026",
        estimasiWaktu: "± 20 menit",
        type: "pdf",
        contentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        description: "Modul ringkas mengenai unsur-unsur pembangun puisi, rima, majas, dan cara deklamasi puisi yang baik dan benar. Dilengkapi dengan puisi anak-anak bertema pahlawan dan keindahan alam.",
        downloadable: true,
        size: "1.5 MB",
        progressStatus: "selesai",
        hasQuiz: true
    },
    {
        id: "5",
        title: "Bangun Datar & Ruang",
        subject: "Matematika",
        author: "Kementerian Pendidikan",
        publishedAt: "05 Jun 2026",
        estimasiWaktu: "± 40 menit",
        type: "youtube",
        // ID Video Youtube untuk pengujian (bisa diganti dengan ID video edukasi asli)
        youtubeId: "dQw4w9WgXcQ",
        description: "Pemahaman visual tentang ciri-ciri bangun ruang (kubus, balok, prisma, limas, tabung) dan cara menghitung luas permukaan serta volumenya. Materi ini diintegrasikan langsung dari kanal edukasi resmi.",
        downloadable: false, // YouTube biasanya tidak diberikan opsi unduh langsung via aplikasi
        size: "Online",
        progressStatus: "sedang",
        hasQuiz: true
    }
];

/**
 * Fungsi tiruan untuk mengambil data materi berdasarkan ID.
 * Menggunakan Promise dan setTimeout untuk mensimulasikan jeda/loading dari server.
 */
export const getMateriById = async (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Mencari data yang ID-nya cocok (memastikan tipe data dikonversi ke string agar aman)
            const data = mockMateriData.find((materi) => String(materi.id) === String(id));

            if (data) {
                resolve(data);
            } else {
                reject(new Error("Materi tidak ditemukan di database."));
            }
        }, 800); // Simulasi loading selama 0.8 detik
    });
};