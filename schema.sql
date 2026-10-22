-- TENANG DI TENGAH RIBUT — Cloudflare D1 schema
-- Akses hanya melalui Worker (/api/*). Tiada akses terus dari browser.

CREATE TABLE IF NOT EXISTS worksheet_responses (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  kod           TEXT NOT NULL,
  worksheet_id  TEXT NOT NULL,
  nama          TEXT,
  data          TEXT NOT NULL DEFAULT '{}',
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (kod, worksheet_id)
);

CREATE TABLE IF NOT EXISTS stress_logs (
  kod        TEXT NOT NULL,
  log_date   TEXT NOT NULL,
  level      INTEGER NOT NULL CHECK (level BETWEEN 1 AND 10),
  note       TEXT,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (kod, log_date)
);

-- Kod akses pembeli. Diisi oleh Worker pembayaran (CHIP) selepas bayaran berjaya,
-- atau secara manual: INSERT INTO lesen (kod, nota) VALUES ('TDTR-XXXX-XXXX-XXXX', 'manual');
CREATE TABLE IF NOT EXISTS lesen (
  kod            TEXT PRIMARY KEY,
  pesanan_id     TEXT,
  pakej          TEXT,
  status         TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif','dibatal')),
  nota           TEXT,
  dicipta        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  guna_pertama   TEXT,
  guna_terakhir  TEXT,
  kiraan_guna    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS lesen_pesanan ON lesen (pesanan_id);

-- Kolum `nama` dalam worksheet_responses tidak lagi diisi (sejak Okt 2026).
-- Untuk padam nama lama yang pernah disimpan:  UPDATE worksheet_responses SET nama = NULL;
