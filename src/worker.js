/* TENANG DI TENGAH RIBUT — Cloudflare Worker (Worksheet App)
 * - Fail statik (index.html, app.js, worksheets/…) dihidang terus oleh Workers Assets.
 * - /api/lesen       : semak kod akses pembeli (jadual `lesen` dalam D1).
 * - /api/rpc/<nama>  : simpan/buka jawapan berasaskan kod rujukan awan (CALM-XXXX-XXXX).
 * Browser tak boleh query jadual terus — hanya fungsi di bawah.
 *
 * Pembolehubah (wrangler secret / vars):
 *   LEGACY_CODES  (pilihan) — senarai kod lama dipisah koma, cth "AKUTENANGBEBAS".
 *                 Buang bila semua pembaca awal dah dapat kod sendiri.
 */

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const fail = (message, status = 400) => json({ data: null, error: { message } }, status);

const validKod = (k) => typeof k === "string" && k.length >= 8 && k.length <= 64;
const validDate = (d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
const validId = (s) => typeof s === "string" && s.length > 0 && s.length <= 100;
const now = () => new Date().toISOString();
const normLesen = (s) => String(s || "").trim().toUpperCase().replace(/\s+/g, "");

const RPC = {
  async save_worksheet(db, p) {
    if (!validKod(p.p_kod)) throw new Error("Kod tidak sah");
    if (!validId(p.p_worksheet_id)) throw new Error("Worksheet tidak sah");
    const data = JSON.stringify(p.p_data ?? {});
    if (data.length > 500_000) throw new Error("Data terlalu besar");
    // Nama tidak lagi disimpan di pelayan (PDPA: minimumkan data peribadi).
    await db
      .prepare(
        `INSERT INTO worksheet_responses (kod, worksheet_id, nama, data)
         VALUES (?1, ?2, NULL, ?3)
         ON CONFLICT (kod, worksheet_id)
         DO UPDATE SET data = excluded.data, nama = NULL, updated_at = ?4`
      )
      .bind(p.p_kod, p.p_worksheet_id, data, now())
      .run();
    return p.p_kod;
  },

  async get_worksheet(db, p) {
    if (!validKod(p.p_kod) || !validId(p.p_worksheet_id)) return null;
    const row = await db
      .prepare(`SELECT data FROM worksheet_responses WHERE kod = ?1 AND worksheet_id = ?2`)
      .bind(p.p_kod, p.p_worksheet_id)
      .first();
    return row ? JSON.parse(row.data) : null;
  },

  async save_stress_log(db, p) {
    if (!validKod(p.p_kod)) throw new Error("Kod tidak sah");
    if (!validDate(p.p_date)) throw new Error("Tarikh tidak sah");
    const level = Number(p.p_level);
    if (!Number.isInteger(level) || level < 1 || level > 10) throw new Error("Tahap tidak sah");
    const note = p.p_note == null ? null : String(p.p_note).slice(0, 2000);
    await db
      .prepare(
        `INSERT INTO stress_logs (kod, log_date, level, note)
         VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT (kod, log_date)
         DO UPDATE SET level = excluded.level, note = excluded.note, updated_at = ?5`
      )
      .bind(p.p_kod, p.p_date, level, note, now())
      .run();
    return null;
  },

  async get_stress_logs(db, p) {
    if (!validKod(p.p_kod) || !validDate(p.p_from) || !validDate(p.p_to)) return [];
    const { results } = await db
      .prepare(
        `SELECT log_date, level, note FROM stress_logs
         WHERE kod = ?1 AND log_date BETWEEN ?2 AND ?3 ORDER BY log_date`
      )
      .bind(p.p_kod, p.p_from, p.p_to)
      .all();
    return results;
  },

  // Hak pengguna (PDPA): padam semua data awan untuk satu kod rujukan.
  async delete_all(db, p) {
    if (!validKod(p.p_kod)) throw new Error("Kod tidak sah");
    await db.batch([
      db.prepare(`DELETE FROM worksheet_responses WHERE kod = ?1`).bind(p.p_kod),
      db.prepare(`DELETE FROM stress_logs WHERE kod = ?1`).bind(p.p_kod),
    ]);
    return true;
  },
};

async function semakLesen(env, kodMentah) {
  const kod = normLesen(kodMentah);
  if (kod.length < 6 || kod.length > 64) return { ok: false };
  const legacy = String(env.LEGACY_CODES || "")
    .split(",")
    .map(normLesen)
    .filter(Boolean);
  if (legacy.includes(kod)) return { ok: true, jenis: "legacy" };
  const row = await env.DB.prepare(`SELECT status FROM lesen WHERE kod = ?1`).bind(kod).first();
  if (!row || row.status !== "aktif") return { ok: false };
  await env.DB.prepare(
    `UPDATE lesen SET kiraan_guna = kiraan_guna + 1,
       guna_pertama = COALESCE(guna_pertama, ?2), guna_terakhir = ?2 WHERE kod = ?1`
  )
    .bind(kod, now())
    .run();
  return { ok: true, jenis: "pembeli" };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/lesen") {
      if (request.method !== "POST") return fail("Method not allowed", 405);
      let body;
      try {
        body = await request.json();
      } catch {
        return fail("JSON tidak sah");
      }
      try {
        const r = await semakLesen(env, body && body.kod);
        return json({ data: r, error: null }, r.ok ? 200 : 403);
      } catch (e) {
        return fail("Ralat pelayan", 500);
      }
    }

    if (url.pathname.startsWith("/api/rpc/")) {
      if (request.method !== "POST") return fail("Method not allowed", 405);
      const name = url.pathname.slice("/api/rpc/".length);
      const fn = Object.hasOwn(RPC, name) ? RPC[name] : null;
      if (!fn) return fail("Fungsi tidak wujud", 404);
      let params;
      try {
        params = await request.json();
      } catch {
        return fail("JSON tidak sah");
      }
      try {
        return json({ data: await fn(env.DB, params || {}), error: null });
      } catch (e) {
        return fail(e.message || "Ralat pelayan", 400);
      }
    }

    if (url.pathname === "/api/health") return json({ ok: true });

    return env.ASSETS.fetch(request);
  },
};
