-- Run this once in Supabase SQL Editor.
-- This adds cloud persistence for the student portal.

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

create index if not exists student_assignments_student_id_idx on public.student_assignments(student_id);

alter table public.student_portal_records enable row level security;
alter table public.student_assignments enable row level security;

drop policy if exists portal_records_anon_all on public.student_portal_records;
create policy portal_records_anon_all on public.student_portal_records for all to anon using (true) with check (true);

drop policy if exists assignments_anon_all on public.student_assignments;
create policy assignments_anon_all on public.student_assignments for all to anon using (true) with check (true);
