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
