-- =====================================================================
--  TENANG DI TENGAH RIBUT — Worksheet Cloud Storage (Supabase)
--  Jalankan SEKALI sahaja di: Supabase Dashboard > SQL Editor > New query
--  Reka bentuk: table dikunci penuh (RLS), akses hanya via RPC + kod rujukan.
-- =====================================================================

-- 1) TABLE -------------------------------------------------------------
create table if not exists public.worksheet_responses (
  id            uuid primary key default gen_random_uuid(),
  kod           text not null,
  worksheet_id  text not null,
  nama          text,
  data          jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (kod, worksheet_id)
);

-- 2) RLS: kunci penuh. Tiada policy untuk anon => tiada akses terus. -----
alter table public.worksheet_responses enable row level security;
revoke all on public.worksheet_responses from anon, authenticated;

-- 3) RPC: SIMPAN (upsert) ---------------------------------------------
create or replace function public.save_worksheet(
  p_kod          text,
  p_worksheet_id text,
  p_nama         text,
  p_data         jsonb
) returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_kod is null or length(p_kod) < 8 then
    raise exception 'Kod tidak sah';
  end if;

  insert into public.worksheet_responses (kod, worksheet_id, nama, data)
  values (p_kod, p_worksheet_id, p_nama, p_data)
  on conflict (kod, worksheet_id)
  do update set data = excluded.data,
                nama = excluded.nama,
                updated_at = now();

  return p_kod;
end;
$$;

-- 4) RPC: BUKA SEMULA (baca ikut kod) ---------------------------------
create or replace function public.get_worksheet(
  p_kod          text,
  p_worksheet_id text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_data jsonb;
begin
  select data into v_data
  from public.worksheet_responses
  where kod = p_kod and worksheet_id = p_worksheet_id;

  return v_data;  -- null kalau kod tak wujud
end;
$$;

-- 5) GRANT: hanya benarkan EXECUTE pada 2 fungsi ini (bukan table) -----
revoke all on function public.save_worksheet(text,text,text,jsonb) from public;
revoke all on function public.get_worksheet(text,text)             from public;
grant execute on function public.save_worksheet(text,text,text,jsonb) to anon, authenticated;
grant execute on function public.get_worksheet(text,text)             to anon, authenticated;

-- =====================================================================
--  TAMBAHAN: JURNAL STRES HARIAN (time-series untuk ringkasan minggu/bulan)
-- =====================================================================

-- 6) TABLE log stres harian -------------------------------------------
create table if not exists public.stress_logs (
  kod        text not null,
  log_date   date not null,
  level      int  not null check (level between 1 and 10),
  note       text,
  updated_at timestamptz not null default now(),
  primary key (kod, log_date)
);
alter table public.stress_logs enable row level security;
revoke all on public.stress_logs from anon, authenticated;

-- 7) RPC simpan satu hari (upsert) ------------------------------------
create or replace function public.save_stress_log(
  p_kod text, p_date date, p_level int, p_note text
) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if p_kod is null or length(p_kod) < 8 then raise exception 'Kod tidak sah'; end if;
  if p_level < 1 or p_level > 10 then raise exception 'Tahap tidak sah'; end if;
  insert into public.stress_logs (kod, log_date, level, note)
  values (p_kod, p_date, p_level, p_note)
  on conflict (kod, log_date)
  do update set level = excluded.level, note = excluded.note, updated_at = now();
end; $$;

-- 8) RPC baca julat tarikh (untuk ringkasan minggu/bulan) -------------
create or replace function public.get_stress_logs(
  p_kod text, p_from date, p_to date
) returns table(log_date date, level int, note text)
language plpgsql security definer set search_path = ''
as $$
begin
  return query
    select s.log_date, s.level, s.note
    from public.stress_logs s
    where s.kod = p_kod and s.log_date between p_from and p_to
    order by s.log_date;
end; $$;

revoke all on function public.save_stress_log(text,date,int,text) from public;
revoke all on function public.get_stress_logs(text,date,date)     from public;
grant execute on function public.save_stress_log(text,date,int,text) to anon, authenticated;
grant execute on function public.get_stress_logs(text,date,date)     to anon, authenticated;

-- Selesai. Customer tak boleh baca table terus — hanya boleh simpan/buka
-- melalui kod rujukan masing-masing.
