# Perencanaan Integrasi Frontend ↔ Backend ↔ Database
## Portal Latihan TKA

---

## Ringkasan Arsitektur

```
Frontend (React + Vite)          Backend (Laravel + Sanctum)         Database (MySQL)
localhost:5173           ←→      localhost:8000/api           ←→     portal_latihan_tka
```

**Mekanisme Auth:** Laravel Sanctum (Bearer Token) — disimpan di `localStorage` sebagai `auth_token`  
**State Management:** React Context (`KonteksPengguna`) + localStorage  
**HTTP Client:** Axios (`/src/utilitas/api.js`) dengan interceptor otomatis untuk token & redirect 401  

---

## Status Legenda

| Simbol | Keterangan |
|--------|-----------|
| ✅ | Backend endpoint sudah ada |
| ⚠️ | Endpoint ada tapi perlu ditambah/diperbaiki |
| ❌ | Endpoint **belum ada** di backend, perlu dibuat |
| 🔗 | Frontend sudah ada, tapi masih menggunakan **data dummy/statis** |
| ✔️ | Frontend + Backend sudah terintegrasi penuh |

---

## BAGIAN 1 — Halaman Publik (Tanpa Login)

### 1.1 `/login` — Halaman Login
**File Frontend:** [Login.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/autentikasi/Login.jsx)  
**Controller Backend:** [AuthController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Auth/AuthController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Submit login | `POST` | `/api/auth/login` | ✅ |
| Ambil profil setelah login | `GET` | `/api/auth/me` | ✅ |

**Ekspektasi Setelah Integrasi:**
- Frontend mengirim `{ username, password }` ke `POST /api/auth/login`
- Backend memvalidasi, mengembalikan `{ token, user: { role }, profil }`
- Frontend menyimpan `auth_token` dan `userRole` ke `localStorage`
- Redirect otomatis: Admin → `/admin`, Guru → `/guru`, Siswa → `/beranda`
- Jika akun `nonaktif`, tampil pesan error langsung dari backend

---

### 1.2 `/forgot-password` — Lupa Password
**File Frontend:** [LupaPassword.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/autentikasi/LupaPassword.jsx)  
**Controller Backend:** [AuthController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Auth/AuthController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Cek username ada | `POST` | `/api/auth/forgot-password/check` | ✅ |
| Reset ke password default | `POST` | `/api/auth/forgot-password/reset` | ✅ |

**Ekspektasi Setelah Integrasi:**
- Langkah 1: Cek username → backend mengembalikan nama, role, dan template password default
- Langkah 2: Konfirmasi reset → backend me-reset password ke `siswasd123` / `gurusd123` / `adminsd123`
- Frontend menampilkan password baru kepada pengguna setelah reset berhasil

> [!WARNING]
> Reset password saat ini menggunakan password default **statis** (bukan email). Pastikan pengguna diedukasi untuk segera mengubah password setelah login.

---

## BAGIAN 2 — Role: Siswa

### 2.1 `/beranda` — Dashboard Siswa
**File Frontend:** [DashboardSiswa.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/DashboardSiswa.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Ambil statistik dashboard | `GET` | `/api/siswa/dashboard` | ❌ Perlu dibuat |
| Daftar simulasi mendatang | `GET` | `/api/siswa/simulasi` | ❌ Perlu dibuat |
| Progress modul | `GET` | `/api/siswa/modul` | ❌ Perlu dibuat |
| Ambil pesan/notifikasi | `GET` | `/api/siswa/pesan` | ✅ |

**Ekspektasi Setelah Integrasi:**
- Kartu statistik menampilkan data real: total simulasi dikerjakan, rata-rata nilai, jumlah modul selesai
- Widget "Simulasi Terdekat" tampil dari jadwal yang diassign guru/admin
- Progress bar modul belajar diambil dari database `riwayat_pengerjaan`
- Badge notifikasi (pesan baru) diambil dari tabel `pesan_penerima`

---

### 2.2 `/latihan` — Halaman Latihan Siswa
**File Frontend:** [LatihanSiswa.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/LatihanSiswa.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar latihan mandiri | `GET` | `/api/siswa/latihan` | ❌ Perlu dibuat |
| Daftar simulasi TKA | `GET` | `/api/siswa/simulasi` | ❌ Perlu dibuat |
| Daftar survei tersedia | `GET` | `/api/siswa/survei` | ⚠️ Endpoint ada tapi hanya show detail |

**Ekspektasi Setelah Integrasi:**
- Dua tab: **Latihan Mandiri** dan **Simulasi TKA** — masing-masing menampilkan list dari database
- Status setiap item (`belum`, `sedang`, `selesai`) diambil dari tabel `riwayat_pengerjaan`
- Tombol "Mulai" mengarah ke halaman pra-latihan / pra-simulasi

---

### 2.3 `/siswa/latihan/:latihanId/pra` — Pra Latihan Mandiri
**File Frontend:** [PraLatihanMandiri.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/PraLatihanMandiri.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Detail latihan | `GET` | `/api/siswa/latihan/:id` | ❌ Perlu dibuat |
| Mulai sesi latihan | `POST` | `/api/siswa/simulasi/mulai` | ✅ (body: `tipe_latihan: latihan_mandiri`) |

**Ekspektasi Setelah Integrasi:**
- Halaman menampilkan info latihan: judul, jumlah soal, durasi, mata pelajaran
- Tombol "Mulai" memanggil `POST /api/siswa/simulasi/mulai` dengan tipe `latihan_mandiri`
- Backend generate sesi dan soal acak, mengembalikan `sesi_id`, `riwayat_id`, array soal

---

### 2.4 `/siswa/latihan/:latihanId/kerjakan` — Eksekusi Latihan Mandiri
**File Frontend:** [EksekusiLatihanMandiri.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/EksekusiLatihanMandiri.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Simpan jawaban sementara | `POST` | `/api/siswa/simulasi/:riwayat_id/jawab` | ✅ |
| Submit akhir | `POST` | `/api/siswa/simulasi/submit` | ✅ |

**Ekspektasi Setelah Integrasi:**
- Timer countdown real (durasi dari backend)
- Setiap klik opsi → auto-save ke backend (real-time)
- Saat waktu habis → auto-submit otomatis oleh frontend
- Penilaian dilakukan oleh backend (`SimulasiService`)

---

### 2.5 `/siswa/latihan/:latihanId/hasil` — Hasil Latihan
**File Frontend:** [HasilLatihanMandiri.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/HasilLatihanMandiri.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Ambil hasil dan pembahasan | `GET` | `/api/siswa/latihan/:riwayat_id/hasil` | ❌ Perlu dibuat |

**Ekspektasi Setelah Integrasi:**
- Tampilkan nilai akhir, jumlah benar/salah, persentase
- Tampilkan pembahasan per soal (teks + foto pembahasan dari backend)
- Data diambil dari tabel `riwayat_pengerjaan` + `jawaban_siswa` + `soal` + `opsi_jawaban`

---

### 2.6 `/siswa/simulasi/:simulasiId/pra` — Pra Simulasi TKA
**File Frontend:** [PraSimulasiTKA.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/PraSimulasiTKA.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Detail simulasi | `GET` | `/api/siswa/simulasi/:id` | ❌ Perlu dibuat |
| Mulai sesi simulasi | `POST` | `/api/siswa/simulasi/mulai` | ✅ (body: `tipe_latihan: simulasi_tka`) |

**Ekspektasi Setelah Integrasi:**
- Info simulasi: nama, tanggal, durasi 90 menit, 40 soal
- Backend generate 40 soal secara acak dari bank soal, memperhatikan `batas_penggunaan_simulasi`

---

### 2.7 `/siswa/simulasi/:simulasiId/kerjakan` — Eksekusi Simulasi TKA
**File Frontend:** [EksekusiSimulasiTKA.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/EksekusiSimulasiTKA.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Auto-save jawaban | `POST` | `/api/siswa/simulasi/:riwayat_id/jawab` | ✅ (throttle 60/menit) |
| Submit simulasi | `POST` | `/api/siswa/simulasi/submit` | ✅ (throttle 5/menit) |

**Ekspektasi Setelah Integrasi:**
- Mode "distraction-free" (tanpa header/sidebar)
- Timer berbasis `expired_at` dari backend (bukan hanya frontend)
- Navigasi antar soal dengan indikator status (dijawab/belum)
- Auto-submit jika backend mendeteksi waktu habis

---

### 2.8 `/siswa/simulasi/:simulasiId/hasil` — Hasil Simulasi TKA
**File Frontend:** [HasilSimulasiTKA.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/HasilSimulasiTKA.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Ambil hasil simulasi | `GET` | `/api/siswa/simulasi/:riwayat_id/hasil` | ❌ Perlu dibuat |

**Ekspektasi Setelah Integrasi:**
- Nilai, persentase, jumlah benar/salah/tidak dijawab
- Rincian per soal dengan pembahasan lengkap
- Grafik performa (opsional)

---

### 2.9 `/modul` — Halaman Modul Siswa
**File Frontend:** [ModulSiswa.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/ModulSiswa.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar modul belajar | `GET` | `/api/siswa/modul` | ❌ Perlu dibuat |
| Progress per modul | Termasuk dalam response | — | ❌ |

**Ekspektasi Setelah Integrasi:**
- Grid kartu modul: judul, mata pelajaran, progress (%), status, gambar cover
- Progress dihitung dari tabel `konten_modul` vs materi yang sudah dibaca siswa
- Filter berdasarkan mata pelajaran

---

### 2.10 `/modul/materi/:materiId` — Learning Viewer
**File Frontend:** [LearningViewer.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/LearningViewer.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Ambil konten materi | `GET` | `/api/siswa/modul/:modul_id/materi/:materi_id` | ❌ Perlu dibuat |
| Tandai materi selesai | `POST` | `/api/siswa/modul/:modul_id/materi/:materi_id/selesai` | ❌ Perlu dibuat |
| Akses kuis modul | Redirect ke `/siswa/kuis/:modulId/kerjakan` | — | 🔗 |

**Ekspektasi Setelah Integrasi:**
- Render konten materi (teks HTML/Markdown, video embed, gambar)
- Tombol "Selesai Membaca" update progress di database
- Navigasi prev/next antar materi dalam modul
- Akses kuis dikunci sampai semua materi selesai dibaca

---

### 2.11 `/siswa/kuis/:modulId/kerjakan` — Kuis Modul
**File Frontend:** [KuisModul.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/KuisModul.jsx)  
**Controller Backend:** [KuisSiswaController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Api/KuisSiswaController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Mulai kuis & ambil soal | `POST` | `/api/siswa/kuis/:id_kuis/mulai` | ✅ |
| Submit jawaban kuis | `POST` | `/api/siswa/kuis/pengerjaan/:id/submit` | ✅ |

**Ekspektasi Setelah Integrasi:**
- Backend mengembalikan soal beserta opsi jawaban (sudah diacak urutan opsinya)
- Setelah submit: tampilkan nilai, status lulus/tidak, tanggal selesai
- Jika sudah pernah mengerjakan: tampilkan skor sebelumnya atau beri opsi ulangi

---

### 2.12 `/siswa/pra-survei/:surveiId` & `/siswa/survei/:surveiId` — Survei Siswa
**File Frontend:** [PraSurvei.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/PraSurvei.jsx), [EksekusiSurveiSiswa.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/EksekusiSurveiSiswa.jsx), [SurveiSelesaiSiswa.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/SurveiSelesaiSiswa.jsx)  
**Controller Backend:** [SurveiSiswaController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Api/SurveiSiswaController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Ambil detail survei | `GET` | `/api/siswa/survei/:id` | ✅ |
| Submit jawaban survei | `POST` | `/api/siswa/survei/:id/submit` | ✅ |

**Ekspektasi Setelah Integrasi:**
- Pra-survei: tampil info judul, deskripsi, jumlah pertanyaan
- Eksekusi: render pertanyaan dinamis (pilihan ganda / teks bebas)
- Selesai: konfirmasi terima kasih, tidak bisa diisi ulang (backend cek duplikasi `pengisian_survei`)

---

### 2.13 `/pengaturan` — Pengaturan Akun Siswa
**File Frontend:** [PengaturanSiswa.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/PengaturanSiswa.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Ambil profil siswa | `GET` | `/api/auth/me` | ✅ |
| Update profil | `PUT` | `/api/siswa/profil` | ❌ Perlu dibuat |
| Ganti password | `POST` | `/api/siswa/ganti-password` | ❌ Perlu dibuat |

**Ekspektasi Setelah Integrasi:**
- Form tampil dengan data terkini dari backend (`nama_lengkap`, `nisn`, `kelas`, `username`)
- Field kelas bersifat **read-only** (hanya admin yang bisa ubah kelas siswa)
- Validasi password lama sebelum ganti password baru

---

### 2.14 `/bantuan` — Pusat Bantuan
**File Frontend:** [PusatBantuan.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/PusatBantuan.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar FAQ | Hardcoded di frontend | — | 🔗 (statis, tidak perlu API) |
| Kirim pesan ke admin | `POST` | `/api/siswa/pesan/kirim` | ❌ Perlu dibuat |

---

### 2.15 `/notifikasi` — Halaman Notifikasi (Siswa)
**File Frontend:** [NotifikasiHalaman.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/ui/NotifikasiHalaman.jsx)  
**Controller Backend:** [PesanSiswaController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Api/PesanSiswaController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Inbox pesan | `GET` | `/api/siswa/pesan` | ✅ |
| Tandai dibaca | `PATCH` | `/api/siswa/pesan/:id/baca` | ✅ |

**Ekspektasi Setelah Integrasi:**
- List pesan dari guru (broadcast)
- Badge unread count di sidebar berdasarkan data real
- Klik pesan → tandai dibaca otomatis

---

## BAGIAN 3 — Role: Guru

### 3.1 `/guru` — Dashboard Guru
**File Frontend:** [DashboardGuru.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/DashboardGuru.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Statistik kelas | `GET` | `/api/guru/dashboard` | ❌ Perlu dibuat |
| Ringkasan modul aktif | Termasuk dalam response | — | ❌ |

**Ekspektasi Setelah Integrasi:**
- Kartu: jumlah siswa aktif, modul yang dipublish, rata-rata nilai kelas
- Widget aktivitas terbaru siswa kelas yang diajar

---

### 3.2 `/guru/agenda` — Agenda Kelas
**File Frontend:** [AgendaKelas.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/AgendaKelas.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar agenda/jadwal | `GET` | `/api/guru/agenda` | ❌ Perlu dibuat |
| Tambah agenda | `POST` | `/api/guru/agenda` | ❌ Perlu dibuat |
| Edit agenda | `PUT` | `/api/guru/agenda/:id` | ❌ Perlu dibuat |
| Hapus agenda | `DELETE` | `/api/guru/agenda/:id` | ❌ Perlu dibuat |

**Ekspektasi Setelah Integrasi:**
- Kalender interaktif menampilkan jadwal simulasi/latihan yang dibuat guru
- Guru bisa tambah agenda (judul, tanggal, kelas tujuan, tipe kegiatan)
- Agenda terhubung ke `SesiLatihan` atau tabel jadwal baru

---

### 3.3 `/guru/siswa` — Daftar Siswa
**File Frontend:** [DaftarSiswaGuru.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/DaftarSiswaGuru.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar siswa kelasnya | `GET` | `/api/guru/siswa` | ❌ Perlu dibuat |
| Riwayat siswa | `GET` | `/api/siswa/:id/riwayat` | ✅ |

**Ekspektasi Setelah Integrasi:**
- Tabel daftar siswa (nama, NISN, kelas, status aktif)
- Guru hanya melihat siswa dari kelas yang diajarnya (filter by `wali_kelas_id`)
- Klik siswa → lihat riwayat pengerjaan

---

### 3.4 `/guru/laporan` — Laporan Nilai Guru
**File Frontend:** [LaporanNilaiGuru.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/LaporanNilaiGuru.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Rekap nilai per siswa | `GET` | `/api/guru/laporan/nilai` | ❌ Perlu dibuat |
| Export laporan | `GET` | `/api/guru/laporan/export` | ❌ Perlu dibuat |
| Filter by kelas/mapel | Query params | — | ❌ |

**Ekspektasi Setelah Integrasi:**
- Tabel rekap: nama siswa, nilai rata-rata, jumlah simulasi, nilai tertinggi/terendah
- Filter berdasarkan kelas, mata pelajaran, rentang tanggal
- Tombol export CSV/PDF

---

### 3.5 `/guru/modul` — Kelola Modul Guru
**File Frontend:** [KelolaModulGuru.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/KelolaModulGuru.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar modul milik guru | `GET` | `/api/guru/modul` | ❌ Perlu dibuat |
| Hapus modul | `DELETE` | `/api/guru/modul/:id` | ❌ Perlu dibuat |
| Toggle publish | `PATCH` | `/api/guru/modul/:id/status` | ❌ Perlu dibuat |

---

### 3.6 `/guru/modul/tambah` & `/guru/modul/edit/:id` — Tambah/Edit Modul
**File Frontend:** [TambahModulGuru.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/TambahModulGuru.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Buat modul baru | `POST` | `/api/guru/modul` | ❌ Perlu dibuat |
| Ambil detail modul | `GET` | `/api/guru/modul/:id` | ❌ Perlu dibuat |
| Update modul | `PUT` | `/api/guru/modul/:id` | ❌ Perlu dibuat |
| Tambah konten materi | `POST` | `/api/guru/modul/:id/materi` | ❌ Perlu dibuat |
| Tambah kuis ke modul | `POST` | `/api/guru/modul/:id/kuis` | ❌ Perlu dibuat |
| Upload gambar cover | `POST` | `/api/guru/modul/:id/cover` | ❌ Perlu dibuat |

**Ekspektasi Setelah Integrasi:**
- Form multi-langkah: info dasar → tambah materi → tambah kuis opsional
- Konten materi bisa berupa teks rich text atau embed video URL
- Simpan ke tabel `modul_belajar`, `konten_modul`, `kuis_modul`

---

### 3.7 `/guru/kuis` — Kelola Kuis Guru
**File Frontend:** [KelolaKuisGuru.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/KelolaKuisGuru.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar kuis | `GET` | `/api/guru/kuis` | ❌ Perlu dibuat |
| Hapus kuis | `DELETE` | `/api/guru/kuis/:id` | ❌ Perlu dibuat |

---

### 3.8 `/guru/kuis/tambah` & `/guru/kuis/edit/:id` — Tambah/Edit Kuis
**File Frontend:** [TambahKuisGuru.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/TambahKuisGuru.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Buat kuis | `POST` | `/api/guru/kuis` | ❌ Perlu dibuat |
| Ambil detail kuis | `GET` | `/api/guru/kuis/:id` | ❌ Perlu dibuat |
| Update kuis | `PUT` | `/api/guru/kuis/:id` | ❌ Perlu dibuat |
| Tambah soal kuis | `POST` | `/api/guru/kuis/:id/soal` | ❌ Perlu dibuat |

**Ekspektasi Setelah Integrasi:**
- Buat kuis dengan judul, passing grade, modul yang dituju
- Tambah soal dengan opsi jawaban (tanda benar/salah)
- Data disimpan ke `kuis_modul`, `soal_kuis`, `opsi_soal_kuis`

---

### 3.9 `/guru/laporan/survei` — Laporan Survei Guru
**File Frontend:** [LaporanSurvei.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/LaporanSurvei.jsx)  
**Controller Backend:** [SurveiGuruController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Api/SurveiGuruController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Rekap pengisian survei | `GET` | `/api/survei/:id/rekap` | ✅ |
| Detail jawaban per siswa | `GET` | `/api/survei/pengisian/:id` | ✅ |

**Ekspektasi Setelah Integrasi:**
- Tabel responden: nama siswa, kelas, waktu pengisian
- Klik "Lihat Detail" → modal dengan jawaban lengkap per pertanyaan
- Statistik: total responden dari siswa di kelasnya

---

### 3.10 `/guru/notifikasi` — Notifikasi & Broadcast Guru
**File Frontend:** [NotifikasiHalaman.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/ui/NotifikasiHalaman.jsx)  
**Controller Backend:** [PesanGuruController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Api/PesanGuruController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Broadcast pesan ke siswa | `POST` | `/api/pesan/broadcast` | ✅ |
| Inbox guru | `GET` | `/api/guru/pesan` | ❌ Perlu dibuat |

**Ekspektasi Setelah Integrasi:**
- Form broadcast: judul, isi pesan, pilih target (semua siswa / per kelas)
- Backend menyimpan ke `pesan` + `pesan_penerima` untuk setiap siswa target

---

## BAGIAN 4 — Role: Admin

### 4.1 `/admin` — Dashboard Admin
**File Frontend:** [DashboardAdmin.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/DashboardAdmin.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Statistik global | `GET` | `/api/admin/dashboard` | ❌ Perlu dibuat |
| Aktivitas terbaru | `GET` | `/api/admin/log-aktivitas` | ⚠️ Endpoint log ada, perlu format dashboard |

**Ekspektasi Setelah Integrasi:**
- Kartu: total pengguna aktif, total soal, total simulasi, total modul
- Grafik tren pengerjaan simulasi per minggu
- Feed aktivitas terbaru sistem (log login, submit, dll)

---

### 4.2 `/admin/pengguna` — Manajemen Pengguna
**File Frontend:** [ManajemenPengguna.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/ManajemenPengguna.jsx)  
**Controller Backend:** [PenggunaController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Admin/PenggunaController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| List pengguna (paginasi) | `GET` | `/api/admin/pengguna` | ✅ |
| Filter by role/status | Query `?filter[role]=siswa` | — | ✅ |
| Sort | Query `?sort=username` | — | ✅ |

**Ekspektasi Setelah Integrasi:**
- Tabel dengan paginasi 15/halaman
- Filter role (admin/guru/siswa) dan status (aktif/nonaktif)
- Search berdasarkan username atau nama lengkap
- Kolom: username, nama, role, kelas (jika siswa), NIP (jika guru), status, aksi

---

### 4.3 `/admin/pengguna/tambah` & `/admin/pengguna/edit/:id` — CRUD Pengguna
**File Frontend:** [TambahPengguna.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/admin/crud/TambahPengguna.jsx)  
**Controller Backend:** [PenggunaController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Admin/PenggunaController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Buat pengguna | `POST` | `/api/admin/pengguna` | ✅ |
| Ambil detail | `GET` | `/api/admin/pengguna/:id` | ✅ |
| Update pengguna | `PUT` | `/api/admin/pengguna/:id` | ✅ |
| Soft delete | `DELETE` | `/api/admin/pengguna/:id` | ✅ |
| Ambil daftar kelas | `GET` | `/api/admin/kelas` | ✅ |

**Ekspektasi Setelah Integrasi:**
- Form dinamis: field berbeda tergantung role yang dipilih
  - Siswa: nama, NISN, kelas (dropdown)
  - Guru: nama, NIP
  - Admin: hanya username + password
- Validasi backend: username unik, NISN unik, password minimal 8 karakter
- Soft delete (nonaktifkan) — bukan hapus permanen

---

### 4.4 `/admin/bank-soal` — Bank Soal
**File Frontend:** [BankSoal.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/BankSoal.jsx)  
**Controller Backend:** [SoalController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Admin/SoalController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| List soal (paginasi) | `GET` | `/api/soal` | ✅ (role: admin/guru) |
| Filter by mapel/topik | Query `?filter[mapel_id]=1` | — | ✅ |
| Search isi soal | Query `?search=...` | — | ✅ |
| Dropdown mata pelajaran | `GET` | `/api/mata-pelajaran` | ✅ (publik) |
| Dropdown topik | `GET` | `/api/topik?mapel_id=1` | ✅ (publik) |

**Ekspektasi Setelah Integrasi:**
- Tabel soal dengan preview isi soal (truncated)
- Filter bertingkat: pilih mapel → topik otomatis update
- Tampilkan foto soal jika ada (thumbnail)
- Indikator status (aktif/nonaktif) dan batas penggunaan simulasi

---

### 4.5 `/admin/bank-soal/tambah` & `/admin/bank-soal/edit/:id` — CRUD Soal
**File Frontend:** [TambahSoal.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/admin/crud/TambahSoal.jsx)  
**Controller Backend:** [SoalController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Admin/SoalController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Buat soal | `POST` | `/api/soal` | ✅ (multipart/form-data) |
| Ambil detail soal | `GET` | `/api/soal/:id` | ✅ |
| Update soal | `PUT` | `/api/soal/:id` | ✅ |
| Hapus soal | `DELETE` | `/api/soal/:id` | ✅ |

> [!IMPORTANT]
> Request harus menggunakan `multipart/form-data` (bukan JSON) karena ada upload foto. Di Axios gunakan `FormData` dan **hapus** header `Content-Type: application/json` untuk request ini.

**Ekspektasi Setelah Integrasi:**
- Form: pilih mapel → topik (cascade), isi soal, upload foto soal opsional
- Opsi jawaban A-E dengan radio "jawaban benar"
- Upload foto per opsi jawaban opsional
- Pembahasan (teks + foto opsional)
- Backend menyimpan file ke storage, mengembalikan path

---

### 4.6 `/admin/simulasi` — Manajemen Simulasi TKA
**File Frontend:** [ManajemenSimulasi.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/ManajemenSimulasi.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar simulasi | `GET` | `/api/admin/simulasi` | ❌ Perlu dibuat |
| Hapus simulasi | `DELETE` | `/api/admin/simulasi/:id` | ❌ Perlu dibuat |
| Toggle status | `PATCH` | `/api/admin/simulasi/:id/status` | ❌ Perlu dibuat |

---

### 4.7 `/admin/simulasi/tambah` & `/admin/simulasi/edit/:id` — CRUD Simulasi
**File Frontend:** [TambahSimulasi.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/admin/crud/TambahSimulasi.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Buat simulasi | `POST` | `/api/admin/simulasi` | ❌ Perlu dibuat |
| Ambil detail simulasi | `GET` | `/api/admin/simulasi/:id` | ❌ Perlu dibuat |
| Update simulasi | `PUT` | `/api/admin/simulasi/:id` | ❌ Perlu dibuat |
| Cek soal tersedia | `GET` | `/api/soal/tersedia-simulasi` | ✅ |

**Ekspektasi Setelah Integrasi:**
- Form: nama simulasi, tanggal mulai/selesai, durasi, kelas tujuan
- Pilih soal secara manual atau generate otomatis dari bank soal
- Sistem menampilkan peringatan jika soal mendekati `batas_penggunaan_simulasi`

---

### 4.8 `/admin/modul` — Manajemen Modul Admin
**File Frontend:** [ManajemenModul.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/ManajemenModul.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar semua modul | `GET` | `/api/admin/modul` | ❌ Perlu dibuat |
| Hapus modul | `DELETE` | `/api/admin/modul/:id` | ❌ Perlu dibuat |

---

### 4.9 `/admin/modul/tambah` & `/admin/modul/edit/:id` — CRUD Modul Admin
**File Frontend:** [TambahModul.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/admin/crud/TambahModul.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Buat modul | `POST` | `/api/admin/modul` | ❌ Perlu dibuat |
| Ambil detail modul | `GET` | `/api/admin/modul/:id` | ❌ Perlu dibuat |
| Update modul | `PUT` | `/api/admin/modul/:id` | ❌ Perlu dibuat |

---

### 4.10 `/admin/laporan` — Laporan Nilai Global
**File Frontend:** [LaporanNilai.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/LaporanNilai.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Rekap nilai semua siswa | `GET` | `/api/admin/laporan/nilai` | ❌ Perlu dibuat |
| Filter by kelas/mapel | Query params | — | ❌ |
| Export data | `GET` | `/api/admin/laporan/export` | ❌ Perlu dibuat |

**Ekspektasi Setelah Integrasi:**
- Admin melihat semua siswa lintas kelas
- Rata-rata nilai per mata pelajaran, per kelas
- Grafik distribusi nilai

---

### 4.11 `/admin/laporan/survei` — Laporan Survei Admin
**File Frontend:** [LaporanSurveiAdmin.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/LaporanSurveiAdmin.jsx)  
**Controller Backend:** [SurveiGuruController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Api/SurveiGuruController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Rekap survei (semua) | `GET` | `/api/survei/:id/rekap` | ✅ (reuse endpoint guru) |
| Detail jawaban | `GET` | `/api/survei/pengisian/:id` | ✅ |

---

### 4.12 `/admin/survei` — Manajemen Survei
**File Frontend:** [ManajemenSurvei.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/ManajemenSurvei.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar survei | `GET` | `/api/admin/survei` | ❌ Perlu dibuat |
| Hapus survei | `DELETE` | `/api/admin/survei/:id` | ❌ Perlu dibuat |
| Toggle status | `PATCH` | `/api/admin/survei/:id/status` | ❌ Perlu dibuat |

---

### 4.13 `/admin/survei/tambah` & `/admin/survei/edit/:id` — CRUD Survei
**File Frontend:** [TambahSurvei.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/komponen/admin/crud/TambahSurvei.jsx)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Buat survei | `POST` | `/api/admin/survei` | ❌ Perlu dibuat |
| Ambil detail survei | `GET` | `/api/admin/survei/:id` | ❌ Perlu dibuat |
| Update survei | `PUT` | `/api/admin/survei/:id` | ❌ Perlu dibuat |
| Tambah pertanyaan | Nested dalam payload | — | ❌ |

**Ekspektasi Setelah Integrasi:**
- Form survei: judul, deskripsi, tanggal aktif
- Tambah pertanyaan dinamis (pilihan ganda atau esai)
- Opsi jawaban untuk pertanyaan pilihan ganda
- Simpan ke `survei`, `pertanyaan_survei`, `opsi_survei`

---

### 4.14 `/admin/log-aktivitas` — Log Aktivitas
**File Frontend:** [LogAktivitasAdmin.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/LogAktivitasAdmin.jsx)  
**Controller Backend:** [LogAktivitasController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Api/LogAktivitasController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Daftar log | `GET` | `/api/admin/log-aktivitas` | ⚠️ Ada tapi perlu route admin |
| Riwayat per siswa | `GET` | `/api/siswa/:id/riwayat` | ✅ |
| Filter by user/aksi | Query params | — | ❌ |

**Ekspektasi Setelah Integrasi:**
- Timeline aktivitas semua pengguna: login, submit simulasi, akses modul, dll
- Filter berdasarkan nama pengguna, tipe aksi, rentang tanggal
- Data dari tabel `log_aktivitas`

---

### 4.15 `/admin/notifikasi` — Notifikasi Admin
**Sama dengan guru:** Inbox + broadcast ke semua pengguna  
**Controller Backend:** [PesanGuruController.php](file:///d:/laragon/www/portal-latihan-tka-backend/app/Http/Controllers/Api/PesanGuruController.php)

| Aksi | Method | Endpoint API | Status |
|------|--------|-------------|--------|
| Broadcast pesan | `POST` | `/api/pesan/broadcast` | ✅ |
| Inbox admin | `GET` | `/api/admin/pesan` | ❌ Perlu dibuat |

---

## BAGIAN 5 — Ringkasan Status Endpoint

### ✅ Endpoint Backend Sudah Ada (13 endpoint)
| Endpoint | Method | Keterangan |
|----------|--------|-----------|
| `/api/auth/login` | POST | Login |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/me` | GET | Profil user |
| `/api/auth/forgot-password/check` | POST | Cek username |
| `/api/auth/forgot-password/reset` | POST | Reset password |
| `/api/admin/pengguna` | GET/POST/PUT/DELETE | CRUD Pengguna |
| `/api/admin/kelas` | GET/POST/PUT/DELETE | CRUD Kelas |
| `/api/soal` | GET/POST/PUT/DELETE | Bank Soal |
| `/api/mata-pelajaran` | GET | Dropdown mapel |
| `/api/topik` | GET | Dropdown topik |
| `/api/siswa/kuis/:id/mulai` | POST | Mulai kuis |
| `/api/siswa/kuis/pengerjaan/:id/submit` | POST | Submit kuis |
| `/api/siswa/simulasi/mulai` | POST | Mulai simulasi/latihan |
| `/api/siswa/simulasi/:id/jawab` | POST | Auto-save jawaban |
| `/api/siswa/simulasi/submit` | POST | Submit simulasi |
| `/api/siswa/survei/:id` | GET | Detail survei |
| `/api/siswa/survei/:id/submit` | POST | Submit survei |
| `/api/siswa/pesan` | GET | Inbox siswa |
| `/api/siswa/pesan/:id/baca` | PATCH | Tandai dibaca |
| `/api/pesan/broadcast` | POST | Broadcast guru |
| `/api/survei/:id/rekap` | GET | Rekap survei guru |
| `/api/survei/pengisian/:id` | GET | Detail jawaban survei |
| `/api/siswa/:id/riwayat` | GET | Riwayat siswa |

### ❌ Endpoint Yang Perlu Dibuat (Prioritas Tinggi → Rendah)

**🔴 Prioritas 1 — Core Siswa (Wajib untuk fungsionalitas dasar)**
| Endpoint | Keterangan |
|----------|-----------|
| `GET /api/siswa/dashboard` | Statistik dashboard siswa |
| `GET /api/siswa/simulasi` | Daftar simulasi tersedia |
| `GET /api/siswa/latihan` | Daftar latihan mandiri |
| `GET /api/siswa/modul` | Daftar modul + progress |
| `GET /api/siswa/simulasi/:id` | Detail simulasi |
| `GET /api/siswa/latihan/:id/hasil` | Hasil latihan/simulasi |
| `GET /api/siswa/modul/:id/materi/:id` | Konten materi |
| `POST /api/siswa/modul/:id/materi/:id/selesai` | Tandai materi selesai |

**🟡 Prioritas 2 — Admin Core**
| Endpoint | Keterangan |
|----------|-----------|
| `GET/POST/PUT/DELETE /api/admin/simulasi` | CRUD Simulasi |
| `GET/POST/PUT/DELETE /api/admin/modul` | CRUD Modul (admin) |
| `GET/POST/PUT/DELETE /api/admin/survei` | CRUD Survei |
| `GET /api/admin/dashboard` | Statistik dashboard admin |
| `GET /api/admin/laporan/nilai` | Laporan nilai global |

**🟢 Prioritas 3 — Guru**
| Endpoint | Keterangan |
|----------|-----------|
| `GET /api/guru/dashboard` | Dashboard guru |
| `GET /api/guru/siswa` | Daftar siswa kelas guru |
| `GET/POST/PUT/DELETE /api/guru/modul` | CRUD Modul (guru) |
| `GET/POST/PUT/DELETE /api/guru/kuis` | CRUD Kuis (guru) |
| `GET /api/guru/laporan/nilai` | Laporan nilai kelas |
| `GET/POST/PUT/DELETE /api/guru/agenda` | Kelola agenda kelas |

**🔵 Prioritas 4 — Fitur Tambahan**
| Endpoint | Keterangan |
|----------|-----------|
| `PUT /api/siswa/profil` | Update profil siswa |
| `POST /api/siswa/ganti-password` | Ganti password siswa |
| `GET /api/admin/laporan/export` | Export laporan CSV |
| `GET /api/admin/log-aktivitas` | Log semua aktivitas |

---

## BAGIAN 6 — Ekspektasi Umum Setelah Integrasi Penuh

### 🔐 Keamanan
- Token Sanctum tersimpan di `localStorage`, dikirim via header `Authorization: Bearer`
- Middleware `role:siswa|guru|admin` memblokir akses lintas role di backend
- Token otomatis dihapus dan user di-redirect ke `/login` jika respons 401
- Session tunggal: login ulang akan menghapus token lama

### 🗄️ Data Real-Time
- Semua widget, tabel, dan kartu statistik **tidak lagi menggunakan data dummy**
- Data diambil fresh dari database setiap kali halaman dimuat (`useEffect` + API call)
- Loading state dan error state ditangani di setiap komponen

### 📁 Upload File
- Foto soal, gambar cover modul, foto opsi jawaban di-upload ke Laravel Storage
- Frontend menggunakan `FormData` (bukan JSON) untuk endpoint dengan file upload
- URL file dikembalikan oleh backend dan disimpan sebagai path di database

### 📊 Penilaian Otomatis
- Nilai dihitung di backend (`SimulasiService`, `KuisService`) — bukan di frontend
- Frontend hanya menampilkan hasil dari backend
- File [mesinPenilaian.js](file:///d:/laragon/www/portal-latihan-tka-frontend/src/utilitas/mesinPenilaian.js) yang ada di frontend perlu dihapus/diabaikan setelah integrasi penuh

### ⏱️ Timer Ujian
- Timer di frontend mengacu pada `expired_at` dari backend (`SesiLatihan`)
- Backend memvalidasi waktu saat menerima jawaban — tidak bisa cheat dengan manipulasi frontend

### 📝 Log Aktivitas
- Setiap aksi penting (login, submit, akses modul) dicatat otomatis di tabel `log_aktivitas`
- Admin dapat melihat audit trail lengkap di halaman Log Aktivitas

---

## BAGIAN 7 — Perubahan Teknis Frontend Yang Diperlukan

| Komponen | Perubahan yang Diperlukan |
|----------|--------------------------|
| [api.js](file:///d:/laragon/www/portal-latihan-tka-frontend/src/utilitas/api.js) | Sudah bagus — tambahkan base URL ke `.env.local` (`VITE_API_URL`) |
| [KonteksPengguna](file:///d:/laragon/www/portal-latihan-tka-frontend/src/konteks/) | Ganti localStorage dengan data real dari `GET /api/auth/me` |
| [App.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/App.jsx) | Guard `RequireAuth` sudah ada — integrasikan dengan response API |
| Semua halaman | Ganti data dummy/statis dengan `useEffect` + API call |
| Form Upload Soal | Ubah Axios ke `multipart/form-data` dengan `FormData` |
| Semua CRUD form | Tambahkan feedback toast sukses/error dari respons API |
