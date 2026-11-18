-- FantaBike · schema per Supabase
-- Esegui tutto questo file una volta in: Supabase → SQL Editor → New query → Run

-- ============ TABELLE ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  ds text unique,                         -- direttore sportivo scelto (Tommy, Ricky, …)
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.stages (
  race text not null,
  stage int not null,
  lock_at timestamptz not null,           -- chiusura scelte (12:00 del giorno di tappa)
  primary key (race, stage)
);

create table if not exists public.picks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  race text not null,
  stage int not null,
  rider text not null check (length(trim(rider)) between 2 and 60),
  rider_key text generated always as (lower(regexp_replace(trim(rider), '\s+', ' ', 'g'))) stored,
  updated_at timestamptz not null default now(),
  primary key (user_id, race, stage),
  foreign key (race, stage) references public.stages(race, stage)
);
-- lo stesso corridore non si può scegliere due volte nella stessa corsa
create unique index if not exists picks_no_repeat on public.picks (user_id, race, rider_key);

create table if not exists public.results (
  race text not null,
  stage int not null,
  riders jsonb not null default '{}'::jsonb, -- { "Pogacar": {t,b,p,g,k,out}, … }
  updated_at timestamptz not null default now(),
  primary key (race, stage)
);

-- ============ TAPPE (chiusura scelte) ============
insert into public.stages (race, stage, lock_at) values
  ('vuelta',1,'2026-08-22 12:00:00+02'),
  ('vuelta',2,'2026-08-23 12:00:00+02'),
  ('vuelta',3,'2026-08-24 12:00:00+02'),
  ('vuelta',4,'2026-08-25 12:00:00+02'),
  ('vuelta',5,'2026-08-26 12:00:00+02'),
  ('vuelta',6,'2026-08-27 12:00:00+02'),
  ('vuelta',7,'2026-08-28 12:00:00+02'),
  ('vuelta',8,'2026-08-29 12:00:00+02'),
  ('vuelta',9,'2026-08-30 12:00:00+02'),
  ('vuelta',10,'2026-09-01 12:00:00+02'),
  ('vuelta',11,'2026-09-02 12:00:00+02'),
  ('vuelta',12,'2026-09-03 12:00:00+02'),
  ('vuelta',13,'2026-09-04 12:00:00+02'),
  ('vuelta',14,'2026-09-05 12:00:00+02'),
  ('vuelta',15,'2026-09-06 12:00:00+02'),
  ('vuelta',16,'2026-09-08 12:00:00+02'),
  ('vuelta',17,'2026-09-09 12:00:00+02'),
  ('vuelta',18,'2026-09-10 12:00:00+02'),
  ('vuelta',19,'2026-09-11 12:00:00+02'),
  ('vuelta',20,'2026-09-12 12:00:00+02'),
  ('vuelta',21,'2026-09-13 12:00:00+02'),
  ('tour',1,'2027-07-02 12:00:00+02'),
  ('tour',2,'2027-07-03 12:00:00+02'),
  ('tour',3,'2027-07-04 12:00:00+02'),
  ('tour',4,'2027-07-06 12:00:00+02'),
  ('tour',5,'2027-07-07 12:00:00+02'),
  ('tour',6,'2027-07-08 12:00:00+02'),
  ('tour',7,'2027-07-09 12:00:00+02'),
  ('tour',8,'2027-07-10 12:00:00+02'),
  ('tour',9,'2027-07-11 12:00:00+02'),
  ('tour',10,'2027-07-13 12:00:00+02'),
  ('tour',11,'2027-07-14 12:00:00+02'),
  ('tour',12,'2027-07-15 12:00:00+02'),
  ('tour',13,'2027-07-16 12:00:00+02'),
  ('tour',14,'2027-07-17 12:00:00+02'),
  ('tour',15,'2027-07-18 12:00:00+02'),
  ('tour',16,'2027-07-20 12:00:00+02'),
  ('tour',17,'2027-07-21 12:00:00+02'),
  ('tour',18,'2027-07-22 12:00:00+02'),
  ('tour',19,'2027-07-23 12:00:00+02'),
  ('tour',20,'2027-07-24 12:00:00+02'),
  ('tour',21,'2027-07-25 12:00:00+02')
on conflict (race, stage) do update set lock_at = excluded.lock_at;

-- ============ FUNZIONI ============
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- profilo creato automaticamente alla registrazione
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- il DS si può cambiare solo finché non hai fatto scelte; is_admin solo da admin
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.is_admin() then return new; end if;  -- SQL editor / admin
  if new.is_admin is distinct from old.is_admin then
    raise exception 'not allowed';
  end if;
  if old.ds is not null and new.ds is distinct from old.ds
     and exists (select 1 from public.picks where user_id = old.id) then
    raise exception 'ds_locked';
  end if;
  return new;
end $$;
drop trigger if exists guard_profile on public.profiles;
create trigger guard_profile before update on public.profiles
  for each row execute function public.guard_profile();

-- quante scelte per tappa (senza rivelare chi ha scelto cosa)
create or replace function public.pick_counts(p_race text)
returns table(stage int, n int)
language sql stable security definer set search_path = public as $$
  select stage, count(*)::int from public.picks where race = p_race group by stage
$$;
grant execute on function public.pick_counts(text) to authenticated;

-- ============ SICUREZZA (RLS) ============
alter table public.profiles enable row level security;
alter table public.stages   enable row level security;
alter table public.picks    enable row level security;
alter table public.results  enable row level security;

drop policy if exists "profiles read"   on public.profiles;
drop policy if exists "profiles update" on public.profiles;
create policy "profiles read"   on public.profiles for select to authenticated using (true);
create policy "profiles update" on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

drop policy if exists "stages read" on public.stages;
create policy "stages read" on public.stages for select to authenticated using (true);

-- scelte: le tue sempre; quelle degli altri solo dopo la chiusura
drop policy if exists "picks read"   on public.picks;
drop policy if exists "picks insert" on public.picks;
drop policy if exists "picks update" on public.picks;
drop policy if exists "picks delete" on public.picks;
create policy "picks read" on public.picks for select to authenticated using (
  user_id = auth.uid() or public.is_admin()
  or exists (select 1 from public.stages s where s.race = picks.race and s.stage = picks.stage and now() >= s.lock_at));
create policy "picks insert" on public.picks for insert to authenticated with check (
  user_id = auth.uid()
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.ds is not null)
  and exists (select 1 from public.stages s where s.race = picks.race and s.stage = picks.stage and now() < s.lock_at)
  and not exists (select 1 from public.results r where r.race = picks.race and r.stage = picks.stage));
create policy "picks update" on public.picks for update to authenticated
  using (user_id = auth.uid() and exists (select 1 from public.stages s where s.race = picks.race and s.stage = picks.stage and now() < s.lock_at))
  with check (user_id = auth.uid() and exists (select 1 from public.stages s where s.race = picks.race and s.stage = picks.stage and now() < s.lock_at));
create policy "picks delete" on public.picks for delete to authenticated
  using (user_id = auth.uid() and exists (select 1 from public.stages s where s.race = picks.race and s.stage = picks.stage and now() < s.lock_at));

-- risultati: tutti leggono, solo admin scrive
drop policy if exists "results read"  on public.results;
drop policy if exists "results write" on public.results;
create policy "results read"  on public.results for select to authenticated using (true);
create policy "results write" on public.results for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- solo queste colonne del profilo sono modificabili dagli utenti
revoke update on public.profiles from authenticated;
grant update (display_name, ds) on public.profiles to authenticated;
grant update (is_admin) on public.profiles to service_role;

-- ============ AGGIORNAMENTI IN TEMPO REALE ============
do $$ begin
  begin alter publication supabase_realtime add table public.picks;    exception when others then null; end;
  begin alter publication supabase_realtime add table public.results;  exception when others then null; end;
  begin alter publication supabase_realtime add table public.profiles; exception when others then null; end;
end $$;

-- ============ DOPO ESSERTI REGISTRATO ============
-- Rendi admin il tuo account (sostituisci l'email) per poter inserire i risultati:
-- update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'jose.chico@wospee.com');
