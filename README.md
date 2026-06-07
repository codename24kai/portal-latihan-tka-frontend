<p align="center">
  <img src="public/logo-tka.png" alt="Logo Aplikasi Latihan TKA" width="120" />
</p>

<h1 align="center">🎓 Portal Latihan TKA</h1>
<h3 align="center">Aplikasi Latihan Tes Kemampuan Akademik untuk Siswa Kelas 6 SD</h3>

<p align="center">
  <em>Progressive Web App (PWA) untuk digitalisasi latihan soal ujian sekolah di UPTD SDN Muncul 02</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Laravel-13.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
  <img src="https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" />
  <img src="https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Aktif%20Dikembangkan-brightgreen?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Lisensi-Kerja%20Praktek-blue?style=flat-square" alt="Lisensi" />
  <img src="https://img.shields.io/badge/Versi-1.0.0-orange?style=flat-square" alt="Versi" />
</p>

---

## 📖 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Tujuan Proyek](#-tujuan-proyek)
- [Kebutuhan Sistem](#-kebutuhan-sistem)
- [Arsitektur &amp; Teknologi](#-arsitektur--teknologi)
- [Dependensi Library Utama](#-dependensi-library-utama)
- [Manajemen Peran](#-manajemen-peran-role-based-access)
- [Alur Kerja Proyek](#-alur-kerja-proyek-workflow)
- [Alur Routing &amp; API](#-alur-routing--api)
- [Panduan Instalasi &amp; Setup Lokal](#-panduan-instalasi--setup-lokal)
- [Kontributor](#-kontributor--author)

---

## 🏫 Tentang Proyek

**Portal Latihan TKA** adalah sebuah Progressive Web App (PWA) yang dikembangkan sebagai proyek Kerja Praktek (KP) di **UPTD SDN Muncul 02**. Aplikasi ini dirancang secara khusus untuk mendigitalisasi proses latihan soal **Tes Kemampuan Akademik (TKA)** bagi siswa kelas 6 Sekolah Dasar.

Sistem ini menghadirkan pengalaman ujian berbasis web yang modern, responsif, dan dapat diakses dari berbagai perangkat — baik komputer, tablet, maupun smartphone — tanpa perlu menginstal aplikasi tambahan. Dengan pendekatan PWA, siswa dapat mengakses portal ini layaknya aplikasi native langsung dari browser mereka.

---

## 🎯 Tujuan Proyek

| No | Tujuan                              | Keterangan                                                                                                                                      |
| -- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | **Digitalisasi Latihan Soal** | Menggantikan metode latihan soal konvensional (kertas) dengan platform digital interaktif yang lebih efisien dan ramah lingkungan.              |
| 2  | **Efisiensi Penilaian Guru**  | Menyediakan sistem penilaian otomatis sehingga guru tidak perlu mengoreksi jawaban secara manual, menghemat waktu dan tenaga secara signifikan. |
| 3  | **Monitoring Real-time**      | Memungkinkan guru dan admin memantau progres pengerjaan siswa secara langsung (*real-time*) melalui dasbor yang informatif.                   |
| 4  | **Pelaporan Terstruktur**     | Menghasilkan laporan nilai dan analisis performa siswa yang terstruktur, lengkap dengan fitur ekspor ke format PDF dan Excel.                   |
| 5  | **Aksesibilitas Tinggi**      | Memberikan akses latihan kapan saja dan di mana saja melalui perangkat apapun yang memiliki browser web modern.                                 |

---

## 💻 Kebutuhan Sistem

### Spesifikasi Server / Environment

| Komponen           | Versi Minimum | Keterangan                                                     |
| ------------------ | :-----------: | -------------------------------------------------------------- |
| **PHP**      |  `^8.3.26`  | Dibutuhkan oleh Laravel 13 sebagai runtime backend.            |
| **Composer** |  `^2.9.2`  | Manajer dependensi untuk paket-paket PHP/Laravel.              |
| **Node.js**  | `^22.17.0` | Dibutuhkan untuk menjalankan Vite dan build frontend.          |
| **NPM**      | `^11.12.1` | Manajer paket untuk dependensi JavaScript/React.               |
| **MySQL**    |  `^8.4.3`  | Basis data relasional untuk penyimpanan seluruh data aplikasi. |

### Environment Lokal yang Disarankan

| Tool                                   | Fungsi                                                                                                                                                   |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Laragon](https://laragon.org/)** | **(Disarankan)** All-in-one development environment yang ringan untuk Windows. Menyediakan Apache/Nginx, PHP, MySQL, dan Node.js dalam satu paket. |
| **Git**                          | Version control system untuk mengelola kode sumber proyek.                                                                                               |
| **VS Code**                      | Text editor yang direkomendasikan dengan ekstensi untuk React dan Laravel.                                                                               |

---

## 🏗 Arsitektur & Teknologi

Proyek ini menggunakan arsitektur **pemisahan penuh (*decoupled*)** antara Frontend dan Backend, di mana keduanya berkomunikasi melalui RESTful API.

```
┌─────────────────────────────────┐      HTTP/REST API       ┌─────────────────────────────────┐
│         🖥️ FRONTEND             │ ◄──────────────────────► │          ⚙️ BACKEND              │
│                                 │                          │                                 │
│  React.js 19 + Vite 8          │   JSON Request/Response   │  Laravel 13 (PHP 8.2+)          │
│  Tailwind CSS 3                 │                          │  MySQL 8                        │
│  Single Page Application (SPA) │                          │  Laravel Sanctum (Auth)         │
│                                 │                          │                                 │
│  📦 Port: 5173 (dev)           │                          │  📦 Port: 8000 (artisan serve)  │
└─────────────────────────────────┘                          └─────────────────────────────────┘
```

### Tech Stack

<table>
  <tr>
    <th align="center">Layer</th>
    <th align="center">Teknologi</th>
    <th align="center">Versi</th>
    <th align="center">Deskripsi</th>
  </tr>
  <tr>
    <td rowspan="3" align="center"><strong>Frontend</strong></td>
    <td><img src="https://img.shields.io/badge/-React.js-61DAFB?logo=react&logoColor=black&style=flat-square" /></td>
    <td align="center">19.2.4</td>
    <td>Library utama untuk membangun antarmuka pengguna berbasis komponen.</td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat-square" /></td>
    <td align="center">8.0.14</td>
    <td>Build tool modern yang sangat cepat untuk development dan bundling.</td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" /></td>
    <td align="center">3.4.19</td>
    <td>Utility-first CSS framework untuk styling yang cepat dan konsisten.</td>
  </tr>
  <tr>
    <td rowspan="3" align="center"><strong>Backend</strong></td>
    <td><img src="https://img.shields.io/badge/-Laravel-FF2D20?logo=laravel&logoColor=white&style=flat-square" /></td>
    <td align="center">13.12.0</td>
    <td>Framework PHP untuk membangun REST API yang terstruktur dan aman.</td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/-PHP-777BB4?logo=php&logoColor=white&style=flat-square" /></td>
    <td align="center">8.3.26</td>
    <td>Bahasa pemrograman server-side sebagai runtime Laravel.</td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white&style=flat-square" /></td>
    <td align="center">8.4.3</td>
    <td>Sistem manajemen basis data relasional untuk penyimpanan data.</td>
  </tr>
</table>

---

## 📦 Dependensi Library Utama

### Frontend Dependencies

| Library              | Badge                                                                                                                        | Fungsi                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `react-router-dom` | ![react-router](https://img.shields.io/badge/react--router--dom-7.x-CA4245?style=flat-square&logo=reactrouter&logoColor=white) | Navigasi halaman berbasis client-side routing (SPA).                     |
| `lucide-react`     | ![lucide](https://img.shields.io/badge/lucide--react-1.x-F56565?style=flat-square)                                             | Koleksi ikon SVG modern yang ringan dan konsisten.                       |
| `recharts`         | ![recharts](https://img.shields.io/badge/recharts-3.x-22B5BF?style=flat-square)                                                | Library grafik/chart untuk visualisasi data statistik di dasbor.         |
| `react-quill-new`  | ![quill](https://img.shields.io/badge/react--quill--new-latest-1A1A2E?style=flat-square)                                       | Rich text editor (WYSIWYG) untuk pembuatan soal dengan format teks kaya. |
| `react-hot-toast`  | ![toast](https://img.shields.io/badge/react--hot--toast-2.x-E4572E?style=flat-square)                                          | Notifikasi toast yang ringan dan elegan.                                 |
| `katex`            | ![katex](https://img.shields.io/badge/KaTeX-0.16-329B8A?style=flat-square)                                                     | Rendering rumus/formula matematika (LaTeX) di soal.                      |
| `framer-motion`    | ![framer](https://img.shields.io/badge/framer--motion-12.x-0055FF?style=flat-square)                                           | Animasi dan transisi halaman yang halus dan modern.                      |
| `axios`            | ![axios](https://img.shields.io/badge/axios-1.x-5A29E4?style=flat-square)                                                      | HTTP client untuk komunikasi API antara frontend dan backend.            |

### Backend Dependencies

| Library                      | Badge                                                                                                                | Fungsi                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `laravel/sanctum`          | ![sanctum](https://img.shields.io/badge/Sanctum-4.x-FF2D20?style=flat-square&logo=laravel&logoColor=white)             | Sistem autentikasi berbasis token (SPA & API token) yang ringan dan aman. |
| `barryvdh/laravel-dompdf`  | ![dompdf](https://img.shields.io/badge/DomPDF-3.x-E44D26?style=flat-square)                                            | Menghasilkan dokumen PDF dari HTML untuk ekspor laporan nilai siswa.      |
| `phpoffice/phpspreadsheet` | ![excel](https://img.shields.io/badge/PhpSpreadsheet-4.x-217346?style=flat-square&logo=microsoftexcel&logoColor=white) | Menghasilkan file Excel (.xlsx) untuk ekspor data nilai dan rekapitulasi. |

---

## 👥 Manajemen Peran (*Role-based Access*)

Aplikasi ini menerapkan sistem kontrol akses berbasis peran (*Role-Based Access Control / RBAC*) dengan tiga peran utama:

### 🔴 Admin

> Pengelola sistem secara keseluruhan dengan akses penuh ke seluruh fitur.

- Mengelola **master data** pengguna (guru, siswa, kelas).
- Mengelola **bank soal** terpusat (akademik & survei) beserta fitur impor CSV/PDF.
- Membuat dan menjadwalkan **simulasi TKA** tingkat sekolah.
- Memantau **log aktivitas** sistem secara menyeluruh.
- Melihat dan mengekspor **laporan statistik** global.
- Mengelola **modul pembelajaran** dan materi pendukung.

### 🟢 Guru (Wali Kelas)

> Pengelola kelas yang bertanggung jawab atas persiapan dan monitoring siswa di kelasnya.

- Membuat dan mengelola **kuis/latihan mandiri** khusus untuk kelas yang diampu.
- Memonitor **status dan log aktivitas** siswa secara *real-time* melalui dasbor.
- Melihat **performa dan progres** setiap siswa di kelasnya.
- Mencetak dan mengekspor **laporan nilai** dalam format PDF dan Excel.
- Mengelola **modul pembelajaran**.
- Mengirimkan **pengumuman kelas** kepada siswa (broadcast atau individual).

### 🔵 Siswa (Kelas 6)

> Pengguna akhir yang mengerjakan latihan soal melalui antarmuka PWA.

- Mengerjakan **simulasi TKA** sesuai jadwal yang telah ditentukan.
- Mengerjakan **latihan mandiri** untuk persiapan ujian kapan saja.
- Mengisi **survei non-kognitif** (karakter & lingkungan belajar).
- Melihat **skor dan riwayat** hasil pengerjaan.
- Mengakses **modul pembelajaran** dan materi pendukung dari guru.
- Menerima **notifikasi** terkait jadwal ujian dan pengumuman kelas.

---

## 🔄 Alur Kerja Proyek (*Workflow*)

Berikut adalah gambaran alur kerja aplikasi dari hulu ke hilir:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  1. ADMIN    │     │  2. ADMIN/   │     │  3. GURU         │     │  4. SISWA    │
│  Setup Data  │────►│  GURU        │────►│  Jadwalkan &     │────►│  Mengerjakan │
│              │     │  Buat Soal   │     │  Publikasikan    │     │  Ujian       │
└──────────────┘     └──────────────┘     └──────────────────┘     └──────┬───────┘
                                                                          │
                                                                          ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  8. ARSIP    │     │  7. GURU     │     │  6. GURU/ADMIN   │     │  5. SISTEM   │
│  & Evaluasi  │◄────│  Cetak       │◄────│  Analisis Data   │◄────│  Koreksi     │
│              │     │  Laporan     │     │  & Monitoring    │     │  Otomatis    │
└──────────────┘     └──────────────┘     └──────────────────┘     └──────────────┘
```

|    Tahap    | Aktor        | Aktivitas                                                                                                                    |
| :---------: | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| **1** | Admin        | Menyiapkan data awal: mendaftarkan guru, siswa, dan kelas ke dalam sistem.                                                   |
| **2** | Admin        | Membuat dan mengelola bank soal — baik secara manual, melalui impor CSV/PDF, atau menggunakan text editor kaya (rich text). |
| **3** | Admin        | Membuat dan menjadwalkan simulasi TKA , mengatur durasi, dan mempublikasikannya agar dapat diakses oleh siswa.               |
|      4      | Guru         | Membuat dan mengatur latihan mandiri, kemudian mempublikasikannya agar dapat diakses oleh siswa.                             |
|      5      | Siswa        | Mengerjakan simulasi TKA/latihan melalui antarmuka PWA sesuai jadwal yang tersedia.                                          |
|      6      | Sistem       | Mengoreksi jawaban secara otomatis dan menghitung skor berdasarkan kunci jawaban.                                            |
|      7      | Guru / Admin | Memantau hasil secara real-time melalui dasbor, menganalisis performa per siswa dan per kelas.                               |
|      8      | Guru / Admin | Mencetak dan mengekspor laporan nilai ke PDF atau Excel untuk dokumentasi.                                                   |
|      9      | Sekolah      | Mengarsipkan hasil latihan dan mengevaluasi kesiapan siswa menghadapi ujian sesungguhnya.                                    |

---

## 🛣 Alur Routing & API

### Frontend Routing (React Router)

Aplikasi frontend menggunakan **React Router v7** dengan pola routing bersarang (*nested routes*) berdasarkan peran:

```
/                          → Redirect ke halaman Login
/login                     → Halaman Login
/lupa-password             → Halaman Lupa Password

├── /admin                 → Layout Admin (AdminLayout)
│   ├── /admin/                    → Dashboard Admin
│   ├── /admin/bank-soal           → Daftar Bank Soal
│   │   ├── /admin/bank-soal/tambah    → Form Tambah Soal
│   │   └── /admin/bank-soal/edit/:id  → Form Edit Soal
│   ├── /admin/simulasi            → Daftar Simulasi TKA
│   │   ├── /admin/simulasi/tambah     → Form Tambah Simulasi TKA
│   │   └── /admin/simulasi/edit/:id   → Form Edit Simulasi TKA
│   ├── /admin/pengguna            → Daftar Pengguna
│   │   ├── /admin/pengguna/tambah     → Form Tambah Pengguna
│   │   └── /admin/pengguna/edit/:id   → Form Edit Pengguna
│   ├── /admin/modul               → Daftar Modul Pembelajaran
│   │   ├── /admin/modul/tambah        → Form Tambah Modul
│   │   └── /admin/modul/edit/:id      → Form Edit Modul
│   ├── /admin/laporan             → Laporan Akademik Siswa
│   │   └── /admin/laporan/survei      → Laporan Hasil Survei
│   ├── /admin/log-aktivitas       → Log Aktivitas Sistem
│   └── /admin/notifikasi          → Daftar Notifikasi

├── /guru                  → Layout Guru (GuruLayout)
│   ├── /guru/                     → Dashboard Guru
│   ├── /guru/agenda               → Agenda Pembelajaran
│   ├── /guru/kuis                 → Daftar Kuis
│   │   ├── /guru/kuis/tambah          → Form Tambah Kuis
│   │   └── /guru/kuis/edit/:id        → Form Edit Kuis
│   ├── /guru/siswa                → Daftar Siswa
│   ├── /guru/modul                → Daftar Modul Pembelajaran
│   │   ├── /guru/modul/tambah         → Form Tambah Modul
│   │   └── /guru/modul/edit/:id       → Form Edit Modul
│   ├── /guru/laporan              → Laporan Nilai Siswa
│   │   └── /guru/laporan/survei       → Laporan Hasil Survei
│   └── /guru/notifikasi           → Daftar Notifikasi

└── /siswa                 → Layout Siswa (SiswaLayout)
├── /siswa/beranda             → Dashboard Siswa
├── /siswa/ujian               → Daftar Simulasi TKA
│   ├── /siswa/ujian/:ujianId/persiapan → Halaman Persiapan Simulasi
│   ├── /siswa/ujian/:ujianId           → Halaman Pengerjaan Simulasi
│   └── /siswa/ujian/:ujianId/hasil     → Hasil Simulasi TKA
├── /siswa/survey/:surveyId    → Halaman Pengisian Survei
│   └── /siswa/survey/:surveyId/selesai → Halaman Survei Selesai
├── /siswa/modul               → Daftar Modul Pembelajaran
│   └── /siswa/modul/kuis/:modulId      → Kuis Modul Pembelajaran
├── /siswa/pengaturan          → Pengaturan Akun
├── /siswa/bantuan             → Pusat Bantuan
└── /siswa/notifikasi          → Daftar Notifikasi

```

### Backend API Routing (Laravel)

Backend memisahkan endpoint API berdasarkan peran, seluruhnya dilindungi oleh middleware **Laravel Sanctum**:

```
/api/v1
│
├── /auth
│   ├── POST   /login              → Autentikasi & generate token
│   └── POST   /logout             → Revoke token aktif
│
├── /admin   (middleware: auth:sanctum, role:admin)
│   ├── GET    /dashboard           → Data statistik dashboard admin
│   ├── CRUD   /pengguna            → Manajemen pengguna
│   ├── CRUD   /soal           	    → Manajemen bank soal
│   ├── CRUD   /simulasi            → Manajemen simulasi TKA
│   ├── CRUD   /modul               → Manajemen modul
│   ├── GET    /laporan             → Data laporan global
│   └── GET    /log-aktivitas       → Log aktivitas sistem
│
├── /guru    (middleware: auth:sanctum, role:guru)
│   ├── GET    /dashboard           → Data statistik kelas
│   ├── CRUD   /kuis                → Manajemen kuis kelas
│   ├── GET    /siswa               → Daftar siswa di kelas
│   ├── GET    /laporan             → Laporan nilai kelas
│   └── GET    /reports/ekspor      → Ekspor laporan (PDF/Excel)
│
└── /siswa   (middleware: auth:sanctum, role:siswa)
    ├── GET    /dashboard           → Data dashboard siswa
    ├── GET    /simulasi            → Daftar tryout tersedia
    ├── POST   /simulasi/:id/submit → Submit jawaban tryout
    └── GET    /riwayat             → Riwayat pengerjaan & skor
```

---

## 🚀 Panduan Instalasi & Setup Lokal

### Prasyarat

Pastikan tools berikut sudah terinstal di sistem Anda:

- [Laragon](https://laragon.org/download/) (atau XAMPP/WAMP dengan PHP ≥ 8.2)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- [Git](https://git-scm.com/)

### Langkah 1 — Kloning Repositori

```bash
# Klon repositori Frontend
git clone https://github.com/username/portal-latihan-tka-frontend.git

# Klon repositori Backend
git clone https://github.com/username/portal-latihan-tka-backend.git
```

### Langkah 2 — Setup Backend (Laravel)

```bash
# Masuk ke direktori backend
cd portal-latihan-tka-backend

# Instal dependensi PHP via Composer
composer install

# Salin file environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Langkah 3 — Konfigurasi Database

Buka file `.env` pada direktori backend dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portal_latihan_tka
DB_USERNAME=root
DB_PASSWORD=
```

> **Catatan:** Pastikan Anda sudah membuat database `portal_latihan_tka` di MySQL terlebih dahulu (melalui phpMyAdmin atau command line).

### Langkah 4 — Migrasi & Seeder Database

```bash
# Jalankan migrasi dan seeder sekaligus
# (Flag --seed akan mengisi data awal: akun admin, guru, siswa, dan contoh soal)
php artisan migrate:fresh --seed
```

### Langkah 5 — Setup Frontend (React + Vite)

```bash
# Masuk ke direktori frontend
cd portal-latihan-tka-frontend

# Instal dependensi Node.js via NPM
npm install
```

### Langkah 6 — Jalankan Aplikasi

Buka **dua terminal terpisah**, lalu jalankan perintah berikut secara bersamaan:

**Terminal 1 — Backend Server:**

```bash
cd portal-latihan-tka-backend
php artisan serve
```

> Server backend akan berjalan di `http://localhost:8000`

**Terminal 2 — Frontend Dev Server:**

```bash
cd portal-latihan-tka-frontend
npm run dev
```

> Server frontend akan berjalan di `http://localhost:5173`

### Langkah 7 — Akses Aplikasi

Buka browser dan navigasikan ke `http://localhost:5173`. Gunakan akun berikut untuk login (disediakan oleh seeder):

| Role  | Email                | Password        |
| ----- | -------------------- | --------------- |
| Admin | `admin@sekolah.id` | `password123` |
| Guru  | `guru@sekolah.id`  | `password123` |
| Siswa | `siswa@sekolah.id` | `password123` |

> ⚠️ **Penting:** Kredensial di atas hanya untuk environment development. Pastikan untuk menggantinya pada environment production.

---

## 🧑‍💻 Kontributor / Author

<table>
  <tr>
    <td align="center">
      <strong>Muhammad Kaisa Nabhan</strong><br/>
      <sub>Fullstack Developer</sub><br/><br/>
      <a href="https://github.com/username">
        <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
      </a>
    </td>
  </tr>
</table>

> Proyek ini dikembangkan sebagai bagian dari pelaksanaan **Kerja Praktek (KP)** di **UPTD SDN Muncul 02**.

---

<p align="center">
  <sub>Dibuat dengan ❤️ untuk kemajuan pendidikan digital Indonesia</sub>
</p>
