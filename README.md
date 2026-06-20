# Tenang Di Tengah Ribut — Worksheet Web App

Web app worksheet pengurusan stres & kecemasan, berasaskan ebook **Tenang Di Tengah Ribut** —
panduan praktikal untuk rakyat Malaysia.

## 🌿 Ciri Utama

- **10 bab worksheet interaktif** — Peta Stres, Peta Badan, Thought Record, Toolkit Emosi,
  Roda Kehidupan, Audit Gaya Hidup, Peta Sokongan, Habit Tracker 30 Hari,
  Pelan Kecemasan, Blueprint 90 Hari.
- **Halaman Rumah** dengan kutipan harian, statistik perjalanan, dan akses cepat.
- **Rekod / Sejarah** — kalendar bulanan tunjuk semua tarikh ada rekod, dengan titik
  berwarna ikut tahap stres.
- **Auto-simpan** dalam telefon (localStorage) + segerak awan opsyenal melalui Supabase
  dengan kod rujukan anonymous `CALM-XXXX-XXXX`.
- **Privacy-first**: tiada login, tiada email, tiada akaun. Customer kekal anonymous.
- **Mobile-first** — direka untuk telefon.

## 🚀 Cara Guna

Buka [https://syafixit.github.io/TDTRWORKSHEET/](https://syafixit.github.io/TDTRWORKSHEET/)
di browser telefon atau komputer.

## 📂 Struktur

```
.
├── index.html              ← pintu masuk app
├── app.js                  ← teras: sidebar, router, awan
├── styles.css              ← reka bentuk semua
└── worksheets/
    ├── rumah.js            ← halaman landing
    ├── rekod.js            ← kalendar / sejarah
    └── bab1.js … bab10.js  ← 10 modul worksheet
```

## 🛡️ Privasi & Keselamatan

Web app ini direka dengan privasi sebagai keutamaan:
- **Tiada akaun diperlukan** — anonymous by design
- **Kod rujukan** (`CALM-XXXX-XXXX`) berfungsi sebagai password sahaja
- Data disulit melalui RLS Supabase + RPC `SECURITY DEFINER`
- Tiada email, tiada nombor telefon, tiada identifier yang boleh dijejak

## 🌱 Lesen

Hak cipta © 2026 Tenang Di Tengah Ribut. Worksheet ni sebahagian dari ebook
"Tenang Di Tengah Ribut" — Panduan Praktikal Pengurusan Stres & Kecemasan
untuk Rakyat Malaysia.
