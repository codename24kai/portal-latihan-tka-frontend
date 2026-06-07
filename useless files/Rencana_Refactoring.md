# Rencana Refactoring Struktur & Penamaan Berbahasa Indonesia

## 1. Pemetaan Struktur Folder & File (Mapping)

### 1.1 Folder Utama (Tingkat Pertama di dalam `src/`)

| Path Lama           | Path Baru            | Keterangan                              |
| ------------------- | -------------------- | --------------------------------------- |
| `src/admin/`      | `src/admin/`       | Tetap (sudah Bahasa Indonesia-friendly) |
| `src/student/`    | `src/siswa/`       | Rename ke Bahasa Indonesia              |
| `src/guru/`       | `src/guru/`        | Tetap                                   |
| `src/auth/`       | `src/autentikasi/` | Rename                                  |
| `src/components/` | `src/komponen/`    | Rename + jadi pusat sentralisasi        |
| `src/constants/`  | `src/konstanta/`   | Rename                                  |
| `src/context/`    | `src/konteks/`     | Rename                                  |
| `src/data/`       | `src/data/`        | Tetap                                   |
| `src/hooks/`      | `src/hooks/`       | Tetap (konvensi React)                  |
| `src/utils/`      | `src/utilitas/`    | Rename                                  |
| `src/assets/`     | `src/aset/`        | Rename                                  |

### 1.2 Subfolder Role — `pages` → `halaman`, `layouts` → `tata-letak`

| Path Lama                   | Path Baru                                            |
| --------------------------- | ---------------------------------------------------- |
| `src/admin/pages/`        | `src/admin/halaman/`                               |
| `src/admin/layouts/`      | tetap sama                                           |
| `src/admin/components/`   | **HAPUS** → pindah ke `src/komponen/admin/` |
| `src/guru/pages/`         | `src/guru/halaman/`                                |
| `src/guru/layouts/`       | tetap sama                                           |
| `src/guru/components/`    | **HAPUS** → pindah ke `src/komponen/guru/`  |
| `src/student/pages/`      | `src/siswa/halaman/`                               |
| `src/student/layouts/`    | tetap sama                                           |
| `src/student/components/` | **HAPUS** → pindah ke `src/komponen/siswa/` |
| `src/student/utils/`      | `src/siswa/utilitas/`                              |

### 1.3 Pemetaan File — Admin

#### Halaman (`src/admin/pages/` → `src/admin/halaman/`)

| File Lama                  | File Baru                  |
| -------------------------- | -------------------------- |
| `AdminDashboard.jsx`     | `DashboardAdmin.jsx`     |
| `QuestionBank.jsx`       | `BankSoal.jsx`           |
| `TryoutManagement.jsx`   | `ManajemenTryout.jsx`    |
| `ScoreReports.jsx`       | `LaporanNilai.jsx`       |
| `UserManagement.jsx`     | `ManajemenPengguna.jsx`  |
| `ModuleManagement.jsx`   | `ManajemenModul.jsx`     |
| `AddTryout.jsx`          | `TambahTryout.jsx`       |
| `AddModule.jsx`          | `TambahModul.jsx`        |
| `AddUser.jsx`            | `TambahPengguna.jsx`     |
| `AddQuestion.jsx`        | `TambahSoal.jsx`         |
| `AdminSurveyReports.jsx` | `LaporanSurveiAdmin.jsx` |

#### Komponen (`src/admin/components/` → `src/komponen/admin/`)

| File Lama                                             | File Baru                                         |
| ----------------------------------------------------- | ------------------------------------------------- |
| `DataTable.jsx`                                     | `TabelData.jsx`                                 |
| `Sidebar.jsx`                                       | `SidebarAdmin.jsx`                              |
| `StatCard.jsx`                                      | `KartuStatistik.jsx`                            |
| `TryoutForm.jsx`                                    | `FormTryout.jsx`                                |
| `QuestionForm.jsx`                                  | `FormSoal.jsx`                                  |
| `VisualMathEditor.jsx`                              | `EditorMatematikaVisual.jsx`                    |
| `dashboard/AdminHeader.jsx`                         | `dashboard/HeaderAdmin.jsx`                     |
| `dashboard/StatCards.jsx`                           | `dashboard`/KartuStatistik.jsx`                 |
| `dashboard/AlertSection.jsx`                        | `dashboard/SeksiPeringatan.jsx`                 |
| `dashboard/DashboardCharts.jsx`                     | `dashboard/GrafikDasbor.jsx`                    |
| `dashboard/DashboardCalendar.jsx`                   | `dashboard/KalenderDasbor.jsx`                  |
| `dashboard/TryoutStatus.jsx`                        | `dashboard/StatusTryout.jsx`                    |
| `dashboard/SiswaPerhatianTable.jsx`                 | `dashboard/TabelSiswaPerhatian.jsx`             |
| `dashboard/ActivityLog.jsx`                         | `dashboard/LogAktivitas.jsx`                    |
| `dashboard/QuestionBankSummary.jsx`                 | `dashboard/RingkasanBankSoal.jsx`               |
| `ModuleManagement/QuizBuilder.jsx`                  | `ManajemenModul/PembuatKuis.jsx`                |
| `QuestionBank/AnswerDropdown.jsx`                   | `BankSoal/DropdownJawaban.jsx`                  |
| `QuestionBank/PreviewModal.jsx`                     | `BankSoal/ModalPratinjau.jsx`                   |
| `QuestionBank/ImportModal.jsx`                      | `BankSoal/ModalImpor.jsx`                       |
| `QuestionBuilder/QuestionStemEditor.jsx`            | `PembuatSoal/EditorBatangSoal.jsx`              |
| `QuestionBuilder/QuestionMetaPanel.jsx`             | `PembuatSoal/PanelMetaSoal.jsx`                 |
| `QuestionBuilder/ExplanationPanel.jsx`              | `PembuatSoal/PanelPenjelasan.jsx`               |
| `QuestionBuilder/QuestionPreview.jsx`               | `PembuatSoal/PratinjauSoal.jsx`                 |
| `QuestionBuilder/strategies/SingleChoiceEditor.jsx` | `PembuatSoal/strategi/EditorPilihanTunggal.jsx` |
| `QuestionBuilder/strategies/MultiChoiceEditor.jsx`  | `PembuatSoal/strategi/EditorPilihanGanda.jsx`   |
| `QuestionBuilder/strategies/TrueFalseEditor.jsx`    | `PembuatSoal/strategi/EditorBenarSalah.jsx`     |
| `QuestionBuilder/strategies/EssayEditor.jsx`        | `PembuatSoal/strategi/EditorEsai.jsx`           |

### 1.4 Pemetaan File — Guru

#### Halaman (`src/guru/pages/` → `src/guru/halaman/`)

| File Lama                 | File Baru                |
| ------------------------- | ------------------------ |
| `GuruDashboard.jsx`     | `DashboardGuru.jsx`    |
| `GuruStudentList.jsx`   | `DaftarSiswaGuru.jsx`  |
| `GuruScoreReports.jsx`  | `LaporanNilaiGuru.jsx` |
| `GuruAgenda.jsx`        | `AgendaGuru.jsx`       |
| `GuruManageModules.jsx` | `KelolaModulGuru.jsx`  |
| `GuruAddModule.jsx`     | `TambahModulGuru.jsx`  |
| `GuruManageQuizzes.jsx` | `KelolaKuisGuru.jsx`   |
| `GuruAddQuiz.jsx`       | `TambahKuisGuru.jsx`   |
| `SurveyReports.jsx`     | `LaporanSurvei.jsx`    |

#### Layout (`src/guru/layouts/` → `src/guru/tata-letak/`)

| File Lama          | File Baru             |
| ------------------ | --------------------- |
| `GuruLayout.jsx` | `TataLetakGuru.jsx` |

#### Komponen (`src/guru/components/` → `src/komponen/guru/`)

| File Lama                                | File Baru                              |
| ---------------------------------------- | -------------------------------------- |
| `GuruSidebar.jsx`                      | `SidebarGuru.jsx`                    |
| `GuruVisualMathEditor.jsx`             | `EditorMatematikaVisualGuru.jsx`     |
| `ModuleManagement/GuruQuizBuilder.jsx` | `ManajemenModul/PembuatKuisGuru.jsx` |

### 1.5 Pemetaan File — Siswa (student)

#### Halaman (`src/student/pages/` → `src/siswa/halaman/`)

| File Lama                | File Baru               |
| ------------------------ | ----------------------- |
| `StudentDashboard.jsx` | `DashboardSiswa.jsx`  |
| `StudentTest.jsx`      | `TesSiswa.jsx`        |
| `StudentModul.jsx`     | `ModulSiswa.jsx`      |
| `StudentSetting.jsx`   | `PengaturanSiswa.jsx` |
| `ModuleQuiz.jsx`       | `KuisModul.jsx`       |
| `ExamExecution.jsx`    | `EksekusiUjian.jsx`   |
| `ExamResult.jsx`       | `HasilUjian.jsx`      |
| `PreSimulation.jsx`    | `PraSimulasi.jsx`     |
| `HelpCenter.jsx`       | `PusatBantuan.jsx`    |
| `SurveyExecution.jsx`  | `EksekusiSurvei.jsx`  |
| `SurveyComplete.jsx`   | `SurveiSelesai.jsx`   |

#### Layout (`src/student/layouts/` → `src/siswa/tata-letak/`)

| File Lama             | File Baru           |
| --------------------- | ------------------- |
| `StudentLayout.jsx` | `LayoutSiswa.jsx` |

#### Komponen (`src/student/components/` → `src/komponen/siswa/`)

| File Lama                                      | File Baru                                   |
| ---------------------------------------------- | ------------------------------------------- |
| `Sidebar.jsx`                                | `SidebarSiswa.jsx`                        |
| `ExamFallback.jsx`                           | `FallbackUjian.jsx`                       |
| `ExamHeader.jsx`                             | `HeaderUjian.jsx`                         |
| `ExamNavBar.jsx`                             | `NavBarUjian.jsx`                         |
| `FloatingGuide.jsx`                          | `PanduanMelayang.jsx`                     |
| `LoginStreakModal.jsx`                       | `ModalStreakLogin.jsx`                    |
| `MissionCard.jsx`                            | `KartuMisi.jsx`                           |
| `ModuleQuizModal.jsx`                        | `ModalKuisModul.jsx`                      |
| `NotificationDropdown.jsx`                   | `DropdownNotifikasi.jsx`                  |
| `OptionCard.jsx`                             | `KartuOpsi.jsx`                           |
| `ProfileHeader.jsx`                          | `HeaderProfil.jsx`                        |
| `ProfilePicModal.jsx`                        | `ModalFotoProfil.jsx`                     |
| `QuestionContent.jsx`                        | `KontenSoal.jsx`                          |
| `QuestionNavigator.jsx`                      | `NavigatorSoal.jsx`                       |
| `QuizGuideModal.jsx`                         | `ModalPanduanKuis.jsx`                    |
| `QuizResult.jsx`                             | `HasilKuis.jsx`                           |
| `Dashboard/CountdownTimer.jsx`               | `Dasbor/PenghitungWaktu.jsx`              |
| `Dashboard/ProgressWidgets.jsx`              | `Dasbor/WidgetProgres.jsx`                |
| `QuestionRenderers/SingleChoiceRenderer.jsx` | `RendererSoal/RendererPilihanTunggal.jsx` |
| `QuestionRenderers/MultiChoiceRenderer.jsx`  | `RendererSoal/RendererPilihanGanda.jsx`   |
| `QuestionRenderers/TrueFalseRenderer.jsx`    | `RendererSoal/RendererBenarSalah.jsx`     |
| `QuestionRenderers/EssayRenderer.jsx`        | `RendererSoal/RendererEsai.jsx`           |
| `Survey/SurveyHeader.jsx`                    | `Survei/HeaderSurvei.jsx`                 |
| `Survey/SurveyOptionCard.jsx`                | `Survei/KartuOpsiSurvei.jsx`              |

#### Utilitas (`src/student/utils/` → `src/siswa/utilitas/`)

| File Lama             | File Baru                |
| --------------------- | ------------------------ |
| `guideContent.js`   | `kontenPanduan.js`     |
| `profileStorage.js` | `penyimpananProfil.js` |

### 1.6 Pemetaan File — Shared/Global

#### Komponen UI (`src/components/` → `src/komponen/`)

| File Lama                    | File Baru                      |
| ---------------------------- | ------------------------------ |
| `NetworkIndicator.jsx`     | `IndikatorJaringan.jsx`      |
| `ui/Badge.jsx`             | `ui/Badge.jsx` (tetap)       |
| `ui/ConfirmDialog.jsx`     | `ui/DialogKonfirmasi.jsx`    |
| `ui/DataTable.jsx`         | `ui/TabelData.jsx`           |
| `ui/Dropdown.jsx`          | `ui/Dropdown.jsx` (tetap)    |
| `ui/EmptyState.jsx`        | `ui/StatusKosong.jsx`        |
| `ui/FilePreviewUpload.jsx` | `ui/UnggahPratinjauFile.jsx` |
| `ui/LoadingSkeleton.jsx`   | `ui/SkeletonMemuat.jsx`      |
| `ui/MathRenderer.jsx`      | `ui/RendererMatematika.jsx`  |
| `ui/ProgressBar.jsx`       | `ui/BarProgres.jsx`          |
| `ui/ToastProvider.jsx`     | `ui/PenyediaToast.jsx`       |

#### Konteks (`src/context/` → `src/konteks/`)

| File Lama            | File Baru               |
| -------------------- | ----------------------- |
| `ThemeContext.jsx` | `KonteksTema.jsx`     |
| `UserContext.jsx`  | `KonteksPengguna.jsx` |

#### Konstanta (`src/constants/` → `src/konstanta/`)

| File Lama        | File Baru            |
| ---------------- | -------------------- |
| `questions.js` | `soal.js`          |
| `subjects.js`  | `mataPelajaran.js` |

#### Data (`src/data/` — tetap)

| File Lama                  | File Baru               |
| -------------------------- | ----------------------- |
| `mockExams.js`           | `mockUjian.js`        |
| `mockQuestions.js`       | `mockSoal.js`         |
| `mockQuestionsV2.js`     | `mockSoalV2.js`       |
| `mockStudents.js`        | `mockSiswa.js`        |
| `mockSurveyResponses.js` | `mockResponSurvei.js` |
| `mockSurveys.js`         | `mockSurvei.js`       |

#### Utilitas (`src/utils/` → `src/utilitas/`)

| File Lama            | File Baru             |
| -------------------- | --------------------- |
| `formatTime.js`    | `formatWaktu.js`    |
| `scoringEngine.js` | `mesinPenilaian.js` |

#### Hooks (`src/hooks/` — tetap)

| File Lama               | File Baru                |
| ----------------------- | ------------------------ |
| `useCountdown.js`     | `useHitungMundur.js`   |
| `useDarkMode.js`      | `useModGelap.js`       |
| `useNetworkStatus.js` | `useStatusJaringan.js` |

#### Autentikasi (`src/auth/` → `src/autentikasi/`)

| File Lama     | File Baru     |
| ------------- | ------------- |
| `Login.jsx` | `Masuk.jsx` |

#### Aset (`src/assets/` → `src/aset/`)

| File Lama    | File Baru            |
| ------------ | -------------------- |
| `hero.png` | `hero.png` (tetap) |

---

## 2. Sentralisasi Komponen

### Prinsip Utama

Semua komponen yang sebelumnya berada di dalam folder role-specific (`src/admin/components/`, `src/guru/components/`, `src/student/components/`) akan dipindahkan ke folder global terpusat:

```
src/komponen/
├── admin/          ← dari src/admin/components/
│   ├── dasbor/
│   ├── BankSoal/
│   ├── PembuatSoal/
│   │   └── strategi/
│   ├── ManajemenModul/
│   ├── SidebarAdmin.jsx
│   ├── KartuStatistik.jsx
│   ├── TabelData.jsx
│   ├── FormTryout.jsx
│   ├── FormSoal.jsx
│   └── EditorMatematikaVisual.jsx
├── guru/           ← dari src/guru/components/
│   ├── ManajemenModul/
│   ├── SidebarGuru.jsx
│   └── EditorMatematikaVisualGuru.jsx
├── siswa/          ← dari src/student/components/
│   ├── Dasbor/
│   ├── RendererSoal/
│   ├── Survei/
│   ├── SidebarSiswa.jsx
│   ├── HeaderUjian.jsx
│   ├── NavBarUjian.jsx
│   ├── ... (semua komponen siswa lainnya)
│   └── HasilKuis.jsx
├── ui/             ← dari src/components/ui/ (tetap di sini)
│   ├── Badge.jsx
│   ├── DialogKonfirmasi.jsx
│   ├── TabelData.jsx
│   └── ... (komponen UI global lainnya)
└── IndikatorJaringan.jsx
```

### Detail Perpindahan

| Sumber (Lama)                           | Tujuan (Baru)                          |
| --------------------------------------- | -------------------------------------- |
| `src/admin/components/*`              | `src/komponen/admin/*`               |
| `src/guru/components/*`               | `src/komponen/guru/*`                |
| `src/student/components/*`            | `src/komponen/siswa/*`               |
| `src/components/ui/*`                 | `src/komponen/ui/*`                  |
| `src/components/NetworkIndicator.jsx` | `src/komponen/IndikatorJaringan.jsx` |

---

## 3. Daftar File yang Terdampak (Dependency Graph)

### 3.1 File Inti yang Memerlukan Update Import Masif

| File             | Alasan                     | Jumlah Import Terdampak |
| ---------------- | -------------------------- | ----------------------- |
| `src/App.jsx`  | Semua route import berubah | ~25 import              |
| `src/main.jsx` | Import context & CSS       | 2 import                |

### 3.2 File Layout (Terdampak Berat)

| File Lama                                 | Import yang Harus Diubah                                                                                              |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `src/admin/layouts/AdminLayout.jsx`     | Sidebar, useDarkMode, AdminHeader                                                                                     |
| `src/guru/layouts/GuruLayout.jsx`       | GuruSidebar, useDarkMode                                                                                              |
| `src/student/layouts/StudentLayout.jsx` | useDarkMode, NetworkIndicator, useNetworkStatus, FloatingGuide, Sidebar, ProfileHeader, NotificationDropdown, useUser |

### 3.3 File Halaman Admin (11 file)

Setiap file halaman admin mengimpor dari:

- `@/components/ui/*` → `@/komponen/ui/*`
- `@/constants/*` → `@/konstanta/*`
- `@/data/*` → data path baru
- `../components/*` → `@/komponen/admin/*`

### 3.4 File Halaman Guru (9 file)

Setiap file halaman guru mengimpor dari:

- `../../components/ui/*` → `@/komponen/ui/*`
- `../../data/*` → data path baru
- `../../hooks/*` → `@/hooks/*`
- `../components/*` → `@/komponen/guru/*`

### 3.5 File Halaman Siswa (11 file)

Setiap file halaman siswa mengimpor dari:

- `../../components/ui/*` → `@/komponen/ui/*`
- `../../data/*` → data path baru
- `../../hooks/*` → `@/hooks/*`
- `../components/*` → `@/komponen/siswa/*`
- `../../context/*` → `@/konteks/*`
- `../../utils/*` → `@/utilitas/*`

### 3.6 File Komponen yang Mengimpor Lintas Folder

| File Komponen                                            | Import Lintas Folder                                        |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| `student/components/ExamHeader.jsx`                    | `utils/formatTime`, `hooks/useDarkMode`                 |
| `student/components/Sidebar.jsx`                       | `components/ui/ConfirmDialog`, `context/UserContext`    |
| `student/components/ProfileHeader.jsx`                 | `components/NetworkIndicator`, `context/UserContext`    |
| `student/components/FloatingGuide.jsx`                 | `student/utils/guideContent`                              |
| `student/components/MissionCard.jsx`                   | `utils/formatTime`                                        |
| `student/components/QuizResult.jsx`                    | `components/ui/MathRenderer`                              |
| `student/components/QuestionContent.jsx`               | `components/ui/MathRenderer`                              |
| `student/components/OptionCard.jsx`                    | `components/ui/MathRenderer`                              |
| `student/components/ModuleQuizModal.jsx`               | `components/ui/MathRenderer`                              |
| `student/components/Dashboard/ProgressWidgets.jsx`     | `components/ui/ProgressBar`                               |
| `student/components/QuestionRenderers/*.jsx`           | `components/ui/MathRenderer`                              |
| `admin/components/Sidebar.jsx`                         | `components/ui/ConfirmDialog`                             |
| `admin/components/TryoutForm.jsx`                      | `constants/subjects`, `components/ui/*`                 |
| `admin/components/QuestionForm.jsx`                    | `constants/subjects`, `components/ui/FilePreviewUpload` |
| `admin/components/dashboard/TryoutStatus.jsx`          | `components/ui/Badge`                                     |
| `admin/components/dashboard/DashboardCalendar.jsx`     | `components/ui/Badge`                                     |
| `admin/components/QuestionBuilder/*.jsx`               | `components/ui/MathRenderer`, `constants/*`             |
| `admin/components/QuestionBank/*.jsx`                  | `components/ui/MathRenderer`, `constants/*`             |
| `guru/components/GuruSidebar.jsx`                      | `components/ui/ConfirmDialog`                             |
| `guru/components/ModuleManagement/GuruQuizBuilder.jsx` | `components/ui/Dropdown`, `components/ui/MathRenderer`  |
| `utils/scoringEngine.js`                               | `constants/questions`                                     |

---

## 4. Urutan Eksekusi (Execution Steps)

### Fase 1: Persiapan & Backup

1. Pastikan semua perubahan tersimpan di Git
2. Buat branch baru: `refactor/bahasa-indonesia`
3. Catat snapshot struktur folder saat ini

### Fase 2: Rename Folder Shared/Global

Urutan:

1. `src/components/` → `src/komponen/`
2. `src/constants/` → `src/konstanta/`
3. `src/context/` → `src/konteks/`
4. `src/utils/` → `src/utilitas/`
5. `src/assets/` → `src/aset/`
6. `src/auth/` → `src/autentikasi/`

### Fase 3: Rename Subfolder Role

1. `src/student/` → `src/siswa/`
2. `src/admin/pages/` → `src/admin/halaman/`
3. `src/guru/pages/` → `src/guru/halaman/`
4. `src/siswa/pages/` → `src/siswa/halaman/`
5. `src/siswa/utils/` → `src/siswa/utilitas/`

### Fase 4: Sentralisasi Komponen

1. Pindahkan `src/admin/components/*` → `src/komponen/admin/*`
2. Pindahkan `src/guru/components/*` → `src/komponen/guru/*`
3. Pindahkan `src/siswa/components/*` → `src/komponen/siswa/*`
4. Hapus folder `components/` kosong dari setiap role

### Fase 5: Rename File Individual

1. Rename semua file halaman admin (11 file)
2. Rename semua file halaman guru (9 file)
3. Rename semua file halaman siswa (11 file)
4. Rename file layout (3 file)
5. Rename file komponen admin (28 file)
6. Rename file komponen guru (3 file)
7. Rename file komponen siswa (26 file)
8. Rename file komponen UI global (11 file)
9. Rename file konteks (2 file)
10. Rename file konstanta (2 file)
11. Rename file data (6 file)
12. Rename file utilitas (2 file)
13. Rename file hooks (3 file)
14. Rename file autentikasi (1 file)

### Fase 6: Update Semua Import

1. Update `src/App.jsx` — semua 25+ import path
2. Update `src/main.jsx` — 2 import path
3. Update semua file halaman admin (11 file)
4. Update semua file halaman guru (9 file)
5. Update semua file halaman siswa (11 file)
6. Update semua file layout (3 file)
7. Update semua file komponen yang mengimpor lintas folder (21+ file)
8. Update file utilitas (`mesinPenilaian.js`)
9. Gunakan alias `@/` secara konsisten di seluruh project

### Fase 7: Validasi Routing

1. Pastikan semua route di `App.jsx` mengarah ke komponen yang benar
2. Pastikan `RequireAuth` wrapper masih berfungsi
3. Validasi nested routes untuk admin, guru, dan siswa

### Fase 8: Validasi Build & Testing

1. Jalankan `npm run build` untuk memastikan tidak ada error
2. Periksa tidak ada warning `Module not found`
3. Periksa tidak ada circular dependency
4. Jalankan dev server dan tes navigasi

### Fase 9: Pembersihan & Dokumentasi

1. Hapus folder kosong bekas pemindahan
2. Cari file orphan yang tidak diimpor di manapun
3. Generate laporan hasil refactoring ke `Hasil_Refactoring.md`
4. Commit dan push perubahan

---

## Catatan Penting

> **PERINGATAN:** File boilerplate React/Vite berikut TIDAK akan di-rename:
>
> - `src/App.jsx`
> - `src/main.jsx`
> - `src/index.css`
> - `package.json`
> - `vite.config.js`
> - `jsconfig.json`
> - `index.html`

> **STRATEGI IMPORT:** Setelah refactoring, semua import akan menggunakan alias `@/` secara konsisten untuk menghindari relative path yang panjang dan rapuh.
