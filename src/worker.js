/* TENANG DI TENGAH RIBUT — Cloudflare Worker
 * - Static files (index.html, app.js, worksheets/…) dihidang terus oleh Workers Assets.
 * - /api/rpc/<nama> ganti RPC Supabase dulu. Data dalam D1 (binding: DB).
 * Browser tak boleh query table terus — hanya 4 fungsi ini, berasaskan kod rujukan.
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

const RPC = {
  async save_worksheet(db, p) {
    if (!validKod(p.p_kod)) throw new Error("Kod tidak sah");
    if (!validId(p.p_worksheet_id)) throw new Error("Worksheet tidak sah");
    const data = JSON.stringify(p.p_data ?? {});
    if (data.length > 500_000) throw new Error("Data terlalu besar");
    await db
      .prepare(
        `INSERT INTO worksheet_responses (kod, worksheet_id, nama, data)
         VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT (kod, worksheet_id)
         DO UPDATE SET data = excluded.data, nama = excluded.nama, updated_at = ?5`
      )
      .bind(p.p_kod, p.p_worksheet_id, p.p_nama ?? null, data, now())
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
    await db
      .prepare(
        `INSERT INTO stress_logs (kod, log_date, level, note)
         VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT (kod, log_date)
         DO UPDATE SET level = excluded.level, note = excluded.note, updated_at = ?5`
      )
      .bind(p.p_kod, p.p_date, level, p.p_note ?? null, now())
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
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
