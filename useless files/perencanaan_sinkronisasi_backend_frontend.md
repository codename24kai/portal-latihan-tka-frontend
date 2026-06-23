# Perencanaan Sinkronisasi Backend & Frontend - Aplikasi Latihan TKA

Dokumen ini berisi rancangan pemetaan dan standarisasi sinkronisasi data antara backend (Laravel) dan frontend (React) untuk Aplikasi Latihan TKA. 

## 1. Standarisasi Format Data & Komunikasi (Data Contract)
Untuk mengatasi masalah inkonsistensi penamaan variabel antara backend (yang umumnya menggunakan `snake_case`) dan frontend (yang menggunakan `camelCase`), kita akan menetapkan standar:
- **Request (Frontend ke Backend):** Payload JSON menggunakan `snake_case` agar sesuai dengan ekspektasi default Laravel.
- **Response (Backend ke Frontend):** Backend harus selalu mengembalikan data dalam bentuk `snake_case`. Frontend akan menggunakan *Adapter/Utility* di layer API service untuk mengubahnya menjadi `camelCase` sebelum masuk ke *state management* atau *komponen*.
- **API Wrapper:** Menggunakan standar struktur respons seperti:
  ```json
  {
    "status": "success",
    "message": "Data berhasil diambil",
    "data": { ... }
  }
  ```

## 2. Pemetaan Modul & Endpoint API

### A. Modul Autentikasi
| Halaman/Komponen Frontend | Aksi / Trigger | Endpoint Backend API (Rencana) | Keterangan Sinkronisasi |
|---|---|---|---|
| `Login.jsx` | Submit Form | `POST /api/auth/login` | Menerima token dan role user. Disimpan di lokal storage/konteks. |
| `LupaPassword.jsx` | Request Reset | `POST /api/auth/forgot-password` | Sinkronisasi validasi email dan pengiriman token reset. |
| `ResetPassword.jsx` | Submit Password Baru | `POST /api/auth/reset-password` | Sinkronisasi penggantian password. |
| `Logout` (Sidebar) | Klik Tombol Keluar | `POST /api/auth/logout` | Penghapusan token di backend & frontend. |

### B. Modul Siswa
| Halaman/Komponen Frontend | Aksi / Trigger | Endpoint Backend API (Rencana) | Keterangan Sinkronisasi |
|---|---|---|---|
| `DashboardSiswa.jsx` | Load Halaman | `GET /api/siswa/dashboard` | Sinkronisasi statistik, info simulasi terdekat, progress latihan. |
| `SidebarSiswa.jsx` | Data Profil | `GET /api/user/profile` | Sinkronisasi nama, kelas, avatar siswa. |
| `DaftarSimulasi.jsx` | Load Halaman | `GET /api/siswa/simulasi` | Mengambil daftar simulasi yang tersedia/aktif. |
| `KerjakanSoal.jsx` | Submit Jawaban per Soal | `POST /api/siswa/simulasi/{id}/jawaban` | Sinkronisasi *auto-save* untuk tiap soal yang dijawab. Format payload disepakati. |
| `KerjakanSoal.jsx` | Submit Simulasi (Selesai) | `POST /api/siswa/simulasi/{id}/submit` | Pengiriman final (PWA sinkronisasi saat online). |

### C. Modul Admin
| Halaman/Komponen Frontend | Aksi / Trigger | Endpoint Backend API (Rencana) | Keterangan Sinkronisasi |
|---|---|---|---|
| `TambahSimulasi.jsx` | Submit Form Simulasi | `POST /api/admin/simulasi` | Format tanggal & jam dari frontend disesuaikan ke format standar backend (ISO/DateTime). |
| `ManajemenSoal.jsx` | CRUD Soal | `GET, POST, PUT, DELETE /api/admin/soal` | Sinkronisasi data pertanyaan, pilihan ganda, dan kunci jawaban. |
| `ManajemenPengguna.jsx`| CRUD User | `GET, POST, PUT, DELETE /api/admin/users` | Sinkronisasi data siswa, guru, admin. |

### D. Modul Guru
| Halaman/Komponen Frontend | Aksi / Trigger | Endpoint Backend API (Rencana) | Keterangan Sinkronisasi |
|---|---|---|---|
| `DashboardGuru.jsx` | Load Halaman | `GET /api/guru/dashboard` | - |
| `SiswaPerhatian.jsx` | Load Komponen | `GET /api/guru/siswa-perhatian` | Sinkronisasi data analitik siswa yang mendapat nilai rendah / butuh perhatian. |
| `CountdownTKA.jsx` | Timer / Jadwal | `GET /api/guru/jadwal-tka` | Mengambil jadwal ujian TKA berikutnya dari backend. |

## 3. Strategi Sinkronisasi State & PWA
Untuk mendukung reliabilitas aplikasi, terutama saat ujian/simulasi:
1. **Caching Mode:** Gunakan PWA Service Worker untuk *cache* aset statis dan API tertentu yang bersifat *read-only* (seperti profil, soal simulasi).
2. **Background Sync:** Ketika siswa mengerjakan simulasi (`KerjakanSoal.jsx`), jawaban disimpan di *IndexedDB/Local Storage* terlebih dahulu. Frontend secara periodik mengirimkan *request* `auto-save` ke backend. Jika offline, request ditunda (*queue*) dan dikirim kembali (melalui Service Worker Background Sync) saat koneksi kembali (*online*).

## 4. Rencana Langkah Implementasi (Action Plan)
1. **Penyesuaian Utility API:** Membuat fungsi *helper* `api.js` yang secara otomatis membungkus *request* dan mengubah format object respons dari `snake_case` ke `camelCase`.
2. **Integrasi Endpoint di Service / Hooks:** Menambahkan atau menyesuaikan Custom Hooks (misal: `useAuth`, `useSimulasi`) untuk mengakses endpoint backend secara terpusat.
3. **Penerapan Komponen PWA:** Memastikan komponen `IndikatorJaringan.jsx` bereaksi terhadap state *online/offline*, serta mengelola *queue* sinkronisasi jawaban secara *background*.
4. **Testing Integrasi:** Melakukan skenario end-to-end (E2E) untuk fitur CRUD Admin, Monitoring Guru, dan Pengerjaan Latihan Siswa.
