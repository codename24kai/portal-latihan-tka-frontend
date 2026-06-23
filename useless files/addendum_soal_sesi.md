# Addendum Analisis Database — Struktur Soal & Sesi Pengerjaan

> **Dokumen:** Addendum dari `revisi_database_tka.md`
> **Tanggal:** 2026-06-09
> **Konteks:** Klarifikasi kebutuhan bisnis 3 jenis sesi pengerjaan
> **Prinsip:** Kebutuhan bisnis tidak diubah kecuali ada alasan teknis sangat kuat

---

## Koreksi Penting terhadap Rekomendasi Sebelumnya

> [!CAUTION]
> Rekomendasi di `analisis_database_tka.md` dan `revisi_database_tka.md` — yang menjadikan `soal` sebagai **single source of truth untuk semua konteks** — adalah **tidak tepat** setelah mempertimbangkan kebutuhan bisnis berikut:
>
> **Soal Kuis Modul secara bisnis adalah entitas yang berbeda dari Bank Soal.** Keduanya tidak boleh saling digunakan, bukan karena keterbatasan teknis, tapi karena memang demikian aturan bisnisnya. Menyatukan keduanya dalam satu tabel `soal` justru akan menyulitkan enforcement rule bisnis tersebut.

---

## Pemetaan Domain Soal

* [ ] Berdasarkan kebutuhan bisnis, terdapat **dua domain soal yang terpisah**:

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOMAIN SOAL                              │
├──────────────────────────────┬──────────────────────────────────┤
│       BANK SOAL              │         SOAL KUIS MODUL          │
│  (soal + opsi_jawaban)       │    (soal_kuis + opsi_soal_kuis)  │
├──────────────────────────────┼──────────────────────────────────┤
│ ✅ Simulasi TKA              │ ❌ Tidak bisa di Simulasi TKA    │
│ ✅ Latihan Mandiri           │ ❌ Tidak bisa di Latihan Mandiri  │
│ ❌ Tidak bisa di Kuis Modul  │ ✅ Kuis Modul saja               │
├──────────────────────────────┼──────────────────────────────────┤
│ Dibuat oleh: Admin/Guru      │ Dibuat oleh: Guru (per modul)    │
│ Batas penggunaan simulasi:   │ Batas penggunaan: tidak ada      │
│   ada (1–2x per soal)        │   (hanya digunakan 1 kuis)       │
│ Batas latihan mandiri:       │                                  │
│   tidak ada                  │                                  │
└──────────────────────────────┴──────────────────────────────────┘
```

**Alasan teknis mengapa dua domain ini harus dipisah:**

1. **Rule bisnis yang berlawanan** — Bank Soal memiliki `batas_penggunaan_simulasi`, Soal Kuis tidak. Menyatukan keduanya berarti kolom ini NULL untuk semua soal kuis, yang membingungkan dan rawan bug di aplikasi layer.
2. **Konteks relasi yang berbeda** — Bank Soal berelasi ke `sesi_latihan` (template latihan/simulasi), sedangkan Soal Kuis berelasi langsung ke `kuis_modul` (terikat ke modul tertentu).
3. **Kepemilikan dan lifecycle yang berbeda** — Bank Soal bersifat global dan reusable, Soal Kuis bersifat lokal dan melekat ke modul spesifik.
4. **Enforcement di DB level** — Dengan tabel terpisah, tidak mungkin secara tidak sengaja menggunakan soal kuis di simulasi TKA. Dengan satu tabel, harus bergantung pada aplikasi layer untuk mencegah ini — yang lebih rawan error.

---

## Analisis per Jenis Sesi Pengerjaan

### 1. SIMULASI TKA

**Karakteristik:**

- Soal dari Bank Soal (`soal`)
- Setiap soal memiliki **batas penggunaan** di Simulasi TKA (1–2x, tergantung kebijakan per soal)
- Tujuan: menjaga variasi, mencegah siswa menghafal soal

**Kebutuhan database:**

- Tabel template sesi: `sesi_latihan` (dengan `tipe = 'simulasi_tka'`)
- Soal dalam sesi: `sesi_latihan_soal` (junction: `sesi_latihan` ↔ `soal`)
- Tracking penggunaan: derivasi dari COUNT di `sesi_latihan_soal` JOIN `sesi_latihan`
- Konfigurasi batas: kolom `batas_penggunaan_simulasi` di tabel `soal`
- Pengerjaan siswa: `pengerjaan_latihan`
- Jawaban siswa: `jawaban_latihan`

### 2. LATIHAN MANDIRI

**Karakteristik:**

- Soal dari Bank Soal (`soal`)
- **Tidak ada batas penggunaan** — soal bisa dipakai berulang kali
- Tujuan: latihan sebanyak mungkin

**Kebutuhan database:**

- Tabel template sesi: `sesi_latihan` (dengan `tipe = 'latihan_mandiri'`)
- Soal dalam sesi: `sesi_latihan_soal` (junction yang sama dengan simulasi TKA)
- Pengerjaan siswa: `pengerjaan_latihan` (tabel yang sama dengan simulasi TKA)
- Jawaban siswa: `jawaban_latihan`

> **Catatan desain:** Simulasi TKA dan Latihan Mandiri berbagi tabel `sesi_latihan`, `sesi_latihan_soal`, `pengerjaan_latihan`, dan `jawaban_latihan`. Perbedaan hanya pada kolom `tipe` di `sesi_latihan` dan ada/tidaknya pengecekan batas penggunaan di aplikasi layer. Ini adalah trade-off yang **tepat dan disengaja** — tidak perlu membuat tabel terpisah untuk keduanya.

### 3. KUIS MODUL

**Karakteristik:**

- Soal **bukan** dari Bank Soal — dibuat guru per modul
- Soal terikat ke satu kuis/modul, tidak reusable di konteks lain
- Guru bisa membuat, edit, hapus soal kuis tanpa memengaruhi Bank Soal

**Kebutuhan database:**

- Kuis: `kuis_modul` (terikat ke `modul_belajar`)
- Soal kuis: `soal_kuis` (terikat langsung ke `kuis_modul`, bukan `sesi_latihan`)
- Opsi jawaban: `opsi_soal_kuis`
- Pengerjaan siswa: `pengerjaan_kuis`
- Jawaban siswa: `jawaban_kuis`

---

## Mekanisme Batas Penggunaan Soal di Simulasi TKA

### Analisis 3 Opsi Implementasi

#### Opsi A — Counter Denormalisasi di Tabel `soal` ❌

```sql
ALTER TABLE soal ADD COLUMN jumlah_digunakan_simulasi SMALLINT UNSIGNED DEFAULT 0;
ALTER TABLE soal ADD COLUMN batas_penggunaan_simulasi TINYINT UNSIGNED DEFAULT 1;
```

**Cara kerja:** Setiap kali soal dimasukkan ke sesi simulasi TKA, increment `jumlah_digunakan_simulasi`. Cek `jumlah_digunakan_simulasi >= batas_penggunaan_simulasi` sebelum assign soal baru.

**Kelemahan kritis:**

- Jika soal dihapus dari sesi (sebelum selesai), counter tidak otomatis berkurang
- Counter bisa tidak sinkron jika ada bug atau rollback transaksi
- Tidak bisa melacak *kapan* dan *di sesi mana* soal digunakan
- Sulit di-audit: "soal ini digunakan di sesi simulasi mana saja?"

#### Opsi B — Tabel Tracking Terpisah `soal_penggunaan_simulasi` ⚠️

```sql
CREATE TABLE soal_penggunaan_simulasi (
    id_penggunaan   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    soal_id         BIGINT UNSIGNED NOT NULL,
    sesi_latihan_id BIGINT UNSIGNED NOT NULL,
    digunakan_pada  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (soal_id) REFERENCES soal(id_soal) ON DELETE CASCADE,
    FOREIGN KEY (sesi_latihan_id) REFERENCES sesi_latihan(id_sesi_latihan) ON DELETE CASCADE
);
```

**Cara kerja:** Insert ke tabel ini saat soal ditambahkan ke sesi simulasi. Cek `COUNT(*) >= batas_penggunaan_simulasi` sebelum assign.

**Kelemahan:** Redundan — `sesi_latihan_soal` sudah menyimpan data ini. Menambah tabel yang datanya bisa diquery dari tabel yang sudah ada.

#### Opsi C — Derivasi dari Junction Table + Konfigurasi di `soal` ✅ DIREKOMENDASIKAN

```sql
-- Tambahkan satu kolom konfigurasi di soal:
ALTER TABLE soal ADD COLUMN batas_penggunaan_simulasi TINYINT UNSIGNED NOT NULL DEFAULT 1;

-- Query untuk cek apakah soal masih boleh digunakan di simulasi baru:
SELECT s.id_soal,
       s.batas_penggunaan_simulasi,
       COUNT(sls.soal_id) AS jumlah_digunakan
FROM soal s
LEFT JOIN sesi_latihan_soal sls ON sls.soal_id = s.id_soal
LEFT JOIN sesi_latihan sl ON sl.id_sesi_latihan = sls.sesi_latihan_id
    AND sl.tipe = 'simulasi_tka'
    AND sl.status != 'nonaktif'   -- hanya hitung sesi aktif/draft
WHERE s.id_soal = ?
GROUP BY s.id_soal;

-- Soal tersedia jika: jumlah_digunakan < batas_penggunaan_simulasi
```

**Keuntungan:**

- **Single source of truth** — `sesi_latihan_soal` adalah fakta penggunaan yang sesungguhnya
- **Tidak ada data duplikasi** — tidak perlu counter terpisah yang bisa desync
- **Auditable** — bisa selalu query "soal ini dipakai di sesi mana saja" dari `sesi_latihan_soal`
- **Fleksibel** — batas bisa dikonfigurasi per soal (`batas_penggunaan_simulasi = 1` atau `2`)
- **Performa** — dengan index composite yang tepat, query ini sangat efisien

**Pertimbangan performa:**

```sql
-- Index yang diperlukan untuk query di atas efisien:
-- Sudah ada di sesi_latihan_soal: INDEX idx_sesi_soal (sesi_latihan_id, soal_id)
-- Tambahkan di sesi_latihan:
INDEX idx_sesi_tipe_status (tipe, status)
-- Tambahkan di soal untuk filtering soal yang "tersedia":
INDEX idx_soal_batas_simulasi (batas_penggunaan_simulasi, status)
```

**Implementasi di Laravel (Service layer):**

```php
// SoalService.php
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

---

## DDL Lengkap — Domain Soal & Sesi Pengerjaan

### Domain 1: Bank Soal (Simulasi TKA + Latihan Mandiri)

```sql
-- ============================================================
-- BANK SOAL
-- Digunakan oleh: Simulasi TKA dan Latihan Mandiri
-- TIDAK digunakan oleh: Kuis Modul
-- ============================================================

-- MATA PELAJARAN
CREATE TABLE mata_pelajaran (
    id_mapel        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama_mapel      VARCHAR(100) NOT NULL UNIQUE,
    deskripsi       TEXT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TOPIK (sub-topik per mata pelajaran)
CREATE TABLE topik (
    id_topik        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mapel_id        BIGINT UNSIGNED NOT NULL,
    nama_topik      VARCHAR(100) NOT NULL,
    deskripsi       TEXT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id_mapel) ON DELETE CASCADE,
    UNIQUE KEY uq_topik_per_mapel (mapel_id, nama_topik)
);

-- MASTER SOAL — BANK SOAL
-- Single source of truth untuk Simulasi TKA dan Latihan Mandiri
CREATE TABLE soal (
    id_soal                     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mapel_id                    BIGINT UNSIGNED NOT NULL,
    topik_id                    BIGINT UNSIGNED NULL,
    dibuat_oleh_id              BIGINT UNSIGNED NOT NULL,     -- FK ke pengguna
    jenis_soal                  ENUM('pilihan_ganda', 'benar_salah', 'pilihan_ganda_kompleks')
                                    NOT NULL DEFAULT 'pilihan_ganda',
    isi_soal                    LONGTEXT NOT NULL,
    foto_soal                   VARCHAR(500) NULL,
    pembahasan_text             LONGTEXT NULL,
    pembahasan_foto             VARCHAR(500) NULL,
    -- Konfigurasi batas penggunaan di Simulasi TKA
    -- Untuk Latihan Mandiri: tidak ada batas (tidak relevan)
    batas_penggunaan_simulasi   TINYINT UNSIGNED NOT NULL DEFAULT 1,
    status                      ENUM('draft', 'aktif', 'arsip') NOT NULL DEFAULT 'draft',
    created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at                  TIMESTAMP NULL,
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id_mapel) ON DELETE RESTRICT,
    FOREIGN KEY (topik_id) REFERENCES topik(id_topik) ON DELETE SET NULL,
    FOREIGN KEY (dibuat_oleh_id) REFERENCES pengguna(id_pengguna) ON DELETE RESTRICT,
    -- Index untuk filtering soal yang tersedia untuk simulasi TKA
    INDEX idx_soal_mapel_status (mapel_id, status),
    INDEX idx_soal_topik_status (topik_id, status),
    INDEX idx_soal_simulasi_config (batas_penggunaan_simulasi, status)
);

-- OPSI JAWABAN BANK SOAL
CREATE TABLE opsi_jawaban (
    id_opsi_jawaban BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    soal_id         BIGINT UNSIGNED NOT NULL,
    label           CHAR(1) NOT NULL,       -- 'A', 'B', 'C', 'D'
    teks_opsi       TEXT NOT NULL,
    foto_opsi       VARCHAR(500) NULL,
    is_benar        BOOLEAN NOT NULL DEFAULT FALSE,
    urutan          TINYINT UNSIGNED NOT NULL DEFAULT 1,
    UNIQUE KEY uq_opsi_label (soal_id, label),
    FOREIGN KEY (soal_id) REFERENCES soal(id_soal) ON DELETE CASCADE
);
```

### Domain 2: Sesi Latihan — Template & Pengerjaan (Simulasi TKA + Latihan Mandiri)

```sql
-- ============================================================
-- SESI LATIHAN
-- Digunakan oleh: Simulasi TKA dan Latihan Mandiri
-- Perbedaan: kolom tipe = 'simulasi_tka' | 'latihan_mandiri'
-- Soal bersumber dari Bank Soal (tabel soal)
-- ============================================================

-- TEMPLATE SESI LATIHAN
-- Simulasi TKA: dibuat oleh Admin/Guru, didistribusikan ke kelas
-- Latihan Mandiri: bisa dibuat guru atau dipilih sendiri oleh siswa
CREATE TABLE sesi_latihan (
    id_sesi_latihan BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dibuat_oleh_id  BIGINT UNSIGNED NOT NULL,
    mapel_id        BIGINT UNSIGNED NULL,
    topik_id        BIGINT UNSIGNED NULL,
    judul           VARCHAR(200) NOT NULL,
    tipe            ENUM('simulasi_tka', 'latihan_mandiri') NOT NULL,
    durasi_menit    SMALLINT UNSIGNED NULL,     -- NULL = tanpa batas waktu
    acak_soal       BOOLEAN NOT NULL DEFAULT FALSE,
    status          ENUM('draft', 'aktif', 'nonaktif') NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dibuat_oleh_id) REFERENCES pengguna(id_pengguna) ON DELETE RESTRICT,
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id_mapel) ON DELETE SET NULL,
    FOREIGN KEY (topik_id) REFERENCES topik(id_topik) ON DELETE SET NULL,
    INDEX idx_sesi_tipe_status (tipe, status)   -- dipakai saat query batas penggunaan simulasi
);

-- SOAL DALAM SESI LATIHAN (junction table)
-- Tabel ini sekaligus menjadi SUMBER DATA untuk menghitung berapa kali
-- soal digunakan di simulasi TKA (Opsi C — tidak perlu tabel tracking terpisah)
CREATE TABLE sesi_latihan_soal (
    id_soal_latihan BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sesi_latihan_id BIGINT UNSIGNED NOT NULL,
    soal_id         BIGINT UNSIGNED NOT NULL,
    urutan          TINYINT UNSIGNED NOT NULL DEFAULT 1,
    bobot_nilai     DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    UNIQUE KEY uq_sesi_soal (sesi_latihan_id, soal_id),
    FOREIGN KEY (sesi_latihan_id) REFERENCES sesi_latihan(id_sesi_latihan) ON DELETE CASCADE,
    FOREIGN KEY (soal_id) REFERENCES soal(id_soal) ON DELETE RESTRICT,
    -- Index kritis: dipakai saat menghitung jumlah_digunakan per soal di simulasi TKA
    INDEX idx_soal_per_sesi (soal_id, sesi_latihan_id)
);

-- PENGERJAAN LATIHAN (instansi siswa mengerjakan sesi)
-- Digunakan oleh Simulasi TKA dan Latihan Mandiri
CREATE TABLE pengerjaan_latihan (
    id_pengerjaan   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id        BIGINT UNSIGNED NOT NULL,
    sesi_latihan_id BIGINT UNSIGNED NOT NULL,
    started_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at     TIMESTAMP NULL,
    durasi_aktual   SMALLINT UNSIGNED NULL,     -- dalam detik, rekam durasi sebenarnya
    nilai           DECIMAL(5,2) NULL,
    jumlah_benar    SMALLINT UNSIGNED NULL,
    jumlah_salah    SMALLINT UNSIGNED NULL,
    status          ENUM('berlangsung', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'berlangsung',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id_siswa) ON DELETE CASCADE,
    FOREIGN KEY (sesi_latihan_id) REFERENCES sesi_latihan(id_sesi_latihan) ON DELETE CASCADE,
    INDEX idx_pengerjaan_siswa (siswa_id),
    INDEX idx_pengerjaan_sesi (sesi_latihan_id),
    INDEX idx_pengerjaan_siswa_sesi (siswa_id, sesi_latihan_id)
);

-- JAWABAN LATIHAN (jawaban siswa per soal)
-- FK eksplisit ke pengerjaan_latihan — bukan polymorphic
CREATE TABLE jawaban_latihan (
    id_jawaban_latihan  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pengerjaan_id       BIGINT UNSIGNED NOT NULL,
    soal_id             BIGINT UNSIGNED NOT NULL,
    opsi_jawaban_id     BIGINT UNSIGNED NULL,   -- NULL jika soal tidak dijawab
    is_benar            BOOLEAN NULL,
    waktu_jawab         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pengerjaan_id) REFERENCES pengerjaan_latihan(id_pengerjaan) ON DELETE CASCADE,
    FOREIGN KEY (soal_id) REFERENCES soal(id_soal) ON DELETE RESTRICT,
    FOREIGN KEY (opsi_jawaban_id) REFERENCES opsi_jawaban(id_opsi_jawaban) ON DELETE SET NULL,
    UNIQUE KEY uq_jawaban_per_soal (pengerjaan_id, soal_id),    -- 1 jawaban per soal per pengerjaan
    INDEX idx_jawaban_pengerjaan (pengerjaan_id)
);
```

### Domain 3: Kuis Modul — Soal & Pengerjaan

```sql
-- ============================================================
-- KUIS MODUL
-- Soal dibuat guru, TIDAK dari Bank Soal
-- Hanya terkait dengan modul tempat soal dibuat
-- Tidak bisa digunakan di Simulasi TKA maupun Latihan Mandiri
-- ============================================================

-- MODUL BELAJAR
CREATE TABLE modul_belajar (
    id_modul        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mapel_id        BIGINT UNSIGNED NOT NULL,
    topik_id        BIGINT UNSIGNED NULL,
    dibuat_oleh_id  BIGINT UNSIGNED NOT NULL,
    judul           VARCHAR(200) NOT NULL,
    deskripsi       TEXT NULL,
    urutan          TINYINT UNSIGNED NOT NULL DEFAULT 1,
    status          ENUM('draft', 'aktif', 'arsip') NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP NULL,
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id_mapel) ON DELETE RESTRICT,
    FOREIGN KEY (topik_id) REFERENCES topik(id_topik) ON DELETE SET NULL,
    FOREIGN KEY (dibuat_oleh_id) REFERENCES pengguna(id_pengguna) ON DELETE RESTRICT
);

-- KUIS MODUL (satu kuis per modul)
CREATE TABLE kuis_modul (
    id_kuis         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    modul_id        BIGINT UNSIGNED NOT NULL UNIQUE,    -- 1 kuis per modul
    judul           VARCHAR(200) NOT NULL,
    nilai_minimum   DECIMAL(5,2) NOT NULL DEFAULT 70.00,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (modul_id) REFERENCES modul_belajar(id_modul) ON DELETE CASCADE
);

-- SOAL KUIS MODUL (TERPISAH dari Bank Soal)
-- Dibuat langsung oleh guru untuk modul tertentu
-- TIDAK bisa digunakan di Simulasi TKA atau Latihan Mandiri
CREATE TABLE soal_kuis (
    id_soal_kuis    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kuis_id         BIGINT UNSIGNED NOT NULL,           -- terikat langsung ke kuis
    dibuat_oleh_id  BIGINT UNSIGNED NOT NULL,
    jenis_soal      ENUM('pilihan_ganda', 'benar_salah', 'pilihan_ganda_kompleks')
                        NOT NULL DEFAULT 'pilihan_ganda',
    isi_soal        LONGTEXT NOT NULL,
    foto_soal       VARCHAR(500) NULL,
    pembahasan_text LONGTEXT NULL,
    pembahasan_foto VARCHAR(500) NULL,
    urutan          TINYINT UNSIGNED NOT NULL DEFAULT 1,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kuis_id) REFERENCES kuis_modul(id_kuis) ON DELETE CASCADE,
    FOREIGN KEY (dibuat_oleh_id) REFERENCES pengguna(id_pengguna) ON DELETE RESTRICT,
    INDEX idx_soal_kuis_urutan (kuis_id, urutan)
);

-- OPSI JAWABAN SOAL KUIS MODUL (terpisah dari opsi_jawaban bank soal)
CREATE TABLE opsi_soal_kuis (
    id_opsi_soal_kuis   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    soal_kuis_id        BIGINT UNSIGNED NOT NULL,
    label               CHAR(1) NOT NULL,
    teks_opsi           TEXT NOT NULL,
    foto_opsi           VARCHAR(500) NULL,
    is_benar            BOOLEAN NOT NULL DEFAULT FALSE,
    urutan              TINYINT UNSIGNED NOT NULL DEFAULT 1,
    UNIQUE KEY uq_opsi_kuis_label (soal_kuis_id, label),
    FOREIGN KEY (soal_kuis_id) REFERENCES soal_kuis(id_soal_kuis) ON DELETE CASCADE
);

-- PENGERJAAN KUIS (instansi siswa mengerjakan kuis modul)
CREATE TABLE pengerjaan_kuis (
    id_pengerjaan_kuis  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id            BIGINT UNSIGNED NOT NULL,
    kuis_id             BIGINT UNSIGNED NOT NULL,
    started_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at         TIMESTAMP NULL,
    nilai               DECIMAL(5,2) NULL,
    lulus               BOOLEAN NULL,           -- dibandingkan nilai_minimum dari kuis_modul
    percobaan_ke        TINYINT UNSIGNED NOT NULL DEFAULT 1,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id_siswa) ON DELETE CASCADE,
    FOREIGN KEY (kuis_id) REFERENCES kuis_modul(id_kuis) ON DELETE CASCADE,
    INDEX idx_pengerjaan_kuis_siswa (siswa_id, kuis_id)
);

-- JAWABAN KUIS MODUL (jawaban siswa per soal_kuis)
-- Mereferensikan soal_kuis, BUKAN soal dari Bank Soal
CREATE TABLE jawaban_kuis (
    id_jawaban_kuis     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pengerjaan_kuis_id  BIGINT UNSIGNED NOT NULL,
    soal_kuis_id        BIGINT UNSIGNED NOT NULL,       -- FK ke soal_kuis, bukan soal
    opsi_soal_kuis_id   BIGINT UNSIGNED NULL,           -- FK ke opsi_soal_kuis
    is_benar            BOOLEAN NULL,
    waktu_jawab         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pengerjaan_kuis_id) REFERENCES pengerjaan_kuis(id_pengerjaan_kuis) ON DELETE CASCADE,
    FOREIGN KEY (soal_kuis_id) REFERENCES soal_kuis(id_soal_kuis) ON DELETE RESTRICT,
    FOREIGN KEY (opsi_soal_kuis_id) REFERENCES opsi_soal_kuis(id_opsi_soal_kuis) ON DELETE SET NULL,
    UNIQUE KEY uq_jawaban_kuis_soal (pengerjaan_kuis_id, soal_kuis_id)
);
```

---

## Diagram Relasi Lengkap

```
BANK SOAL DOMAIN:
─────────────────────────────────────────────────────────────────────
                              ┌──────────────┐
                              │ mata_pelajaran│
                              └──────┬───────┘
                                     │ 1:N
                              ┌──────▼───────┐
                              │    topik     │
                              └──────┬───────┘
                                     │ 1:N
                    ┌────────────────▼────────────────────┐
                    │              soal                    │
                    │  (+ batas_penggunaan_simulasi)       │
                    └──┬──────────────────────────────┬───┘
                       │ 1:N                          │ 1:N
              ┌────────▼────────┐           ┌────────▼────────┐
              │  opsi_jawaban   │           │ sesi_latihan_soal│ ← junction
              └─────────────────┘           └────────┬────────┘
                                                     │ N:1
                                            ┌────────▼────────┐
                                            │  sesi_latihan   │
                                            │ tipe: sim|lat   │
                                            └────────┬────────┘
                                                     │ 1:N
                                            ┌────────▼──────────┐
                                            │ pengerjaan_latihan │
                                            │ (siswa_id di sini) │
                                            └────────┬──────────┘
                                                     │ 1:N
                                            ┌────────▼────────┐
                                            │ jawaban_latihan │
                                            └─────────────────┘

KUIS MODUL DOMAIN:
─────────────────────────────────────────────────────────────────────
              ┌────────────────┐
              │  modul_belajar │
              └───────┬────────┘
                      │ 1:1
              ┌───────▼────────┐
              │   kuis_modul   │
              └───────┬────────┘
                      │ 1:N
              ┌───────▼────────┐
              │   soal_kuis    │ ← BUKAN dari Bank Soal
              └───────┬────────┘
                      │ 1:N
              ┌───────▼────────┐
              │ opsi_soal_kuis │
              └────────────────┘

              ┌───────────────────┐
              │  pengerjaan_kuis  │ (siswa_id)
              └───────┬───────────┘
                      │ 1:N
              ┌───────▼────────┐
              │  jawaban_kuis  │ → FK ke soal_kuis (bukan soal)
              └────────────────┘
```

---

## Ringkasan Keputusan Desain

| Aspek                                     | Keputusan                                                                                     | Alasan                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Bank Soal vs Soal Kuis**          | **Tabel terpisah** (`soal` vs `soal_kuis`)                                          | Beda entitas bisnis, beda lifecycle, beda aturan penggunaan |
| **Simulasi TKA vs Latihan Mandiri** | **Satu tabel** `sesi_latihan` dengan kolom `tipe`                                   | Keduanya menggunakan Bank Soal, tabel pengerjaan sama       |
| **Batas penggunaan soal simulasi**  | **Opsi C** — derivasi dari `sesi_latihan_soal` + kolom `batas_penggunaan_simulasi` | Tidak ada data duplikasi, auditable, fleksibel per soal     |
| **Jawaban latihan vs jawaban kuis** | **Tabel terpisah** (`jawaban_latihan` vs `jawaban_kuis`)                            | FK berbeda target (soal vs soal_kuis), tidak bisa digabung  |
| **Polymorphic association**         | **Dihindari sepenuhnya**                                                                | Semua FK dapat di-enforce di DB level                       |

---

## Dampak terhadap Dokumen Revisi Sebelumnya

Rekomendasi di `revisi_database_tka.md` yang perlu **dikoreksi**:

| Item                                            | Rekomendasi Sebelumnya                         | Koreksi Berdasarkan Kebutuhan Bisnis                                            |
| ----------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| ✅ #1 Struktur `soal` (Bank Soal)             | Pertahankan sebagai single source of truth     | **Masih benar** — untuk Simulasi TKA & Latihan Mandiri                   |
| ❌ #8 Tabel junction `kuis_modul_soal`        | Soal kuis referensikan ke `soal` (bank soal) | **Salah** — soal kuis HARUS di tabel `soal_kuis` terpisah              |
| ❌ Tabel `kuis_modul_soal`                    | Dihapus, diganti junction ke `soal`          | **Salah** — ganti dengan `soal_kuis` yang berdiri sendiri              |
| ✅ Pisah `jawaban_latihan` & `jawaban_kuis` | Sudah benar                                    | **Tetap benar**, tapi `jawaban_kuis` FK ke `soal_kuis` bukan `soal` |
| ➕ Baru                                         | Tidak ada mekanisme batas penggunaan           | **Tambahkan** `batas_penggunaan_simulasi` di `soal`                   |

---

## Pertanyaan Bisnis yang Masih Perlu Dikonfirmasi

> [!IMPORTANT]
> **Pertanyaan 1:** Apakah satu siswa bisa mengerjakan sesi simulasi TKA yang sama **lebih dari satu kali**?
>
> - Jika tidak boleh: tambahkan `UNIQUE KEY uq_siswa_sesi (siswa_id, sesi_latihan_id)` di `pengerjaan_latihan`
> - Jika boleh (misal untuk remediasi): pertahankan tanpa constraint unik, tambahkan `percobaan_ke` seperti di `pengerjaan_kuis`

> [!IMPORTANT]
> **Pertanyaan 2:** Apakah batas penggunaan soal simulasi TKA berlaku **per soal secara global**, atau **per soal per tahun ajaran/semester**?
>
> - Jika global: implementasi saat ini (Opsi C) sudah cukup
> - Jika per tahun ajaran: tambahkan filter `sesi_latihan.tahun_ajaran` saat menghitung penggunaan

> [!IMPORTANT]
> **Pertanyaan 3:** Siapa yang bisa mengubah nilai `batas_penggunaan_simulasi`?
>
> - Hanya Admin? Atau juga Guru?
> - Ini mempengaruhi Policy/Gate di Laravel, bukan struktur database

---

*Dokumen ini merupakan addendum dari `revisi_database_tka.md` dan harus dibaca bersama dokumen tersebut.*
