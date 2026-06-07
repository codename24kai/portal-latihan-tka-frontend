```md
# 📘 Laporan Proyek — Portal Latihan TKA

> **Versi Dokumen:** 1.0  
> **Tanggal:** 28 April 2026  
> **Instansi:** UPTD SDN Muncul 02  
> **Jenis Sistem:** Progressive Web App (PWA) — Computer Based Test (CBT)

---

## Daftar Isi

1. [Deskripsi & Tujuan Proyek](#1-deskripsi--tujuan-proyek)
2. [Stack Teknologi](#2-stack-teknologi)
3. [Pembagian Role & Fitur Utama](#3-pembagian-role--fitur-utama)
4. [Aspek Arsitektur & Keputusan Teknis Penting](#4-aspek-arsitektur--keputusan-teknis-penting)

---

## 1. Deskripsi & Tujuan Proyek

### 1.1 Latar Belakang

**Portal Latihan TKA** adalah sebuah platform **Computer Based Test (CBT)** berbasis **Progressive Web App (PWA)** yang dirancang secara khusus untuk siswa kelas 6 di **UPTD SDN Muncul 02**. Sistem ini bertujuan mendigitalisasi seluruh proses latihan dan asesmen yang selama ini dilakukan secara manual (kertas), meliputi:

- **Tryout Kognitif (Akademik):** Simulasi ujian mata pelajaran (Matematika, Bahasa Indonesia) dengan batas waktu, penilaian otomatis, dan analisis hasil per butir soal.
- **Asesmen Non-Kognitif:** Instrumen **Survei Karakter** (mengukur dimensi gotong royong, empati, dll.) dan **Survei Lingkungan Belajar (Sulingjar)** yang mengacu pada kerangka Asesmen Nasional.

### 1.2 Tujuan Utama

| No. | Tujuan | Deskripsi |
|:---:|--------|-----------|
| 1 | **Digitalisasi Asesmen** | Menggantikan proses tryout berbasis kertas menjadi sistem CBT digital yang efisien dan ramah lingkungan. |
| 2 | **Pemetaan Kompetensi** | Menyediakan data analitik per siswa dan per kelas untuk membantu guru mengidentifikasi area yang perlu perhatian khusus. |
| 3 | **Asesmen Holistik** | Mengintegrasikan penilaian kognitif (akademik) dengan non-kognitif (karakter & lingkungan belajar) dalam satu platform terpadu. |
| 4 | **Aksesibilitas Offline** | Memastikan siswa tetap dapat mengerjakan ujian meskipun koneksi internet tidak stabil melalui teknologi PWA (Service Worker & IndexedDB). |
| 5 | **Kemandirian Guru** | Memberdayakan guru/wali kelas untuk membuat latihan mandiri (kuis kelas) tanpa bergantung pada administrator pusat. |

### 1.3 Sasaran Pengguna

- **Siswa Kelas 6** — Peserta tryout dan survei.
- **Guru / Wali Kelas** — Pengelola kelas, pembuat latihan mandiri, dan analis butir soal.
- **Administrator Sekolah** — Pengelola global: bank soal pusat, penjadwalan tryout, dan manajemen pengguna.

---

## 2. Stack Teknologi

### 2.1 Ringkasan Arsitektur

```
┌──────────────────────────────────────────────────┐
│                   CLIENT (PWA)                   │
│  React 19 · Vite 8 · Tailwind CSS 3 · IndexedDB │
├──────────────────────────────────────────────────┤
│                  REST API (JSON)                 │
├──────────────────────────────────────────────────┤
│                  SERVER (Backend)                │
│          Laravel · MySQL (JSON Columns)          │
└──────────────────────────────────────────────────┘
```

### 2.2 Frontend

| Teknologi | Versi | Fungsi |
|-----------|:-----:|--------|
| **React** | 19.2 | Library utama untuk membangun antarmuka pengguna berbasis komponen. |
| **Vite** | 8.0 | Build tool & dev server dengan Hot Module Replacement (HMR) untuk pengembangan cepat. |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework dengan konfigurasi design token kustom (warna, animasi, shadow). |
| **React Router** | 7.13 | Client-side routing dengan role-based route guarding (`RequireAuth`). |
| **Framer Motion** | 12.38 | Library animasi deklaratif untuk micro-interactions dan transisi halaman. |
| **Recharts** | 3.8 | Library charting berbasis React untuk visualisasi data skor dan distribusi survei. |
| **Lucide React** | 1.7 | Koleksi ikon SVG modern yang konsisten secara visual. |
| **KaTeX / MathLive** | 0.16 / 0.109 | Rendering formula matematika pada soal dan jawaban. |

**Design System Kustom:**

Proyek ini menggunakan design token terpusat yang didefinisikan dalam `tailwind.config.js`:

- **Font:** Plus Jakarta Sans (Google Fonts) sebagai font primer.
- **Palet Warna:** Primary (`#6C5CE7`), Secondary (`#00CEC9`), Accent (`#FD79A8`), serta semantic colors (`correct`, `incorrect`, `warning`).
- **Dark Mode:** Didukung melalui class-based toggling (`darkMode: 'class'`).
- **Animasi:** 8 animasi kustom terdaftar (`fade-in`, `slide-up`, `bounce-in`, `shimmer`, dll.) untuk pengalaman UI yang premium.

### 2.3 Backend

| Teknologi | Fungsi |
|-----------|--------|
| **Laravel** | Framework PHP full-stack untuk REST API, autentikasi, dan business logic. |
| **MySQL** | Relational Database Management System dengan dukungan **JSON Columns** untuk menyimpan payload soal yang fleksibel. |

### 2.4 PWA & Kemampuan Offline

| Teknologi | Fungsi |
|-----------|--------|
| **Service Workers** | Meng-cache aset statis dan respons API untuk akses offline. Menampilkan `NetworkIndicator` saat koneksi terputus. |
| **IndexedDB** | Penyimpanan lokal terstruktur untuk data profil siswa (termasuk avatar/foto profil), jawaban ujian sementara, dan cache data yang belum tersinkronisasi. |
| **`useNetworkStatus` Hook** | Custom React hook yang mendeteksi status jaringan secara real-time menggunakan `navigator.onLine` dan event listener `online`/`offline`. |

---

## 3. Pembagian Role & Fitur Utama

Sistem menerapkan **Role-Based Access Control (RBAC)** dengan tiga peran yang terisolasi secara ketat. Setiap role memiliki layout, sidebar, dan routing yang sepenuhnya terpisah.

### 3.1 ADMIN — Akses Global

> **Route Prefix:** `/admin/*`  
> **Layout:** `AdminLayout`

Administrator memiliki kendali penuh atas seluruh sistem tanpa batasan scope kelas.

| Fitur | Halaman | Deskripsi |
|-------|---------|-----------|
| **Dashboard Global** | `AdminDashboard` | Ringkasan statistik seluruh sekolah: jumlah siswa, tryout aktif, rata-rata skor, dan tren performa. |
| **Manajemen Pengguna** | `UserManagement` · `AddUser` | CRUD lengkap untuk akun siswa, guru, dan admin. Termasuk penugasan guru ke kelas tertentu. |
| **Bank Soal Pusat** | `QuestionBank` · `AddQuestion` | Pengelolaan bank soal terpusat yang mendukung 4 tipe soal (lihat Bagian 4.1). Dilengkapi filter berdasarkan mata pelajaran, tingkat kesulitan, dan level kognitif Bloom (C1–C6). |
| **Manajemen Tryout** | `TryoutManagement` · `AddTryout` | Penjadwalan sesi tryout global dengan konfigurasi: durasi, mata pelajaran, pemilihan soal dari bank pusat, dan jenis latihan (Ujian Mapel / Latihan TKA). |
| **Laporan Skor** | `ScoreReports` | Analitik agregat: distribusi skor, perbandingan antar kelas, dan tren historis. |
| **Laporan Survei** | `AdminSurveyReports` | Visualisasi agregat distribusi jawaban Survei Karakter dan Sulingjar seluruh sekolah. |
| **Manajemen Modul** | `ModuleManagement` · `AddModule` | Pengelolaan modul belajar sebagai materi pendamping tryout. |

### 3.2 GURU / WALI KELAS — Akses Terbatas per Kelas

> **Route Prefix:** `/guru/*`  
> **Layout:** `GuruLayout`

Guru/Wali Kelas hanya memiliki akses ke **kelas yang ditugaskan** kepadanya (*scoped access*). Guru **tidak dapat** mengakses data kelas lain maupun bank soal pusat milik admin.

| Fitur | Halaman | Deskripsi |
|-------|---------|-----------|
| **Dashboard Kelas** | `GuruDashboard` | Monitoring siswa yang membutuhkan perhatian khusus: siswa dengan skor di bawah KKM, siswa yang belum mengerjakan tryout, dan ringkasan performa kelas. |
| **Daftar Siswa** | `GuruStudentList` | Daftar lengkap siswa di kelas yang diampu beserta status asesmen mereka. |
| **Latihan Mandiri (Kuis Kelas)** | `GuruManageQuizzes` · `GuruAddQuiz` | Guru dapat membuat kuis/latihan mandiri khusus untuk kelasnya. Soal yang dibuat di sini **tidak mencemari** bank soal pusat milik admin (*isolated question pool*). |
| **Manajemen Modul Kelas** | `GuruManageModules` · `GuruAddModule` | Modul belajar khusus kelas yang dibuat oleh guru sebagai materi pengayaan. |
| **Laporan Skor Kelas** | `GuruScoreReports` | Analisis performa siswa di kelas: distribusi skor, ranking, dan *item analysis* (Analisis Butir Soal) untuk mengevaluasi kualitas setiap soal. |
| **Laporan Survei Kelas** | `SurveyReports` | Distribusi jawaban Survei Karakter dan Sulingjar khusus siswa di kelas yang diampu. |
| **Agenda Kelas** | `GuruAgenda` | Kalender dan jadwal kegiatan tryout serta asesmen untuk kelas yang diampu. |

### 3.3 SISWA — Pengguna Akhir

> **Route Prefix:** `/*` (root)  
> **Layout:** `StudentLayout` (dengan mode *distraction-free* tanpa layout untuk ujian)

| Fitur | Halaman | Deskripsi |
|-------|---------|-----------|
| **Dashboard Siswa** | `StudentDashboard` | Ringkasan personal: tryout yang akan datang, skor terakhir, progres belajar, dan pengumuman kelas. |
| **Daftar Tryout** | `StudentTest` | Daftar tryout yang tersedia untuk dikerjakan, beserta status (belum/sudah dikerjakan). |
| **Persiapan Ujian** | `PreSimulation` | Halaman persiapan sebelum memulai ujian: informasi durasi, jumlah soal, dan aturan pengerjaan. |
| **Eksekusi Ujian** | `ExamExecution` | Antarmuka pengerjaan ujian *distraction-free* (tanpa sidebar/navbar) dengan countdown timer, navigasi soal, dan auto-save jawaban. |
| **Hasil Ujian** | `ExamResult` | Tampilan detail hasil: skor total, pembahasan per soal, dan status benar/salah per butir. |
| **Eksekusi Survei** | `SurveyExecution` · `SurveyComplete` | Pengerjaan Survei Karakter dan Sulingjar yang muncul setelah menyelesaikan tryout terkait. Tanpa batas waktu dan tanpa penilaian benar/salah. |
| **Modul Belajar** | `StudentModul` · `ModuleQuiz` | Akses modul belajar dan kuis latihan dari modul. |
| **Pengaturan Profil** | `StudentSetting` | Kustomisasi avatar/foto profil (unggah foto atau pilih dari template yang disediakan), dengan persistensi ke IndexedDB. |
| **Pusat Bantuan** | `HelpCenter` | Panduan penggunaan aplikasi dan FAQ. |

---

## 4. Aspek Arsitektur & Keputusan Teknis Penting

### 4.1 Bank Soal V2 & Arsitektur JSON Payload

Sistem menggunakan arsitektur **Bank Soal V2** yang dirancang untuk mendukung berbagai format soal secara fleksibel melalui kolom **JSON Payload** pada database.

**Mengapa JSON Payload?**

Pendekatan tradisional dengan kolom relasional terpisah (`option_a`, `option_b`, `option_c`, `option_d`) bersifat kaku dan tidak mampu mengakomodasi variasi soal. Dengan menyimpan struktur soal dalam kolom JSON, satu tabel `questions` dapat menampung semua tipe soal tanpa perubahan skema database.

**4 Tipe Soal yang Didukung:**

#### a) Pilihan Ganda Tunggal (`single_choice`)

Format klasik dengan satu jawaban benar. Penilaian bersifat **binary** (benar = `max_points`, salah = 0).

```json
{
  "stem": "Hasil dari 2.456 + 3.789 − 1.234 adalah …",
  "stem_image": null,
  "options": [
    { "key": "A", "text": "5.011", "image": null },
    { "key": "B", "text": "5.111", "image": null },
    { "key": "C", "text": "5.211", "image": null },
    { "key": "D", "text": "5.311", "image": null }
  ],
  "correct_keys": ["A"]
}
```

#### b) Pilihan Ganda Kompleks (`multi_choice`)

Soal dengan **lebih dari satu jawaban benar**. Penilaian menggunakan **partial credit** (kredit parsial) dengan opsi penalti untuk jawaban salah yang dipilih.

```json
{
  "stem": "Manakah bilangan prima?",
  "options": [
    { "key": "A", "text": "2" },
    { "key": "B", "text": "4" },
    { "key": "C", "text": "7" },
    { "key": "D", "text": "9" },
    { "key": "E", "text": "11" }
  ],
  "correct_keys": ["A", "C", "E"],
  "penalty_for_wrong": true
}
```

**Formula Penilaian:**
```
skor = max(0, (hits / total_benar × max_points) - (salah_dipilih / total_benar × max_points))
```

#### c) Benar/Salah Majemuk — Gaya AKM (`true_false`)

Format matriks ala **Asesmen Kompetensi Minimum (AKM)** di mana satu soal induk memiliki array pernyataan yang masing-masing dinilai Benar atau Salah secara independen. Penilaian menggunakan **kredit proporsional** per pernyataan.

```json
{
  "stem": "Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
  "statements": [
    { "id": "s1", "text": "Antonim dari 'Cerdas' adalah 'Bodoh'", "correct_answer": true },
    { "id": "s2", "text": "'Pintar' adalah sinonim dari 'Cerdas'", "correct_answer": true },
    { "id": "s3", "text": "Antonim dari 'Cerdas' adalah 'Pintar'", "correct_answer": false },
    { "id": "s4", "text": "'Dungu' merupakan lawan kata dari 'Cerdas'", "correct_answer": true }
  ]
}
```

**Formula Penilaian:**
```
skor = (jumlah_pernyataan_benar / total_pernyataan) × max_points
```

#### d) Esai (`essay`)

Soal uraian dengan batas kata dan rubrik penilaian terstruktur. Penilaian bersifat **manual** (dikembalikan `null` oleh scoring engine untuk ditangani guru).

```json
{
  "stem": "Jelaskan apa yang dimaksud dengan ide pokok paragraf.",
  "word_limit": 500,
  "rubric": [
    { "criterion": "Definisi ide pokok benar", "max_points": 2 },
    { "criterion": "Langkah-langkah sistematis", "max_points": 3 }
  ]
}
```

**Metadata Tambahan per Soal:**

Setiap soal juga dilengkapi metadata terstruktur di luar payload:

| Field | Deskripsi |
|-------|-----------|
| `category` | `akademik` atau `non-akademik` |
| `subject` | Mata pelajaran (Matematika, Bahasa Indonesia, dll.) |
| `difficulty` | Tingkat kesulitan: `easy`, `medium`, `hard` |
| `cognitive_level` | Level Taksonomi Bloom: C1 (Mengingat) s.d. C6 (Mencipta) |
| `max_points` | Skor maksimum untuk soal tersebut |
| `explanation` | Pembahasan yang ditampilkan setelah ujian selesai |

---

### 4.2 Immutability — Prinsip Copy-on-Use

**Masalah:** Jika soal dalam bank soal pusat diubah setelah tryout selesai, maka rekam jejak ujian siswa menjadi tidak valid — soal yang dilihat siswa saat ujian berbeda dengan soal yang tersimpan di bank soal saat ini.

**Solusi — Exam Snapshot:**

Sistem menerapkan prinsip **Copy-on-Use (Immutability)** pada saat tryout dibuat:

```
┌─────────────────┐         ┌──────────────────────┐
│   BANK SOAL     │  Copy   │   EXAM SNAPSHOT      │
│   (Master)      │ ──────► │   (Frozen Copy)      │
│                 │ on-use  │                      │
│  Bisa diedit    │         │  Tidak bisa diedit   │
│  kapan saja     │         │  Melekat pada sesi   │
└─────────────────┘         └──────────────────────┘
```

**Cara Kerja:**

1. Admin memilih soal dari bank soal pusat saat membuat tryout.
2. Sistem membuat **salinan penuh (deep copy)** dari setiap soal yang dipilih — termasuk seluruh payload JSON, opsi jawaban, dan kunci jawaban.
3. Salinan ini disimpan sebagai **snapshot** yang terikat pada sesi ujian tersebut.
4. Perubahan pada soal master di bank soal pusat **tidak mempengaruhi** snapshot ujian yang sudah dibuat.

**Manfaat:**

- **Integritas Data Historis:** Rekam jejak ujian siswa selalu akurat dan dapat diaudit.
- **Kebebasan Revisi:** Admin dapat terus memperbaiki dan memperbarui soal di bank soal pusat tanpa khawatir merusak data ujian sebelumnya.
- **Konsistensi Pembahasan:** Pembahasan yang ditampilkan kepada siswa setelah ujian selalu sesuai dengan versi soal yang mereka kerjakan.

---

### 4.3 Pemisahan Alur Kognitif vs Non-Kognitif (Decoupling)

Sistem secara tegas memisahkan dua jenis asesmen yang memiliki karakteristik fundamental berbeda:

| Aspek | Tryout (Kognitif) | Survei (Non-Kognitif) |
|-------|--------------------|-----------------------|
| **Tipe** | Ujian Mapel / Latihan TKA | Survei Karakter · Sulingjar |
| **Waktu** | ⏱ **Terbatas** (countdown timer aktif) | ⏳ **Tanpa batas waktu** |
| **Penilaian** | ✅ Ada jawaban benar/salah, skor numerik | ❌ Tidak ada jawaban benar/salah |
| **Hasil untuk Siswa** | Skor individual, pembahasan per soal | Tidak ditampilkan ke siswa |
| **Hasil untuk Guru/Admin** | Analisis butir soal, ranking, distribusi skor | Grafik distribusi jawaban agregat |
| **Routing** | `/exam/:examId` | `/survey/:surveyId` |
| **Layout** | Distraction-free (tanpa sidebar) | Distraction-free (tanpa sidebar) |

**Mekanisme Attachment:**

Setiap survei **terikat pada satu tryout tertentu** melalui field `attached_to_tryout_id`. Alur siswa:

```
Mulai Tryout → Kerjakan Soal → Submit Jawaban → Lihat Hasil
                                                      │
                                                      ▼
                                            Survei Tersedia?
                                            ┌─── Ya ───┐
                                            ▼           │
                                     Kerjakan Survei    │
                                            │           │
                                            ▼           │
                                     Survei Selesai ◄───┘
```

**Rasional Arsitektur:**

1. **Skema Data Terpisah:** Survei menggunakan definisi soal sendiri (`mockSurveyDefinitions`) yang terpisah dari bank soal akademik (`mockQuestionBankV2`), karena struktur pertanyaan survei tidak memerlukan metadata seperti `cognitive_level`, `difficulty`, atau `correct_keys`.

2. **Scoring Engine Tidak Berlaku:** `scoringEngine.js` hanya memproses soal kognitif. Jawaban survei disimpan apa adanya tanpa melalui proses penilaian.

3. **Reporting Terpisah:** Laporan survei (`SurveyReports`, `AdminSurveyReports`) hanya menampilkan **distribusi frekuensi** jawaban dalam bentuk chart, bukan skor individual — sesuai dengan prinsip bahwa survei karakter dan lingkungan belajar tidak bersifat menghakimi.

---

## Lampiran: Struktur Direktori Frontend

```
src/
├── App.jsx                    # Root router dengan RequireAuth guard
├── main.jsx                   # Entry point React
├── index.css                  # Global styles
│
├── admin/                     # === MODUL ADMIN ===
│   ├── layouts/               #   AdminLayout (sidebar + topbar)
│   ├── components/            #   Komponen khusus admin
│   └── pages/                 #   11 halaman admin
│
├── guru/                      # === MODUL GURU ===
│   ├── layouts/               #   GuruLayout (sidebar + topbar)
│   ├── components/            #   Komponen khusus guru
│   └── pages/                 #   9 halaman guru
│
├── student/                   # === MODUL SISWA ===
│   ├── layouts/               #   StudentLayout (bottom nav)
│   ├── components/            #   Komponen khusus siswa
│   ├── pages/                 #   11 halaman siswa
│   └── utils/                 #   Utilitas khusus siswa
│
├── components/                # === KOMPONEN SHARED ===
│   ├── ui/                    #   ToastProvider, dll.
│   └── NetworkIndicator.jsx   #   Indikator status jaringan
│
├── constants/                 # === KONSTANTA GLOBAL ===
│   ├── questions.js           #   Tipe soal, level kognitif, tingkat kesulitan
│   └── subjects.js            #   Daftar mata pelajaran & kategori
│
├── context/                   # === REACT CONTEXT ===
│   └── ThemeContext.jsx        #   Dark mode provider
│
├── data/                      # === MOCK DATA ===
│   ├── mockQuestionsV2.js     #   Bank soal V2 (JSON payload)
│   ├── mockSurveys.js         #   Definisi survei
│   ├── mockSurveyResponses.js #   Respons survei mock
│   ├── mockExams.js           #   Data tryout/ujian
│   └── mockStudents.js        #   Data siswa
│
├── hooks/                     # === CUSTOM HOOKS ===
│   ├── useCountdown.js        #   Timer countdown ujian
│   ├── useDarkMode.js         #   Toggle dark mode
│   └── useNetworkStatus.js    #   Deteksi online/offline
│
└── utils/                     # === UTILITAS GLOBAL ===
    ├── scoringEngine.js       #   Mesin penilaian multi-tipe soal
    └── formatTime.js          #   Format waktu untuk countdown
```

---

> **Dokumen ini disusun sebagai referensi teknis internal untuk tim pengembang dan pemangku kepentingan UPTD SDN Muncul 02.**
```
