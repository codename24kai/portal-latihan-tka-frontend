# 🗓️ Rundown Eksekusi — Database & Backend
## Portal Latihan TKA (SD Kelas 6)
> **Stack:** Laravel 11 · MySQL 8.0 · Redis · Laravel Sanctum
> **Referensi DDL:** `revisi_database_tka.md` + **`addendum_soal_sesi.md`** (koreksi domain soal)
> **Konvensi:** PK → `id_{tabel}`, FK → `{tabel_referensi}_id`
> **Total Tabel:** 29 tabel | **Total Estimasi:** ~8 minggu

> [!IMPORTANT]
> Dokumen ini telah diperbarui berdasarkan **`addendum_soal_sesi.md`** yang mengkoreksi arsitektur domain soal. Terdapat **dua domain soal yang terpisah secara bisnis**:
> - **Bank Soal** (`soal` + `opsi_jawaban`) → hanya untuk Simulasi TKA & Latihan Mandiri
> - **Soal Kuis Modul** (`soal_kuis` + `opsi_soal_kuis`) → hanya untuk Kuis Modul, dibuat guru per modul
>
> Rekomendasi di `revisi_database_tka.md` yang menjadikan `soal` sebagai *single source of truth untuk semua konteks* **tidak lagi berlaku** setelah koreksi ini.

---

## 📊 Ringkasan Timeline

| Fase | Nama                          | Durasi     | Tabel Terlibat                                 | Deliverable Utama                          |
|------|-------------------------------|------------|------------------------------------------------|--------------------------------------------|
| 0    | Persiapan & Fondasi           | Minggu 1   | —                                              | Environment siap, konvensi ditetapkan      |
| 1    | User Management & Auth        | Minggu 1–2 | `pengguna`, `guru`, `siswa`, `kelas`          | Login multi-role, middleware, seeder       |
| 2    | Bank Soal                     | Minggu 2–3 | `mata_pelajaran`, `topik`, `soal`, `opsi_jawaban` | CRUD soal + batas penggunaan simulasi  |
| 3    | Modul Belajar & Kuis          | Minggu 3–4 | `modul_belajar`, `konten_modul`, `kuis_modul`, **`soal_kuis`**, **`opsi_soal_kuis`**, `pengerjaan_kuis`, `jawaban_kuis` | CRUD modul + soal kuis independen |
| 4    | Latihan Mandiri & Simulasi    | Minggu 4–5 | `sesi_latihan`, `sesi_latihan_soal`, `pengerjaan_latihan`, `jawaban_latihan` | Engine latihan + scoring + cek batas soal |
| 5    | Survei                        | Minggu 5–6 | `survei`, `pertanyaan_survei`, `opsi_survei`, `pengisian_survei`, `jawaban_survei` | CRUD + pengisian survei |
| 6    | Notifikasi & Pesan            | Minggu 6   | `pesan`, `pesan_penerima`                     | Broadcast pesan, mark as read             |
| 7    | Log & Dashboard Analitik      | Minggu 7   | `log_aktivitas`                               | Observer, dashboard guru & admin          |
| 8    | Testing & Optimisasi          | Minggu 8   | Semua tabel                                   | Unit test, caching Redis, load test       |

---

## ⚙️ Fase 0 — Persiapan & Fondasi
> **Durasi:** Minggu 1 (Hari 1–3)
> **Prasyarat:** Tidak ada

### Checklist Lingkungan

- [ ] **Install Laravel 11** via `composer create-project laravel/laravel portal-latihan-tka-backend`
- [ ] **Konfigurasi `.env`:**
  ```env
  APP_NAME="Portal Latihan TKA"
  APP_ENV=local
  APP_URL=http://localhost:8000

  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=portal_latihan_tka
  DB_USERNAME=root
  DB_PASSWORD=

  CACHE_DRIVER=redis
  QUEUE_CONNECTION=redis
  SESSION_DRIVER=file

  SANCTUM_STATEFUL_DOMAINS=localhost:5173
  ```
- [ ] **Install package wajib:**
  ```bash
  composer require laravel/sanctum
  composer require spatie/laravel-query-builder    # filter & sort API
  composer require intervention/image              # resize foto soal
  ```
- [ ] **Setup Redis** di Laragon (enable extension `php_redis.dll`)
- [ ] **Buat database** `portal_latihan_tka` di MySQL
- [ ] **Tetapkan konvensi** dalam tim:
  - PK: `id_{nama_tabel}` (contoh: `id_pengguna`, `id_soal`)
  - FK: `{tabel_referensi}_id` (contoh: `pengguna_id`, `soal_id`)
  - Semua tabel: snake_case
  - Kolom status: selalu ENUM, tidak pernah boolean/int tanpa komentar
- [ ] **Buat folder struktur backend:**
  ```
  app/
  ├── Http/
  │   ├── Controllers/
  │   │   ├── Auth/
  │   │   ├── Admin/
  │   │   ├── Guru/
  │   │   └── Siswa/
  │   ├── Middleware/
  │   └── Requests/
  ├── Models/
  ├── Services/
  ├── Policies/
  └── Observers/
  ```
- [ ] **Setup Sanctum** (`php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`)
- [ ] **Setup CORS** di `config/cors.php` untuk frontend Vite (`localhost:5173`)

---

## 👤 Fase 1 — User Management & Autentikasi
> **Durasi:** Minggu 1–2 (Hari 3–10)
> **Prasyarat:** Fase 0 selesai

### 1.1 Migrasi Database

**Urutan migrasi (wajib berurutan karena dependency FK):**

```
pengguna → guru → kelas → siswa
```

- [ ] `2026_01_01_000001_create_pengguna_table.php`
  - Kolom: `id_pengguna`, `username`, `password`, `role ENUM`, `status ENUM`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`
- [ ] `2026_01_01_000002_create_guru_table.php`
  - Kolom: `id_guru`, `pengguna_id FK`, `nama_lengkap`, `nip`, `created_at`, `updated_at`
- [ ] `2026_01_01_000003_create_kelas_table.php`
  - Kolom: `id_kelas`, `wali_kelas_id FK→guru`, `nama_kelas`, `tahun_ajaran VARCHAR(9)`, `is_aktif`, `created_at`, `updated_at`
  - Unique key: `(nama_kelas, tahun_ajaran)`
- [ ] `2026_01_01_000004_create_siswa_table.php`
  - Kolom: `id_siswa`, `pengguna_id FK`, `kelas_id FK`, `nama_lengkap`, `nisn`, `created_at`, `updated_at`

### 1.2 Eloquent Models

- [ ] `app/Models/Pengguna.php`
  ```php
  protected $primaryKey = 'id_pengguna';
  protected $fillable = ['username', 'password', 'role', 'status', 'last_login_at'];
  protected $hidden = ['password'];
  protected $casts = ['password' => 'hashed'];

  // Relationships
  public function guru(): HasOne { return $this->hasOne(Guru::class, 'pengguna_id', 'id_pengguna'); }
  public function siswa(): HasOne { return $this->hasOne(Siswa::class, 'pengguna_id', 'id_pengguna'); }
  ```

- [ ] `app/Models/Guru.php` — `belongsTo(Pengguna::class)`, `hasMany(Kelas::class, 'wali_kelas_id')`
- [ ] `app/Models/Kelas.php` — `belongsTo(Guru::class, 'wali_kelas_id')`, `hasMany(Siswa::class, 'kelas_id')`
- [ ] `app/Models/Siswa.php` — `belongsTo(Pengguna::class)`, `belongsTo(Kelas::class)`

### 1.3 Autentikasi (Laravel Sanctum)

- [ ] `POST /api/auth/login` — validasi username+password, issue Sanctum token
  ```json
  Request:  { "username": "...", "password": "..." }
  Response: { "token": "...", "user": { "id", "username", "role" }, "profil": {...} }
  ```
- [ ] `POST /api/auth/logout` — revoke token (`$request->user()->currentAccessToken()->delete()`)
- [ ] `GET /api/auth/me` — return user + profil berdasarkan role

### 1.4 Middleware Role-Based Access

- [ ] `app/Http/Middleware/RoleMiddleware.php`
  ```php
  // Contoh penggunaan di routes:
  Route::middleware(['auth:sanctum', 'role:admin'])->group(...);
  Route::middleware(['auth:sanctum', 'role:guru'])->group(...);
  Route::middleware(['auth:sanctum', 'role:siswa'])->group(...);
  ```
- [ ] Register di `bootstrap/app.php` sebagai alias `'role'`

### 1.5 API Pengguna (Admin Only)

- [ ] `GET /api/admin/pengguna` — list semua pengguna (dengan filter role, status)
- [ ] `POST /api/admin/pengguna` — buat pengguna baru (auto-buat profil guru/siswa sesuai role)
- [ ] `PUT /api/admin/pengguna/{id}` — update pengguna
- [ ] `DELETE /api/admin/pengguna/{id}` — soft delete
- [ ] `GET /api/admin/kelas` — list kelas aktif
- [ ] `POST /api/admin/kelas` — buat kelas baru
- [ ] `PUT /api/admin/kelas/{id}` — edit kelas
- [ ] `DELETE /api/admin/kelas/{id}` — hapus kelas

### 1.6 Seeder Data

- [ ] `DatabaseSeeder.php` memanggil (berurutan):
  ```
  PenggunaSeeder → GuruSeeder → KelasSeeder → SiswaSeeder
  ```
- [ ] **PenggunaSeeder:** 1 admin (`admin/admin123`), 3 guru, 30 siswa (10 per kelas)
- [ ] **KelasSeeder:** 3 kelas (6A, 6B, 6C) dengan `tahun_ajaran = '2025/2026'`

### ✅ Kriteria Selesai Fase 1
- Login berhasil menghasilkan Sanctum token
- Endpoint `/me` mengembalikan data lengkap sesuai role
- Middleware menolak akses lintas role dengan `403 Forbidden`
- Seeder berjalan tanpa error

---

## 📚 Fase 2 — Bank Soal
> **Durasi:** Minggu 2–3 (Hari 8–15)
> **Prasyarat:** Fase 1 selesai (tabel `pengguna` ada)

### 2.1 Migrasi Database

**Urutan:**
```
mata_pelajaran → topik → soal → opsi_jawaban
```

- [ ] `create_mata_pelajaran_table.php`
  - Kolom: `id_mapel`, `nama_mapel UNIQUE`, `deskripsi`, `created_at`, `updated_at`
- [ ] `create_topik_table.php`
  - Kolom: `id_topik`, `mapel_id FK`, `nama_topik`, `deskripsi`, `created_at`, `updated_at`
- [ ] `create_soal_table.php`
  - Kolom: `id_soal`, `mapel_id FK`, `topik_id FK NULL`, `dibuat_oleh_id FK`, `jenis_soal ENUM`, `isi_soal LONGTEXT`, `foto_soal VARCHAR(500)`, `pembahasan_text LONGTEXT`, `pembahasan_foto VARCHAR(500)`, `status ENUM`, `created_at`, `updated_at`, `deleted_at`
  - Kolom baru (addendum): **`batas_penggunaan_simulasi TINYINT UNSIGNED NOT NULL DEFAULT 1`** — konfigurasi berapa kali soal boleh dipakai di Simulasi TKA
  - Index: `idx_soal_mapel_status (mapel_id, status)`, `idx_soal_topik_status (topik_id, status)`, `idx_soal_simulasi_config (batas_penggunaan_simulasi, status)`
- [ ] `create_topik_table.php` — tambah Unique key: `uq_topik_per_mapel (mapel_id, nama_topik)`
- [ ] `create_opsi_jawaban_table.php`
  - Kolom: `id_opsi_jawaban`, `soal_id FK`, `label CHAR(1)`, `teks_opsi TEXT`, `foto_opsi VARCHAR(500)`, `is_benar BOOLEAN`, **`urutan TINYINT UNSIGNED NOT NULL DEFAULT 1`**
  - Unique key: `(soal_id, label)`

### 2.2 Models

- [ ] `app/Models/MataPelajaran.php` — `hasMany(Topik::class)`, `hasMany(Soal::class)`
- [ ] `app/Models/Topik.php` — `belongsTo(MataPelajaran::class)`, `hasMany(Soal::class)`
- [ ] `app/Models/Soal.php`
  - `belongsTo(MataPelajaran::class, 'mapel_id')`, `belongsTo(Topik::class)`
  - `hasMany(OpsiJawaban::class, 'soal_id')`
  - `belongsToMany(SesiLatihan::class, 'sesi_latihan_soal', 'soal_id', 'sesi_latihan_id')` → relasi ke sesi latihan
  - Kolom `batas_penggunaan_simulasi` di `$fillable`
  - Soft delete: `use SoftDeletes`
- [ ] `app/Models/OpsiJawaban.php` — `belongsTo(Soal::class, 'soal_id')`

### 2.3 Service: File Upload

- [ ] `app/Services/FileUploadService.php`
  ```php
  // Upload foto soal ke storage/app/public/soal/
  public function uploadFotoSoal(UploadedFile $file): string;
  // Delete foto lama saat soal diedit
  public function deleteFoto(string $path): void;
  ```
- [ ] Konfigurasi `storage:link` (`php artisan storage:link`)
- [ ] Batasi ukuran file: maks 2MB, format: jpg/jpeg/png/webp

### 2.4 API Bank Soal

**Untuk Admin & Guru:**
- [ ] `GET /api/soal` — list soal dengan filter (mapel, topik, status, search by isi_soal)
  - Query params: `?mapel_id=1&topik_id=2&status=aktif&search=persegi`
  - Gunakan `spatie/laravel-query-builder`
- [ ] `POST /api/soal` — buat soal baru (dengan opsi jawaban)
  ```json
  {
    "mapel_id": 1,
    "topik_id": 2,
    "jenis_soal": "pilihan_ganda",
    "isi_soal": "Berapakah ...",
    "foto_soal": "<file>",
    "opsi_jawaban": [
      { "label": "A", "teks_opsi": "...", "is_benar": false },
      { "label": "B", "teks_opsi": "...", "is_benar": true },
      { "label": "C", "teks_opsi": "..." },
      { "label": "D", "teks_opsi": "..." }
    ]
  }
  ```
- [ ] `GET /api/soal/{id}` — detail soal + opsi jawaban
- [ ] `PUT /api/soal/{id}` — update soal (termasuk replace opsi jawaban + `batas_penggunaan_simulasi`)
- [ ] `DELETE /api/soal/{id}` — soft delete soal
- [ ] `GET /api/mata-pelajaran` — list semua mapel (public untuk dropdown)
- [ ] `GET /api/topik?mapel_id={id}` — list topik berdasarkan mapel
- [ ] `GET /api/soal/tersedia-simulasi?mapel_id={id}` — list soal bank yang **masih tersedia** untuk dimasukkan ke simulasi baru (belum mencapai batas penggunaan)

### 2.5 Form Request Validation

- [ ] `app/Http/Requests/SoalRequest.php`
  - Validasi: `mapel_id required|exists`, `jenis_soal required|in:...`, `isi_soal required`, `foto_soal nullable|image|max:2048`
  - Validasi `batas_penggunaan_simulasi`: `integer|min:1|max:5`
  - Validasi opsi jawaban: minimal 2 opsi, tepat 1 yang `is_benar = true` (untuk pilihan ganda biasa)

### 2.6 Seeder

- [ ] `MataPelajaranSeeder` — 5 mapel TKA: Matematika, Bahasa Indonesia, IPA, IPS, Bahasa Inggris
- [ ] `TopikSeeder` — 3–5 topik per mapel
- [ ] `SoalSeeder` — 20 soal sample per mapel (100 soal total)

### ✅ Kriteria Selesai Fase 2
- Soal bisa dibuat dengan foto dan opsi jawaban melalui API
- Filter dan search berfungsi
- Foto tersimpan di storage dan URL-nya tersimpan di DB
- Soal soft-deleted tidak muncul di list

### 2.7 Service: Cek Ketersediaan Soal Simulasi

> **Referensi:** `addendum_soal_sesi.md` — Opsi C (Direkomendasikan)

- [ ] `app/Services/SoalService.php`
  ```php
  // Query soal bank yang belum mencapai batas penggunaan di simulasi TKA
  // Menggunakan withCount() dari sesi_latihan_soal — TIDAK membutuhkan counter terpisah
  public function getSoalTersediaUntukSimulasi(int $mapelId, int $jumlahSoal): Collection
  {
      return Soal::query()
          ->where('mapel_id', $mapelId)
          ->where('status', 'aktif')
          ->withCount([
              'sesiLatihanSoal as jumlah_digunakan_simulasi' => function ($query) {
                  $query->whereHas('sesiLatihan', function ($q) {
                      $q->where('tipe', 'simulasi_tka')
                        ->where('status', '!=', 'nonaktif');
                  });
              }
          ])
          ->havingRaw('jumlah_digunakan_simulasi < batas_penggunaan_simulasi')
          ->inRandomOrder()
          ->limit($jumlahSoal)
          ->get();
  }
  ```

> [!NOTE]
> **Mengapa tidak butuh tabel counter terpisah?** — `sesi_latihan_soal` sudah menjadi *sumber kebenaran* (single source of truth) untuk penggunaan soal. Metode derivasi ini lebih andal karena tidak ada risiko desync antara counter dan data aktual.

---

## 📖 Fase 3 — Modul Belajar & Kuis
> **Durasi:** Minggu 3–4 (Hari 15–22)
> **Prasyarat:** Fase 1 selesai (tabel `pengguna` ada), Fase 2 **tidak** diperlukan

> [!IMPORTANT]
> **Koreksi dari `addendum_soal_sesi.md`:** Soal Kuis Modul adalah **domain terpisah** dari Bank Soal. Guru membuat soal langsung di kuis — **bukan** mengambil dari bank soal. Tabel `kuis_modul_soal` (junction ke bank soal) **dihapus** dan diganti dengan tabel `soal_kuis` + `opsi_soal_kuis` yang berdiri sendiri.

### 3.1 Migrasi Database

**Urutan:**
```
modul_belajar → konten_modul → kuis_modul → soal_kuis → opsi_soal_kuis → pengerjaan_kuis → jawaban_kuis
```

- [ ] `create_modul_belajar_table.php`
  - Kolom: `id_modul`, `mapel_id FK`, `topik_id FK NULL`, `dibuat_oleh_id FK`, `judul`, `deskripsi`, `urutan TINYINT`, `status ENUM('draft','aktif','arsip')`, timestamps, `deleted_at`
- [ ] `create_konten_modul_table.php`
  - Kolom: `id_konten_modul`, `modul_id FK`, `tipe_konten ENUM('teks','video','gambar','file')`, `urutan`, `konten LONGTEXT NULL`, `url_media VARCHAR(500) NULL`, timestamps
- [ ] `create_kuis_modul_table.php`
  - Kolom: `id_kuis`, `modul_id FK UNIQUE` (1 kuis per modul), `judul`, `nilai_minimum DECIMAL(5,2) DEFAULT 70.00`, timestamps
- [ ] **`create_soal_kuis_table.php`** ← BUKAN junction ke bank soal, melainkan tabel soal mandiri
  - Kolom: `id_soal_kuis`, `kuis_id FK→kuis_modul`, `dibuat_oleh_id FK→pengguna`, `jenis_soal ENUM('pilihan_ganda','benar_salah','pilihan_ganda_kompleks')`, `isi_soal LONGTEXT`, `foto_soal VARCHAR(500) NULL`, `pembahasan_text LONGTEXT NULL`, `pembahasan_foto VARCHAR(500) NULL`, `urutan TINYINT`, `created_at`, `updated_at`
  - Index: `idx_soal_kuis_urutan (kuis_id, urutan)`
- [ ] **`create_opsi_soal_kuis_table.php`** ← opsi jawaban khusus soal kuis, terpisah dari `opsi_jawaban`
  - Kolom: `id_opsi_soal_kuis`, `soal_kuis_id FK→soal_kuis`, `label CHAR(1)`, `teks_opsi TEXT`, `foto_opsi VARCHAR(500) NULL`, `is_benar BOOLEAN DEFAULT FALSE`, `urutan TINYINT`
  - Unique key: `uq_opsi_kuis_label (soal_kuis_id, label)`
- [ ] `create_pengerjaan_kuis_table.php`
  - Kolom: `id_pengerjaan_kuis`, `siswa_id FK`, `kuis_id FK`, `started_at`, `finished_at NULL`, `nilai DECIMAL(5,2) NULL`, `lulus BOOLEAN NULL`, `percobaan_ke TINYINT DEFAULT 1`, `created_at`
  - Index: `idx_pengerjaan_kuis_siswa (siswa_id, kuis_id)`
- [ ] `create_jawaban_kuis_table.php`
  - Kolom: `id_jawaban_kuis`, `pengerjaan_kuis_id FK`, **`soal_kuis_id FK→soal_kuis`** (bukan `soal_id`), **`opsi_soal_kuis_id FK→opsi_soal_kuis NULL`** (bukan `opsi_jawaban_id`), `is_benar BOOLEAN NULL`, `waktu_jawab`
  - Unique key: `uq_jawaban_kuis_soal (pengerjaan_kuis_id, soal_kuis_id)`

### 3.2 Models & Relationships

- [ ] `ModulBelajar` — `hasMany(KontenModul)`, `hasOne(KuisModul)`, `belongsTo(MataPelajaran)`, `belongsTo(Topik)`, `SoftDeletes`
- [ ] `KontenModul` — `belongsTo(ModulBelajar)`
- [ ] `KuisModul` — `belongsTo(ModulBelajar)`, `hasMany(SoalKuis)`, `hasMany(PengerjaanKuis)`
- [ ] **`SoalKuis`** — `belongsTo(KuisModul)`, `hasMany(OpsiSoalKuis)`, `belongsTo(Pengguna, 'dibuat_oleh_id')`
  - ⚠️ **Bukan** `belongsTo(Soal::class)` — domain terpisah
- [ ] **`OpsiSoalKuis`** — `belongsTo(SoalKuis, 'soal_kuis_id')`
- [ ] `PengerjaanKuis` — `belongsTo(Siswa)`, `belongsTo(KuisModul)`, `hasMany(JawabanKuis)`
- [ ] `JawabanKuis` — `belongsTo(PengerjaanKuis)`, **`belongsTo(SoalKuis, 'soal_kuis_id')`**, **`belongsTo(OpsiSoalKuis, 'opsi_soal_kuis_id')`**

### 3.3 API Modul

**Admin & Guru:**
- [ ] `GET /api/modul` — list modul (filter mapel, status)
- [ ] `POST /api/modul` — buat modul baru
- [ ] `PUT /api/modul/{id}` — edit modul
- [ ] `DELETE /api/modul/{id}` — soft delete
- [ ] `POST /api/modul/{id}/konten` — tambah konten ke modul
- [ ] `PUT /api/modul/{id}/konten/{kontenId}` — edit konten
- [ ] `DELETE /api/modul/{id}/konten/{kontenId}` — hapus konten
- [ ] `POST /api/modul/{id}/kuis` — buat kuis untuk modul (judul + nilai_minimum)

**API Soal Kuis (Guru buat soal di dalam kuis, bukan dari bank soal):**
- [ ] `GET /api/kuis/{kuisId}/soal` — list soal dalam kuis ini
- [ ] `POST /api/kuis/{kuisId}/soal` — buat soal baru di kuis
  ```json
  {
    "jenis_soal": "pilihan_ganda",
    "isi_soal": "Apakah ...",
    "foto_soal": "<file>",
    "opsi_soal": [
      { "label": "A", "teks_opsi": "...", "is_benar": false },
      { "label": "B", "teks_opsi": "...", "is_benar": true },
      { "label": "C", "teks_opsi": "..." },
      { "label": "D", "teks_opsi": "..." }
    ]
  }
  ```
- [ ] `PUT /api/kuis/{kuisId}/soal/{soalKuisId}` — edit soal kuis
- [ ] `DELETE /api/kuis/{kuisId}/soal/{soalKuisId}` — hapus soal kuis

**Siswa:**
- [ ] `GET /api/siswa/modul` — list modul aktif yang tersedia
- [ ] `GET /api/siswa/modul/{id}` — detail modul + konten + status kuis (sudah dikerjakan?)
- [ ] `GET /api/siswa/modul/{id}/kuis` — soal kuis modul (tanpa kunci jawaban, dari `soal_kuis`)

### 3.4 Service: Kuis Engine

- [ ] `app/Services/KuisService.php`
  ```php
  // Mulai sesi kuis baru (atau lanjutkan yang berlangsung)
  public function mulaiKuis(Siswa $siswa, KuisModul $kuis): PengerjaanKuis;

  // Submit semua jawaban + hitung nilai (FK ke soal_kuis & opsi_soal_kuis)
  public function submitKuis(PengerjaanKuis $pengerjaan, array $jawaban): PengerjaanKuis;
  // $jawaban = [['soal_kuis_id' => 1, 'opsi_soal_kuis_id' => 3], ...]
  // Perhatikan: bukan soal_id / opsi_jawaban_id
  ```

- [ ] `POST /api/siswa/kuis/{kuisId}/mulai` — mulai kuis, return `id_pengerjaan_kuis` + soal dari `soal_kuis`
- [ ] `POST /api/siswa/kuis/{pengerjaan_kuis_id}/submit` — submit semua jawaban
  ```json
  { "jawaban": [{"soal_kuis_id": 1, "opsi_soal_kuis_id": 5}, ...] }
  ```
- [ ] `GET /api/siswa/kuis/{pengerjaan_kuis_id}/hasil` — nilai, lulus/tidak, pembahasan tiap soal

### ✅ Kriteria Selesai Fase 3
- Modul bisa dibuat dengan beberapa konten
- Guru bisa membuat soal kuis **langsung di dalam kuis** (bukan dari bank soal)
- `soal_kuis` dan `opsi_soal_kuis` terpisah secara fisik dari `soal` dan `opsi_jawaban`
- Siswa bisa mengerjakan kuis dan mendapat nilai + status lulus
- `jawaban_kuis` FK ke `soal_kuis` — bukan ke `soal` bank soal
- Hasil kuis tersimpan per pengerjaan (`percobaan_ke` bertambah jika mengulang)

---

## 🏋️ Fase 4 — Latihan Mandiri & Simulasi TKA
> **Durasi:** Minggu 4–5 (Hari 22–29)
> **Prasyarat:** Fase 2 selesai (tabel `soal`, `opsi_jawaban`, `sesi_latihan_soal` ada)

> [!NOTE]
> **Dari `addendum_soal_sesi.md`:** Simulasi TKA dan Latihan Mandiri **berbagi tabel yang sama** (`sesi_latihan`, `sesi_latihan_soal`, `pengerjaan_latihan`, `jawaban_latihan`). Perbedaan hanya pada kolom `tipe` dan ada/tidaknya pengecekan batas penggunaan soal. Ini adalah trade-off yang **disengaja** — tidak perlu tabel terpisah.

### 4.1 Migrasi Database

**Urutan:**
```
sesi_latihan → sesi_latihan_soal → pengerjaan_latihan → jawaban_latihan
```

- [ ] `create_sesi_latihan_table.php`
  - Kolom: `id_sesi_latihan`, `dibuat_oleh_id FK`, `mapel_id FK NULL`, `topik_id FK NULL`, `judul`, `tipe ENUM('simulasi_tka','latihan_mandiri')`, `durasi_menit SMALLINT NULL`, `acak_soal BOOLEAN DEFAULT FALSE`, `status ENUM('draft','aktif','nonaktif') DEFAULT 'draft'`, timestamps
  - Index: **`idx_sesi_tipe_status (tipe, status)`** ← kritis untuk query batas penggunaan simulasi
- [ ] `create_sesi_latihan_soal_table.php` (junction)
  - Kolom: `id_soal_latihan`, `sesi_latihan_id FK`, `soal_id FK→soal (bank soal)`, `urutan TINYINT`, `bobot_nilai DECIMAL(5,2) DEFAULT 1.00`
  - Unique key: `uq_sesi_soal (sesi_latihan_id, soal_id)`
  - Index: **`idx_soal_per_sesi (soal_id, sesi_latihan_id)`** ← kritis untuk menghitung `jumlah_digunakan`
- [ ] `create_pengerjaan_latihan_table.php`
  - Kolom: `id_pengerjaan`, `siswa_id FK`, `sesi_latihan_id FK`, `started_at`, `finished_at NULL`, **`durasi_aktual SMALLINT UNSIGNED NULL`** (dalam detik), `nilai DECIMAL(5,2) NULL`, `jumlah_benar SMALLINT NULL`, `jumlah_salah SMALLINT NULL`, `status ENUM('berlangsung','selesai','dibatalkan') DEFAULT 'berlangsung'`, `created_at`
  - Index: `idx_pengerjaan_siswa (siswa_id)`, `idx_pengerjaan_sesi (sesi_latihan_id)`, **`idx_pengerjaan_siswa_sesi (siswa_id, sesi_latihan_id)`**
- [ ] `create_jawaban_latihan_table.php`
  - Kolom: `id_jawaban_latihan`, `pengerjaan_id FK`, `soal_id FK→soal`, `opsi_jawaban_id FK→opsi_jawaban NULL`, `is_benar BOOLEAN NULL`, `waktu_jawab`
  - Unique key: **`uq_jawaban_per_soal (pengerjaan_id, soal_id)`** ← 1 jawaban per soal per pengerjaan
  - Index: `idx_jawaban_pengerjaan (pengerjaan_id)`

### 4.2 Models & Relationships

- [ ] `SesiLatihan`
  - `belongsToMany(Soal::class, 'sesi_latihan_soal', 'sesi_latihan_id', 'soal_id')`
  - `hasMany(PengerjaanLatihan)`
  - Scope: `scopeSimulasi($query)` → `where('tipe', 'simulasi_tka')`
  - Scope: `scopeLatihanMandiri($query)` → `where('tipe', 'latihan_mandiri')`
- [ ] `SesiLatihanSoal` — model pivot dengan kolom `urutan` dan `bobot_nilai`
- [ ] `PengerjaanLatihan` — `belongsTo(Siswa)`, `belongsTo(SesiLatihan)`, `hasMany(JawabanLatihan)`
- [ ] `JawabanLatihan` — `belongsTo(PengerjaanLatihan)`, `belongsTo(Soal)`, `belongsTo(OpsiJawaban)`

### 4.3 API Sesi Latihan

**Admin (Simulasi TKA):**
- [ ] `GET /api/admin/simulasi` — list semua simulasi TKA
- [ ] `GET /api/admin/simulasi/soal-tersedia?mapel_id={id}` — list soal yang **masih tersedia** (belum capai batas)
- [ ] `POST /api/admin/simulasi` — buat simulasi baru + assign soal (validasi batas penggunaan!)
  ```json
  {
    "judul": "Simulasi TKA Sesi 1",
    "tipe": "simulasi_tka",
    "durasi_menit": 90,
    "acak_soal": true,
    "soal_ids": [1, 2, 3, 5, 8]
  }
  ```
  > Backend wajib memanggil `SoalService::getSoalTersediaUntukSimulasi()` untuk validasi sebelum insert ke `sesi_latihan_soal`.
- [ ] `PUT /api/admin/simulasi/{id}` — edit simulasi
- [ ] `DELETE /api/admin/simulasi/{id}` — nonaktifkan

**Guru (Latihan Mandiri):**
- [ ] `GET /api/guru/latihan` — list latihan mandiri buatan guru ini
- [ ] `POST /api/guru/latihan` — buat latihan mandiri (tipe = `latihan_mandiri`, tanpa cek batas penggunaan)
- [ ] `GET /api/guru/latihan/{id}/laporan` — laporan pengerjaan siswa per sesi

**Siswa:**
- [ ] `GET /api/siswa/latihan` — list latihan + simulasi yang tersedia (status aktif)
- [ ] `GET /api/siswa/latihan/{id}` — detail sesi (judul, mapel, topik, jumlah soal, durasi)
- [ ] `POST /api/siswa/latihan/{id}/mulai` — mulai latihan, return `id_pengerjaan` + list soal (tanpa kunci)
- [ ] `POST /api/siswa/latihan/{pengerjaan_id}/jawab` — submit satu jawaban (real-time simpan)
  ```json
  { "soal_id": 5, "opsi_jawaban_id": 12 }
  ```
- [ ] `POST /api/siswa/latihan/{pengerjaan_id}/selesai` — tutup sesi, hitung nilai final + `durasi_aktual`
- [ ] `GET /api/siswa/latihan/{pengerjaan_id}/hasil` — nilai, per-soal: benar/salah + pembahasan

### 4.4 Service: Scoring Engine

- [ ] `app/Services/ScoringService.php`
  ```php
  // Hitung nilai setelah selesai
  public function hitungNilai(PengerjaanLatihan $pengerjaan): array;
  // Returns: ['nilai' => 85.00, 'jumlah_benar' => 17, 'jumlah_salah' => 3]

  // Evaluasi is_benar per jawaban saat submit
  public function evaluasiJawaban(JawabanLatihan $jawaban): bool;

  // Hitung dan simpan durasi_aktual saat selesai
  public function hitungDurasiAktual(PengerjaanLatihan $pengerjaan): int; // dalam detik
  ```

### 4.5 Logika Acak Soal & Batas Penggunaan

- [ ] Jika `acak_soal = true`: gunakan `inRandomOrder()` saat mengambil soal dari `sesi_latihan_soal`
- [ ] Urutan soal yang sudah diacak **tidak** disimpan ke DB
- [ ] Saat Admin membuat Simulasi TKA baru, backend **wajib** memanggil `SoalService::getSoalTersediaUntukSimulasi()` dan menolak soal yang sudah melebihi `batas_penggunaan_simulasi`
- [ ] Latihan Mandiri **tidak** ada pengecekan batas — soal bebas dipakai berulang

### 4.6 Pertanyaan Bisnis yang Perlu Dikonfirmasi

> [!IMPORTANT]
> **Pertanyaan 1 — Pengulangan Simulasi TKA oleh Siswa:**
> Apakah satu siswa bisa mengerjakan simulasi yang sama lebih dari satu kali?
> - Jika **tidak**: tambahkan `UNIQUE KEY uq_siswa_sesi (siswa_id, sesi_latihan_id)` di `pengerjaan_latihan`
> - Jika **ya** (remediasi): pertahankan tanpa unique constraint, tambahkan kolom `percobaan_ke` seperti di `pengerjaan_kuis`

> [!IMPORTANT]
> **Pertanyaan 2 — Scope Batas Penggunaan Soal Simulasi:**
> Apakah batas penggunaan soal berlaku secara **global** (sepanjang masa) atau **per tahun ajaran**?
> - Global: implementasi Fase 2 (Opsi C) sudah cukup
> - Per tahun ajaran: tambahkan filter `sesi_latihan.tahun_ajaran` saat menghitung penggunaan (perlu tambah kolom `tahun_ajaran` di `sesi_latihan`)

> [!IMPORTANT]
> **Pertanyaan 3 — Siapa yang bisa ubah `batas_penggunaan_simulasi`:**
> - Hanya Admin? Atau juga Guru? → Mempengaruhi Policy/Gate di Laravel

### ✅ Kriteria Selesai Fase 4
- Simulasi TKA dibuat dengan soal dari bank soal + validasi batas penggunaan berjalan
- Latihan mandiri dibuat tanpa batas penggunaan soal
- Siswa bisa mulai latihan, jawab per soal, dan selesaikan
- `durasi_aktual` tersimpan setelah selesai
- Nilai dihitung otomatis setelah selesai
- Riwayat latihan per siswa bisa ditampilkan

---

## 📋 Fase 5 — Survei
> **Durasi:** Minggu 5–6 (Hari 29–36)
> **Prasyarat:** Fase 1 selesai (tabel `pengguna` ada)

### 5.1 Migrasi Database

**Urutan:**
```
survei → pertanyaan_survei → opsi_survei → pengisian_survei → jawaban_survei
```

- [ ] `create_survei_table.php`
  - Kolom: `id_survei`, `dibuat_oleh_id FK`, `judul`, `deskripsi`, `jenis_survei ENUM('survei_karakter','survei_lingkungan_belajar')`, `mulai_at TIMESTAMP NULL`, `berakhir_at TIMESTAMP NULL`, `status ENUM('draft','aktif','ditutup')`, timestamps
- [ ] `create_pertanyaan_survei_table.php`
  - Kolom: `id_pertanyaan`, `survei_id FK`, `isi_pertanyaan TEXT`, `tipe_jawaban ENUM('pilihan_ganda','skala_likert','ya_tidak')`, `urutan`, `is_wajib BOOLEAN`, `created_at`
- [ ] `create_opsi_survei_table.php`
  - Kolom: `id_opsi_survei`, `pertanyaan_id FK`, `teks_opsi`, `nilai_opsi TINYINT NULL`, `urutan`
- [ ] `create_pengisian_survei_table.php`
  - Kolom: `id_pengisian`, `survei_id FK`, `pengguna_id FK`, `started_at`, `finished_at NULL`, `status ENUM`
  - Unique key: `(survei_id, pengguna_id)` — 1 user hanya 1x isi
- [ ] `create_jawaban_survei_table.php`
  - Kolom: `id_jawaban_survei`, `pengisian_id FK`, `pertanyaan_id FK`, `opsi_survei_id FK NULL`, `jawaban_teks TEXT NULL`, `created_at`

### 5.2 Models

- [ ] `Survei` — `hasMany(PertanyaanSurvei)`, `hasMany(PengisianSurvei)`, `belongsTo(Pengguna, 'dibuat_oleh_id')`
- [ ] `PertanyaanSurvei` — `belongsTo(Survei)`, `hasMany(OpsiSurvei)`, `hasMany(JawabanSurvei)`
- [ ] `OpsiSurvei` — `belongsTo(PertanyaanSurvei)`
- [ ] `PengisianSurvei` — `belongsTo(Survei)`, `belongsTo(Pengguna)`, `hasMany(JawabanSurvei)`
- [ ] `JawabanSurvei` — `belongsTo(PengisianSurvei)`, `belongsTo(PertanyaanSurvei)`

### 5.3 API Survei

**Admin:**
- [ ] `GET /api/admin/survei` — list survei
- [ ] `POST /api/admin/survei` — buat survei + pertanyaan + opsi
- [ ] `PUT /api/admin/survei/{id}` — edit survei
- [ ] `PUT /api/admin/survei/{id}/status` — ubah status (aktifkan/tutup)
- [ ] `GET /api/admin/survei/{id}/rekap` — rekap hasil survei
  ```json
  {
    "total_pengisian": 28,
    "pertanyaan": [
      {
        "id_pertanyaan": 1,
        "isi_pertanyaan": "...",
        "distribusi": { "A": 10, "B": 12, "C": 6 }
      }
    ]
  }
  ```

**Guru:**
- [ ] `GET /api/guru/survei` — list survei yang aktif + sudah diisi oleh guru ini

**Siswa:**
- [ ] `GET /api/siswa/survei` — list survei aktif yang belum diisi
- [ ] `GET /api/siswa/survei/{id}` — detail survei + pertanyaan + opsi
- [ ] `POST /api/siswa/survei/{id}/mulai` — buat `pengisian_survei`, return `id_pengisian`
- [ ] `POST /api/siswa/survei/{pengisian_id}/submit` — simpan semua jawaban + tutup pengisian
  ```json
  { "jawaban": [{"pertanyaan_id": 1, "opsi_survei_id": 3}, {"pertanyaan_id": 2, "jawaban_teks": "..."}] }
  ```

### ✅ Kriteria Selesai Fase 5
- Survei bisa dibuat dengan pertanyaan pilihan ganda, skala likert, dan ya/tidak
- Setiap pengguna hanya bisa mengisi satu kali per survei
- Rekap hasil survei menampilkan distribusi jawaban per pertanyaan

---

## 🔔 Fase 6 — Notifikasi & Pesan
> **Durasi:** Minggu 6 (Hari 36–40)
> **Prasyarat:** Fase 1 selesai

### 6.1 Migrasi Database

**Urutan:**
```
pesan → pesan_penerima
```

- [ ] `create_pesan_table.php`
  - Kolom: `id_pesan`, `dikirim_oleh_id FK`, `judul`, `isi TEXT`, `tipe ENUM('informasi','peringatan','darurat','pengumuman')`, `target_role ENUM('semua','admin','guru','siswa','spesifik')`, `created_at`
- [ ] `create_pesan_penerima_table.php`
  - Kolom: `id_penerima`, `pesan_id FK`, `pengguna_id FK`, `dibaca_at TIMESTAMP NULL`, `created_at`
  - Unique key: `(pesan_id, pengguna_id)`
  - Index: `idx_penerima_belum_baca (pengguna_id, dibaca_at)`

### 6.2 Models

- [ ] `Pesan` — `belongsTo(Pengguna, 'dikirim_oleh_id')`, `hasMany(PesanPenerima)`
- [ ] `PesanPenerima` — `belongsTo(Pesan)`, `belongsTo(Pengguna)`

### 6.3 Service: Broadcast Pesan

- [ ] `app/Services/BroadcastPesanService.php`
  ```php
  // Fanout ke semua user berdasarkan target_role
  public function broadcast(Pesan $pesan): void;
  // Jika target_role = 'semua': insert ke pesan_penerima untuk semua pengguna aktif
  // Jika target_role = 'guru': insert hanya untuk pengguna dengan role guru
  // Jika target_role = 'siswa': insert hanya untuk pengguna dengan role siswa
  // Jika target_role = 'spesifik': gunakan array pengguna_ids
  ```
- [ ] Gunakan **Laravel Queue** (`php artisan queue:work`) untuk fanout agar tidak memblokir request

### 6.4 API Pesan

**Admin & Guru:**
- [ ] `GET /api/notifikasi/terkirim` — list pesan yang dikirim oleh user ini
- [ ] `POST /api/notifikasi` — kirim pesan baru
  ```json
  {
    "judul": "Pengumuman Ujian",
    "isi": "...",
    "tipe": "pengumuman",
    "target_role": "siswa"
  }
  ```
- [ ] `DELETE /api/notifikasi/{id}` — hapus pesan (cascade ke pesan_penerima)

**Semua Role:**
- [ ] `GET /api/notifikasi` — list notifikasi saya (belum dibaca + sudah dibaca, paginate)
- [ ] `GET /api/notifikasi/belum-dibaca/count` — hitung badge notifikasi
- [ ] `PUT /api/notifikasi/{id}/baca` — tandai 1 notifikasi dibaca (`dibaca_at = now()`)
- [ ] `PUT /api/notifikasi/baca-semua` — tandai semua notifikasi saya dibaca

### ✅ Kriteria Selesai Fase 6
- Admin/Guru bisa kirim pesan ke target role tertentu
- Fanout ke `pesan_penerima` berjalan via queue (tidak blocking)
- Badge count notifikasi akurat
- Mark as read berfungsi

---

## 📊 Fase 7 — Log Aktivitas & Dashboard Analitik
> **Durasi:** Minggu 7 (Hari 40–47)
> **Prasyarat:** Semua fase sebelumnya selesai

### 7.1 Migrasi Database

- [ ] `create_log_aktivitas_table.php`
  - Kolom: `id_log`, `pengguna_id FK`, `aksi VARCHAR(100)`, `modul VARCHAR(50)`, `tabel_terkait VARCHAR(50) NULL`, `id_terkait BIGINT NULL`, `detail JSON NULL`, `ip_address VARCHAR(45) NULL`, `user_agent VARCHAR(500) NULL`, `created_at`
  - Index: `idx_log_pengguna (pengguna_id, aksi)`, `idx_log_created_at (created_at)`

### 7.2 Model

- [ ] `LogAktivitas` — `belongsTo(Pengguna)`, **tidak ada** `updated_at` (append-only log)

### 7.3 Eloquent Observer: Auto-Logging

- [ ] `app/Observers/AuthObserver.php` — log `login` dan `logout`
- [ ] `app/Observers/PengerjaanObserver.php` — log `mulai_latihan`, `selesai_latihan`, `mulai_kuis`, `selesai_kuis`
- [ ] `app/Observers/SurveiObserver.php` — log `isi_survei`
- [ ] `app/Services/ActivityLogger.php` — helper service
  ```php
  public static function log(string $aksi, string $modul, ?string $tabel = null, ?int $idTerkait = null, array $detail = []): void;
  ```
- [ ] Register observer di `AppServiceProvider::boot()`

**Contoh aksi yang di-log:**

| Aksi                | Modul      | Tabel Terkait       |
|---------------------|------------|---------------------|
| `login`             | `auth`     | `pengguna`          |
| `logout`            | `auth`     | `pengguna`          |
| `buka_modul`        | `modul`    | `modul_belajar`     |
| `mulai_latihan`     | `latihan`  | `pengerjaan_latihan`|
| `selesai_latihan`   | `latihan`  | `pengerjaan_latihan`|
| `submit_kuis`       | `kuis`     | `pengerjaan_kuis`   |
| `isi_survei`        | `survei`   | `pengisian_survei`  |
| `buat_soal`         | `bank_soal`| `soal`              |

### 7.4 API Dashboard

**Dashboard Guru:**
- [ ] `GET /api/guru/dashboard` — statistik kelas
  ```json
  {
    "total_siswa": 30,
    "rata_rata_nilai_latihan": 78.5,
    "latihan_per_mapel": [ { "mapel": "Matematika", "rata_nilai": 80.2, "jumlah_pengerjaan": 45 } ],
    "siswa_belum_latihan_minggu_ini": 5
  }
  ```
- [ ] `GET /api/guru/siswa/{id}/progress` — progress individu siswa (semua latihan, kuis, survei)

**Dashboard Admin:**
- [ ] `GET /api/admin/dashboard` — statistik global
  ```json
  {
    "total_pengguna": { "siswa": 90, "guru": 3 },
    "total_soal": 350,
    "total_modul": 15,
    "total_simulasi": 8,
    "aktivitas_7_hari": [...]
  }
  ```
- [ ] `GET /api/admin/log-aktivitas` — list log (filter aksi, modul, pengguna, rentang tanggal)
- [ ] `GET /api/admin/laporan/nilai` — laporan nilai semua siswa (filter kelas, mapel, rentang tanggal)

### ✅ Kriteria Selesai Fase 7
- Setiap aksi penting otomatis ter-log via Observer
- Dashboard guru menampilkan progress kelas secara akurat
- Log aktivitas bisa difilter di panel admin

---

## 🧪 Fase 8 — Testing & Optimisasi
> **Durasi:** Minggu 8 (Hari 47–54)
> **Prasyarat:** Semua fase selesai

### 8.1 Unit Testing

- [ ] `tests/Unit/ScoringServiceTest.php`
  - Test hitung nilai dengan semua benar: nilai = 100
  - Test hitung nilai dengan 50% benar: nilai = 50
  - Test hitung nilai dengan semua salah: nilai = 0
  - Test `hitungDurasiAktual()`: started_at 10 menit lalu → durasi = 600 detik

- [ ] **`tests/Unit/SoalServiceTest.php`** ← baru dari addendum
  - Soal dengan `batas_penggunaan_simulasi = 1` yang sudah dipakai 1x → tidak muncul di hasil
  - Soal dengan `batas_penggunaan_simulasi = 2` yang baru dipakai 1x → masih muncul
  - Soal dengan status `arsip` → tidak muncul meski belum capai batas
  - Soal di sesi `nonaktif` tidak dihitung sebagai penggunaan

- [ ] `tests/Unit/BroadcastPesanServiceTest.php`
  - Test fanout ke `guru` hanya insert untuk role guru
  - Test fanout ke `semua` insert untuk semua pengguna aktif

### 8.2 Feature Testing

- [ ] `tests/Feature/AuthTest.php`
  - Login berhasil → dapat token ✅
  - Login gagal (password salah) → `401` ✅
  - Akses route guru dengan token siswa → `403` ✅

- [ ] `tests/Feature/LatihanTest.php`
  - Mulai latihan → `pengerjaan_latihan` terbuat ✅
  - Submit jawaban → `jawaban_latihan` tersimpan ✅
  - Selesaikan latihan → nilai + `durasi_aktual` terhitung dan tersimpan ✅
  - Tidak bisa submit setelah selesai → `422` ✅

- [ ] **`tests/Feature/SimulasiTest.php`** ← baru dari addendum
  - Buat simulasi dengan soal yang masih tersedia → berhasil ✅
  - Buat simulasi dengan soal yang sudah capai batas → `422 Soal tidak tersedia` ✅
  - Endpoint `GET /soal/tersedia-simulasi` hanya mengembalikan soal yang belum capai batas ✅

- [ ] `tests/Feature/KuisTest.php`
  - Submit kuis dengan `soal_kuis_id` (bukan `soal_id`) → nilai + status lulus/tidak tersimpan ✅
  - `jawaban_kuis.soal_kuis_id` FK ke `soal_kuis`, bukan ke `soal` ✅
  - Pengerjaan ke-2 → `percobaan_ke` bertambah ✅
  - Tidak bisa gunakan `soal_id` dari bank soal di endpoint kuis → `422` ✅

- [ ] `tests/Feature/SurveiTest.php`
  - Isi survei sekali → sukses ✅
  - Isi survei dua kali oleh user sama → `422 Duplicate` ✅

### 8.3 Database Optimization

- [ ] Jalankan `EXPLAIN` pada query-query berat:
  - Query list soal dengan filter mapel + status
  - Query riwayat latihan siswa
  - Query dashboard guru (aggregate query)
- [ ] Tambah index yang missing berdasarkan hasil `EXPLAIN`
- [ ] Aktifkan **Query Caching dengan Redis** untuk endpoint berat (TTL: 5 menit):
  - `GET /api/soal` (list bank soal — jarang berubah)
  - `GET /api/mata-pelajaran` (data master — hampir tidak berubah)
  - `GET /api/admin/dashboard` (statistik — update setiap 5 menit cukup)
  ```php
  // Contoh cache implementation:
  $soal = Cache::remember('soal.all', 300, fn() => Soal::with('opsiJawaban')->aktif()->get());
  ```

### 8.4 API Response Standarisasi

- [ ] Buat `app/Http/Resources/` untuk semua resource response:
  - `SoalResource`, `ModulResource`, `SesiLatihanResource`, `SurveiResource`
- [ ] Format response konsisten:
  ```json
  {
    "status": "success",
    "message": "Data berhasil diambil",
    "data": { ... },
    "meta": { "page": 1, "per_page": 15, "total": 100 }
  }
  ```
- [ ] Buat `app/Exceptions/Handler.php` untuk handle error secara konsisten:
  - `ValidationException` → `422` dengan pesan field-level
  - `AuthenticationException` → `401`
  - `AuthorizationException` → `403`
  - `ModelNotFoundException` → `404`

### 8.5 Dokumentasi API

- [ ] Install **Laravel Scribe** atau gunakan **Postman Collection**
  ```bash
  composer require knuckleswtf/scribe --dev
  php artisan scribe:generate
  ```
- [ ] Pastikan semua endpoint terdokumentasi dengan contoh request/response
- [ ] Export Postman Collection dan simpan di repo

### ✅ Kriteria Selesai Fase 8
- Semua unit test dan feature test hijau
- Tidak ada query tanpa index yang terlibat di halaman utama
- Cache Redis aktif untuk endpoint berat
- Dokumentasi API tersedia

---

## 📋 Master Checklist Pre-Launch

### Database
- [ ] Semua **29 tabel** berhasil di-migrate tanpa error
- [ ] Semua FK constraint valid (`SHOW ENGINE INNODB STATUS` tidak ada error 150)
- [ ] Semua index composite terbuat (termasuk `idx_sesi_tipe_status`, `idx_soal_per_sesi`, `idx_soal_simulasi_config`)
- [ ] Seeder berjalan dari fresh state (`php artisan migrate:fresh --seed`)
- [ ] Soft delete berfungsi pada tabel: `pengguna`, `soal`, `modul_belajar`, `survei`
- [ ] Verifikasi **pemisahan domain soal**: `soal` ≠ `soal_kuis` — tidak ada cross-reference antar domain

### Backend
- [ ] Login multi-role (admin, guru, siswa) berfungsi
- [ ] Middleware role menolak akses lintas role
- [ ] CRUD soal bank + upload foto berfungsi
- [ ] `SoalService::getSoalTersediaUntukSimulasi()` berfungsi dengan benar
- [ ] Batas penggunaan soal simulasi divalidasi saat Admin buat simulasi baru
- [ ] Guru bisa buat soal kuis **di dalam kuis** — tidak bisa dari bank soal
- [ ] Engine latihan: mulai → jawab per soal → selesai → nilai + durasi_aktual
- [ ] Engine kuis: mulai → submit (soal_kuis_id) → hasil + status lulus
- [ ] Survei: 1 pengguna 1 pengisian per survei
- [ ] Notifikasi: broadcast per role + mark as read
- [ ] Log aktivitas: auto-log via Observer
- [ ] Queue worker berjalan untuk fanout pesan
- [ ] CORS dikonfigurasi untuk domain frontend
- [ ] Pertanyaan bisnis (Fase 4.6) sudah dikonfirmasi dan diimplementasikan

### Kualitas
- [ ] Semua test hijau (`php artisan test`)
- [ ] `SoalServiceTest` dan `SimulasiTest` hijau khususnya
- [ ] Tidak ada `dd()`, `var_dump()`, atau debug code tertinggal
- [ ] `.env` tidak di-commit ke git
- [ ] API documentation tersedia

---

## 🔗 Urutan Dependency Migrasi (Referensi Cepat)

> [!NOTE]
> Dua domain soal ditandai dengan blok terpisah. `soal` (Bank Soal) dan `soal_kuis` (Kuis Modul) **tidak boleh saling mereferensikan**.

```
pengguna
├── guru (pengguna_id → pengguna)
│   └── kelas (wali_kelas_id → guru)
│       └── siswa (kelas_id → kelas, pengguna_id → pengguna)
│
├── mata_pelajaran
│   └── topik (mapel_id → mata_pelajaran)
│
│   ┌─── DOMAIN BANK SOAL (Simulasi TKA + Latihan Mandiri) ───────────────────┐
│   │   soal (mapel_id, topik_id, dibuat_oleh_id, batas_penggunaan_simulasi)   │
│   │   └── opsi_jawaban (soal_id → soal)                                       │
│   │                                                                            │
│   │   sesi_latihan (dibuat_oleh_id → pengguna, tipe: sim | lat)              │
│   │   ├── sesi_latihan_soal [junction: sesi_latihan × soal]                  │
│   │   │   ← tabel ini juga dipakai untuk hitung batas penggunaan simulasi    │
│   │   └── pengerjaan_latihan (siswa_id, sesi_latihan_id, durasi_aktual)      │
│   │       └── jawaban_latihan (pengerjaan_id, soal_id, opsi_jawaban_id)      │
│   └─────────────────────────────────────────────────────────────────────────-┘
│
│   ┌─── DOMAIN KUIS MODUL (terpisah, dibuat guru per modul) ─────────────────┐
│   │   modul_belajar (mapel_id, topik_id, dibuat_oleh_id)                    │
│   │   ├── konten_modul (modul_id → modul_belajar)                            │
│   │   └── kuis_modul (modul_id → modul_belajar)                              │
│   │       ├── soal_kuis (kuis_id → kuis_modul, dibuat_oleh_id)              │
│   │       │   └── opsi_soal_kuis (soal_kuis_id → soal_kuis)                 │
│   │       └── pengerjaan_kuis (siswa_id, kuis_id)                            │
│   │           └── jawaban_kuis (pengerjaan_kuis_id,                          │
│   │                             soal_kuis_id → soal_kuis,                   │
│   │                             opsi_soal_kuis_id → opsi_soal_kuis)         │
│   └─────────────────────────────────────────────────────────────────────────-┘
│
├── survei (dibuat_oleh_id → pengguna)
│   ├── pertanyaan_survei (survei_id → survei)
│   │   └── opsi_survei (pertanyaan_id → pertanyaan_survei)
│   └── pengisian_survei (survei_id, pengguna_id)
│       └── jawaban_survei (pengisian_id, pertanyaan_id, opsi_survei_id)
│
├── pesan (dikirim_oleh_id → pengguna)
│   └── pesan_penerima (pesan_id, pengguna_id)
│
└── log_aktivitas (pengguna_id → pengguna)
```

---

## 📑 Referensi Dokumen

| Dokumen | Scope | Status |
|---------|-------|--------|
| `analisis_database_tka.md` | Analisis ERD awal, identifikasi masalah | Referensi historis |
| `revisi_database_tka.md` | DDL final dengan konvensi FK konsisten | **Dasar implementasi** |
| `addendum_soal_sesi.md` | Koreksi domain soal kuis, batas penggunaan simulasi | **Wajib dibaca** — mengkoreksi Fase 3 & 4 |

> [!CAUTION]
> Bagian dari `revisi_database_tka.md` yang dikoreksi oleh addendum:
> - ❌ Tabel `kuis_modul_soal` (junction ke bank soal) → diganti `soal_kuis` + `opsi_soal_kuis`
> - ❌ `jawaban_kuis` FK ke `soal` → harus FK ke `soal_kuis`
> - ➕ Kolom `batas_penggunaan_simulasi` di tabel `soal` (ditambahkan)
> - ➕ Index `idx_sesi_tipe_status` dan `idx_soal_per_sesi` (ditambahkan)

---

*Dokumen ini adalah rundown eksekusi teknis yang harus diikuti secara berurutan. Setiap fase memiliki kriteria selesai yang harus dipenuhi sebelum melanjutkan ke fase berikutnya.*
