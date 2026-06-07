# 📝 Log Aktivitas Pembaruan — Portal Latihan TKA

Dokumen ini mencatat pembaruan dan perubahan fitur secara bertahap sesuai dengan **Development Roadmap (V2)**.

---

## 🏃 Sprint 1 — Fondasi & Quick Wins

### [x] A8. Pembaruan Nomenklatur "Tryout" → "Simulasi TKA"
- **Tanggal:** 2026-05-30
- **Deskripsi:** Mengubah seluruh nomenklatur/label visual "Tryout" menjadi "Simulasi TKA" pada sisi Administrator untuk memastikan konsistensi branding aplikasi.
- **Berkas yang Diubah:**
  1. [SidebarAdmin.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/admin/SidebarAdmin.jsx) — Mengubah label menu navigasi Sidebar ke "Manajemen Simulasi TKA".
  2. [ManajemenTryout.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/ManajemenTryout.jsx) — Mengubah judul halaman, tombol rilis/buat sesi, placeholder pencarian, dan kolom tabel utama.
  3. [TambahTryout.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/TambahTryout.jsx) — Mengubah tajuk pembuatan sesi, label form nama simulasi, placeholder, notifikasi toast sukses, dan modal konfirmasi rilis.
  4. [StatusTryout.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/admin/dasbor/StatusTryout.jsx) — Mengubah judul kartu dasbor, status kosong, dan tombol kelola.
  5. [KartuStatistik.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/admin/dasbor/KartuStatistik.jsx) — Mengubah metrik "Tryout Dibuat" menjadi "Simulasi Dibuat".
- **Status:** ✅ Selesai

### [x] A1. Filter Bank Soal (Hapus opsi "Semua" Kategori)
- **Tanggal:** 2026-05-30
- **Deskripsi:** Merapikan tab kategori filter utama di halaman Bank Soal sehingga hanya menyisakan kategori spesifik "Akademik" dan "Survei", serta menghapus jalur kode usang (*dead code*) untuk kategori "Semua".
- **Berkas yang Diubah:**
  1. [BankSoal.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/BankSoal.jsx) — Menghapus logika rendering *badge* usang untuk `activeTab === 'Semua'`.
- **Status:** ✅ Selesai

### [x] A2. Filter Laporan Nilai (Hapus opsi "Survei")
- **Tanggal:** 2026-05-30
- **Deskripsi:** Menghapus tab "Survei & Karakter" dari halaman Laporan Nilai utama Administrator karena Laporan Survei sekarang sudah dipisahkan ke modul khusus tersendiri.
- **Berkas yang Diubah:**
  1. [LaporanNilai.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/LaporanNilai.jsx) — Menghapus tab opsi survey, menyederhanakan data kolom *headers* dan metode rendering *row* agar fokus hanya pada data akademik siswa.
- **Status:** ✅ Selesai

### [x] A3. Optimalisasi UI Laporan Survei
- **Tanggal:** 2026-05-30
- **Deskripsi:** Memperkecil tinggi grafik agregat jawaban siswa untuk efisiensi ruang antarmuka, serta memperbarui tabel siswa dengan fungsionalitas tombol aksi "Lihat" yang interaktif guna menampilkan rincian jawaban survei per siswa secara premium.
- **Berkas yang Diubah:**
  1. [LaporanSurveiAdmin.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/LaporanSurveiAdmin.jsx) — Memperkecil tinggi *ResponsiveContainer* recharts menjadi 200px, menambahkan *state* pratinjau detail, memperbarui kolom tabel siswa, dan menambahkan modal interaktif berdesain modern untuk mempratinjau pilihan jawaban siswa per pertanyaan.
- **Status:** ✅ Selesai

### [x] A4. Perbaikan Tombol Dashboard
- **Tanggal:** 2026-05-30
- **Deskripsi:** Memperbaiki tombol aksi pada widget dasbor "Siswa Perlu Perhatian" dan log aktivitas "Lihat Semua" agar dapat mengarahkan Administrator ke halaman Laporan Nilai secara dinamis.
- **Berkas yang Diubah:**
  1. [TabelSiswaPerhatian.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/admin/dasbor/TabelSiswaPerhatian.jsx) — Mengintegrasikan `useNavigate` dan memperbarui tombol *ChevronRight* serta tombol utama di bawah tabel ke halaman laporan.
  2. [LogAktivitas.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/admin/dasbor/LogAktivitas.jsx) — Mengintegrasikan `useNavigate` pada tombol "Lihat Semua".
- **Status:** ✅ Selesai

### [x] A5. Integrasi Sulingjar & Survei Karakter
- **Tanggal:** 2026-05-30
- **Deskripsi:** Mengintegrasikan instrumen Survei Karakter dan Sulingjar ke dalam proses pembuatan Simulasi TKA dengan menambahkan dropdown integrasi survei pendukung opsional.
- **Berkas yang Diubah:**
  1. [TambahTryout.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/TambahTryout.jsx) — Menambahkan *state* `attachedSurveyId` dan dropdown pilihan survei pendukung sebelum pengerjaan soal.
- **Status:** ✅ Selesai

### [x] A6. Penyederhanaan Mode Ujian
- **Tanggal:** 2026-05-30
- **Deskripsi:** Menyederhanakan alur pembuatan sesi dengan menghapus pilihan Jenis Latihan "Latihan Mandiri" dari antarmuka Admin karena Admin hanya ditugaskan untuk mengelola "Simulasi TKA".
- **Berkas yang Diubah:**
  1. [TambahTryout.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/TambahTryout.jsx) — Menghapus dropdown "Jenis Latihan" dari form antarmuka admin, serta menetapkan default jenis latihan secara otomatis ke "simulasi tka".
- **Status:** ✅ Selesai

### [x] A7. Filter Periode Ujian / Simulasi TKA
- **Tanggal:** 2026-05-30
- **Deskripsi:** Menghubungkan dropdown filter periode pada halaman Laporan Nilai agar bersifat interaktif, menggunakan nama nomenklatur baru, dan membatasi hanya untuk menampilkan Simulasi TKA yang valid/sudah selesai.
- **Berkas yang Diubah:**
  1. [LaporanNilai.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/LaporanNilai.jsx) — Mengimpor komponen *Dropdown* UI, mengubah mock periods ke "Simulasi TKA Tahap 1 & 2", dan mengaktifkan perubahan pilihan filter.
- **Status:** ✅ Selesai

---

## 🎒 Modul Siswa (S1 — S8)

### [x] S1. Visibilitas Password (Eye Icon)
- **Tanggal:** 2026-05-30
- **Deskripsi:** Menambahkan ikon mata (*eye toggle*) pada formulir ganti kata sandi siswa agar pengguna dapat menyembunyikan/menampilkan kata sandi dengan aman dan mudah.
- **Berkas yang Diubah:**
  1. [PengaturanSiswa.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/PengaturanSiswa.jsx) — Mengintegrasikan ikon *Eye* dan *EyeOff*, serta melengkapi visibilitas dinamis untuk 3 jenis input password.
- **Status:** ✅ Selesai

### [x] S2. Sistem Reminder Dashboard
- **Tanggal:** 2026-05-30
- **Deskripsi:** Membuat banner pengingat (*reminder box*) yang besar, premium, dan berwarna gradasi hangat dengan tombol dismiss (*Tutup*) interaktif di halaman dasbor siswa.
- **Berkas yang Diubah:**
  1. [DashboardSiswa.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/DashboardSiswa.jsx) — Menambahkan banner pengumuman persiapan Simulasi TKA Nasional dengan tombol tutup dinamis.
- **Status:** ✅ Selesai

### [x] S3. Agenda Mendatang
- **Tanggal:** 2026-05-30
- **Deskripsi:** Menambahkan widget visual *Agenda Mendatang* pada dasbor siswa untuk memantau jadwal simulasi wajib dan pembahasan penting yang akan datang.
- **Berkas yang Diubah:**
  1. [DashboardSiswa.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/DashboardSiswa.jsx) — Merender kotak agenda jadwal mendatang bersanding dengan riwayat belajar siswa.
- **Status:** ✅ Selesai

### [x] S4 & S5. Fleksibilitas Akses Modul Dokumen (PDF) & Video Player Ganda
- **Tanggal:** 2026-05-30
- **Deskripsi:** Menghadirkan in-browser reader untuk membaca PDF langsung di browser lengkap dengan tombol unduh offline. Serta merancang modal pemutar video ganda (internal MP4 player & YouTube responsive iframe embed) yang otomatis membuka akses kuis game setelah selesai ditonton/dibaca.
- **Berkas yang Diubah:**
  1. [ModulSiswa.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/ModulSiswa.jsx) — Menyediakan tombol ganda *Baca Modul / Unduh PDF* dan *Tonton Video*, serta mengimplementasikan 2 modal premium untuk membaca PDF dan memutar video (YouTube & MP4 internal).
- **Status:** ✅ Selesai

### [x] S6. Pembaruan UI Hasil Ujian
- **Tanggal:** 2026-05-30
- **Deskripsi:** Mendesain 3 variasi tata letak (*layout variants*) yang berbeda dan spesifik untuk hasil ujian berdasarkan jenis aktivitas: layout formal & prestisius untuk *Simulasi TKA*, layout berorientasi akademik untuk *Latihan Mandiri*, dan layout tergamifikasi (*coin / star rewards*) untuk *Kuis Game*.
- **Berkas yang Diubah:**
  1. [HasilUjian.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/HasilUjian.jsx) — Refactoring layout hasil ujian agar beradaptasi penuh secara visual dengan jenis aktivitas yang baru saja diselesaikan siswa.
- **Status:** ✅ Selesai

### [x] S7. Revisi UI Simulasi (PG Kompleks)
- **Tanggal:** 2026-05-30
- **Deskripsi:** Menambahkan banner penanda bercahaya *💡 Pilihan Ganda Kompleks* dan indikator *checkbox* bersertifikasi centang modern di masing-masing pilihan jawaban agar siswa kelas 6 SD mudah memahami bahwa soal memiliki multi-jawaban.
- **Berkas yang Diubah:**
  1. [RendererPilihanGanda.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/RendererSoal/RendererPilihanGanda.jsx) — Menyematkan banner info multi-jawaban dan merender kotak centang interaktif (*checkbox*) di sisi kanan opsi pilihan ganda kompleks.
- **Status:** ✅ Selesai

### [x] S8. Progress Bar Pembelajaran
- **Tanggal:** 2026-05-30
- **Deskripsi:** Mengubah metrik umum "Kemampuan Akademik" pada widget kemajuan siswa menjadi "Progres Aktivitas Belajar" dengan tampilan tiga bar meter penyelesaian detail (Simulasi TKA, Modul, dan Latihan Mandiri).
- **Berkas yang Diubah:**
  1. [WidgetProgres.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/Dasbor/WidgetProgres.jsx) — Mengubah rendering progress meter menjadi visual melacak progres riil Simulasi, Modul, dan Latihan.
- **Status:** ✅ Selesai

---

## 🌐 Fitur Global (G2)

### [x] G2. Loading Skeleton (Animasi Pemuatan)
- **Tanggal:** 2026-05-30
- **Deskripsi:** Mengintegrasikan loading skeleton premium beranimasi shimmer ke seluruh widget utama di Dashboard Admin (grafik tren, statistik perbandingan kelas, tabel siswa, riwayat aktivitas, dan ringkasan bank soal) untuk menggantikan spinner konvensional, meningkatkan *perceived performance* dan memberikan antarmuka yang sangat premium.
- **Berkas yang Diubah:**
  1. [DashboardAdmin.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/DashboardAdmin.jsx) — Mengimpor komponen `LoadingSkeleton` dan mengimplementasikan render kondisional layout skeleton shimmer untuk semua chart, tabel, list aktivitas, dan ringkasan bank soal selama data dimuat (`isLoading === true`).
- **Status:** ✅ Selesai

