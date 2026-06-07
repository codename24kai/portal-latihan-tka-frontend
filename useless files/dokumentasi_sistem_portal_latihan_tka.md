# Dokumentasi Sistem: Portal Latihan TKA Berbasis Progressive Web App (PWA)

**Versi Dokumen:** 1.0  
**Tanggal:** Juni 2026  
**Status:** Resmi / Final  
**Platform:** Progressive Web App (React + Vite)

---

## DAFTAR ISI

1. [Pendahuluan](#1-pendahuluan)
2. [Hak Akses Pengguna (Role)](#2-hak-akses-pengguna-role)
3. [Deskripsi Halaman (Pages Overview)](#3-deskripsi-halaman-pages-overview)
4. [Alur Kerja Utama (Core Workflows)](#4-alur-kerja-utama-core-workflows)

---

## 1. PENDAHULUAN

### 1.1 Deskripsi Sistem

**Portal Latihan TKA** adalah sebuah aplikasi latihan tes kemampuan akademik berbasis *Progressive Web App* (PWA) yang dirancang khusus untuk mendukung kesiapan siswa kelas 6 Sekolah Dasar dalam menghadapi **Tes Kemampuan Akademik (TKA)**. Aplikasi ini dapat diakses melalui peramban web di berbagai perangkat (komputer, tablet, dan ponsel pintar) tanpa memerlukan instalasi dari toko aplikasi.

Sistem ini dibangun dengan arsitektur *multi-role*, yang berarti terdapat antarmuka yang berbeda dan disesuaikan untuk setiap jenis pengguna: **Siswa**, **Guru/Wali Kelas**, dan **Administrator**. Pendekatan ini memastikan setiap pengguna hanya melihat fitur yang relevan dengan peran dan kewenangannya.

### 1.2 Tujuan Utama

Aplikasi ini memiliki tiga tujuan utama:

1. **Mempersiapkan Siswa Secara Akademis:** Menyediakan wahana latihan soal TKA yang terstandarisasi, mencakup Simulasi TKA Resmi, Kuis Modul Gamifikasi, dan Latihan Mandiri, sehingga siswa dapat mengukur dan meningkatkan kemampuan mereka secara mandiri.

2. **Memberdayakan Guru dalam Pemantauan:** Memberikan alat kepada guru untuk memantau perkembangan akademis setiap siswa di kelasnya, mengelola materi pembelajaran (modul dan kuis), serta berkomunikasi dengan siswa melalui fitur pengumuman kelas.

3. **Mengefisienkan Administrasi Sistem:** Membantu administrator dalam mengelola seluruh ekosistem portal, mulai dari manajemen pengguna, pengelolaan bank soal, pembuatan instrumen survei (Survei Karakter & Sulingjar), hingga pemantauan seluruh aktivitas sistem secara *realtime*.

---

## 2. HAK AKSES PENGGUNA (ROLE)

Sistem menggunakan tiga peran (role) utama yang menentukan halaman apa yang dapat diakses dan tindakan apa yang dapat dilakukan oleh pengguna.

### 2.1 Peran: Siswa (`student`)

**Deskripsi:** Pengguna akhir utama aplikasi. Siswa adalah peserta didik kelas 6 SD yang menggunakan portal untuk belajar dan berlatih soal TKA.

**Hak Akses & Kemampuan:**
- ✅ Mengakses Beranda/Dashboard Siswa pribadi.
- ✅ Melihat dan mengerjakan **Simulasi TKA Resmi** (memerlukan Kode Akses/Token dari guru).
- ✅ Melihat dan mengerjakan **Latihan Mandiri** (tanpa token, dapat dikerjakan kapan saja).
- ✅ Mengakses **Katalog Modul Belajar** dan mengerjakan Kuis Modul interaktif (gamifikasi).
- ✅ Melihat **Hasil dan Pembahasan** (bedah jawaban) setelah menyelesaikan ujian atau latihan.
- ✅ Mengisi **Survei** yang telah dipublikasikan oleh admin (Survei Karakter & Sulingjar).
- ✅ Mengakses halaman **Pengaturan Akun** untuk mengelola data pribadi dan mengubah kata sandi.
- ✅ Melihat **Notifikasi** dan pengumuman dari guru.
- ✅ Mengakses **Pusat Bantuan**.

**Batasan Akses:**
- ❌ Tidak dapat mengakses antarmuka Guru (`/guru`) atau Admin (`/admin`).
- ❌ Tidak dapat membuat, mengedit, atau menghapus soal, modul, atau simulasi.
- ❌ Tidak dapat melihat data atau nilai siswa lain.
- ❌ Tidak dapat melihat kunci jawaban secara langsung pada mode Simulasi TKA Resmi (hanya dapat melihat hasil pembahasan secara terstruktur).

---

### 2.2 Peran: Guru/Wali Kelas (`guru`)

**Deskripsi:** Tenaga pendidik yang berperan sebagai wali kelas dan bertanggung jawab atas **satu kelas** yang diampu. Guru memiliki antarmuka manajemen kelas yang terfokus.

**Hak Akses & Kemampuan:**
- ✅ Mengakses **Dashboard Guru** dengan ringkasan statistik kelas — jumlah siswa, rata-rata nilai, serta tingkat partisipasi **latihan** (mencakup tiga jenis: Simulasi TKA, Latihan Mandiri, dan Kuis Modul Belajar) — beserta *countdown* menuju TKA.
- ✅ Melihat **Daftar Siswa** di kelasnya beserta status dan perkembangan masing-masing siswa.
- ✅ Mengakses **Laporan Nilai** detail seluruh siswa di kelasnya, baik per mata pelajaran maupun per jenis ujian (Simulasi TKA, Latihan Mandiri, dan Kuis Modul).
- ✅ Mengakses **Laporan Survei** (rekap pengisian survei dari siswa di kelasnya).
- ✅ Mengelola **Modul Belajar** (membuat, mengedit, menghapus modul yang ditugaskan ke kelasnya).
- ✅ Mengelola **Kuis Modul** (membuat dan mengedit kuis yang terhubung ke modul).
- ✅ Memantau **Agenda Kelas** dan jadwal tryout yang sedang atau akan berjalan.
- ✅ Mengirimkan **Pengumuman Kelas** kepada seluruh siswa atau siswa tertentu, dengan tingkat prioritas (Biasa, Penting, Urgent).
- ✅ Mengidentifikasi **Siswa yang Memerlukan Perhatian Khusus** (berdasarkan skor rendah atau ketidakaktifan).

**Batasan Akses:**
- ❌ Tidak dapat mengakses antarmuka Administrator (`/admin`).
- ❌ Tidak dapat mengelola **Bank Soal** secara langsung (hanya Admin).
- ❌ Tidak dapat mengelola **Simulasi TKA** di tingkat sistem (hanya Admin yang dapat membuat sesi simulasi baru dari bank soal).
- ❌ Tidak dapat menambah atau menghapus akun pengguna (hanya Admin).

---

### 2.3 Peran: Administrator (`admin`)

**Deskripsi:** Pengelola sistem dengan kewenangan penuh. Administrator bertanggung jawab atas keseluruhan ekosistem portal, mulai dari konten hingga pengguna.

**Hak Akses & Kemampuan (Eksklusif):**
- ✅ Mengakses **Dashboard Admin** dengan metrik statistik tingkat sistem (total siswa, tryout aktif, rata-rata skor, total soal).
- ✅ Mengelola **Bank Soal** secara penuh (menambah, mengedit, menghapus soal dengan dukungan render matematika).
- ✅ Mengelola **Sesi Simulasi TKA & Latihan Mandiri** (membuat sesi baru dengan fitur pengambilan soal otomatis-acak atau pilih manual dari bank soal).
- ✅ Mengelola **Modul Belajar** di tingkat sistem.
- ✅ Mengelola **Manajemen Survei** (membuat, mengedit, dan mempublikasikan instrumen Survei Karakter & Survei Lingkungan Belajar/Sulingjar).
- ✅ Mengelola **Manajemen Pengguna** (menambah, mengedit, dan menonaktifkan akun siswa maupun guru).
- ✅ Mengakses **Laporan Nilai** dan **Laporan Survei** di tingkat sistem.
- ✅ Memantau **Log Aktivitas Sistem** (audit trail seluruh aktivitas penting pengguna).
- ✅ Memantau **Pengguna Aktif secara Realtime** (tabel live online users yang berisi nama, peran, aktivitas terkini, dan perangkat yang digunakan).

---

## 3. DESKRIPSI HALAMAN (PAGES OVERVIEW)

### 3.1 Halaman Autentikasi

---

#### 3.1.1 Halaman Masuk (Login)
- **Path URL:** `/login`
- **Akses:** Publik (tidak memerlukan autentikasi)
- **Deskripsi:** Halaman gerbang utama aplikasi. Pengguna memasukkan kredensial (nama pengguna/email dan kata sandi) untuk mengakses sistem. Setelah berhasil, sistem akan mengarahkan pengguna ke dashboard sesuai perannya (`/beranda` untuk siswa, `/guru` untuk guru, `/admin` untuk administrator).
- **Fitur Utama:**
  - Formulir login dengan validasi input.
  - Tautan ke halaman *Lupa Password*.
  - Redirect otomatis berdasarkan role pengguna.

#### 3.1.2 Halaman Lupa Kata Sandi
- **Path URL:** `/forgot-password`
- **Akses:** Publik
- **Deskripsi:** Halaman untuk proses pemulihan akun bagi pengguna yang lupa kata sandinya.

---

### 3.2 Halaman Siswa

---

#### 3.2.1 Beranda / Dashboard Siswa
- **Path URL:** `/beranda`
- **Akses:** Siswa
- **Deskripsi:** Halaman utama yang menjadi pusat informasi dan navigasi bagi siswa. Dirancang dengan antarmuka yang ramah dan menarik bagi anak-anak.

**Komponen dan Informasi yang Ditampilkan:**
| Komponen | Keterangan |
|---|---|
| **Widget Hitung Mundur (Countdown)** | Menampilkan sisa hari menuju pelaksanaan TKA nasional secara realtime. |
| **Banner Pengingat** | Notifikasi penting dari guru yang dapat ditutup oleh siswa. |
| **Header Profil** | Menampilkan nama, foto profil, sekolah, dan kelas siswa. |
| **Streak Login** | Tombol yang menampilkan jumlah hari berturut-turut siswa login, mendorong konsistensi belajar. |
| **Progres Akademis** | Widget yang menampilkan progres penyelesaian simulasi dan modul dalam bentuk visual. |
| **Agenda Mendatang** | Daftar jadwal simulasi TKA yang akan datang. |
| **Riwayat Pengerjaan** | Daftar singkat hasil simulasi/latihan yang pernah dikerjakan sebelumnya. |
| **Latihan Terbaru** | Kartu-kartu simulasi/latihan terbaru yang tersedia, dengan tautan ke halaman ujian. |
| **Modul Terbaru** | Pratinjau visual modul belajar terbaru, dengan tautan ke halaman modul. |

---

#### 3.2.2 Halaman Pusat Ujian & Latihan (Daftar Simulasi)
- **Path URL:** `/ujian`
- **Akses:** Siswa
- **Deskripsi:** Halaman repositori utama tempat siswa dapat melihat seluruh ujian yang tersedia. Terdapat dua tab navigasi utama untuk memilah jenis latihan.

**Komponen Utama:**
- **Tab "Simulasi TKA":** Menampilkan seluruh sesi simulasi TKA resmi yang telah dipublikasikan oleh admin. Setiap kartu menampilkan judul, mata pelajaran, durasi, jumlah soal, dan status. Untuk memulai, siswa **diwajibkan memasukkan Kode Akses (Token)** yang diberikan oleh guru pada hari ujian.
- **Tab "Latihan Mandiri":** Menampilkan sesi latihan mandiri yang dapat dikerjakan kapan saja tanpa token, berfungsi sebagai latihan bebas tanpa tekanan.
- **Widget Hitung Mundur:** Menampilkan sisa waktu menuju jadwal simulasi terdekat.
- **Riwayat Terakhir:** Ringkasan kartu dari ujian/latihan yang telah diselesaikan sebelumnya, lengkap dengan skor.
- **Modal Konfirmasi:** Ketika siswa memilih ujian, modal konfirmasi muncul untuk memasukkan token (untuk simulasi TKA) atau langsung melanjutkan ke halaman persiapan (untuk latihan mandiri).

---

#### 3.2.3 Halaman Persiapan Ujian (Pra-Simulasi)
- **Path URL:** `/ujian/:ujianId/persiapan`
- **Akses:** Siswa
- **Deskripsi:** Halaman jeda sebelum ujian dimulai. Berfungsi sebagai ruang transisi untuk memastikan siswa siap secara mental dan teknis. Menampilkan informasi lengkap ujian (judul, mata pelajaran, jumlah soal, durasi, dan tata tertib), serta tombol untuk memulai pengerjaan.

---

#### 3.2.4 Halaman Eksekusi Ujian / Pengerjaan Soal
- **Path URL:** `/ujian/:ujianId`
- **Akses:** Siswa
- **Deskripsi:** Halaman pengerjaan soal utama. Dirancang tanpa navigasi layout (distraction-free) agar siswa dapat fokus sepenuhnya pada ujian.

**Fitur Utama:**
- **Timer Hitung Mundur:** Menampilkan sisa waktu pengerjaan yang terus berkurang. Memberikan peringatan visual ketika waktu hampir habis.
- **Navigasi Soal:** Nomor soal yang dapat diklik untuk berpindah antar soal dengan cepat. Soal yang sudah dijawab ditandai berbeda secara visual.
- **Render Matematika:** Soal yang mengandung formula matematika (LaTeX) akan dirender dengan benar.
- **Indikator Kemajuan:** Menampilkan berapa soal yang sudah dijawab dari total soal.
- **Penyimpanan Jawaban Sementara:** Jawaban siswa tersimpan secara lokal sehingga tidak hilang jika terjadi gangguan koneksi sementara.
- **Pengumpulan Otomatis:** Jawaban dikirim secara otomatis ketika waktu habis.

---

#### 3.2.5 Halaman Hasil & Ulasan Simulasi TKA
- **Path URL:** `/ujian/:ujianId/hasil`
- **Akses:** Siswa
- **Deskripsi:** Halaman yang menampilkan rekap hasil pengerjaan Simulasi TKA Resmi setelah selesai dikerjakan.

**Fitur Utama:**
- Tampilan **Skor Akhir** dalam format visual yang menarik.
- **Ringkasan Statistik:** Jumlah jawaban benar, salah, dan soal yang tidak dijawab.
- **Fitur Bedah Jawaban:** Siswa dapat menelusuri setiap soal dan melihat penjelasan/pembahasan jawaban untuk memahami letak kesalahan mereka.

> [!IMPORTANT]
> Pada mode Simulasi TKA Resmi, **kunci jawaban (huruf A/B/C/D) tidak ditampilkan secara langsung**. Sebagai gantinya, sistem hanya menampilkan apakah jawaban siswa benar atau salah, beserta uraian pembahasan untuk setiap soal.

---

#### 3.2.6 Halaman Hasil Latihan Mandiri
- **Path URL:** `/latihan/:ujianId/hasil`
- **Akses:** Siswa
- **Deskripsi:** Serupa dengan halaman Hasil Simulasi, namun diperuntukkan bagi mode Latihan Mandiri. Pada mode ini, pembahasan dan kunci jawaban dapat ditampilkan lebih transparan karena bersifat latihan, bukan ujian resmi.

---

#### 3.2.7 Halaman Katalog Modul Belajar
- **Path URL:** `/modul`
- **Akses:** Siswa
- **Deskripsi:** Halaman katalog yang menampilkan seluruh modul belajar yang tersedia bagi siswa, disajikan dengan tampilan visual berupa kartu bergambar (*hero image*). Setiap modul mencakup ringkasan materi dan kuis interaktif.

---

#### 3.2.8 Halaman Kuis Modul (Gamifikasi)
- **Path URL:** `/modul/kuis/:modulId`
- **Akses:** Siswa
- **Deskripsi:** Halaman pengerjaan kuis yang terhubung dengan modul belajar tertentu. Berbeda dari simulasi TKA, kuis modul dirancang dengan elemen gamifikasi (misalnya, poin, umpan balik instan) untuk membuat proses belajar lebih menyenangkan dan memotivasi siswa.

---

#### 3.2.9 Halaman Eksekusi Survei
- **Path URL:** `/survey/:surveyId`
- **Akses:** Siswa
- **Deskripsi:** Halaman pengisian survei yang telah dipublikasikan oleh administrator. Antarmuka survei bersih dan mudah dipahami anak-anak. Setelah semua pertanyaan dijawab, siswa akan diarahkan ke halaman konfirmasi penyelesaian survei.

---

#### 3.2.10 Halaman Pengaturan Akun Siswa
- **Path URL:** `/pengaturan`
- **Akses:** Siswa
- **Deskripsi:** Halaman bagi siswa untuk mengelola informasi profil pribadi mereka, termasuk mengganti foto profil, nama tampilan, dan mengubah kata sandi.

---

#### 3.2.11 Halaman Pusat Bantuan
- **Path URL:** `/bantuan`
- **Akses:** Siswa
- **Deskripsi:** Halaman berisi panduan penggunaan aplikasi dan jawaban atas pertanyaan-pertanyaan yang sering diajukan (FAQ) untuk membantu siswa jika menemui kesulitan dalam menggunakan portal.

---

### 3.3 Halaman Guru

---

#### 3.3.1 Beranda / Dashboard Guru
- **Path URL:** `/guru`
- **Akses:** Guru
- **Deskripsi:** Pusat kendali utama bagi guru untuk memantau kondisi kelasnya secara keseluruhan.

**Komponen Utama:**
| Komponen | Keterangan |
|---|---|
| **Banner Countdown TKA** | Hitung mundur besar menuju pelaksanaan TKA dalam format Hari:Jam:Menit. |
| **Kartu Statistik Kelas** | Menampilkan total siswa, rata-rata nilai Matematika, rata-rata nilai Bahasa Indonesia, dan tingkat partisipasi tryout. |
| **Progress Bar Tryout Aktif** | Menampilkan progres pengerjaan tryout yang sedang berjalan (misal: "14 dari 16 siswa selesai"). |
| **Siswa Perlu Perhatian** | Daftar siswa dengan skor di bawah 60 atau yang sudah lama tidak aktif, lengkap dengan tombol "Intervensi". |
| **Ringkasan Performa Kelas** | Daftar singkat 5 siswa teratas beserta skor rata-rata mereka. |
| **Agenda Terdekat** | Timeline jadwal tryout atau kegiatan kelas yang akan datang. |
| **Panel Pengumuman Kelas** | Tombol cepat untuk membuka modal kirim pengumuman kepada seluruh atau sebagian siswa kelas. |

**Fitur Pengumuman Kelas (Modal):**
Guru dapat mengirim pengumuman dengan konfigurasi:
- **Target Penerima:** Semua Siswa *atau* Siswa Spesifik (dipilih satu per satu).
- **Tingkat Prioritas:** Biasa / Penting / Urgent (dengan kode warna berbeda).
- **Isi Pesan:** Teks bebas maksimal 500 karakter.

---

#### 3.3.2 Halaman Daftar Siswa
- **Path URL:** `/guru/siswa`
- **Akses:** Guru
- **Deskripsi:** Tabel lengkap seluruh siswa yang terdaftar di kelas yang diampu oleh guru, disertai informasi status keaktifan dan rata-rata skor masing-masing siswa.

---

#### 3.3.3 Halaman Laporan Nilai (Guru)
- **Path URL:** `/guru/laporan`
- **Akses:** Guru
- **Deskripsi:** Halaman analisis nilai yang lebih detail dan komprehensif. Guru dapat melihat rekap nilai setiap siswa per mata pelajaran dan per sesi simulasi, serta mengunduh laporan.

---

#### 3.3.4 Halaman Laporan Survei (Guru)
- **Path URL:** `/guru/laporan/survey`
- **Akses:** Guru
- **Deskripsi:** Halaman yang menampilkan rekap dan analisis hasil pengisian survei (Survei Karakter & Sulingjar) dari seluruh siswa di kelas guru tersebut.

---

#### 3.3.5 Halaman Kelola Modul (Guru)
- **Path URL:** `/guru/modul`
- **Akses:** Guru
- **Deskripsi:** Daftar modul belajar yang dikelola oleh guru. Guru dapat menambah modul baru atau mengedit modul yang sudah ada.

#### 3.3.6 Halaman Tambah/Edit Modul (Guru)
- **Path URL:** `/guru/modul/tambah` | `/guru/modul/edit/:id`
- **Akses:** Guru
- **Deskripsi:** Formulir untuk membuat konten modul belajar baru atau memperbarui modul yang sudah ada.

---

#### 3.3.7 Halaman Kelola Kuis (Guru)
- **Path URL:** `/guru/kuis`
- **Akses:** Guru
- **Deskripsi:** Daftar kuis yang terhubung dengan modul-modul di kelas guru. Guru dapat menambah atau mengedit kuis.

#### 3.3.8 Halaman Tambah/Edit Kuis (Guru)
- **Path URL:** `/guru/kuis/tambah` | `/guru/kuis/edit/:id`
- **Akses:** Guru
- **Deskripsi:** Formulir pembuatan atau pengeditan kuis modul, termasuk pengaturan soal dan jawaban.

---

#### 3.3.9 Halaman Agenda Kelas
- **Path URL:** `/guru/agenda`
- **Akses:** Guru
- **Deskripsi:** Tampilan kalender atau timeline yang menampilkan seluruh agenda kelas, jadwal tryout, kuis, dan kegiatan penting lainnya.

---

### 3.4 Halaman Administrator

---

#### 3.4.1 Beranda / Dashboard Admin
- **Path URL:** `/admin`
- **Akses:** Administrator
- **Deskripsi:** Pusat komando utama administrator dengan pandangan menyeluruh (bird's-eye view) terhadap seluruh sistem.

**Komponen Utama:**
| Komponen | Keterangan |
|---|---|
| **Kartu Statistik Sistem** | Empat metrik kunci: Total Siswa (1.284), Tryout Aktif (12), Rata-rata Skor Sistem (78.5), Total Soal di Bank (4.520). |
| **Grafik Tren Performa** | Grafik garis yang menampilkan perkembangan rata-rata nilai dari waktu ke waktu (per bulan). |
| **Status Tryout Aktif** | Daftar sesi tryout yang sedang berlangsung beserta jumlah peserta dan sisa waktu. |
| **Grafik Perbandingan Kelas** | Grafik batang yang membandingkan performa antar-kelas untuk setiap mata pelajaran. |
| **Tabel Siswa Perlu Perhatian** | Daftar siswa dengan skor terendah di seluruh sistem. |
| **Log Aktivitas Terbaru** | Ringkasan beberapa aktivitas sistem terkini. |
| **Ringkasan Bank Soal** | Tampilan visual distribusi soal per mata pelajaran (Mudah/Sedang/Sulit). |

---

#### 3.4.2 Halaman Manajemen Pengguna
- **Path URL:** `/admin/pengguna`
- **Akses:** Administrator (Eksklusif)
- **Deskripsi:** Halaman tabel manajemen seluruh akun pengguna dalam sistem (Siswa dan Guru). Admin dapat memfilter, mencari, menambah, mengedit, atau menonaktifkan akun.

#### 3.4.3 Halaman Tambah/Edit Pengguna
- **Path URL:** `/admin/pengguna/tambah` | `/admin/pengguna/edit/:id`
- **Akses:** Administrator (Eksklusif)
- **Deskripsi:** Formulir untuk mendaftarkan akun pengguna baru atau memperbarui data pengguna yang sudah ada (nama, sekolah, kelas, peran, kata sandi).

---

#### 3.4.4 Halaman Bank Soal
- **Path URL:** `/admin/bank-soal`
- **Akses:** Administrator
- **Deskripsi:** Repositori utama seluruh soal dalam sistem. Admin dapat melihat, memfilter, dan mengelola ribuan soal yang dikelompokkan berdasarkan mata pelajaran, tingkat kesulitan, dan status penggunaan (sudah/belum pernah digunakan di simulasi).

#### 3.4.5 Halaman Tambah/Edit Soal
- **Path URL:** `/admin/bank-soal/tambah` | `/admin/bank-soal/edit/:id`
- **Akses:** Administrator
- **Deskripsi:** Formulir pengeditan soal yang dilengkapi dengan **renderer matematika (LaTeX/KaTeX)** untuk menampilkan dan membuat soal yang mengandung formula matematika dengan benar.

---

#### 3.4.6 Halaman Manajemen Simulasi & Latihan Mandiri
- **Path URL:** `/admin/simulasi`
- **Akses:** Administrator
- **Deskripsi:** Daftar seluruh sesi Simulasi TKA dan Latihan Mandiri yang pernah dibuat, beserta statusnya (Draft / Berlangsung / Selesai).

#### 3.4.7 Halaman Tambah/Edit Sesi Simulasi atau Latihan Mandiri
- **Path URL:** `/admin/simulasi/tambah` | `/admin/simulasi/edit/:id`
- **Akses:** Administrator
- **Deskripsi:** Formulir 3-langkah untuk membuat sesi simulasi/latihan baru (lihat detail di [Workflow B](#workflow-b)).

---

#### 3.4.8 Halaman Manajemen Survei
- **Path URL:** `/admin/survei`
- **Akses:** Administrator
- **Deskripsi:** Daftar seluruh instrumen survei (Survei Karakter dan Sulingjar) yang pernah dibuat, beserta statusnya (Draft / Aktif).

#### 3.4.9 Halaman Tambah/Edit Survei
- **Path URL:** `/admin/survei/tambah` | `/admin/survei/edit/:id`
- **Akses:** Administrator
- **Deskripsi:** Formulir 2-langkah untuk membuat atau mengedit instrumen survei menggunakan soal dari Bank Soal Survei (lihat detail di [Workflow B](#workflow-b)).

---

#### 3.4.10 Halaman Laporan Nilai (Admin)
- **Path URL:** `/admin/laporan`
- **Akses:** Administrator
- **Deskripsi:** Laporan nilai menyeluruh di tingkat sistem, mencakup seluruh kelas dan seluruh sesi simulasi. Admin dapat mengunduh laporan dalam format spreadsheet.

#### 3.4.11 Halaman Laporan Survei (Admin)
- **Path URL:** `/admin/laporan/survey`
- **Akses:** Administrator
- **Deskripsi:** Rekap dan analisis hasil pengisian survei dari seluruh siswa di seluruh kelas di tingkat sistem.

---

#### 3.4.12 Halaman Log Aktivitas & Monitor Realtime
- **Path URL:** `/admin/log-aktivitas`
- **Akses:** Administrator
- **Deskripsi:** Pusat pemantauan sistem yang paling komprehensif. Terdiri dari dua panel utama:

**Panel 1 — Tabel Log Aktivitas (Audit Trail):**
Menampilkan seluruh rekam jejak aktivitas pengguna secara kronologis dengan standar zona waktu WIB.

| Kolom | Keterangan |
|---|---|
| **Aktivitas** | Deskripsi singkat tindakan yang dilakukan beserta ikon tipe (login, mulai tes, selesai tes, perubahan data, unggah, unduh). |
| **Pelaku** | Nama pengguna yang melakukan tindakan beserta kelas/unit. |
| **Lingkup / Subjek** | Konteks mata pelajaran atau modul yang terkait. |
| **Waktu Kejadian** | Waktu persis tindakan tersebut terjadi. |

Fitur tambahan: **Pencarian** (berdasarkan nama atau deskripsi) dan **Filter Tipe** (Login, Mulai Tes, Selesai Tes, Perubahan Data, Unggah, Unduh). Setiap baris dapat diklik untuk melihat **Detail Log** dalam modal terpisah yang memuat ID Referensi, pelaku, waktu, kategori, dan keterangan lengkap.

**Panel 2 — Tabel Pengguna Aktif Realtime (Live Online Users):**
Diakses melalui tombol **"Pengguna Aktif Realtime"** (dengan indikator titik hijau berkedip) di bagian atas halaman. Menampilkan modal tabel yang berisi daftar seluruh pengguna yang sedang *online* saat itu.

| Kolom | Keterangan |
|---|---|
| **Identitas Pengguna** | Nama, peran (Siswa/Guru/Admin), dan kelas/unit. |
| **Aktivitas Terkini** | Apa yang sedang dilakukan pengguna saat ini (misal: "Sedang Mengerjakan Simulasi TKA"). |
| **Perangkat** | Jenis perangkat yang digunakan (Laptop/Windows, Mobile/Android, dll.). |
| **Durasi Online** | Berapa lama pengguna telah aktif dalam sesi tersebut. |

> [!NOTE]
> Jumlah pengguna aktif diperbarui secara otomatis setiap beberapa detik untuk mencerminkan kondisi realtime sistem.

---

## 4. ALUR KERJA UTAMA (CORE WORKFLOWS)

### Workflow A: Alur Siswa — Dari Login hingga Melihat Hasil

Skenario ini menggambarkan perjalanan lengkap seorang siswa yang masuk ke aplikasi, memilih dan mengerjakan ujian, belajar melalui modul, lalu melihat hasilnya.

---

#### A.1. Alur Mengerjakan Simulasi TKA Resmi

```
[MULAI]
    │
    ▼
Langkah 1: MASUK APLIKASI
    ├─ Siswa membuka URL Portal di peramban (browser).
    ├─ Mengisi username/email dan kata sandi pada halaman /login.
    └─ Sistem memverifikasi kredensial.
            │
            ▼
Langkah 2: BERANDA SISWA (Dashboard)
    ├─ Sistem mengarahkan ke /beranda.
    ├─ Siswa melihat countdown TKA, pengingat guru, dan daftar
    │  latihan/simulasi terbaru.
    └─ Siswa mengklik "Lihat Semua" atau navigasi ke /ujian.
            │
            ▼
Langkah 3: HALAMAN PUSAT UJIAN & LATIHAN (/ujian)
    ├─ Halaman terbuka dengan Tab "Simulasi TKA" aktif secara default.
    ├─ Siswa melihat daftar sesi simulasi yang tersedia (kartu-kartu ujian).
    └─ Siswa mengklik tombol "Mulai" pada salah satu kartu simulasi.
            │
            ▼
Langkah 4: MODAL KONFIRMASI & INPUT TOKEN
    ├─ Sebuah modal muncul: "Sudah Siap? Ini Simulasi Resmi."
    ├─ Siswa diminta memasukkan Kode Akses (Token) yang diberikan
    │  oleh guru pada hari pelaksanaan ujian.
    │  ├─ Jika token BENAR → lanjut ke Langkah 5.
    │  └─ Jika token SALAH → muncul pesan "Kode Akses Salah!".
    └─ Siswa mengklik "Mulai Ujian Sekarang".
            │
            ▼
Langkah 5: HALAMAN PERSIAPAN (/ujian/:id/persiapan)
    ├─ Siswa melihat informasi lengkap ujian: nama, mata pelajaran,
    │  jumlah soal, durasi, dan tata tertib pengerjaan.
    └─ Siswa mengklik tombol "Mulai Pengerjaan" untuk memulai timer.
            │
            ▼
Langkah 6: EKSEKUSI UJIAN (/ujian/:id) — Distraction-Free Mode
    ├─ Timer hitung mundur berjalan di bagian atas layar.
    ├─ Siswa membaca soal dan memilih jawaban (pilihan ganda).
    ├─ Siswa dapat berpindah antar soal menggunakan navigasi nomor.
    ├─ Soal yang sudah dijawab ditandai secara visual.
    ├─ Siswa dapat meninjau kembali jawaban sebelum mengumpulkan.
    └─ Siswa mengklik "Kumpulkan Jawaban" ATAU timer habis otomatis.
            │
            ▼
Langkah 7: HALAMAN HASIL SIMULASI (/ujian/:id/hasil)
    ├─ Sistem menghitung dan menampilkan skor akhir secara otomatis.
    ├─ Ringkasan: jawaban benar, salah, dan tidak dijawab.
    ├─ Siswa mengklik "Bedah Jawaban" untuk meninjau per soal.
    │  └─ Setiap soal menampilkan pembahasan tanpa memperlihatkan
    │     kunci jawaban (huruf) secara langsung.
    └─ Siswa mengklik "Kembali ke Beranda" atau "Lihat Semua Latihan".

[SELESAI]
```

---

#### A.2. Alur Mengerjakan Latihan Mandiri

```
[MULAI]
    │
    ▼
Langkah 1 & 2: (Sama dengan A.1 — Login dan Beranda)
            │
            ▼
Langkah 3: HALAMAN PUSAT UJIAN (/ujian)
    └─ Siswa mengklik Tab "LATIHAN MANDIRI".
            │
            ▼
Langkah 4: MODAL KONFIRMASI (Tanpa Token)
    ├─ Modal muncul: "Ukur kemampuanmu dengan latihan mandiri ini!"
    ├─ Tidak ada input token yang diperlukan.
    └─ Siswa mengklik "Mulai Ujian Sekarang".
            │
            ▼
Langkah 5 & 6: (Sama dengan A.1 — Persiapan & Eksekusi)
            │
            ▼
Langkah 7: HALAMAN HASIL LATIHAN (/latihan/:id/hasil)
    ├─ Skor akhir ditampilkan.
    └─ Bedah jawaban tersedia dengan pembahasan yang lebih terbuka
       (kunci jawaban dapat ditampilkan karena bukan ujian resmi).

[SELESAI]
```

---

#### A.3. Alur Belajar dan Mengerjakan Kuis Modul

```
[MULAI] — (Sudah Login di Beranda)
    │
    ▼
Langkah 1: NAVIGASI KE MODUL
    └─ Siswa mengklik "Katalog Lengkap" di bagian Modul Beranda
       atau memilih menu "Modul" di navigasi bawah → /modul.
            │
            ▼
Langkah 2: HALAMAN KATALOG MODUL (/modul)
    ├─ Siswa melihat daftar modul dengan gambar sampul yang menarik.
    └─ Siswa memilih sebuah modul yang ingin dipelajari.
            │
            ▼
Langkah 3: DETAIL MODUL
    ├─ Siswa membaca materi dan konten yang tersedia di dalam modul.
    └─ Siswa mengklik tombol "Mulai Kuis" untuk mengerjakan kuis.
            │
            ▼
Langkah 4: EKSEKUSI KUIS MODUL (/modul/kuis/:modulId)
    ├─ Siswa menjawab pertanyaan kuis dalam antarmuka gamifikasi.
    ├─ Umpan balik instan diberikan setelah setiap jawaban (benar/salah).
    └─ Siswa menyelesaikan semua soal kuis.
            │
            ▼
Langkah 5: HASIL KUIS
    └─ Skor kuis ditampilkan. Siswa dapat mengulang kuis atau
       kembali ke katalog modul.

[SELESAI]
```

---

### Workflow B: Alur Guru/Admin — Membuat Instrumen Survei & Sesi Simulasi TKA

#### B.1. Alur Membuat Instrumen Survei (Admin)

```
[MULAI]
    │
    ▼
Langkah 1: AKSES MANAJEMEN SURVEI
    └─ Admin login dan membuka menu Survei di sidebar → /admin/survei.
            │
            ▼
Langkah 2: INISIASI SURVEI BARU
    └─ Admin mengklik tombol "Tambah Survei" → /admin/survei/tambah.
            │
            ▼
Langkah 3: FORMULIR SURVEI — LANGKAH 1 (Informasi Dasar)
    ├─ Admin mengisi kolom berikut:
    │  ├─ Judul Survei (wajib): misal "Survei Karakter Kemandirian".
    │  ├─ Deskripsi / Petunjuk Pengisian.
    │  └─ Tipe Instrumen: pilih "Survei Karakter" atau
    │      "Survei Lingkungan Belajar (Sulingjar)".
    └─ Admin memastikan semua data sudah benar, lanjut ke Langkah 4.
            │
            ▼
Langkah 4: FORMULIR SURVEI — LANGKAH 2 (Pengaturan Soal)
    ├─ Admin memilih METODE SELEKSI SOAL:
    │
    │  [OPSI A: ACAK OTOMATIS]
    │  ├─ Admin memasukkan jumlah soal yang diinginkan (misal: 10 butir).
    │  ├─ Admin mengklik tombol "Acak Soal Sekarang".
    │  ├─ Sistem menjalankan algoritma acak (Fisher-Yates) dan memilih
    │  │   soal secara acak dari bank soal sesuai tipe instrumen.
    │  └─ Pratinjau soal yang teracak muncul di bawah tombol.
    │
    │  [OPSI B: PILIH MANUAL]
    │  ├─ Sistem menampilkan daftar soal dari bank soal sesuai tipe.
    │  ├─ Admin dapat mencari soal menggunakan kotak pencarian.
    │  └─ Admin mencentang (✓) soal yang ingin dimasukkan ke survei.
    │
    └─ Setelah soal dipilih, rangkuman total soal ditampilkan.
            │
            ▼
Langkah 5: SIMPAN & PUBLIKASIKAN
    ├─ Admin mengklik "Draft" untuk menyimpan sebagai draf (belum
    │   tampil ke siswa).
    │   ATAU
    └─ Admin mengklik "Simpan & Rilis" untuk langsung mempublikasikan
       survei (langsung tampil ke siswa).
            │
            ▼
Langkah 6: SURVEI TERSEDIA PASCA SIMULASI TKA
    └─ Setelah status "Aktif", survei **tidak muncul di beranda**.
       Survei ditampilkan kepada siswa sebagai bagian dari alur
       **pasca penyelesaian Sesi Simulasi TKA** yang telah dikaitkan
       (melalui field "Integrasi Survei Pendukung" saat membuat simulasi).
       Siswa akan diarahkan ke halaman pengisian survei setelah
       menyelesaikan dan mengumpulkan jawaban ujian.

[SELESAI]
```

---

#### B.2. Alur Membuat Sesi Simulasi TKA atau Latihan Mandiri Baru (Admin)

```
[MULAI]
    │
    ▼
Langkah 1: AKSES MANAJEMEN SIMULASI
    └─ Admin membuka menu Simulasi di sidebar → /admin/simulasi.
            │
            ▼
Langkah 2: INISIASI SESI BARU
    └─ Admin mengklik tombol "Buat Sesi Baru" → /admin/simulasi/tambah.
            │
            ▼
Langkah 3: FORMULIR SIMULASI — LANGKAH 1 (Informasi Dasar & Konfigurasi)
    ├─ Admin mengisi formulir berikut:
    │  ├─ Nama Simulasi TKA (wajib): misal "Simulasi TKA Nasional 1".
    │  ├─ Tipe: "Simulasi TKA" atau "Latihan Mandiri".
    │  ├─ Filter Materi (Mata Pelajaran): Matematika / Bahasa Indonesia.
    │  ├─ Integrasi Survei Pendukung: menautkan survei opsional.
    │  ├─ Target Soal (Butir): misal "30".
    │  ├─ Durasi (Menit): misal "90".
    │  ├─ Tanggal & Waktu Mulai Ujian.
    │  └─ Tanggal & Waktu Selesai Ujian.
    └─ Admin mengklik "Terapkan Konfigurasi" untuk mengunci pengaturan.
            │
            ▼
Langkah 4: FORMULIR SIMULASI — LANGKAH 2 (Metode Pengambilan Soal)
    └─ Admin memilih metode pengambilan soal:
       ├─ "Acak Otomatis": soal dipilih oleh sistem.
       └─ "Pilih Manual": soal dipilih sendiri oleh admin.
            │
            ▼
Langkah 5: FORMULIR SIMULASI — LANGKAH 3 (Pemilihan Soal)
    │
    ├─ [JIKA ACAK OTOMATIS]
    │  ├─ Sistem menampilkan informasi stok soal yang tersedia di bank soal
    │  │   sesuai mata pelajaran yang dikonfigurasi.
    │  ├─ Admin mengklik tombol "Acak Soal Otomatis".
    │  ├─ Sistem mengacak dan memilih soal sesuai jumlah target.
    │  ├─ Indikator validasi muncul:
    │  │   ├─ ✅ Hijau: "Acak otomatis berhasil & jumlah sesuai!"
    │  │   └─ ⚠️  Kuning: "Soal belum diacak atau belum cukup."
    │  └─ Pratinjau tabel soal yang teracak ditampilkan.
    │
    └─ [JIKA PILIH MANUAL]
       ├─ Sistem menampilkan tabel seluruh soal dari bank soal sesuai
       │   mata pelajaran.
       ├─ Setiap soal dilengkapi dengan badge "Sudah Pernah Digunakan"
       │   atau "Belum Pernah Digunakan" untuk membantu seleksi.
       ├─ Admin dapat mencari soal menggunakan kotak pencarian.
       └─ Admin mencentang (✓) soal satu per satu hingga memenuhi target.
            │
            ▼
Langkah 6: SIMPAN & RILIS
    ├─ Admin mengklik "Draft" → disimpan sebagai draf, belum tampil
    │   ke siswa.
    │   ATAU
    ├─ Admin mengklik "Simpan & Rilis" → dialog konfirmasi muncul.
    └─ Admin mengkonfirmasi: "Ya, Rilis Sekarang" → sesi simulasi
       dipublikasikan dan muncul di halaman ujian siswa.
            │
            ▼
Langkah 7: SESI SIMULASI AKTIF
    └─ Sesi simulasi kini tersedia di halaman /ujian siswa.
       Guru dapat mendistribusikan Kode Akses (Token) kepada siswa.

[SELESAI]
```

---

### Workflow C: Alur Admin Memantau Aktivitas Siswa Secara Realtime

```
[MULAI]
    │
    ▼
Langkah 1: AKSES LOG AKTIVITAS
    ├─ Admin login dan membuka menu "Log Aktivitas" di sidebar admin.
    └─ Sistem memuat halaman /admin/log-aktivitas.
            │
            ▼
Langkah 2: TINJAUAN TABEL LOG AKTIVITAS SISTEM
    ├─ Admin melihat tabel log yang menampilkan seluruh aktivitas
    │   penting pengguna secara kronologis (terbaru di atas).
    ├─ Setiap baris menampilkan: ikon tipe aktivitas, deskripsi,
    │   nama pelaku, kelas/unit, lingkup/subjek, dan waktu kejadian.
    │
    ├─ [PENCARIAN & FILTER]
    │  ├─ Admin mengetik kata kunci di kotak pencarian (nama pengguna,
    │  │   deskripsi, atau subjek).
    │  └─ Admin memilih filter tipe dari dropdown:
    │      Semua / Login / Mulai Tes / Selesai Tes /
    │      Perubahan Data / Unggah Berkas / Unduh Berkas.
    │
    └─ [LIHAT DETAIL AKTIVITAS]
       └─ Admin mengklik salah satu baris pada tabel.
             │
             ▼
Langkah 3: MODAL DETAIL LOG AKTIVITAS
    ├─ Modal muncul dan menampilkan:
    │   ├─ ID Referensi Log (misal: #LOG-0001).
    │   ├─ Pelaku (Nama dan Kelas/Unit).
    │   ├─ Waktu Kejadian yang tepat (zona WIB).
    │   ├─ Kategori Tipe Aktivitas.
    │   └─ Deskripsi & Keterangan Lengkap aktivitas.
    └─ Admin mengklik "Tutup Jendela" untuk kembali ke tabel.
            │
            ▼
Langkah 4: MEMANTAU PENGGUNA AKTIF REALTIME
    ├─ Admin melihat tombol "Pengguna Aktif Realtime" di pojok kanan atas.
    ├─ Tombol menampilkan jumlah pengguna online saat ini (berubah
    │   otomatis setiap beberapa detik dengan indikator titik hijau
    │   berkedip).
    └─ Admin mengklik tombol tersebut.
            │
            ▼
Langkah 5: MODAL TABEL PENGGUNA AKTIF (Live Online Users)
    ├─ Modal besar muncul menampilkan tabel seluruh pengguna online.
    ├─ Tabel memuat informasi per pengguna:
    │   ├─ Identitas: Nama, Peran (Siswa/Guru/Admin), Kelas/Unit.
    │   ├─ Aktivitas Terkini: Apa yang sedang dilakukan saat ini
    │   │   (misal: "Sedang Mengerjakan Simulasi TKA").
    │   ├─ Perangkat: Jenis perangkat (Laptop/Windows, Mobile/Android).
    │   └─ Durasi Online: Berapa lama sudah online (misal: "45 Menit").
    │
    ├─ Admin dapat mengidentifikasi jika ada siswa yang mengalami
    │   kesulitan atau aktivitas yang mencurigakan.
    └─ Admin mengklik tombol "X" untuk menutup modal.
            │
            ▼
Langkah 6: TINDAK LANJUT BERDASARKAN TEMUAN
    ├─ Jika ada siswa yang stuck/tidak bergerak: Admin dapat
    │   menghubungi guru kelas untuk melakukan intervensi.
    ├─ Jika ada aktivitas sistem yang tidak normal: Admin dapat
    │   mengambil tindakan administratif sesuai prosedur.
    └─ Admin dapat kembali memantau log secara berkala atau
       meninggalkan halaman.

[SELESAI]
```

---

## LAMPIRAN: Peta Seluruh Rute Aplikasi

| No | Path URL | Halaman | Akses |
|---|---|---|---|
| 1 | `/login` | Halaman Masuk | Publik |
| 2 | `/forgot-password` | Lupa Kata Sandi | Publik |
| 3 | `/beranda` | Dashboard Siswa | Siswa |
| 4 | `/ujian` | Pusat Ujian & Latihan | Siswa |
| 5 | `/ujian/:id/persiapan` | Persiapan Sebelum Ujian | Siswa |
| 6 | `/ujian/:id` | Eksekusi/Pengerjaan Soal | Siswa |
| 7 | `/ujian/:id/hasil` | Hasil & Ulasan Simulasi TKA | Siswa |
| 8 | `/latihan/:id/hasil` | Hasil Latihan Mandiri | Siswa |
| 9 | `/modul` | Katalog Modul Belajar | Siswa |
| 10 | `/modul/kuis/:modulId` | Kuis Modul (Gamifikasi) | Siswa |
| 11 | `/survey/:surveyId` | Eksekusi Survei | Siswa |
| 12 | `/survey/:surveyId/selesai` | Konfirmasi Survei Selesai | Siswa |
| 13 | `/pengaturan` | Pengaturan Akun Siswa | Siswa |
| 14 | `/bantuan` | Pusat Bantuan | Siswa |
| 15 | `/guru` | Dashboard Guru | Guru |
| 16 | `/guru/siswa` | Daftar Siswa Kelas | Guru |
| 17 | `/guru/laporan` | Laporan Nilai Kelas | Guru |
| 18 | `/guru/laporan/survey` | Laporan Survei Kelas | Guru |
| 19 | `/guru/modul` | Kelola Modul | Guru |
| 20 | `/guru/modul/tambah` | Tambah Modul Baru | Guru |
| 21 | `/guru/kuis` | Kelola Kuis Modul | Guru |
| 22 | `/guru/kuis/tambah` | Tambah Kuis Baru | Guru |
| 23 | `/guru/agenda` | Agenda Kelas | Guru |
| 24 | `/admin` | Dashboard Admin | Admin |
| 25 | `/admin/pengguna` | Manajemen Pengguna | Admin (Eksklusif) |
| 26 | `/admin/pengguna/tambah` | Tambah Pengguna Baru | Admin (Eksklusif) |
| 27 | `/admin/bank-soal` | Bank Soal | Admin |
| 28 | `/admin/bank-soal/tambah` | Tambah Soal Baru | Admin |
| 29 | `/admin/simulasi` | Manajemen Simulasi & Latihan | Admin |
| 30 | `/admin/simulasi/tambah` | Buat Sesi Simulasi Baru | Admin |
| 31 | `/admin/modul` | Manajemen Modul (Sistem) | Admin |
| 32 | `/admin/laporan` | Laporan Nilai (Sistem) | Admin |
| 33 | `/admin/laporan/survey` | Laporan Survei (Sistem) | Admin |
| 34 | `/admin/survei` | Manajemen Survei | Admin |
| 35 | `/admin/survei/tambah` | Tambah Instrumen Survei | Admin |
| 36 | `/admin/log-aktivitas` | Log Aktivitas & Monitor Realtime | Admin |

---

*Dokumen ini dibuat berdasarkan analisis langsung terhadap kode sumber aplikasi Portal Latihan TKA Frontend. Seluruh informasi mencerminkan fitur dan alur kerja yang telah diimplementasikan dalam sistem.*
