Act as a Principal React Architect and Project Manager. You have full workspace access.

We are going to execute a MASSIVE structural refactoring of the "Portal Latihan TKA" project.
The goals are:

1. Translate all custom file and folder names into Indonesian (excluding core React/Vite boilerplate like `src`, `public`, `App.jsx`, `main.jsx`, `package.json`, etc.).
2. Consolidate all role-specific component folders. Remove `src/[role]/components` and move them into a centralized global components directory categorized by role subfolders (e.g., `src/komponen/admin`, `src/komponen/guru`, `src/komponen/siswa`).

YOUR TASK:
DO NOT EXECUTE THE REFACTORING YET.
Your only task right now is to generate a comprehensive execution plan and save it into a Markdown file named `Rencana_Refactoring.md` in the root directory.

The `Rencana_Refactoring.md` file must contain:

# Rencana Refactoring Struktur & Penamaan Berbahasa Indonesia

## 1. Pemetaan Struktur Folder & File (Mapping)

Create a detailed Tree structure mapping the OLD paths to the NEW Indonesian paths.
Example:

- `src/admin/pages/GlobalReports.jsx` -> `src/admin/halaman/LaporanGlobal.jsx`
- `src/student/pages/PreSimulation.jsx` -> `src/siswa/halaman/PraSimulasi.jsx`

## 2. Sentralisasi Komponen

Detail the movement of component files:

- `src/admin/components/*` moves to -> `src/komponen/admin/*`
- `src/guru/components/*` moves to -> `src/komponen/guru/*`
- `src/student/components/*` moves to -> `src/komponen/siswa/*`

## 3. Daftar File yang Terdampak (Dependency Graph)

List the core files that will need massive import path updates (e.g., `App.jsx` for routing, layout files, and context providers).

## 4. Urutan Eksekusi (Execution Steps)

Define the step-by-step phases you will take once approved (e.g., Phase 1: Rename folders, Phase 2: Move components, Phase 3: Update all imports across the workspace, Phase 4: Fix routing).

CRITICAL RULES FOR THIS PROMPT:

- Write the content of the `.md` file in professional Indonesian.
- USE YOUR FILE SYSTEM TOOLS to actually create/write the `Rencana_Refactoring.md` file in the root folder.
- DO NOT rename any existing files, move any folders, or change any code yet.
- Reply ONLY with a confirmation that the `Rencana_Refactoring.md` file has been created, and end your response with this exact question: "File Rencana_Refactoring.md telah dibuat. Silakan periksa file tersebut. Apakah Anda menyetujui rencana pemetaan ini untuk dieksekusi sekarang?" Wait for my explicit approval.
