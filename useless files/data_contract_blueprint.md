# 📋 Data Synchronization Blueprint
### Portal Latihan TKA — React Frontend ↔ Laravel 11 Backend

---

> [!IMPORTANT]
> Dokumen ini adalah **kontrak data hidup** antara Frontend React dan Backend Laravel.
> Setiap perubahan skema di salah satu sisi **harus** diperbarui di dokumen ini.

---

## 📁 Struktur File yang Direkomendasikan

```
src/
├── utilitas/
│   ├── api.js                     ← (sudah ada) Axios instance
│   ├── apiAdapter.js              ← [BARU] Semua fungsi mapper/transformer
│   └── apiConstants.js            ← [BARU] URL endpoint constants
├── tipe/
│   └── index.js                   ← [BARU] Semua JSDoc type definitions
```

---

## Bagian 1 — Standarisasi API Response Wrapper (Laravel)

Semua endpoint Laravel **wajib** mengembalikan format berikut secara konsisten.
Frontend Axios interceptor akan bergantung pada struktur ini.

### ✅ Format Sukses (2xx)
```json
{
  "status": "success",
  "message": "Data berhasil dimuat.",
  "data": { ... }
}
```

### ✅ Format Sukses dengan Paginasi (2xx)
```json
{
  "status": "success",
  "message": "Data berhasil dimuat.",
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 72
  }
}
```

### ❌ Format Error Validasi (422)
```json
{
  "status": "error",
  "message": "Data yang dikirim tidak valid.",
  "errors": {
    "opsi_soal_kuis_id": ["Field ini wajib diisi."],
    "soal_kuis_id": ["Soal tidak ditemukan."]
  }
}
```

### ❌ Format Error Umum (4xx / 5xx)
```json
{
  "status": "error",
  "message": "Sesi Anda telah berakhir, silakan login kembali.",
  "data": null
}
```

> [!TIP]
> Di Laravel, buat satu `ApiResponse` helper class atau gunakan Trait di `app/Traits/ApiResponseTrait.php`
> agar semua controller menggunakan format yang sama.

---

## Bagian 2 — JSDoc Type Definitions (Frontend camelCase)

Simpan di `src/tipe/index.js`. Ini adalah "sumber kebenaran" bentuk data di React State.

### 2.1 Domain: Auth & User

```js
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {'student'|'guru'|'admin'} role
 * @property {string|null} profilePic       ← API: profile_pic
 * @property {string|null} assignedClass    ← API: assigned_class / class
 * @property {string} createdAt             ← API: created_at
 */
```

### 2.2 Domain: Kuis Modul

```js
/**
 * @typedef {Object} OpsiSoalKuis
 * @property {number} id                  ← API: id_opsi_soal_kuis
 * @property {string} label               ← API: label (A/B/C/D)
 * @property {string} teksOpsi            ← API: teks_opsi
 */

/**
 * @typedef {Object} SoalKuis
 * @property {number} id                  ← API: id_soal_kuis
 * @property {string} isiSoal             ← API: isi_soal
 * @property {string|null} fotoSoal       ← API: foto_soal (URL)
 * @property {OpsiSoalKuis[]} opsiJawaban ← API: opsi_soal_kuis (relasi)
 */

/**
 * @typedef {Object} KuisModul
 * @property {number} id                  ← API: id_kuis
 * @property {string} judul               ← API: judul
 * @property {number} nilaiMinimum        ← API: nilai_minimum
 * @property {SoalKuis[]} soal            ← API: soal_kuis (relasi)
 * @property {number} totalSoal           ← derived: soal.length
 */

/**
 * @typedef {Object} HasilKuis
 * @property {number} skor                ← API: skor
 * @property {number} nilaiMinimum        ← API: nilai_minimum
 * @property {boolean} lulus              ← API: lulus
 * @property {number} totalBenar          ← API: total_benar
 * @property {number} totalSoal           ← API: total_soal
 */
```

### 2.3 Domain: Simulasi TKA & Latihan Mandiri

```js
/**
 * @typedef {'single_choice'|'multi_choice'|'true_false'} TipesoalEnum
 */

/**
 * @typedef {Object} OpsiJawabanSoal
 * @property {number} id                  ← API: id_jawaban
 * @property {string} key                 ← API: opsi_jawaban (A/B/C/D)
 * @property {string} teks                ← API: teks_opsi (jika ada)
 * @property {string|null} gambar         ← API: foto_opsi
 */

/**
 * @typedef {Object} SoalUjian
 * @property {number} id                  ← API: id_soal
 * @property {TipesoalEnum} questionType  ← API: question_type
 * @property {string} isiSoal             ← API: isi_soal (teks stem)
 * @property {string|null} fotoSoal       ← API: foto_soal (URL gambar stem)
 * @property {OpsiJawabanSoal[]} opsi     ← API: opsi_jawaban (relasi)
 * @property {number} maxPoin             ← API: max_points
 * @property {string|null} penjelasan     ← API: penjelasan
 */

/**
 * @typedef {Object} SesiSimulasi
 * @property {number} id                  ← API: id (dari sesi_latihan)
 * @property {string} judul               ← API: judul / nama
 * @property {number} durasi              ← API: durasi (detik)
 * @property {SoalUjian[]} soal           ← API: soal (relasi)
 * @property {number|null} sesiAktifId    ← API: sesi_aktif_id (dari response start)
 */

/**
 * @typedef {Object} RiwayatPengerjaan
 * @property {number} id                  ← API: id (riwayat_pengerjaan)
 * @property {number} skorAkhir           ← API: skor_final
 * @property {number} totalBenar          ← API: total_benar
 * @property {number} totalSoal           ← API: total_soal
 * @property {string} selesaiPada         ← API: selesai_pada (timestamp)
 */
```

### 2.4 Domain: Survei (Kuesioner)

```js
/**
 * @typedef {Object} OpsiSurvei
 * @property {number} id                  ← API: id (opsi_survei)
 * @property {string} label               ← API: label (A/B/C/D)
 * @property {string} teksOpsi            ← API: teks_opsi
 */

/**
 * @typedef {Object} PertanyaanSurvei
 * @property {number} id                  ← API: id (pertanyaan_survei)
 * @property {string} teks                ← API: teks_pertanyaan
 * @property {'single_choice'|'text'} tipe ← API: tipe
 * @property {OpsiSurvei[]} opsi          ← API: opsi_survei (relasi)
 */

/**
 * @typedef {Object} DefinisiSurvei
 * @property {number} id                  ← API: id
 * @property {'survei_karakter'|'sulingjar'} tipe ← API: tipe
 * @property {string} judul               ← API: judul
 * @property {string} deskripsi           ← API: deskripsi
 * @property {PertanyaanSurvei[]} pertanyaan ← API: pertanyaan_survei (relasi)
 */
```

### 2.5 Domain: Inbox / Pesan Guru

```js
/**
 * @typedef {Object} PesanInbox
 * @property {number} id                  ← API: id_pesan_penerima
 * @property {string} judul               ← API: judul
 * @property {string} isiPesan            ← API: isi_pesan
 * @property {boolean} isRead             ← API: is_read (0/1 → boolean)
 * @property {string} diterimaPada        ← API: created_at
 * @property {string|null} pengirim       ← API: pengirim.name (dari relasi)
 */
```

---

## Bagian 3 — Data Mapping Strategy (Adapter Pattern)

Buat file baru di `src/utilitas/apiAdapter.js`.
Setiap domain punya fungsi `adaptXxx(rawData)` yang **mengubah snake_case → camelCase**
sekaligus menormalisasi tipe data (string '0'/'1' → boolean, null handling, dll).

```js
// src/utilitas/apiAdapter.js

// ─── HELPER UMUM ──────────────────────────────────────────────────────────────

/**
 * Mengubah string snake_case menjadi camelCase.
 * Contoh: "id_soal_kuis" → "idSoalKuis"
 * @param {string} str
 * @returns {string}
 */
export function toCamel(str) {
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Secara rekursif mengubah semua key object dari snake_case ke camelCase.
 * Berguna sebagai fallback untuk field-field yang tidak perlu penanganan khusus.
 * @param {any} data
 * @returns {any}
 */
export function deepCamelCase(data) {
  if (Array.isArray(data)) {
    return data.map(deepCamelCase);
  }
  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [toCamel(key), deepCamelCase(val)])
    );
  }
  return data;
}


// ─── DOMAIN: KUIS MODUL ───────────────────────────────────────────────────────

/**
 * Mengubah raw opsi soal kuis dari API → OpsiSoalKuis
 * @param {Object} raw - Raw API object
 * @returns {import('@/tipe').OpsiSoalKuis}
 */
export function adaptOpsiSoalKuis(raw) {
  return {
    id: raw.id_opsi_soal_kuis,
    label: raw.label,
    teksOpsi: raw.teks_opsi,
  };
}

/**
 * Mengubah raw soal kuis dari API → SoalKuis
 * @param {Object} raw
 * @returns {import('@/tipe').SoalKuis}
 */
export function adaptSoalKuis(raw) {
  return {
    id: raw.id_soal_kuis,
    isiSoal: raw.isi_soal,
    fotoSoal: raw.foto_soal ?? null,
    opsiJawaban: Array.isArray(raw.opsi_soal_kuis)
      ? raw.opsi_soal_kuis.map(adaptOpsiSoalKuis)
      : [],
  };
}

/**
 * Mengubah raw kuis modul dari API → KuisModul
 * @param {Object} raw
 * @returns {import('@/tipe').KuisModul}
 */
export function adaptKuisModul(raw) {
  const soal = Array.isArray(raw.soal_kuis)
    ? raw.soal_kuis.map(adaptSoalKuis)
    : [];
  return {
    id: raw.id_kuis,
    judul: raw.judul,
    nilaiMinimum: raw.nilai_minimum,
    soal,
    totalSoal: soal.length,
  };
}

/**
 * Mengubah raw hasil submit kuis dari API → HasilKuis
 * @param {Object} raw
 * @returns {import('@/tipe').HasilKuis}
 */
export function adaptHasilKuis(raw) {
  return {
    skor: raw.skor,
    nilaiMinimum: raw.nilai_minimum,
    lulus: Boolean(raw.lulus),
    totalBenar: raw.total_benar,
    totalSoal: raw.total_soal,
  };
}


// ─── DOMAIN: SIMULASI TKA & LATIHAN MANDIRI ───────────────────────────────────

/**
 * Mengubah raw opsi jawaban soal ujian dari API → OpsiJawabanSoal
 * @param {Object} raw
 * @returns {import('@/tipe').OpsiJawabanSoal}
 */
export function adaptOpsiJawaban(raw) {
  return {
    id: raw.id_jawaban,
    key: raw.opsi_jawaban,        // "A", "B", "C", "D"
    teks: raw.teks_opsi ?? raw.opsi_jawaban,
    gambar: raw.foto_opsi ?? null,
  };
}

/**
 * Mengubah raw soal dari API (tabel soal) → SoalUjian
 * Kompatibel dengan format mock V2 yang sudah ada (question_type, payload)
 * @param {Object} raw
 * @returns {import('@/tipe').SoalUjian}
 */
export function adaptSoalUjian(raw) {
  return {
    id: raw.id_soal,
    questionType: raw.question_type ?? 'single_choice',
    isiSoal: raw.isi_soal,
    fotoSoal: raw.foto_soal ?? null,
    opsi: Array.isArray(raw.opsi_jawaban)
      ? raw.opsi_jawaban.map(adaptOpsiJawaban)
      : [],
    maxPoin: raw.max_points ?? 1,
    penjelasan: raw.penjelasan ?? null,
  };
}

/**
 * Mengubah raw data simulasi/latihan dari API → SesiSimulasi
 * @param {Object} raw
 * @returns {import('@/tipe').SesiSimulasi}
 */
export function adaptSesiSimulasi(raw) {
  return {
    id: raw.id,
    judul: raw.judul ?? raw.nama ?? 'Simulasi',
    durasi: raw.durasi,
    soal: Array.isArray(raw.soal) ? raw.soal.map(adaptSoalUjian) : [],
    sesiAktifId: raw.sesi_aktif_id ?? null,
  };
}

/**
 * Mengubah raw riwayat pengerjaan dari API → RiwayatPengerjaan
 * @param {Object} raw
 * @returns {import('@/tipe').RiwayatPengerjaan}
 */
export function adaptRiwayatPengerjaan(raw) {
  return {
    id: raw.id,
    skorAkhir: raw.skor_final ?? raw.skor ?? 0,
    totalBenar: raw.total_benar ?? 0,
    totalSoal: raw.total_soal ?? 0,
    selesaiPada: raw.selesai_pada ?? raw.updated_at,
  };
}


// ─── DOMAIN: SURVEI ───────────────────────────────────────────────────────────

/**
 * Mengubah raw opsi survei dari API → OpsiSurvei
 * @param {Object} raw
 * @returns {import('@/tipe').OpsiSurvei}
 */
export function adaptOpsiSurvei(raw) {
  return {
    id: raw.id,
    label: raw.label,
    teksOpsi: raw.teks_opsi,
  };
}

/**
 * Mengubah raw pertanyaan survei dari API → PertanyaanSurvei
 * @param {Object} raw
 * @returns {import('@/tipe').PertanyaanSurvei}
 */
export function adaptPertanyaanSurvei(raw) {
  return {
    id: raw.id,
    teks: raw.teks_pertanyaan,
    tipe: raw.tipe ?? 'single_choice',
    opsi: Array.isArray(raw.opsi_survei)
      ? raw.opsi_survei.map(adaptOpsiSurvei)
      : [],
  };
}

/**
 * Mengubah raw definisi survei dari API → DefinisiSurvei
 * @param {Object} raw
 * @returns {import('@/tipe').DefinisiSurvei}
 */
export function adaptDefinisiSurvei(raw) {
  return {
    id: raw.id,
    tipe: raw.tipe,
    judul: raw.judul,
    deskripsi: raw.deskripsi,
    pertanyaan: Array.isArray(raw.pertanyaan_survei)
      ? raw.pertanyaan_survei.map(adaptPertanyaanSurvei)
      : [],
  };
}


// ─── DOMAIN: INBOX / PESAN ────────────────────────────────────────────────────

/**
 * Mengubah raw pesan inbox dari API → PesanInbox
 * @param {Object} raw
 * @returns {import('@/tipe').PesanInbox}
 */
export function adaptPesanInbox(raw) {
  return {
    id: raw.id_pesan_penerima,
    judul: raw.judul,
    isiPesan: raw.isi_pesan,
    isRead: Boolean(raw.is_read),       // DB menyimpan 0/1
    diterimaPada: raw.created_at,
    pengirim: raw.pengirim?.name ?? null,
  };
}
```

---

## Bagian 4 — Contoh Payload Request (Frontend → Backend)

### 4.1 Submit Kuis Modul
**Endpoint:** `POST /api/siswa/kuis/{id_kuis}/submit`

```json
{
  "jawaban": [
    { "soal_kuis_id": 11, "opsi_soal_kuis_id": 43 },
    { "soal_kuis_id": 12, "opsi_soal_kuis_id": 46 },
    { "soal_kuis_id": 13, "opsi_soal_kuis_id": 51 }
  ]
}
```

**Cara membangun payload dari React State:**
```js
// State contoh: { 11: 43, 12: 46, 13: 51 }
// Key = soal_kuis_id, Value = opsi_soal_kuis_id yang dipilih

function buildKuisPayload(jawabanState) {
  return {
    jawaban: Object.entries(jawabanState).map(([soalId, opsiId]) => ({
      soal_kuis_id: Number(soalId),
      opsi_soal_kuis_id: Number(opsiId),
    })),
  };
}
```

---

### 4.2 Auto-Save Per Soal — Simulasi TKA
**Endpoint:** `POST /api/siswa/simulasi/{id}/jawab`

```json
{
  "sesi_id": 789,
  "soal_id": 101,
  "opsi_id": 312
}
```

**Cara penggunaan di komponen:**
```js
// Dipanggil setiap kali siswa berpindah soal
async function autoSaveJawaban(sesiId, soalId, opsiId) {
  try {
    await api.post(`/siswa/simulasi/${simulasiId}/jawab`, {
      sesi_id: sesiId,
      soal_id: soalId,
      opsi_id: opsiId,
    });
  } catch (err) {
    // Simpan ke antrian offline jika gagal (offline-first strategy)
    console.warn('[AutoSave] Gagal menyimpan, antrikan ke offline queue.');
  }
}
```

---

### 4.3 Submit Survei
**Endpoint:** `POST /api/siswa/survei/{id}/submit`

```json
{
  "jawaban": [
    { "pertanyaan_id": 1, "opsi_survei_id": 3, "teks_jawaban": null },
    { "pertanyaan_id": 2, "opsi_survei_id": null, "teks_jawaban": "Saya sangat menikmati belajar di sekolah." }
  ]
}
```

**Cara membangun payload dari React State:**
```js
// State contoh: [{ pertanyaanId: 1, opsiSurveiId: 3 }, { pertanyaanId: 2, teksJawaban: "..." }]

function buildSurveiPayload(jawabanState) {
  return {
    jawaban: jawabanState.map((j) => ({
      pertanyaan_id: j.pertanyaanId,
      opsi_survei_id: j.opsiSurveiId ?? null,
      teks_jawaban: j.teksJawaban ?? null,
    })),
  };
}
```

---

## Bagian 5 — Enhanced Axios Interceptor Strategy

Update `src/utilitas/api.js` dengan interceptor yang lebih cerdas:

```js
// Tambahkan ke api.js — Response interceptor yang menormalkan wrapper

api.interceptors.response.use(
  (response) => {
    // Langsung kembalikan response.data agar komponen tidak perlu
    // selalu menulis: response.data.data
    // Komponen cukup: const { data } = await api.get(...)
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Terjadi kesalahan jaringan.';

    if (status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('assignedClass');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Lempar error yang sudah diformatkan agar mudah di-catch di komponen
    const formattedError = new Error(message);
    formattedError.status = status;
    formattedError.validationErrors = error.response?.data?.errors ?? null;
    return Promise.reject(formattedError);
  }
);
```

**Cara menangkap validasi error di komponen:**
```js
try {
  const res = await api.post('/siswa/kuis/1/submit', payload);
  const hasil = adaptHasilKuis(res.data.data);
  setHasil(hasil);
} catch (err) {
  if (err.validationErrors) {
    // Tampilkan error per field
    console.log(err.validationErrors);
  } else {
    // Tampilkan toast error umum
    toast.error(err.message);
  }
}
```

---

## Bagian 6 — Contoh Penggunaan Lengkap di Komponen React

Contoh di `KuisModul.jsx` setelah integrasi dengan adapter:

```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/utilitas/api';
import { adaptKuisModul, adaptHasilKuis, buildKuisPayload } from '@/utilitas/apiAdapter';

export default function KuisModul() {
  const { modulId } = useParams();
  const [kuis, setKuis] = useState(null);         // type: KuisModul
  const [jawaban, setJawaban] = useState({});     // { [soalKuisId]: opsiSoalKuisId }
  const [hasil, setHasil] = useState(null);       // type: HasilKuis
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchKuis = async () => {
      try {
        const res = await api.get(`/siswa/kuis/${modulId}`);
        // ✅ Adapter mengubah snake_case → camelCase
        setKuis(adaptKuisModul(res.data.data));
      } catch (err) {
        console.error('Gagal memuat kuis:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKuis();
  }, [modulId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // ✅ Payload builder mengubah camelCase state → snake_case request
      const payload = buildKuisPayload(jawaban);
      const res = await api.post(`/siswa/kuis/${modulId}/submit`, payload);
      setHasil(adaptHasilKuis(res.data.data));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ... render
}
```

---

## Ringkasan Peta Key Mapping (Quick Reference)

| Backend (snake_case) | Frontend (camelCase) | Domain |
|---|---|---|
| `id_kuis` | `id` | Kuis Modul |
| `id_soal_kuis` | `id` | Kuis Modul |
| `id_opsi_soal_kuis` | `id` | Kuis Modul |
| `teks_opsi` | `teksOpsi` | Kuis / Survei |
| `nilai_minimum` | `nilaiMinimum` | Kuis Modul |
| `foto_soal` | `fotoSoal` | Soal (semua domain) |
| `id_soal` | `id` | Simulasi/Latihan |
| `id_jawaban` | `id` | Simulasi/Latihan |
| `opsi_jawaban` | `key` | Simulasi/Latihan |
| `max_points` | `maxPoin` | Simulasi/Latihan |
| `skor_final` | `skorAkhir` | Riwayat Pengerjaan |
| `total_benar` | `totalBenar` | Hasil/Riwayat |
| `total_soal` | `totalSoal` | Hasil/Riwayat |
| `sesi_aktif_id` | `sesiAktifId` | Sesi Simulasi |
| `teks_pertanyaan` | `teks` | Survei |
| `opsi_survei` | `opsi` | Survei |
| `id_pesan_penerima` | `id` | Inbox |
| `isi_pesan` | `isiPesan` | Inbox |
| `is_read` | `isRead` (boolean) | Inbox |
| `created_at` | `diterimaPada` / `createdAt` | Inbox / Umum |
| `profile_pic` | `profilePic` | User |
| `assigned_class` | `assignedClass` | User |
