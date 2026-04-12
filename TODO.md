# Project Update: Work Detail Tabs (Idea, UI/UX, Development)

## Overview
Menambahkan fitur "Behind the Scenes" pada halaman detail project (Work). Tepat di bawah media preview, akan ada hingga 3 tombol:
- **Idea**: Membahas konsep awal, diskusi dengan Project Manager, dan tujuan project.
- **UI/UX**: Membahas proses desain, wireframing, dan keputusan tampilan.
- **Development**: Membahas arsitektur kode, teknologi yang digunakan, serta tantangan dalam development.

Setiap tombol akan membuka sebuah **Side Panel** (mirip Sheet di shadcn-ui) yang dapat di-*toggle* menjadi mode **Full Screen** (Full Mode) atau dapat **ditutup**. Fitur ini bersifat dinamis; tombol hanya akan muncul apabila konten MDX untuk topik tersebut tersedia.

---

## Rencana Langkah-Langkah (Step-by-Step Plan)

### 1. Persiapan Struktur Konten (MDX)
Daripada menggabungkan semuanya dalam satu file MDX yang panjang, kita akan memanfaatkan kemampuan Next.js + Fumadocs untuk meload page yang berada di dalam folder slug-nya.
- Saat ini: `content/work/21oss.mdx` (halaman utama).
- Tambahan: 
  - `content/work/21oss/idea.mdx`
  - `content/work/21oss/uiux.mdx`
  - `content/work/21oss/development.mdx`
- *Setiap file tersebut dapat diisi dengan Markdown sesuai dengan topik yang dibahas.*

### 2. Pembuatan Komponen Panel Interaktif (`components/work-side-panel.tsx`)
Membuat komponen React client-side yang menangani tampilan Sheet / Side Panel.
- **Fitur Komponen:**
  - `framer-motion` (opsional) atau CSS transition biasa untuk animasi *slide-in* dari kanan.
  - State mode: `isFullMode` (menentukan apakah lebar panel 100% atau lebar default mis. `max-w-2xl`).
  - Overlay (background gelap translusen).
  - Tombol Close (X).
  - Tombol Toggle Fullscreen (Bisa berupa ikon expand/collapse).
  - Mengambil `children` berupa konten MDX yang sudah di-render.

### 3. Modifikasi Halaman Work Slug (`app/(sections)/work/[slug]/page.tsx`)
- Lakukan fetching tambahan:
  - `const ideaPage = workSource.getPage([slug, "idea"]);`
  - `const uiuxPage = workSource.getPage([slug, "uiux"]);`
  - `const devPage = workSource.getPage([slug, "development"]);`
- Tambahkan container khusus tepat di bawah bagian preview `media` dengan deretan tombol.
- Tombol hanya dirender jika halaman tambahannya (`ideaPage`, `uiuxPage`, dll) *exist*.
- Hubungkan masing-masing tombol dengan state aktif untuk membuka `WorkSidePanel` dengan konten MDX yang relevan.

### 4. Implementasi MDX di Client Server
- Karena MDX menggunakan RSC (React Server Components), kita dapat melempar `MDX components` (hasil render `<MDX components={...} />`) langsung sebagai `children` ke dalam komponen stateful `WorkSidePanel`.

---

## Status Pengerjaan
- [ ] Buat kerangka folder MDX tambahan untuk uji coba (misal: `content/work/21oss/...`)
- [ ] Buat file `components/work-side-panel.tsx`
- [ ] Modifikasi halaman `app/(sections)/work/[slug]/page.tsx`
- [ ] Uji coba interaktif, animasi, dan pastikan "Full Mode" berjalan dengan baik.
