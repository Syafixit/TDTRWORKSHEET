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
- **Auto-simpan** dalam telefon (localStorage) + segerak awan opsyenal melalui Cloudflare D1
  dengan kod rujukan anonymous `CALM-XXXX-XXXX`.
- **Privacy-first**: tiada login, tiada akaun. Nama tidak dihantar ke pelayan.
- **Mobile-first** — direka untuk telefon. Boleh dipasang sebagai app (PWA) dan dibuka tanpa internet.
- **Tenang Sekarang** — latihan nafas berpandu (Physiological Sigh, Box, 4-7-8, 5-5) + Grounding 5-4-3-2-1.
- **Butang SOS** di setiap halaman — 999, HEAL 15555, Befrienders KL, MIASA, Talian Kasih (tap untuk telefon).
- **Kod akses per pembeli** — disemak di pelayan (`/api/lesen`, jadual `lesen`). Tiada kod dalam kod sumber.
- **Kawalan data** — persetujuan sebelum Simpan Awan, padam data awan, sandaran/pulih fail JSON, padam data peranti.

## 🚀 Cara Guna

Buka [https://tdtrws.simetry.digital](https://tdtrws.simetry.digital)
di browser telefon atau komputer.

## 📂 Struktur

```
.
├── index.html              ← pintu masuk app
├── app.js                  ← teras: sidebar, router, awan
├── src/worker.js           ← Cloudflare Worker: API /api/rpc/* + hidang fail statik
├── schema.sql              ← skema D1
├── wrangler.jsonc          ← config Cloudflare (D1 + domain tdtrws.simetry.digital)
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
- Data dalam Cloudflare D1, hanya boleh dicapai melalui API Worker (`/api/rpc/*`) dengan kod rujukan
- Tiada email, tiada nombor telefon, tiada identifier yang boleh dijejak

## 🌱 Lesen

Hak cipta © 2026 Tenang Di Tengah Ribut. Worksheet ni sebahagian dari ebook
"Tenang Di Tengah Ribut" — Panduan Praktikal Pengurusan Stres & Kecemasan
untuk Rakyat Malaysia.

## ☁️ Deploy (Cloudflare)

- Hosting: Cloudflare Workers (static assets) di `tdtrws.simetry.digital`
- Database: D1 `tdtrworksheet` (dipindah dari Supabase)
- Deploy manual: `npm i && npx wrangler deploy`
- Skema baru (jadual `lesen`): `npm run db:schema` (selamat diulang — guna `IF NOT EXISTS`)
- Tambah kod akses manual: `npx wrangler d1 execute tdtrworksheet --remote --command "INSERT INTO lesen (kod, nota) VALUES ('TDTR-XXXX-XXXX-XXXX','manual')"`
- Kod lama `AKUTENANGBEBAS` masih diterima melalui `LEGACY_CODES` dalam `wrangler.jsonc` — kosongkan bila pembaca awal dah dapat kod sendiri.
- Pautan terus dari emel: `https://<domain>/#kod=TDTR-XXXX-XXXX-XXXX` (app buka sendiri).
