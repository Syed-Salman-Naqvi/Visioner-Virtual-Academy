-- Visioner Virtual Academy portal migration
-- Run this entire file once in Supabase SQL Editor.
-- It intentionally uses the existing `portal_records` and `assignments` tables
-- visible in the project instead of creating parallel student_* tables.

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1. CANONICAL PER-STUDENT PORTAL RECORD
-- ------------------------------------------------------------
create table if not exists public.portal_records (
  student_id text primary key,
  records jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portal_records add column if not exists student_id text;
alter table public.portal_records add column if not exists records jsonb not null default '{}'::jsonb;
alter table public.portal_records add column if not exists updated_at timestamptz not null default now();

create unique index if not exists portal_records_student_id_uidx
  on public.portal_records(student_id);

create index if not exists portal_records_updated_at_idx
  on public.portal_records(updated_at desc);

-- ------------------------------------------------------------
-- 2. CANONICAL ASSIGNMENTS TABLE
-- Existing columns such as id/title/subject/due_date are preserved.
-- Additional columns make the same row usable by both portals.
-- ------------------------------------------------------------
create table if not exists public.assignments (
  id text primary key,
  student_id text not null,
  title text not null,
  subject text,
  due_date text,
  status text not null default 'pending'
);

alter table public.assignments add column if not exists student_id text;
alter table public.assignments add column if not exists title text;
alter table public.assignments add column if not exists subject text;
alter table public.assignments add column if not exists course text;
alter table public.assignments add column if not exists subject_code text;
alter table public.assignments add column if not exists course_code text;
alter table public.assignments add column if not exists due_date text;
alter table public.assignments add column if not exists status text default 'pending';
alter table public.assignments add column if not exists instructions text;
alter table public.assignments add column if not exists score text;
alter table public.assignments add column if not exists feedback text;
alter table public.assignments add column if not exists urgency text default 'normal';
alter table public.assignments add column if not exists submitted_at timestamptz;
alter table public.assignments add column if not exists submission_notes text;
alter table public.assignments add column if not exists assignment jsonb;
alter table public.assignments add column if not exists created_at timestamptz not null default now();
alter table public.assignments add column if not exists updated_at timestamptz not null default now();

create index if not exists assignments_student_id_idx
  on public.assignments(student_id);
create index if not exists assignments_updated_at_idx
  on public.assignments(updated_at desc);

-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- The current application uses the Supabase publishable/anon client.
-- These policies match that existing architecture.
-- ------------------------------------------------------------
alter table public.portal_records enable row level security;
alter table public.assignments enable row level security;

drop policy if exists vva_portal_records_anon_all on public.portal_records;
create policy vva_portal_records_anon_all
  on public.portal_records for all to anon
  using (true) with check (true);

drop policy if exists vva_assignments_anon_all on public.assignments;
create policy vva_assignments_anon_all
  on public.assignments for all to anon
  using (true) with check (true);

-- Keep the older parallel tables readable for compatibility with any old data.
-- New application code does NOT use them.
create table if not exists public.student_portal_records (
  student_id text primary key,
  records jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.student_assignments (
  id uuid primary key default gen_random_uuid(),
  student_id text not null,
  assignment jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_portal_records enable row level security;
alter table public.student_assignments enable row level security;

drop policy if exists portal_records_anon_all on public.student_portal_records;
create policy portal_records_anon_all on public.student_portal_records for all to anon using (true) with check (true);

drop policy if exists assignments_anon_all on public.student_assignments;
create policy assignments_anon_all on public.student_assignments for all to anon using (true) with check (true);
